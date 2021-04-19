import { ChatClient } from '@azure/communication-chat';

export const SET_CHAT_CLIENT = 'SET_CHAT_CLIENT';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_USERS = 'SET_USERS';

export type UserConfiguration = {
  emoji: string;
};

export type Users = Record<string, UserConfiguration>;

export interface SetChatClientAction {
  type: typeof SET_CHAT_CLIENT;
  chatClient: ChatClient | undefined;
}

export interface SetContosoUserAction {
  type: typeof SET_CURRENT_USER;
  identity: string;
  token: string;
  displayName: string;
  memberRole?: string;
}

export interface SetContosoUsersAction {
  type: typeof SET_USERS;
  users: Users;
}

export const setChatClient = (chatClient: ChatClient | undefined): SetChatClientAction => ({
  type: SET_CHAT_CLIENT,
  chatClient
});

export const setContosoUser = (identity: string, token: string, displayName: string): SetContosoUserAction => ({
  type: SET_CURRENT_USER,
  identity,
  token,
  displayName
});

export const setContosoUsers = (users: Users): SetContosoUsersAction => ({
  type: SET_USERS,
  users
});

export type ContosoActionTypes = SetChatClientAction | SetContosoUserAction | SetContosoUsersAction;
