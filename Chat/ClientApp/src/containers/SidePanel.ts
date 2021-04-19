import { connect } from 'react-redux';

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../../src/constants';
import { setContosoUsers, SetContosoUsersAction } from '../core/actions/ContosoClientAction';
import SidePanel from '../components/SidePanel';
import { State } from '../core/reducers/index';
import React from 'react';
import { updateThreadTopicName, removeThreadMemberByUserId } from '../core/sideEffects';
import { ChatClient, ChatParticipant } from '@azure/communication-chat';

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
  removeChatParticipantById: (userId: string) => void;
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
  removeChatParticipantById: async (userId: string) => {
    dispatch(removeThreadMemberByUserId(userId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
