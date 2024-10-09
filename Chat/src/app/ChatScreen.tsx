// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatMessage } from '@azure/communication-chat';
import { Badge } from '@fluentui/react-components';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter,
  MessageProps,
  MessageRenderer
} from '@azure/communication-react';
import { SkeletonItem, Skeleton } from '@fluentui/react-components';
import { Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { ChatHeader } from './ChatHeader';
import { chatCompositeContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { getSentiment } from './utils/getSentiment';
import { getSummary } from './utils/getSummary';
import { getTranslation } from './utils/getTranslation';
import { SummaryCard } from './SummaryCard';

import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  endChatHandler(isParticipantRemoved: boolean): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, endChatHandler } = props;
  const [sentiments, setSentiments] = useState({});
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showLoadingSummary, setShowLoadingSummary] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [translations, setTranslations] = useState({});
  const translationLanguage = useRef<string>('default');

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  const { currentTheme } = useSwitchableFluentTheme();

  const fetchSentiment = useCallback(async (message: ChatMessage): Promise<void> => {
    if (message.type !== 'html' && message.type !== 'text') {
      return;
    }
    const sentiment = await getSentiment(message);
    setSentiments((sentiments) => ({
      ...sentiments,
      [message.id]: sentiment
    }));
  }, []);

  const setTranslationLanguage = (language: string): void => {
    translationLanguage.current = language;
  };

  const fetchTranslation = useCallback(
    async (message: ChatMessage): Promise<void> => {
      if (message.type !== 'html' && message.type !== 'text') {
        return;
      }
      const translation = await getTranslation(message, translationLanguage.current);
      setTranslations((translations) => ({
        ...translations,
        [message.id]: translation
      }));
    },
    [translationLanguage]
  );

  const onRenderMessage = useCallback(
    (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
      if (messageProps.message.messageType === 'chat' && messageProps.message.senderId !== userId) {
        return defaultOnRender ? (
          <>
            {sentiments[messageProps.message.messageId] ? (
              <Badge
                appearance="tint"
                color={
                  sentiments[messageProps.message.messageId] === 'Negative'
                    ? 'danger'
                    : sentiments[messageProps.message.messageId] === 'Neutral'
                    ? 'important'
                    : 'success'
                }
                style={{ position: 'absolute', zIndex: '10' }}
              >
                {`${sentiments[messageProps.message.messageId]}`}
              </Badge>
            ) : (
              <></>
              // <Skeleton
              //   animation="pulse"
              //   aria-label="Loading Content"
              //   style={{ maxWidth: '100px', marginBottom: '-5px', marginTop: '5px' }}
              // >
              //   <SkeletonItem size={16} />
              // </Skeleton>
            )}

            <div style={{ marginTop: '10px' }}>{defaultOnRender(messageProps)}</div>
            <small>
              {translations[messageProps.message.messageId] && `[${translations[messageProps.message.messageId]}]`}
            </small>
          </>
        ) : (
          <></>
        );
      }
      return defaultOnRender ? defaultOnRender(messageProps) : <></>;
    },
    [userId, sentiments, translations]
  );

  const summarizationHandler = useCallback(async (adapter: ChatAdapter): Promise<void> => {
    setShowLoadingSummary(true);
    const messages = Object.values(adapter.getState().thread.chatMessages)
      .filter((m) => m.type === 'html' || m.type === 'text')
      .sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime())
      .map((m) => {
        // Return the formatted string
        return {
          timestamp: m.createdOn,
          user: m.senderDisplayName,
          content: m.content?.message
        };
      });

    const summaryResponse = await getSummary(JSON.stringify(messages));
    const trimmedSummary = summaryResponse.replace('```', '');

    setShowLoadingSummary(false);
    setSummary(trimmedSummary);
    setShowSummary(true);
  }, []);

  const adapterAfterCreate = useCallback(
    async (adapter: ChatAdapter): Promise<ChatAdapter> => {
      adapter?.on('messageReceived', (listener) => {
        fetchSentiment(listener.message);
        fetchTranslation(listener.message);
        console.log('receiveMessage event language: ', translationLanguage);
      });
      adapter?.on('messageEdited', (listener) => {
        fetchSentiment(listener.message);
        fetchTranslation(listener.message);
      });
      adapter.on('participantsRemoved', (listener) => {
        const removedParticipantIds = listener.participantsRemoved.map((p) => toFlatCommunicationIdentifier(p.id));
        if (removedParticipantIds.includes(userId)) {
          const removedBy = toFlatCommunicationIdentifier(listener.removedBy.id);
          endChatHandler(removedBy !== userId);
        }
      });
      adapter.on('error', (e) => {
        console.error(e);
      });
      return adapter;
    },
    [endChatHandler, fetchSentiment, fetchTranslation, translationLanguage, userId]
  );

  const adapterArgs = useMemo(
    () => ({
      endpoint: endpointUrl,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      credential: createAutoRefreshingCredential(userId, token),
      threadId
    }),
    [endpointUrl, userId, displayName, token, threadId]
  );
  const adapter = useAzureCommunicationChatAdapter(adapterArgs, adapterAfterCreate);

  // Dispose of the adapter in the window's before unload event
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  if (adapter) {
    const onFetchAvatarPersonaData = (userId: string): Promise<AvatarPersonaData> =>
      fetchEmojiForUser(userId).then(
        (emoji) =>
          new Promise((resolve) => {
            return resolve({
              imageInitials: emoji,
              initialsColor: emoji ? getBackgroundColor(emoji)?.backgroundColor : undefined
            });
          })
      );
    return (
      <Stack className={chatScreenContainerStyle}>
        <Stack.Item className={chatCompositeContainerStyle} role="main">
          <SummaryCard
            showSummary={showSummary}
            showLoading={showLoadingSummary}
            summary={summary}
            setShowSummary={setShowSummary}
          />
          <ChatComposite
            adapter={adapter}
            fluentTheme={currentTheme.theme}
            options={{
              autoFocus: 'sendBoxTextField'
            }}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onRenderMessage={onRenderMessage}
          />
        </Stack.Item>
        <ChatHeader
          onEndChat={() => adapter.removeParticipant(userId)}
          onSummarize={() => summarizationHandler(adapter)}
          setLanguage={setTranslationLanguage}
        />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
