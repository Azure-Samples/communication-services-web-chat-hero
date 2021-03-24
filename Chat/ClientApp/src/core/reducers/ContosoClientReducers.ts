import { ChatClient } from '@azure/communication-chat';

import {
  ContosoActionTypes,
  SET_CHAT_CLIENT,
  SET_CURRENT_USER,
  SET_USERS,
  SET_CURRENT_USER_COOL_PERIOD,
  Users
} from '../actions/ContosoClientAction';

export interface User {
  identity: string;
  token?: string;
  displayName: string;
  memberRole?: String;
  coolPeriod?: Date;
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
    case SET_CURRENT_USER_COOL_PERIOD:
      return {
        ...state,
        user: {
          identity: state.user.identity,
          token: state.user.token,
          displayName: state.user.displayName,
          memberRole: state.user.memberRole,
          coolPeriod: action.coolPeriod
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
