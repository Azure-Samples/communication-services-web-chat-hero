import { Dispatch } from 'redux';
import React from 'react';

import {
  MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS,
  MAXIMUM_INT64,
  PAGE_SIZE,
  INITIAL_MESSAGES_SIZE,
  OK
} from '../constants';
import { setChatClient, setContosoUser, setContosoUsers } from './actions/ContosoClientAction';
import { setReceipts } from './actions/ConversationsAction';
import { setMessages, setTypingNotifications, setTypingUsers, setFailedMessages, setIsMessagesLoaded } from './actions/MessagesAction';
import { setThreadId, setThreadTopicName } from './actions/ThreadAction';
import { setThreadMembers, setThreadMembersError, setRemovedFromThread } from './actions/ThreadMembersAction';
import { User } from './reducers/ContosoClientReducers';
import { State } from './reducers/index';
import { ClientChatMessage } from './reducers/MessagesReducer';
import {
  compareMessages,
  convertToClientChatMessage,
  createNewClientChatMessage,
  isUserMatchingIdentity
} from '../utils/utils';

import {
  ChatClient,
  ChatThreadClient,
  SendReadReceiptRequest,
  ChatMessageReadReceipt,
  ChatMessage,
  ChatParticipant
} from '@azure/communication-chat';
import {
  AzureCommunicationTokenCredential,
  CommunicationTokenRefreshOptions,
  CommunicationUserIdentifier
} from '@azure/communication-common';
import {
  ChatThreadPropertiesUpdatedEvent,
  CommunicationUserKind,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent
} from '@azure/communication-signaling';

let _serverHardCodedEventInfo: any, _displayName: string, _emoji: string;

const addUserToRoomThread = () => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  if (state.thread.threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  let contosoClient = state.contosoClient;
  if(!contosoClient){
    throw "Error: cannot add user to a room. contosoClient doesnt exist in state."
  }
  let chatClient = state.contosoClient.chatClient;
  let userId = state.contosoClient.user.identity;
  let userTokenString = state.contosoClient.user.token;
  let threadId: string = state.thread.threadId;
  if(!chatClient || !userId || !userTokenString){
    throw "Error: cannot add user to a room. One or more required state objects are missing.";
  }
  // set emoji for the user
  setEmoji(userId, _emoji);
  // subscribe for message, typing indicator, and read receipt
  let chatThreadClient = await chatClient.getChatThreadClient(threadId);
  subscribeForMessage(chatClient, dispatch, getState);
  subscribeForTypingIndicator(chatClient, dispatch);
  subscribeForReadReceipt(chatClient, chatThreadClient, dispatch);
  subscribeForChatParticipants(chatClient, userId, dispatch, getState);
  subscribeForTopicUpdated(chatClient, dispatch, getState);
  dispatch(setThreadId(threadId));
  dispatch(setContosoUser(userId, userTokenString, _displayName));
  dispatch(setChatClient(chatClient));

  await addThreadMemberHelper(
    threadId,
    {
      identity: userId,
      token: userTokenString,
      displayName: _displayName,
      memberRole: 'User'
    },
    dispatch
  );

  await getThreadInformation(chatClient, dispatch, getState);
  await getMessages(chatClient, dispatch, getState);
}
// This function sets up the user to chat with the thread
const addUserToThread = (displayName: string, emoji: string) => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  _displayName = displayName;
  _emoji = emoji;
  if (state.thread.threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  let threadId: string = state.thread.threadId;

  // get environment url from server
  let environmentUrl = await getEnvironmentUrl();

  if (environmentUrl === undefined) {
    console.error('unable to get environment url from server');
    return;
  }
  // create our user
  let userToken = await getToken();

  if (userToken === undefined) {
    console.error('unable to get a token');
    return;
  }

  const user = userToken.user as CommunicationUserIdentifier;

  let options: CommunicationTokenRefreshOptions = {
    token: userToken.token,
    tokenRefresher: () => refreshTokenAsync(user.communicationUserId),
    refreshProactively: true
  };

  let userAccessTokenCredentialNew = new AzureCommunicationTokenCredential(options);
  let chatClient = new ChatClient(environmentUrl, userAccessTokenCredentialNew);

  // set emoji for the user
  setEmoji(user.communicationUserId, emoji);

  // subscribe for message, typing indicator, and read receipt
  let chatThreadClient = await chatClient.getChatThreadClient(threadId);
  subscribeForMessage(chatClient, dispatch, getState);
  subscribeForTypingIndicator(chatClient, dispatch);
  subscribeForReadReceipt(chatClient, chatThreadClient, dispatch);
  subscribeForChatParticipants(chatClient, user.communicationUserId, dispatch, getState);
  subscribeForTopicUpdated(chatClient, dispatch, getState);
  dispatch(setThreadId(threadId));
  dispatch(setContosoUser(user.communicationUserId, userToken.token, displayName));
  dispatch(setChatClient(chatClient));

  await addThreadMemberHelper(
    threadId,
    {
      identity: user.communicationUserId,
      token: userToken.token,
      displayName: displayName,
      memberRole: 'User'
    },
    dispatch
  );

  await getThreadInformation(chatClient, dispatch, getState);
  await getMessages(chatClient, dispatch, getState);
};

const subscribeForTypingIndicator = async (chatClient: ChatClient, dispatch: Dispatch) => {
  await chatClient.startRealtimeNotifications();
  chatClient.on('typingIndicatorReceived', async (event) => {
    const fromId = (event.sender as CommunicationUserKind).communicationUserId;
    const typingNotification = {
      from: fromId,
      originalArrivalTime: event.receivedOn,
      recipientId: (event.recipient as CommunicationUserKind).communicationUserId,
      threadId: event.threadId,
      version: event.version
    };
    dispatch(setTypingNotifications(fromId, typingNotification));
  });
};

const subscribeForMessage = async (chatClient: ChatClient, dispatch: Dispatch, getState: () => State) => {
  await chatClient.startRealtimeNotifications();
  chatClient.on('chatMessageReceived', async (event) => {
    let state: State = getState();
    let messages: ClientChatMessage[] = state.chat.messages !== undefined ? state.chat.messages : [];
    if (!isUserMatchingIdentity(event.sender, state.contosoClient.user.identity)) {
      const clientChatMessage = {
        sender: event.sender,
        id: event.id,
        senderDisplayName: event.senderDisplayName,
        createdOn: event.createdOn,
        content: { message: event.message },
        isMessagesLoaded: false
      };

      messages.push(clientChatMessage);
      dispatch(setMessages(messages.sort(compareMessages)));
    }
  });
};

const subscribeForReadReceipt = async (
  chatClient: ChatClient,
  chatThreadClient: ChatThreadClient,
  dispatch: Dispatch
) => {
  await chatClient.startRealtimeNotifications();
  chatClient.on('readReceiptReceived', async (event) => {
    let receipts: ChatMessageReadReceipt[] = [];
    for await (let page of chatThreadClient.listReadReceipts().byPage()) {
      for (const receipt of page) {
        receipts.push(receipt);
      }
    }
    dispatch(setReceipts(receipts));
  });
};

const subscribeForChatParticipants = async (
  chatClient: ChatClient,
  identity: string,
  dispatch: Dispatch,
  getState: () => State
) => {
  chatClient.on('participantsRemoved', async (event: ParticipantsRemovedEvent) => {
    const state = getState();
    let participants: ChatParticipant[] = [];
    for (let chatParticipant of event.participantsRemoved) {
      // if you are in the list, remove yourself from the chat
      if (isUserMatchingIdentity(chatParticipant.id, identity)) {
        dispatch(setRemovedFromThread(true));
        return;
      }
    }

    const originalParticipants = state.threadMembers.threadMembers;
    for (var i = 0; i < originalParticipants.length; i++) {
      const participantId = (originalParticipants[i].id as CommunicationUserIdentifier).communicationUserId;
      if (
        event.participantsRemoved.filter((chatParticipant) => isUserMatchingIdentity(chatParticipant.id, participantId))
          .length === 0
      ) {
        participants.push(originalParticipants[i]);
      }
    }

    dispatch(setThreadMembers(participants));
  });

  chatClient.on('participantsAdded', async (event: ParticipantsAddedEvent) => {
    const state = getState();
    let participants: ChatParticipant[] = [...state.threadMembers.threadMembers];

    // there is a chance that the participant added is you and so there is a chance that you can come in as a
    // new participant as well
    const addedParticipants = event.participantsAdded.map((chatParticipant: ChatParticipant) => {
      return {
        id: chatParticipant.id,
        displayName: chatParticipant.displayName,
        shareHistoryTime: new Date(chatParticipant?.shareHistoryTime || new Date())
      };
    });

    // add participants not in the list
    for (var j = 0; j < event.participantsAdded.length; j++) {
      const addedParticipant = event.participantsAdded[j];
      const id = (addedParticipant.id as CommunicationUserIdentifier).communicationUserId;
      if (
        participants.filter((participant: ChatParticipant) => isUserMatchingIdentity(participant.id, id)).length === 0
      ) {
        participants.push(addedParticipant);
      }
    }

    // also make sure we get the emojis for the new participants
    let users = Object.assign({}, state.contosoClient.users);
    for (var i = 0; i < addedParticipants.length; i++) {
      var threadMember = addedParticipants[i];
      var identity = (threadMember.id as CommunicationUserIdentifier).communicationUserId;
      var user = users[identity];
      if (user == null) {
        var serverUser = await getEmoji(identity);
        if (serverUser !== undefined) {
          users[identity] = { emoji: serverUser.emoji };
        }
      }
    }

    dispatch(setContosoUsers(users));
    dispatch(setThreadMembers(participants));
  });
};

const subscribeForTopicUpdated = async (chatClient: ChatClient, dispatch: Dispatch, getState: () => State) => {
  chatClient.on('chatThreadPropertiesUpdated', async (e: ChatThreadPropertiesUpdatedEvent) => {
    const state = getState();
    let threadId = state.thread.threadId;

    if (!threadId) {
      console.error('no threadId set');
      return;
    }

    dispatch(setThreadTopicName(e.properties.topic));
  });
};

const sendTypingNotification = () => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  let chatClient = state.contosoClient.chatClient;
  if (chatClient === undefined) {
    console.error('Chat Client not created yet');
    return;
  }
  let threadId = state.thread.threadId;
  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  await sendTypingNotificationHelper(await chatClient.getChatThreadClient(threadId));
};

const updateTypingUsers = () => async (dispatch: Dispatch, getState: () => State) => {
  let typingUsers = [];
  let state: State = getState();
  let typingNotifications = state.chat.typingNotifications;
  for (let id in typingNotifications) {
    let typingNotification = typingNotifications[id];
    if (!typingNotification.originalArrivalTime) {
      continue;
    }
    if (shouldDisplayTyping(typingNotification.originalArrivalTime)) {
      let threadMember = state.threadMembers.threadMembers.find((threadMember) =>
        isUserMatchingIdentity(threadMember.id, id)
      );
      if (threadMember) {
        typingUsers.push(threadMember);
      }
    }
  }
  dispatch(setTypingUsers(typingUsers));
};

const shouldDisplayTyping = (lastReceivedTypingEventDate: number) => {
  let currentDate = new Date();
  let timeSinceLastTypingNotificationMs = currentDate.getTime() - lastReceivedTypingEventDate;
  return timeSinceLastTypingNotificationMs <= MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS;
};

const sendMessage = (messageContent: string) => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  let chatClient = state.contosoClient.chatClient;
  if (chatClient === undefined) {
    console.error('Chat Client not created yet');
    return;
  }
  let threadId = state.thread.threadId;
  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  let displayName = state.contosoClient.user.displayName;
  let userId = state.contosoClient.user.identity;

  // we use this client message id to have a local id for messages
  // if we fail to send the message we'll at least be able to show that the message failed to send on the client
  let clientMessageId = (Math.floor(Math.random() * MAXIMUM_INT64) + 1).toString(); //generate a random unsigned Int64 number
  let newMessage = createNewClientChatMessage(userId, displayName, clientMessageId, messageContent);

  let messages = getState().chat.messages;
  messages.push(newMessage);
  dispatch(setMessages(messages));

  await sendMessageHelper(
    await chatClient.getChatThreadClient(threadId),
    messageContent,
    displayName,
    clientMessageId,
    dispatch,
    getState
  );
};

const getEventIfExists = () => _serverHardCodedEventInfo;

const setRoomThreadId = (roomId: string) => async (dispatch: Dispatch) => {
  if(roomId == "main")
      dispatch(setThreadId(_serverHardCodedEventInfo.chatSessionThreadId));
  else 
      dispatch(setThreadId(_serverHardCodedEventInfo.rooms[0].chatSessionThreadId));
}

const getEventInformation = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    let validationRequestOptions = { method: 'GET' };
    let response = await fetch('/event/' + eventId, validationRequestOptions);
    if (response.status === 200) {
      return response.json().then((result) => {
        console.log("Event Information: ", result);
        dispatch(setThreadId(result.chatSessionThreadId));
        return _serverHardCodedEventInfo = result;
      });
    } else {
      return false;
    }
  } catch (error) {
    console.error('Failed at getting isThreadIdValid, Error: ', error);
  }
};

const isValidThread = (threadId: string) => async (dispatch: Dispatch) => {
  try {
    let validationRequestOptions = { method: 'GET' };
    let validationResponse = await fetch('/isValidThread/' + threadId, validationRequestOptions);
    if (validationResponse.status === 200) {
      dispatch(setThreadId(threadId));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Failed at getting isThreadIdValid, Error: ', error);
  }
};

const getMessages = async (chatClient: ChatClient, dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  if (chatClient === undefined) {
    console.error('Chat Client not created yet');
    return;
  }
  let threadId = state.thread.threadId;
  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  let messages = await getMessagesHelper(await chatClient.getChatThreadClient(threadId));
  if (messages === undefined) {
    console.error('unable to get messages');
    return;
  }

  const reversedClientChatMessages: ClientChatMessage[] = messages
    .map((message) => convertToClientChatMessage(message))
    .reverse();

  return dispatch(setMessages(reversedClientChatMessages));
};

const resetMessages = () => (dispatch: Dispatch, getState: () => State) => {
  dispatch(setIsMessagesLoaded(false));
}

const createThread = async () => {
  // TODO: fetch saved threadId from the server
  let threadId = await createThreadHelper();
  if (threadId !== null) {
    window.location.href += `?threadId=${threadId}`;
  } else {
    console.error('unable to generate a new chat thread');
  }
};

const addThreadMember = () => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  let user = state.contosoClient.user;
  let threadId = state.thread.threadId;

  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  await addThreadMemberHelper(
    threadId,
    {
      identity: user.identity,
      token: user.token,
      displayName: user.displayName,
      memberRole: 'User'
    },
    dispatch
  );
};
// TODO: Only remove if user was in a room and getting to another room or to the main event page.
const removeThreadMemberByUserId = (userId: string) => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  let chatClient = state.contosoClient.chatClient;
  let threadId = state.thread.threadId;
  if (chatClient === undefined) {
    console.error("Chat client doesn't created yet");
    return;
  }
  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  let chatThreadClient = await chatClient.getChatThreadClient(threadId);
  try {
    await chatThreadClient.removeParticipant({
      communicationUserId: userId
    });
  } catch (error) {
    console.log(error);
  }
};

const getThreadMembers = () => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  let chatClient = state.contosoClient.chatClient;
  if (chatClient === undefined) {
    console.error('Chat Client not created yet');
    return;
  }
  let threadId = state.thread.threadId;
  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  let chatThreadClient = await chatClient.getChatThreadClient(threadId);

  try {
    let threadMembers = [];
    for await (let page of chatThreadClient.listParticipants().byPage()) {
      for (const threadMember of page) {
        threadMembers.push(threadMember);
      }
    }
    dispatch(setThreadMembers(threadMembers));
  } catch (error) {
    console.error('Failed at getting members, Error: ', error);
    dispatch(setThreadMembersError(true));
  }
};

// We want to grab everything about the chat thread that has occured before we register for events.
// We care about pre-existing messages, the chat topic, and the participants in this chat
const getThreadInformation = async (chatClient: ChatClient, dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
  if (chatClient === undefined) {
    console.error('Chat Client not created yet');
    return;
  }
  let threadId = state.thread.threadId;
  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }

  let chatThreadClient;
  let iteratableParticipants;
  let topic;

  try {
    chatThreadClient = chatClient.getChatThreadClient(threadId);
    iteratableParticipants = chatThreadClient.listParticipants();
  } catch (error) {
    console.error(error);
    dispatch(setThreadMembersError(true));
  }

  let chatParticipants = [];
  // This is just to get all of the members in a chat. This is not performance as we're not using paging
  if (!iteratableParticipants) {
    console.error('unable to resolve chat participant iterator');
    return; // really we need to alert that there was an error?
  }

  for await (const page of iteratableParticipants.byPage()) {
    for (const chatParticipant of page) {
      chatParticipants.push(chatParticipant);
    }
  }

  if (chatParticipants.length === 0) {
    console.error('unable to get members in the thread');
    return;
  }

  // remove undefined display name chat participants
  const validChatParticipants = chatParticipants.filter(
    (chatParticipant) => chatParticipant.displayName !== undefined && chatParticipant.id !== undefined
  );

  // get the emojis for the new participants
  let users = state.contosoClient.users;
  for (var i = 0; i < chatParticipants.length; i++) {
    var threadMember = chatParticipants[i];
    var identity = (threadMember.id as CommunicationUserIdentifier).communicationUserId;
    var user = users[identity];
    if (user == null) {
      var serverUser = await getEmoji(identity);
      if (serverUser !== undefined) {
        users[identity] = { emoji: serverUser.emoji };
      }
    }
  }

  const properties = await chatThreadClient?.getProperties();

  if (!properties) {
    console.error('no chat thread properties');
    return;
  }

  dispatch(setThreadId(threadId));
  dispatch(setThreadTopicName(properties.topic));
  dispatch(setContosoUsers(users));
  dispatch(setThreadMembers(validChatParticipants));
};

const updateThreadTopicName = async (
  chatClient: ChatClient,
  threadId: string,
  topicName: string,
  setIsSavingTopicName: React.Dispatch<boolean>
) => {
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  updateThreadTopicNameHelper(chatThreadClient, topicName, setIsSavingTopicName);
};

// Thread Helper
const createThreadHelper = async () => {
  try {
    let createThreadRequestOptions = { method: 'POST' };
    let createThreadResponse = await fetch('/createThread', createThreadRequestOptions);
    let threadId = await createThreadResponse.text();
    return threadId;
  } catch (error) {
    console.error('Failed at creating thread, Error: ', error);
  }
};

const updateThreadTopicNameHelper = async (
  chatThreadClient: ChatThreadClient,
  topicName: string,
  setIsSavingTopicName: React.Dispatch<boolean>
) => {
  try {
    await chatThreadClient.updateTopic(topicName);
    setIsSavingTopicName(false);
  } catch (error) {
    console.error('Failed at updating thread property, Error: ', error);
  }
};

// Thread Member Helper
const addThreadMemberHelper = async (threadId: string, user: User, dispatch: Dispatch) => {
  try {
    let body = {
      id: user.identity,
      displayName: user.displayName
    };
    let addMemberRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    await fetch('/addUser/' + threadId, addMemberRequestOptions);
  } catch (error) {
    console.error('Failed at adding thread member, Error: ', error);
  }
};

// Message Helper
const sendMessageHelper = async (
  chatThreadClient: ChatThreadClient,
  messageContent: string,
  displayName: string,
  clientMessageId: string,
  dispatch: Dispatch,
  getState: () => State
) => {
  // for real time messages we want to store it locally and render it and then sync it with the server message later
  // 1. send the message
  // 2. cache the message locally using the message.id
  // 3. when we get the server synced message we match with the message.id
  try {
    const messageResult = await chatThreadClient.sendMessage(
      { content: messageContent },
      { senderDisplayName: displayName }
    );
    const message: ChatMessage = await chatThreadClient.getMessage(messageResult.id);
    updateMessagesArray(dispatch, getState, convertToClientChatMessage(message, clientMessageId));
  } catch (error) {
    console.error('Failed at getting messages, Error: ', error);
    let failedMessages = getState().chat.failedMessages;
    failedMessages.push(clientMessageId);
    setFailedMessages(failedMessages);

    const message = getState().chat.messages.filter((message) => message.clientMessageId === clientMessageId)[0];
    message.failed = true;
    updateMessagesArray(dispatch, getState, message);
  }
};

// Merge our local messages with server synced messages
const updateMessagesArray = async (dispatch: Dispatch, getState: () => State, newMessage: ClientChatMessage) => {
  let state: State = getState();
  let messages: ClientChatMessage[] = state.chat.messages !== undefined ? state.chat.messages : [];

  // the message id is what we we get from the server when it is synced. There will be other server attributes
  // on the message but the id should be consistent.
  messages = messages.map((message: ClientChatMessage) => {
    return message.clientMessageId === newMessage.clientMessageId ? Object.assign({}, message, newMessage) : message;
  });
  dispatch(setMessages(messages.sort(compareMessages)));
};

const getMessagesHelper = async (chatThreadClient: ChatThreadClient): Promise<ChatMessage[] | undefined> => {
  try {
    let messages: ChatMessage[] = [];
    let getMessagesResponse = await chatThreadClient.listMessages({
      maxPageSize: PAGE_SIZE
    });

    let messages_temp = [];

    for await (let page of getMessagesResponse.byPage()) {
      for (const message of page) {
        messages_temp.push(message);
      }
    }

    while (true) {
      if (messages_temp === undefined) {
        console.error('Unable to get messages from server');
        return;
      }

      // filter and only return top 100 text messages
      messages.push(...messages_temp.filter((message) => message.type === 'text'));
      if (messages.length >= INITIAL_MESSAGES_SIZE) {
        return messages.slice(0, INITIAL_MESSAGES_SIZE);
      }
      // if there is no more messages
      break;
    }

    return messages.slice(0, INITIAL_MESSAGES_SIZE);
  } catch (error) {
    console.error('Failed at getting messages, Error: ', error);
  }
};

// Typing Notification Helper
const sendTypingNotificationHelper = async (chatThreadClient: ChatThreadClient) => {
  try {
    await chatThreadClient.sendTypingNotification();
  } catch (error) {
    console.error('Failed at sending typing notification, Error: ', error);
  }
};

const getEnvironmentUrl = async () => {
  try {
    let getRequestOptions = {
      method: 'GET'
    };
    let response = await fetch('/getEnvironmentUrl', getRequestOptions);
    return response.text().then((environmentUrl) => environmentUrl);
  } catch (error) {
    console.error('Failed at getting environment url, Error: ', error);
  }
};

// Token Helper
const getToken = async () => {
  try {
    let getTokenRequestOptions = {
      method: 'POST'
    };
    let getTokenResponse = await fetch('/token', getTokenRequestOptions);
    return getTokenResponse.json().then((_responseJson) => _responseJson);
  } catch (error) {
    console.error('Failed at getting token, Error: ', error);
  }
};

const refreshTokenAsync = async (userIdentity: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    return fetch('/refreshToken/' + userIdentity).then(
      (response) => {
        if (response.ok) {
          resolve(response.json().then((json) => json.token));
        } else {
          reject(new Error('error'));
        }
      },
      (error) => {
        reject(new Error(error.message));
      }
    );
  });
};

const setEmoji = async (userId: string, emoji: string) => {
  try {
    let getTokenRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Emoji: emoji })
    };
    await (await fetch('/userConfig/' + userId, getTokenRequestOptions)).json;
  } catch (error) {
    console.error('Failed at setting emoji, Error: ', error);
  }
};

const getEmoji = async (userId: string) => {
  try {
    let getTokenRequestOptions = {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    };
    return await (await fetch('/userConfig/' + userId, getTokenRequestOptions)).json();
  } catch (error) {
    console.error('Failed at getting emoji, Error: ', error);
  }
};

const sendReadReceipt = (messageId: string) => async (dispatch: Dispatch, getState: () => State) => {
  // This is sent when we get focus to this tab and see this message
  let state: State = getState();
  let chatClient = state.contosoClient.chatClient;
  if (chatClient === undefined) {
    console.error('Chat Client not created yet');
    return;
  }
  let threadId = state.thread.threadId;
  if (threadId === undefined) {
    console.error('Thread Id not created yet');
    return;
  }
  await sendReadReceiptHelper(await chatClient.getChatThreadClient(threadId), messageId);
};

const sendReadReceiptHelper = async (chatThreadClient: ChatThreadClient, messageId: string) => {
  let postReadReceiptRequest: SendReadReceiptRequest = {
    chatMessageId: messageId
  };
  await chatThreadClient.sendReadReceipt(postReadReceiptRequest);
};

export {
  sendMessage,
  getMessages,
  createThread,
  addThreadMember,
  getThreadMembers,
  addUserToThread,
  removeThreadMemberByUserId,
  getEmoji,
  setEmoji,
  sendReadReceipt,
  sendTypingNotification,
  updateTypingUsers,
  isValidThread,
  updateThreadTopicName,
  getEventInformation,
  getEventIfExists,
  setRoomThreadId,
  addUserToRoomThread,
  resetMessages
};
