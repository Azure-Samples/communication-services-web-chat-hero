import React, { useEffect, useState } from 'react';
import { DefaultButton, Icon, IconButton, Pivot, PivotItem, Stack, StackItem } from '@fluentui/react';

import ChatArea from '../containers/ChatArea';
import ChatHeader from '../containers/ChatHeader';
import { chatScreenBottomContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { SidePanelTypes } from './SidePanel';
import LeftPane from './LeftPane';
import MainArea from './MainArea';

interface ChatScreenProps {
  leaveChatHandler(): void;
  removedFromThreadHandler(): void;
  isRemoved: boolean;
}

export default (props: ChatScreenProps): JSX.Element => {
  // People pane will be visible when a chat is joined if the window width is greater than 600
  const [selectedPane, setSelectedPane] = useState(
    window.innerWidth > 600 ? SidePanelTypes.People : SidePanelTypes.None
  );

  const { leaveChatHandler, isRemoved, removedFromThreadHandler } = props;

  // when the screen first loads we want to put focus on the sendbox
  useEffect(() => {
    document.getElementById('sendbox')?.focus();
  }, []);

  // if a user is on the chat screen and they are removed from the chat thread
  // we want to move them to the removedFromThread screen
  useEffect(() => {
    if (isRemoved) {
      removedFromThreadHandler();
    }
  }, [isRemoved, removedFromThreadHandler]);

  return (
    <Stack className={chatScreenContainerStyle}>
      <ChatHeader leaveChatHandler={leaveChatHandler} selectedPane={selectedPane} setSelectedPane={setSelectedPane} />
      <Stack className={chatScreenBottomContainerStyle} horizontal={true}>
        <LeftPane />
        <MainArea />
        <ChatArea />
        {/* <Stack.Item grow disableShrink>
          <SidePanel selectedPane={selectedPane} setSelectedPane={setSelectedPane} />
        </Stack.Item> */}
      </Stack>
    </Stack>
  );
};
