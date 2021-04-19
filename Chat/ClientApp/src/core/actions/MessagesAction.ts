import { ChatParticipant } from '@azure/communication-chat';
import { ClientChatMessage } from '../reducers/MessagesReducer';

export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_TYPING_NOTIFICATIONS = 'SET_TYPING_NOTIFICATIONS';
export const SET_TYPING_USERS = 'SET_TYPING_USERS';
export const SET_FAILED_MESSAGES = 'SET_FAILED_MESSAGES';

export interface SetMessagesAction {
  type: typeof SET_MESSAGES;
  messages: ClientChatMessage[];
}

export type TypingNotification = {
  recipientId: string; // the user that is sending a message
  originalArrivalTime: Date; // when the message was last sent
  threadId: string;
  version: string;
};

export interface SetTypingNotificationsAction {
  type: typeof SET_TYPING_NOTIFICATIONS;
  id: string;
  typingNotification: TypingNotification;
}

export interface SetTypingUsersAction {
  type: typeof SET_TYPING_USERS;
  typingUsers: ChatParticipant[];
}

export interface SetFailedMessagesAction {
  type: typeof SET_FAILED_MESSAGES;
  failedMessages: string[];
}

export const setMessages = (messages: ClientChatMessage[]): SetMessagesAction => ({
  type: SET_MESSAGES,
  messages
});

export const setTypingNotifications = (
  id: string,
  typingNotification: TypingNotification
): SetTypingNotificationsAction => ({
  type: SET_TYPING_NOTIFICATIONS,
  id,
  typingNotification
});

export const setTypingUsers = (typingUsers: ChatParticipant[]): SetTypingUsersAction => ({
  type: SET_TYPING_USERS,
  typingUsers
});

export const setFailedMessages = (failedMessages: string[]): SetFailedMessagesAction => ({
  type: SET_FAILED_MESSAGES,
  failedMessages
});

export type MessagesActionTypes =
  | SetMessagesAction
  | SetTypingNotificationsAction
  | SetTypingUsersAction
  | SetFailedMessagesAction;
