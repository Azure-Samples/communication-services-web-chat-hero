import { Dispatch } from 'redux';
import React from 'react';

import {
  MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS,
  MAXIMUM_INT64,
  PAGE_SIZE,
  INITIAL_MESSAGES_SIZE,
  MAXIMUM_RETRY_COUNT,
  OK
} from '../constants';
import { setChatClient, setContosoUser, setContosoUsers } from './actions/ContosoClientAction';
import { setReceipts } from './actions/ConversationsAction';
import { setMessages, setTypingNotifications, setTypingUsers, setFailedMessages } from './actions/MessagesAction';
import { setThreadId, setThread } from './actions/ThreadAction';
import {
  setThreadMembers,
  setThreadMembersError,
  setRemoveThreadMemberError,
  setAddThreadMemberError
} from './actions/ThreadMembersAction';
import { User } from './reducers/ContosoClientReducers';
import { State } from './reducers/index';
import { ClientChatMessage } from './reducers/MessagesReducer';
import { compareMessages, convertToClientChatMessage, createNewClientChatMessage, isUserMatchingIdentity } from '../utils/utils';

import {
  ChatClient,
  ChatThreadClient,
  SendReadReceiptRequest,
  ChatMessageReadReceipt,
  ChatMessage,
  ChatParticipant,
} from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions, CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatThreadPropertiesUpdatedEvent, ParticipantsAddedEvent, ParticipantsRemovedEvent } from '@azure/communication-signaling';

// This function sets up the user to chat with the thread
const addUserToThread = (displayName: string, emoji: string, endChatHandler: () => void) => async (dispatch: Dispatch, getState: () => State) => {
  let state: State = getState();
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
  tokenRefresher:  () => refreshTokenAsync(user.communicationUserId),
  refreshProactively: true
 }

  let userAccessTokenCredentialNew = new AzureCommunicationTokenCredential(options);
  let chatClient = new ChatClient(environmentUrl, userAccessTokenCredentialNew);

  // set emoji for the user
  setEmoji(user.communicationUserId, emoji);

  // subscribe for message, typing indicator, and read receipt
  let chatThreadClient = await chatClient.getChatThreadClient(threadId);
  subscribeForMessage(chatClient, dispatch, getState);
  subscribeForTypingIndicator(chatClient, dispatch);
  subscribeForReadReceipt(chatClient, chatThreadClient, dispatch);
  subscribeForChatParticipants(chatClient, user.communicationUserId, endChatHandler, dispatch, getState);
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
};

const subscribeForTypingIndicator = async (chatClient: ChatClient, dispatch: Dispatch) => {
  await chatClient.startRealtimeNotifications();
  chatClient.on('typingIndicatorReceived', async (event) => {
    const fromId = event.sender.user.communicationUserId;

    const typingNotification = {
      from: fromId,
      originalArrivalTime: Date.parse(event.receivedOn),
      recipientId: event.recipient.communicationUserId,
      threadId: event.threadId,
      version: event.version
    }
    dispatch(setTypingNotifications(fromId, typingNotification));
  });
};

const subscribeForMessage = async (chatClient: ChatClient, dispatch: Dispatch, getState: () => State) => {
  await chatClient.startRealtimeNotifications();
  chatClient.on('chatMessageReceived', async (event) => {
    let state: State = getState();
    let messages: any = state.chat.messages !== undefined ? state.chat.messages : [];
    if (!isUserMatchingIdentity(event.sender.user, state.contosoClient.user.identity)) {
      // not user's own message
      messages.push(event);
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

const subscribeForChatParticipants = async (chatClient: ChatClient, identity: string, endChatHandler: ()=> void, dispatch: Dispatch, getState: () => State) => {
  chatClient.on('participantsRemoved', async (event: ParticipantsRemovedEvent) => {
    const state = getState();
    let participants: ChatParticipant[] = [];
    for(let chatParticipant of event.participantsRemoved) {
      // if you are in the list, remove yourself from the chat
      if(isUserMatchingIdentity(chatParticipant.user, identity)) {
        setThreadMembersError(true);
        endChatHandler();
        return;
      }
    }

    const originalParticipants = state.threadMembers.threadMembers;
    for(var i = 0; i < originalParticipants.length; i++) {
      if (event.participantsRemoved.filter(
        chatParticipant => (chatParticipant.user as CommunicationUserIdentifier).communicationUserId === (originalParticipants[i].id as CommunicationUserIdentifier).communicationUserId).length === 0) {
        participants.push(originalParticipants[i]);
      }
    }

    dispatch(setThreadMembers(participants))
  });

  chatClient.on('participantsAdded', async (event: ParticipantsAddedEvent) => {
    const state = getState();
    let participants: ChatParticipant[] = [...state.threadMembers.threadMembers];

    const addedParticipants = event.participantsAdded.map(chatParticipant => { return {id: chatParticipant.user, displayName: chatParticipant.displayName, shareHistoryTime: new Date(chatParticipant?.shareHistoryTime || new Date()) }})

    for(var i  = 0; i < addedParticipants.length; i++) {
      participants.push(addedParticipants[i])
    }

    // also make sure we get the emojis for the new participants
    let users = state.contosoClient.users;
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
  
    dispatch(setContosoUsers(users))
    dispatch(setThreadMembers(participants))
  })
};

const subscribeForTopicUpdated = async (chatClient: ChatClient, dispatch: Dispatch, getState: () => State) => {
  chatClient.on('chatThreadPropertiesUpdated', async(e: ChatThreadPropertiesUpdatedEvent) => {
    const state = getState();
    let thread = state.thread.thread;

    if (!thread) {
      return;
    }

    thread.topic = e.properties.topic;
  
    dispatch(setThread(thread))
  })
}

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
      let threadMember = state.threadMembers.threadMembers.find(
        (threadMember) => isUserMatchingIdentity(threadMember.id, id)
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

  let clientMessageId = (Math.floor(Math.random() * MAXIMUM_INT64) + 1).toString(); //generate a random unsigned Int64 number
  let newMessage = createNewClientChatMessage(userId, displayName, clientMessageId, messageContent);

  let messages = getState().chat.messages;
  messages.push(newMessage);
  dispatch(setMessages(messages));

  await sendMessageHelper(
    await chatClient.getChatThreadClient(threadId),
    threadId,
    messageContent,
    displayName,
    clientMessageId,
    dispatch,
    0,
    getState
  );
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

const getMessages = () => async (dispatch: Dispatch, getState: () => State) => {
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
  let messages = await getMessagesHelper(await chatClient.getChatThreadClient(threadId));
  if (messages === undefined) {
    console.error('unable to get messages');
    return;
  }

  const clientChatMessages = messages.map(message => { return {
    sender: message.sender,
    senderDisplayName: message.senderDisplayName,
    createdOn: message.createdOn,
    content: message.content?.message
    }
  })

  // so the messages are in the order you expect in the chat thread
  const reversedClientChatMessages = clientChatMessages.reverse()

  return dispatch(setMessages(reversedClientChatMessages));
};

const createThread = async () => {
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
    let response = await chatThreadClient.removeParticipant({
      communicationUserId: userId
    });
  }
  catch(error) {
    // TOO_MANY_REQUESTS_STATUS_CODE
    console.log(error);
    dispatch(setRemoveThreadMemberError(true));
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
  let threadMembers = await getThreadMembersHelper(chatThreadClient);
  if (threadMembers === undefined) {
    console.error('unable to get members in the thread');
    dispatch(setThreadMembersError(true));
    return;
  }
  dispatch(setThreadMembers(threadMembers));
};

const getThread = () => async (dispatch: Dispatch, getState: () => State) => {
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

  let thread;
  let chatThreadClient;
  let iteratableParticipants
  try {
    thread = await chatClient.getChatThread(threadId);
    chatThreadClient = chatClient.getChatThreadClient(threadId);
    iteratableParticipants = chatThreadClient.listParticipants()
  }
  catch(error) {
    dispatch(setThreadMembersError(true));
  }


  let chatParticipants = [];
  // This is just to get all of the members in a chat. This is not performance as we're not using paging
  if (!iteratableParticipants) {
    return;
  }

  for await (const chatParticipant of iteratableParticipants) {
    chatParticipants.push(chatParticipant);
  }

  if (chatParticipants.length == 0) {
    console.error('unable to get members in the thread');
    return;
  }

  // remove undefined display name chat participants
  const validChatParticipants = chatParticipants.filter(chatParticipant => chatParticipant.displayName !== undefined && chatParticipant.id !== undefined)

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

  dispatch(setContosoUsers(users))
  dispatch(setThreadMembers(validChatParticipants));
  dispatch(setThread(thread));
};

const updateThreadTopicName = (topicName: string, setIsSavingTopicName: React.Dispatch<boolean>) => async (
  dispatch: Dispatch,
  getState: () => State
) => {
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
  updateThreadTopicNameHelper(await chatClient.getChatThreadClient(threadId), topicName, setIsSavingTopicName);
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
    let response = await fetch('/addUser/' + threadId, addMemberRequestOptions);
    dispatch(setAddThreadMemberError(response.status !== OK));
  } catch (error) {
    console.error('Failed at adding thread member, Error: ', error);
  }
};

const getThreadMembersHelper = async (chatThreadClient: ChatThreadClient) => {
  try {
    let threadMembers = [];
    for await (let page of chatThreadClient.listParticipants().byPage()) {
      for (const threadMember of page) {
        threadMembers.push(threadMember);
      }
    }
    return threadMembers.filter((threadMember) => threadMember.displayName !== undefined)!;
  } catch (error) {
    console.error('Failed at getting members, Error: ', error);
    return [];
  }
};

// Message Helper
const sendMessageHelper = async (
  chatThreadClient: ChatThreadClient,
  threadId: string,
  messageContent: string,
  displayName: string,
  clientMessageId: string,
  dispatch: Dispatch,
  retryCount: number,
  getState: () => State
) => {
  let failedMessages = getState().chat.failedMessages;
  try {
    let SendMessageRequest = {
      content: messageContent,
      senderDisplayName: displayName
    };

    const messageResult = await chatThreadClient.sendMessage(SendMessageRequest);

    if (messageResult.id) {
      let message: ChatMessage | undefined = await getMessageHelper(chatThreadClient, messageResult.id);
      if (message) {
        updateMessagesArray(dispatch, getState, convertToClientChatMessage(message, clientMessageId));
      } else {
        updateMessagesArray(dispatch, getState, {
          clientMessageId: clientMessageId,
          createdOn: new Date(),
          id: messageResult.id
        });
      }
    }
  } catch (error) {
    if (retryCount >= MAXIMUM_RETRY_COUNT) {
      console.error('Failed at sending message and reached max retry count');
      failedMessages.push(clientMessageId);
      setFailedMessages(failedMessages);
      return;
    }
    setTimeout(() => {
      sendMessageHelper(
        chatThreadClient,
        threadId,
        messageContent,
        displayName,
        clientMessageId,
        dispatch,
        retryCount + 1,
        getState
      );
    }, 200);
  }
};

// when we get a message we want to update the server state of that message with our local message
const updateMessagesArray = async (
  dispatch: Dispatch,
  getState: () => State,
  newMessage: ClientChatMessage
) => {
  let state: State = getState();
  let messages: ClientChatMessage[] = state.chat.messages !== undefined ? state.chat.messages : [];
  messages = messages.map((message: ClientChatMessage) => {
    return message.clientMessageId === newMessage.clientMessageId ? Object.assign({}, message, newMessage) : message;
  });
  dispatch(setMessages(messages.sort(compareMessages)));
};

const getMessageHelper = async (chatThreadClient: ChatThreadClient, messageId: string): Promise<ChatMessage | undefined> => {
  try {
    const message: ChatMessage = await chatThreadClient.getMessage(messageId);
    return message;
  } catch (error) {
    console.error('Failed at getting messages, Error: ', error);
  }
  return undefined;
};

const getMessagesHelper = async (chatThreadClient: ChatThreadClient): Promise<ChatMessage[] | undefined>=> {
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

const refreshTokenAsync = async (userIdentity: string) : Promise<string>=> {
  return new Promise<string>((resolve, reject) => {
    return fetch('/refreshToken/'+ userIdentity).then(response => {
      if (response.ok) {
        resolve(response.json().then(json => json.token))
      } else {
        reject(new Error('error'))
      }
    }, error => {
      reject(new Error(error.message))
    })
  })
}

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
  getThread
};