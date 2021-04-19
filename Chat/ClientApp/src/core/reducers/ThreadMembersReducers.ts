import { ChatParticipant } from '@azure/communication-chat';

import {
  SET_THREAD_MEMBERS,
  SET_THREAD_MEMBERS_ERROR,
  ThreadMembersActionTypes,
  SET_REMOVED_FROM_THREAD
} from '../actions/ThreadMembersAction';

export interface ThreadMembersState {
  threadMembers: ChatParticipant[];
  error?: boolean;
  isRemoved: boolean;
}

const initState: ThreadMembersState = {
  threadMembers: [],
  error: false,
  isRemoved: false
};

export const ThreadMembersReducer = (state = initState, action: ThreadMembersActionTypes) => {
  switch (action.type) {
    case SET_THREAD_MEMBERS:
      return {
        ...state,
        threadMembers: [...action.threadMembers]
      };
    case SET_THREAD_MEMBERS_ERROR:
      return {
        ...state,
        error: true
      };
    case SET_REMOVED_FROM_THREAD:
      return {
        ...state,
        isRemoved: action.isRemoved
      };
    default:
      return state;
  }
};
