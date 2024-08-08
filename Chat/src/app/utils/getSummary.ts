// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

export const getSummary = async (messagesJSON: string): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST',
      body: messagesJSON,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    };
    const response = await fetch('/getSummary', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at getting summary for list of messages' + response.status);
    }
  } catch (error) {
    console.error('Failed getting summary for list of messages, Error: ', error);
    throw new Error('Failed at getting summary for list of messages');
  }
};
