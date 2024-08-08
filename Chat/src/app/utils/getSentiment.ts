// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';
import { ChatMessage } from '@azure/communication-chat';

export const getSentiment = async (chatMessage: ChatMessage): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ content: chatMessage.content?.message }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    };
    const response = await fetch('/getSentiment', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at getting message sentiment' + response.status);
    }
  } catch (error) {
    console.error('Failed getting message sentiment, Error: ', error);
    throw new Error('Failed at getting message sentiment');
  }
};
