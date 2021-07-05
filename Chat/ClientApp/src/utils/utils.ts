import { ChatMessage } from '@azure/communication-chat';
import { CommunicationIdentifier, isCommunicationUserIdentifier } from '@azure/communication-common';
import { BlobServiceClient, BlockBlobUploadResponse } from '@azure/storage-blob';
import preval from 'preval.macro';
import { FeedbackSettings } from '../feedbacks/FeedbackSettings';
import { ClientChatMessage } from '../core/reducers/MessagesReducer';

export const CAT = '🐱';
export const MOUSE = '🐭';
export const KOALA = '🐨';
export const OCTOPUS = '🐙';
export const MONKEY = '🐵';
export const FOX = '🦊';

export const utils = {
  getImage: (avatar: string, isSmall: boolean): string => {
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
  },

  getBackgroundColor: (avatar: string) => {
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
  },

  getThreadId: () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('threadId');
  },
  
  getBuildTime: () => {
    const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`;
    return dateTimeStamp;
  },
  
  getChatSDKVersion: () => {
    return require('../../package.json')['dependencies']['@azure/communication-chat'];
  },
  
  getFeedbackSettings: async (): Promise<FeedbackSettings> => {
    const response = await fetch('/blobSettings');
    if (!response.ok) {
      throw new Error('Failed to get blob settings from server!');
    }
    const retJson = await response.json();
    return {
      ...retJson,
      isFeedbackEnabled: retJson.isFeedbackEnabled.toLowerCase() === 'true'
    };
  },
  
  compareMessages: (firstMessage: ClientChatMessage, secondMessage: ClientChatMessage): number => {
    if (firstMessage.createdOn === undefined) return 1;
    if (secondMessage.createdOn === undefined) return -1;
    const firstDate = new Date(firstMessage.createdOn).getTime();
    const secondDate = new Date(secondMessage.createdOn).getTime();
    return firstDate - secondDate;
  },
  
  isUserMatchingIdentity: (user: CommunicationIdentifier, communicationUserId: string): boolean => {
    return isCommunicationUserIdentifier(user) && user.communicationUserId === communicationUserId;
  },
  
  convertToClientChatMessage: (chatMessage: ChatMessage, clientMessageId?: string): ClientChatMessage => {
    return {
      content: { message: chatMessage.content?.message },
      clientMessageId: clientMessageId,
      sender: chatMessage.sender,
      senderDisplayName: chatMessage.senderDisplayName,
      createdOn: chatMessage.createdOn,
      id: chatMessage.id
    };
  },
  
  createNewClientChatMessage: (
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
      createdOn: new Date()
    };
  },
  
  uploadContentToBlobStorage: async (filename: string, content: string): Promise<BlockBlobUploadResponse> => {
      const response = await fetch('/blobSettings');
      if (!response.ok) {
          throw new Error('Failed to get blob settings from server!');
      }
      const settings = await response.json();
  
      const blobServiceClient = new BlobServiceClient(settings.sasUri);
      const containerClient = blobServiceClient.getContainerClient(settings.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(filename);
      return blockBlobClient.upload(content, content.length);
  }
}

// export const getImage = (avatar: string, isSmall: boolean) => {
//   let avatarType: string = '';
//   switch (avatar) {
//     case CAT:
//       avatarType = 'cat';
//       break;
//     case MOUSE:
//       avatarType = 'mouse';
//       break;
//     case KOALA:
//       avatarType = 'koala';
//       break;
//     case OCTOPUS:
//       avatarType = 'octopus';
//       break;
//     case MONKEY:
//       avatarType = 'monkey';
//       break;
//     case FOX:
//       avatarType = 'fox';
//       break;
//   }

//   return `${isSmall ? '1' : '2'}x/${avatarType}.png`;
// };
// export const getBackgroundColor = (avatar: string) => {
//   switch (avatar) {
//     case CAT:
//       return {
//         backgroundColor: 'rgba(255, 250, 228, 1)'
//       };
//     case MOUSE:
//       return {
//         backgroundColor: 'rgba(33, 131, 196, 0.1)'
//       };
//     case KOALA:
//       return {
//         backgroundColor: 'rgba(197, 179, 173, 0.3)'
//       };
//     case OCTOPUS:
//       return {
//         backgroundColor: 'rgba(255, 240, 245, 1)'
//       };
//     case MONKEY:
//       return {
//         backgroundColor: 'rgba(255, 245, 222, 1)'
//       };
//     case FOX:
//       return {
//         backgroundColor: 'rgba(255, 231, 205, 1)'
//       };
//     default:
//       return {
//         backgroundColor: 'rgba(255, 250, 228, 1)'
//       };
//   }
// };

// export const getThreadId = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get('threadId');
// };

// export const getBuildTime = () => {
//   const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`;
//   return dateTimeStamp;
// };

// export function getChatSDKVersion() {
//   return require('../../package.json')['dependencies']['@azure/communication-chat'];
// }

// export const getFeedbackSettings = async (): Promise<FeedbackSettings> => {
//   const response = await fetch('/blobSettings');
//   if (!response.ok) {
//     throw new Error('Failed to get blob settings from server!');
//   }
//   const retJson = await response.json();
//   return {
//     ...retJson,
//     isFeedbackEnabled: retJson.isFeedbackEnabled.toLowerCase() === 'true'
//   };
// }

// export const compareMessages = (firstMessage: ClientChatMessage, secondMessage: ClientChatMessage) => {
//   if (firstMessage.createdOn === undefined) return 1;
//   if (secondMessage.createdOn === undefined) return -1;
//   const firstDate = new Date(firstMessage.createdOn).getTime();
//   const secondDate = new Date(secondMessage.createdOn).getTime();
//   return firstDate - secondDate;
// };

// export const isUserMatchingIdentity = (user: CommunicationIdentifier, communicationUserId: string): boolean => {
//   return isCommunicationUserIdentifier(user) && user.communicationUserId === communicationUserId;
// };

// export const convertToClientChatMessage = (chatMessage: ChatMessage, clientMessageId?: string): ClientChatMessage => {
//   return {
//     content: { message: chatMessage.content?.message },
//     clientMessageId: clientMessageId,
//     sender: chatMessage.sender,
//     senderDisplayName: chatMessage.senderDisplayName,
//     createdOn: chatMessage.createdOn,
//     id: chatMessage.id
//   };
// };

// export const createNewClientChatMessage = (
//   userId: string,
//   displayName: string,
//   clientMessageId: string,
//   message: string
// ): ClientChatMessage => {
//   return {
//     content: { message: message },
//     clientMessageId: clientMessageId,
//     sender: { communicationUserId: userId, kind: 'communicationUser' },
//     senderDisplayName: displayName,
//     createdOn: new Date()
//   };
// };

// export const uploadContentToBlobStorage = async (filename: string, content: string): Promise<BlockBlobUploadResponse> => {
//     const response = await fetch('/blobSettings');
//     if (!response.ok) {
//         throw new Error('Failed to get blob settings from server!');
//     }
//     const settings = await response.json();

//     const blobServiceClient = new BlobServiceClient(settings.sasUri);
//     const containerClient = blobServiceClient.getContainerClient(settings.containerName);
//     const blockBlobClient = containerClient.getBlockBlobClient(filename);
//     return blockBlobClient.upload(content, content.length);
// };
