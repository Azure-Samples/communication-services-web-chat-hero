import { ChatClient } from '@azure/communication-chat';

import {
  ContosoActionTypes,
  SET_CHAT_CLIENT,
  SET_CURRENT_USER,
  SET_USERS,
  Users
} from '../actions/ContosoClientAction';

export interface User {
  identity: string;
  token?: string;
  displayName: string;
  memberRole?: String;
}

export interface ContosoState {
  chatClient: ChatClient | undefined;
  user: User;
  users: Users;
}

const initContosoState: ContosoState = {
  chatClient: undefined,
  user: { identity: '', token: '', displayName: '', memberRole: '' },
  users: {}
};

export const ContosoReducer = (state = initContosoState, action: ContosoActionTypes) => {
  switch (action.type) {
    case SET_CHAT_CLIENT:
      return {
        ...state,
        chatClient: action.chatClient
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        user: {
          identity: action.identity,
          token: action.token,
          displayName: action.displayName,
          memberRole: action.memberRole
        }
      };
    case SET_USERS:
      return {
        ...state,
        users: Object.assign({}, action.users)
      };
    default:
      return state;
  }
};
