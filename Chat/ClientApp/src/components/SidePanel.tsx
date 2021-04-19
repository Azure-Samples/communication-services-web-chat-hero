import { Stack, TextField, PrimaryButton, Icon, StackItem } from '@fluentui/react';
import React, { useEffect, useState, Dispatch } from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';

import { ENTER_KEY, GUID_FOR_INITIAL_TOPIC_NAME, MAXIMUM_LENGTH_OF_TOPIC } from '../../src/constants';
import InviteFooter from './InviteFooter';
import MemberItem from './MemberItem';
import { inputBoxTextStyle } from './styles/ConfigurationScreen.styles';
import {
  memberListStyle,
  settingsListStyle,
  saveChatNameButtonStyle,
  sidePanelContainerStyle,
  textFieldIconStyle,
  titleStyle,
  topicWarningStyle,
  emptyWarningStyle,
  saveButtonTextStyle,
  groupNameStyle,
  groupNameInputBoxStyle,
  groupNameInputBoxWarningStyle
} from './styles/SidePanel.styles';
import { SidePanelDispatchProps, SidePanelProps } from '../containers/SidePanel';
import { CommunicationUserIdentifier } from '@azure/communication-common';

export enum SidePanelTypes {
  None = 'none',
  People = 'People',
  Settings = 'Settings'
}

type ChatSidePaneProps = {
  selectedPane: SidePanelTypes;
  setSelectedPane: Dispatch<SidePanelTypes>;
};

export default (props: SidePanelProps & SidePanelDispatchProps & ChatSidePaneProps): JSX.Element => {
  const [topicName, setTopicName] = useState('');
  const [isEditingTopicName, setIsEditingTopicName] = useState(false);
  const [isTopicNameOverflow, setTopicNameOverflow] = useState(false);
  const [isSavingTopicName, setIsSavingTopicName] = useState(false);

  const { chatClient, threadId } = props;

  const onTopicNameTextChange = (event: any) => {
    setIsEditingTopicName(true);
    setTopicName(event.target.value);
    if (event.target.value.length > MAXIMUM_LENGTH_OF_TOPIC) {
      setTopicNameOverflow(true);
    } else {
      setTopicNameOverflow(false);
    }
  };

  const onTopicNameSubmit = () => {
    if (topicName.length > MAXIMUM_LENGTH_OF_TOPIC) return;
    if (!chatClient) return;
    if (!threadId) return;
    props.updateThreadTopicName(chatClient, threadId, topicName, setIsSavingTopicName);
    setIsSavingTopicName(true);
    setIsEditingTopicName(false);
    setTimeout(() => {
      document.getElementById('focusButton')?.focus();
    }, 100);
  };

  return (
    <>
      <Stack
        verticalAlign="space-between"
        className={sidePanelContainerStyle(props.selectedPane === SidePanelTypes.People)}
      >
        {/* Title */}
        <span className={titleStyle}>People</span>
        {/* Member list */}
        <StackItem className={memberListStyle}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            {props.chatParticipants.map((person) => {
              const id = (person.id as CommunicationUserIdentifier).communicationUserId;
              return (
                <MemberItem
                  key={id}
                  userId={id}
                  avatar={props.users[id] === undefined ? '' : props.users[id].emoji}
                  name={person.displayName as string}
                  isYou={id === (props.identity as string)}
                  removeThreadMemberByUserId={props.removeChatParticipantById}
                />
              );
            })}
          </FocusZone>
        </StackItem>
        {/* Invite link footer */}
        <InviteFooter />
      </Stack>
      <Stack
        verticalAlign="space-between"
        className={sidePanelContainerStyle(props.selectedPane === SidePanelTypes.Settings)}
      >
        {/* Title */}
        <div className={titleStyle}>Settings</div>
        <div className={settingsListStyle}>
          {/* Change Chat Name */}
          <div className={groupNameStyle}>Group Name</div>
          <TextField
            className={isTopicNameOverflow ? groupNameInputBoxWarningStyle : groupNameInputBoxStyle}
            inputClassName={inputBoxTextStyle}
            borderless={true}
            defaultValue={props.topic === GUID_FOR_INITIAL_TOPIC_NAME ? '' : props.topic}
            placeholder={props.existsTopicName ? undefined : 'Type a group name'}
            autoComplete="off"
            onSubmit={onTopicNameSubmit}
            onChange={onTopicNameTextChange}
            onKeyUp={(ev) => {
              if (ev.which === ENTER_KEY) {
                onTopicNameSubmit();
              }
            }}
          />
          {(isTopicNameOverflow && <div className={topicWarningStyle}> Topic cannot be over 30 characters </div>) ||
            (!isTopicNameOverflow && <div className={emptyWarningStyle} />)}
          <PrimaryButton
            id="editThreadTopicButton"
            className={saveChatNameButtonStyle}
            onClick={(e: any) => onTopicNameSubmit()}
            disabled={isSavingTopicName}
          >
            <Icon iconName="Save" className={textFieldIconStyle} />
            <div className={saveButtonTextStyle}>{isSavingTopicName ? 'Saving...' : 'Save'}</div>
          </PrimaryButton>
        </div>
      </Stack>
    </>
  );
};
