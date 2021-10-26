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
  pivotItemStyle,
  pivotItemStyles,
  topicNameLabelStyle
} from './styles/ChatHeader.styles';
import { SidePanelTypes } from './SidePanel';
import { ChatHeaderDispatchProps, ChatHeaderProps } from '../containers/ChatHeader';
import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';

type ChatHeaderPaneProps = {
  selectedPane: SidePanelTypes;
  setSelectedPane: Dispatch<SidePanelTypes>;
  leaveChatHandler: () => void;
};

export default (props: ChatHeaderDispatchProps & ChatHeaderProps & ChatHeaderPaneProps): JSX.Element => {
  const [header, setHeader] = useState('');

  const togglePivotItem = (item: PivotItem | undefined) => {
    if (!item) return;
    if (item.props.itemKey === SidePanelTypes.Settings) toggleSettings(props.selectedPane, props.setSelectedPane);
    if (item.props.itemKey === SidePanelTypes.People) togglePeople(props.selectedPane, props.setSelectedPane);
  };

  const togglePeople = (selectedPane: SidePanelTypes, setSelectedPane: (pane: SidePanelTypes) => void) => {
    return selectedPane !== SidePanelTypes.People
      ? setSelectedPane(SidePanelTypes.People)
      : setSelectedPane(SidePanelTypes.None);
  };

  const toggleSettings = (selectedPane: SidePanelTypes, setSelectedPane: (pane: SidePanelTypes) => void) => {
    return selectedPane !== SidePanelTypes.Settings
      ? setSelectedPane(SidePanelTypes.Settings)
      : setSelectedPane(SidePanelTypes.None);
  };

  const leaveString = 'Leave';

  const { topic, generateHeaderMessage, leaveChatHandler, removeThreadMember, userId } = props;

  useEffect(() => {
    setHeader(topic && topic !== GUID_FOR_INITIAL_TOPIC_NAME ? topic : generateHeaderMessage());
  }, [topic, generateHeaderMessage]);

  return (
    <Stack className={chatHeaderContainerStyle} horizontal={true} horizontalAlign="space-between">
      <Stack.Item align="center">
        <div className={topicNameLabelStyle}>{header}</div>
      </Stack.Item>
      <Stack.Item align="center">
        <Stack horizontal={true}>
          <Stack.Item align="center">
            <Pivot
              onKeyDownCapture={(e) => {
                if ((e.target as HTMLElement).id === SidePanelTypes.People && e.keyCode === 39) e.preventDefault();
              }}
              getTabId={(itemKey: string) => itemKey}
              onLinkClick={(item) => togglePivotItem(item)}
              styles={pivotItemStyles}
              defaultSelectedKey={SidePanelTypes.None}
              selectedKey={props.selectedPane}
            >
              <PivotItem itemKey={SidePanelTypes.None} />
              {/* To Toggle People's Panel */}
              <PivotItem
                itemKey={SidePanelTypes.People}
                onRenderItemLink={() => (
                  <UserFriendsIcon
                    outline={props.selectedPane === SidePanelTypes.People ? false : true}
                    size="medium"
                    className={pivotItemStyle}
                  />
                )}
              />
              {/* To Toggle Settings's Panel */}
              <PivotItem
                itemKey={SidePanelTypes.Settings}
                onRenderItemLink={() => (
                  <SettingsIcon
                    outline={props.selectedPane === SidePanelTypes.Settings ? false : true}
                    size="medium"
                    className={pivotItemStyle}
                  />
                )}
              />
            </Pivot>
          </Stack.Item>
          <Stack.Item align="center">
            <div className={iconButtonContainerStyle}>
              <IconButton
                id="leave"
                iconProps={leaveIcon}
                className={greyIconButtonStyle}
                onClick={() => {
                  leaveChatHandler();
                  const user = { communicationUserId: userId }
                  removeThreadMember(user);
                }}
              />
            </div>
            <div className={largeButtonContainerStyle}>
              <DefaultButton
                id="leave"
                className={leaveButtonStyle}
                onClick={() => {
                  leaveChatHandler();
                  const user = { communicationUserId: userId }
                  removeThreadMember(user);
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
