// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatMessage } from '@azure/communication-chat';
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
import { Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ChatHeader } from './ChatHeader';
import { chatCompositeContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { getSentiment } from './utils/getSentiment';
import { getSummary } from './utils/getSummary';

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
    console.log('fetchSentiment for message: ' + message.id + ' sentiment: ' + sentiment);
    setSentiments((sentiments) => ({
      ...sentiments,
      [message.id]: sentiment
    }));
  }, []);

  const onRenderMessage = useCallback(
    (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
      if (messageProps.message.messageType === 'chat' && messageProps.message.senderId !== userId) {
        return defaultOnRender ? (
          <div>
            <small>
              {sentiments[messageProps.message.messageId] &&
                `[${sentiments[messageProps.message.messageId].toUpperCase()}]`}
            </small>
            {defaultOnRender(messageProps)}
          </div>
        ) : (
          <></>
        );
      }
      return defaultOnRender ? defaultOnRender(messageProps) : <></>;
    },
    [userId, sentiments]
  );

  const summarizationHandler = useCallback(async (adapter: ChatAdapter): Promise<void> => {
    console.log('hi');
    const messages = Object.values(adapter.getState().thread.chatMessages)
      .filter((m) => m.type === 'html' || m.type === 'text')
      .sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime())
      .map((m) => {
        return {
          timestamp: m.createdOn,
          user: m.senderDisplayName,
          content: m.content?.message
        };
      });

    const summary = await getSummary(JSON.stringify(messages));

    // console.log(messages);
    // console.log(summary);

    const trimmedHTLPSummary = summary.replace(/^```html\s*|\s*```$/g, '');
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(trimmedHTLPSummary);
      newWindow.document.close();
    } else {
      console.error('Failed to open new window');
    }
  }, []);

  const adapterAfterCreate = useCallback(
    async (adapter: ChatAdapter): Promise<ChatAdapter> => {
      adapter?.on('messageReceived', (listener) => {
        fetchSentiment(listener.message);
      });
      adapter?.on('messageEdited', (listener) => {
        fetchSentiment(listener.message);
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
    [endChatHandler, fetchSentiment, userId]
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
        />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
