import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind } from '@azure/communication-common';

import {
  MessagesActionTypes,
  SET_MESSAGES,
  SET_TYPING_NOTIFICATIONS,
  SET_TYPING_USERS,
  SET_FAILED_MESSAGES
} from '../actions/MessagesAction';

export interface MessagesState {
  messages: ClientChatMessage[];
  typingNotifications: any;
  typingUsers: ChatParticipant[];
  failedMessages: string[];
  isMessagesLoaded: boolean;
}

// model that allows us to track a message before its replicated on the server
// it also allows us to maintain state if the message was properly sent or not
export interface ClientChatMessage {
  clientMessageId?: string;
  sender?: CommunicationIdentifierKind;
  senderDisplayName?: string;
  content?: { message?: string };
  createdOn: Date;
  id?: string;
  failed?: boolean;
  isMessagesLoaded: boolean;
}

const initMessagesState: MessagesState = {
  messages: [],
  typingNotifications: {},
  typingUsers: [],
  failedMessages: [],
  isMessagesLoaded: false
};

export const MessagesReducer = (state = initMessagesState, action: MessagesActionTypes) => {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        isMessagesLoaded: true,
        messages: [...action.messages]
      };
    case SET_TYPING_NOTIFICATIONS:
      return {
        ...state,
        typingNotifications: {
          ...state.typingNotifications,
          [action.id]: action.typingNotification
        }
      };
    case SET_TYPING_USERS:
      return {
        ...state,
        typingUsers: [...action.typingUsers]
      };
    case SET_FAILED_MESSAGES:
      return {
        ...state,
        failedMessages: [...action.failedMessages]
      };
    default:
      return state;
  }
};
