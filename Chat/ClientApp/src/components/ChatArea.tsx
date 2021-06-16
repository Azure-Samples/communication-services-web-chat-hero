import { IPivotStyles, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

import ChatThread from '../containers/ChatThread';
import SendBox from '../containers/SendBox';
import TypingIndicator from '../containers/TypingIndicator';
import { chatAreaContainerStyle } from './styles/ChatArea.styles';
import { IStyleSet, Pivot, PivotItem } from '@fluentui/react';
import AttendeesArea  from '../containers/AttendeesArea';

const pivotStyles: Partial<IStyleSet<IPivotStyles>> = {
  root: { width: "100%" },
  link: {
    width: "50%"
  },
  linkIsSelected: {
    width: "50%"
  }
};

interface ChatAreaProps {
  onUpdateTypingUsers(): void;
  typingNotifications: any;
}

export default (props: ChatAreaProps): JSX.Element => {
  const { onUpdateTypingUsers } = props;
  const [selectedTab, setTab] = useState('Chat');

  useEffect(() => {
    let listener: NodeJS.Timeout = setInterval(() => {
      onUpdateTypingUsers();
    }, 500);
    return () => {
      clearInterval(listener);
    };
  }, [onUpdateTypingUsers]);

  const handleLinkClick = (item?: PivotItem) => {
    if (item) {
      setTab(item.props.itemKey!);
    }
  };
  // TODO: add here two tabs to switch between chat and people
  return (
    <Stack className={chatAreaContainerStyle}>
      <Pivot 
        aria-label="Basic Pivot Example" 
        onLinkClick={handleLinkClick}
        styles={pivotStyles}>
        <PivotItem headerText="Chat" itemKey="Chat"/>
        <PivotItem headerText="People" itemKey="People"/>
      </Pivot>
      {selectedTab === "People" && <AttendeesArea />}
      {selectedTab === "Chat" && 
        <>
          <ChatThread />
          <TypingIndicator />
          <SendBox />
        </>
      }
    </Stack>
  );
};
