import { DefaultButton, Icon, IconButton, Pivot, PivotItem, Stack } from '@fluentui/react';
import { UserFriendsIcon, SettingsIcon } from '@fluentui/react-icons-northstar';
import React, { Dispatch, useEffect, useState } from 'react';

import { copyIconStyle } from './styles/SidePanel.styles';
import {
  chatHeaderContainerStyle,
  greyIconButtonStyle,
  iconButtonContainerStyle,
  largeButtonContainerStyle,
  leaveButtonStyle,
  leaveIcon,
  topicNameLabelStyle
} from './styles/ChatHeader.styles';
import { SidePanelTypes } from './SidePanel';
import { ChatHeaderDispatchProps, ChatHeaderProps } from '../containers/ChatHeader';

type ChatHeaderPaneProps = {
  selectedPane: SidePanelTypes;
  setSelectedPane: Dispatch<SidePanelTypes>;
  leaveChatHandler: () => void;
};

export default (props: ChatHeaderDispatchProps & ChatHeaderProps & ChatHeaderPaneProps): JSX.Element => {
  const [header, setHeader] = useState('');

  const leaveString = 'Leave';

  const { topic, generateHeaderMessage, leaveChatHandler, removeChatParticipantById, userId } = props;

  useEffect(() => {
    setHeader("ACS Virtual Events: Alpha Event");
  }, [topic, generateHeaderMessage]);

  return (
    <Stack className={chatHeaderContainerStyle} horizontal={true} horizontalAlign="space-between">
      <Stack.Item align="center">
        <div className={topicNameLabelStyle}>{header}</div>
      </Stack.Item>
      <Stack.Item align="center">
        <Stack horizontal={true}>
          <Stack.Item align="center">
            <div className={iconButtonContainerStyle}>
              <IconButton
                id="leave"
                iconProps={leaveIcon}
                className={greyIconButtonStyle}
                onClick={() => {
                  leaveChatHandler();
                  removeChatParticipantById(userId);
                }}
              />
            </div>
            <div className={largeButtonContainerStyle}>
              <DefaultButton
                id="leave"
                className={leaveButtonStyle}
                onClick={() => {
                  leaveChatHandler();
                  removeChatParticipantById(userId);
                }}
              >
                <Icon iconName="Leave" className={copyIconStyle} />
                {leaveString}
              </DefaultButton>
            </div>
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
