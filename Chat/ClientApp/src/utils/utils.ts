import { ChatMessage } from '@azure/communication-chat';
import { CommunicationIdentifier, isCommunicationUserIdentifier } from '@azure/communication-common';
import preval from 'preval.macro';
import { ClientChatMessage } from '../core/reducers/MessagesReducer';
import { AudioDeviceInfo, VideoDeviceInfo, RemoteVideoStream } from '@azure/communication-calling';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CommunicationUserToken } from '@azure/communication-identity';

export const CAT = '🐱';
export const MOUSE = '🐭';
export const KOALA = '🐨';
export const OCTOPUS = '🐙';
export const MONKEY = '🐵';
export const FOX = '🦊';

export const getImage = (avatar: string, isSmall: boolean) => {
  let avatarType: string = '';
  switch (avatar) {
    case CAT:
      avatarType = 'cat';
      break;
    case MOUSE:
      avatarType = 'mouse';
      break;
    case KOALA:
      avatarType = 'koala';
      break;
    case OCTOPUS:
      avatarType = 'octopus';
      break;
    case MONKEY:
      avatarType = 'monkey';
      break;
    case FOX:
      avatarType = 'fox';
      break;
  }

  return `${isSmall ? '1' : '2'}x/${avatarType}.png`;
};
export const getBackgroundColor = (avatar: string) => {
  switch (avatar) {
    case CAT:
      return {
        backgroundColor: 'rgba(255, 250, 228, 1)'
      };
    case MOUSE:
      return {
        backgroundColor: 'rgba(33, 131, 196, 0.1)'
      };
    case KOALA:
      return {
        backgroundColor: 'rgba(197, 179, 173, 0.3)'
      };
    case OCTOPUS:
      return {
        backgroundColor: 'rgba(255, 240, 245, 1)'
      };
    case MONKEY:
      return {
        backgroundColor: 'rgba(255, 245, 222, 1)'
      };
    case FOX:
      return {
        backgroundColor: 'rgba(255, 231, 205, 1)'
      };
    default:
      return {
        backgroundColor: 'rgba(255, 250, 228, 1)'
      };
  }
};
export const getEventId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('eventId');
};

export const getThreadId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('threadId');
};

export const getBuildTime = () => {
  const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`;
  return dateTimeStamp;
};

export function getChatSDKVersion() {
  return require('../../package.json')['dependencies']['@azure/communication-chat'];
}

export const compareMessages = (firstMessage: ClientChatMessage, secondMessage: ClientChatMessage) => {
  if (firstMessage.createdOn === undefined) return 1;
  if (secondMessage.createdOn === undefined) return -1;
  const firstDate = new Date(firstMessage.createdOn).getTime();
  const secondDate = new Date(secondMessage.createdOn).getTime();
  return firstDate - secondDate;
};

export const isUserMatchingIdentity = (user: CommunicationIdentifier, communicationUserId: string): boolean => {
  return isCommunicationUserIdentifier(user) && user.communicationUserId === communicationUserId;
};

export const convertToClientChatMessage = (chatMessage: ChatMessage, clientMessageId?: string): ClientChatMessage => {
  return {
    content: { message: chatMessage.content?.message },
    clientMessageId: clientMessageId,
    sender: chatMessage.sender,
    senderDisplayName: chatMessage.senderDisplayName,
    createdOn: chatMessage.createdOn,
    id: chatMessage.id,
    isMessagesLoaded: true
  };
};

export const createNewClientChatMessage = (
  userId: string,
  displayName: string,
  clientMessageId: string,
  message: string
): ClientChatMessage => {
  return {
    content: { message: message },
    clientMessageId: clientMessageId,
    sender: { communicationUserId: userId, kind: 'communicationUser' },
    senderDisplayName: displayName,
    createdOn: new Date(),
    isMessagesLoaded: true
  };
};

export const utils = {
  getAppServiceUrl: (): string => {
    return window.location.origin;
  },
  getTokenForUser: async (): Promise<CommunicationUserToken> => {
    const response = await fetch('/token');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Invalid token response');
  },
  getRefreshedTokenForUser: async (identity: string): Promise<string> => {
    const response = await fetch(`/refreshToken/${identity}`);
    if (response.ok) {
      const content = await response.json();
      return content.token;
    }
    throw new Error('Invalid token response');
  },
  isSelectedAudioDeviceInList(selected: AudioDeviceInfo, list: AudioDeviceInfo[]): boolean {
    return list.filter((item) => item.name === selected.name).length > 0;
  },
  isSelectedVideoDeviceInList(selected: VideoDeviceInfo, list: VideoDeviceInfo[]): boolean {
    return list.filter((item) => item.name === selected.name).length > 0;
  },
  isMobileSession(): boolean {
    return window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g)
      ? true
      : false;
  },
  isSmallScreen(): boolean {
    return window.innerWidth < 700 || window.innerHeight < 400;
  },
  isUnsupportedBrowser(): boolean {
    return window.navigator.userAgent.match(/(Firefox)/g) ? true : false;
  },
  getId: (identifier: CommunicationIdentifierKind): string => {
    switch (identifier.kind) {
      case 'communicationUser':
        return identifier.communicationUserId;
      case 'phoneNumber':
        return identifier.phoneNumber;
      case 'microsoftTeamsUser':
        return identifier.microsoftTeamsUserId;
      case 'unknown':
        return identifier.id;
    }
  },
  getStreamId: (userId: string, stream: RemoteVideoStream): string => {
    return `${userId}-${stream.id}-${stream.mediaStreamType}`;
  },
  /*
   * TODO:
   *  Remove this method once the SDK improves error handling for unsupported browser.
   */
  isOnIphoneAndNotSafari(): boolean {
    const userAgent = navigator.userAgent;
    // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
    if (userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'))) {
      return true;
    }
    return false;
  },
  getBuildTime: (): string => {
    const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`;
    return dateTimeStamp;
  }
};