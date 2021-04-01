import { Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

import ChatArea from '../containers/ChatArea';
import ChatHeader from '../containers/ChatHeader';
import SidePanel from '../containers/SidePanel';
import {
  chatScreenBottomContainerStyle,
  chatScreenContainerStyle,
} from './styles/ChatScreen.styles';
import { SidePanelTypes } from './SidePanel';

interface ChatScreenProps {
  leaveChatHandler(): void;
  getThread(): void;
  getMessages(): void;
}

export default (props: ChatScreenProps): JSX.Element => {
  // People pane will be visible when a chat is joined if the window width is greater than 600
  const [selectedPane, setSelectedPane] = useState(
    window.innerWidth > 600 ? SidePanelTypes.People : SidePanelTypes.None
  );

  const { getThread, getMessages, leaveChatHandler } = props;
  useEffect(() => {
    getThread();
    getMessages();
    document.getElementById('sendbox')?.focus();
  }, [getThread, getMessages]);

  return (
    <Stack className={chatScreenContainerStyle}>
      <ChatHeader
        leaveChatHandler={leaveChatHandler}
        selectedPane={selectedPane}
        setSelectedPane={setSelectedPane}
      />
      <Stack className={chatScreenBottomContainerStyle} horizontal={true}>
      <ChatArea/>
        <Stack.Item grow disableShrink>
          <SidePanel
            selectedPane={selectedPane}
            setSelectedPane={setSelectedPane}
          />
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
