import { ChatParticipant } from '@azure/communication-chat';

export const SET_THREAD_MEMBERS = 'SET_THREAD_MEMBERS';
export const SET_THREAD_MEMBERS_ERROR = 'SET_THREAD_MEMBERS_ERROR';
export const SET_REMOVE_THREAD_MEMBER_ERROR = 'SET_REMOVE_THREAD_MEMBER_ERROR';
export const SET_ADD_THREAD_MEMBER_ERROR = 'SET_ADD_THREAD_MEMBER_ERROR';
export const SET_REMOVED_FROM_THREAD = 'SET_REMOVED_FROM_THREAD';

export interface SetThreadMembersAction {
  type: typeof SET_THREAD_MEMBERS;
  threadMembers: ChatParticipant[];
}

export interface SetThreadMembersErrorAction {
  type: typeof SET_THREAD_MEMBERS_ERROR;
  error?: boolean;
}

export interface SetRemovedFromThreadAction {
  type: typeof SET_REMOVED_FROM_THREAD;
  isRemoved: boolean;
}

export const setThreadMembers = (threadMembers: ChatParticipant[]): SetThreadMembersAction => ({
  type: SET_THREAD_MEMBERS,
  threadMembers
});

export const setThreadMembersError = (error: boolean): SetThreadMembersErrorAction => ({
  type: SET_THREAD_MEMBERS_ERROR,
  error
});

export const setRemovedFromThread = (isRemoved: boolean): SetRemovedFromThreadAction => ({
  type: SET_REMOVED_FROM_THREAD,
  isRemoved
});

export type ThreadMembersActionTypes =
  | SetThreadMembersAction
  | SetThreadMembersErrorAction
  | SetRemovedFromThreadAction;
