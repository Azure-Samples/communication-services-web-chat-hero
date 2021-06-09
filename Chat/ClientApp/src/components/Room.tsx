import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import React, { useState } from 'react';
import ChatArea from '../containers/ChatArea';
import ChatHeader from '../containers/ChatHeader';
import LeftPane from './LeftPane';
import MainArea from './MainArea';
import RoomMainArea from './RoomMainArea';
import { SidePanelTypes } from './SidePanel';
import { chatScreenBottomContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';

export interface RoomProps {
  roomTitle: string;
  backToChatScreenHander(): void;

}

export default (props: RoomProps): JSX.Element => {
  return (
    <Stack className={chatScreenContainerStyle}>
      <ChatHeader leaveChatHandler={() => { }} selectedPane={SidePanelTypes.None} setSelectedPane={() => { }} />
      <Stack className={chatScreenBottomContainerStyle} horizontal={true}>
        <LeftPane />
        <RoomMainArea roomTitle={props.roomTitle} backToChatScreenHander={props.backToChatScreenHander} />
        <ChatArea />
      </Stack>
    </Stack>

  );
};
