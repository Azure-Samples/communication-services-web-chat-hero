// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';
import { ChatMessage } from '@azure/communication-chat';

export const getTranslation = async (chatMessage: ChatMessage, language: string): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ language: language, content: chatMessage.content?.message }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    };
    // TODO
    // console.log(JSON.stringify({ language: language, content: chatMessage.content?.message }));
    // return '';
    const response = await fetch('/getTranslation', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at getting translation for message' + response.status);
    }
  } catch (error) {
    console.error('Failed getting translation message, Error: ', error);
    throw new Error('Failed getting translation message');
  }
};
