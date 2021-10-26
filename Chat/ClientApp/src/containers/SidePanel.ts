import { connect } from 'react-redux';

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../../src/constants';
import { setContosoUsers, SetContosoUsersAction } from '../core/actions/ContosoClientAction';
import SidePanel from '../components/SidePanel';
import { State } from '../core/reducers/index';
import React from 'react';
import { updateThreadTopicName, removeThreadMember } from '../core/sideEffects';
import { ChatClient, ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';

export type SidePanelProps = {
  identity: string;
  chatParticipants: ChatParticipant[];
  users: any;
  existsTopicName: boolean;
  topic: string | undefined;
  threadId: string | undefined;
  chatClient: ChatClient | undefined;
  updateThreadTopicName: (
    chatClient: ChatClient,
    threadId: string,
    topicName: string,
    setIsSavingTopicName: React.Dispatch<boolean>
  ) => void;
};

export type SidePanelDispatchProps = {
  setContosoUsers: (users: any) => SetContosoUsersAction;
  removeThreadMember: (communicationUser: CommunicationIdentifier) => void;
};

const mapStateToProps = (state: State): SidePanelProps => ({
  identity: state.contosoClient.user.identity,
  chatParticipants: state.threadMembers.threadMembers,
  users: state.contosoClient.users,
  existsTopicName: state.thread.topic !== GUID_FOR_INITIAL_TOPIC_NAME,
  topic: state.thread.topic,
  threadId: state.thread.threadId,
  chatClient: state.contosoClient.chatClient,
  updateThreadTopicName: (
    chatClient: ChatClient,
    threadId: string,
    topicName: string,
    setIsSavingTopicName: React.Dispatch<boolean>
  ) => {
    updateThreadTopicName(chatClient, threadId, topicName, setIsSavingTopicName);
  }
});

const mapDispatchToProps = (dispatch: any): SidePanelDispatchProps => ({
  setContosoUsers: (users: any) => setContosoUsers(users),
  removeThreadMember: async (communicationUser: CommunicationIdentifier) => {
    dispatch(removeThreadMember(communicationUser));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
