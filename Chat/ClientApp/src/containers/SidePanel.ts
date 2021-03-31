import { connect } from 'react-redux';

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../../src/constants';
import { setContosoUsers, SetContosoUsersAction } from '../core/actions/ContosoClientAction';
import { setThreadMembers, setRemoveThreadMemberError } from '../core/actions/ThreadMembersAction';
import SidePanel from '../components/SidePanel';
import { State } from '../core/reducers/index';
import React from 'react';
import { updateThreadTopicName, removeThreadMemberByUserId } from '../core/sideEffects';
import { ChatParticipant, ChatThreadItem } from '@azure/communication-chat';

export type SidePanelProps = {
  identity: string,
  chatParticipants: ChatParticipant[],
  users: any
  thread: ChatThreadItem | undefined,
  existsTopicName: boolean,
  removeChatParticipantError: boolean
  
}
const mapStateToProps = (state: State): SidePanelProps => ({
  identity: state.contosoClient.user.identity,
  chatParticipants: state.threadMembers.threadMembers,
  users: state.contosoClient.users,
  thread: state.thread.thread,
  existsTopicName: state.thread.thread !== undefined && state.thread.thread.topic !== GUID_FOR_INITIAL_TOPIC_NAME,
  removeChatParticipantError: state.threadMembers.removeThreadMemberError!
});

export type SidePanelDispatchProps = {
  clearChatParticipants: () => void,
  setContosoUsers: (users: any) => SetContosoUsersAction,
  updateThreadTopicName: (topicName: string, setIsSavingTopicName: React.Dispatch<boolean>) => void,
  removeChatParticipantById: (userId: string) => void,
  setRemoveChatParticipantError: (removeError: boolean) => void
}

const mapDispatchToProps = (dispatch: any): SidePanelDispatchProps => ({
  clearChatParticipants: dispatch(setThreadMembers([])),
  setContosoUsers: (users: any) => setContosoUsers(users),
  updateThreadTopicName: (topicName: string, setIsSavingTopicName: React.Dispatch<boolean>) => {
    dispatch(updateThreadTopicName(topicName, setIsSavingTopicName));
  },
  removeChatParticipantById: async (userId: string) => {
    dispatch(removeThreadMemberByUserId(userId));
  },
  setRemoveChatParticipantError: async (removeError: boolean) => {
    dispatch(setRemoveThreadMemberError(removeError));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
