// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { getAzureOpenAIKey, getAzureOpenAIEndpoint, getAzureOpenAIDeploymentName } from '../envHelper';

export const getSummary = async (messages: { timestamp: number; user: string; content: string }[]): Promise<string> => {
  const systemPrompt =
    'Act like you are a agent specialized in generating summary of a chat conversation, you will be provided with a JSON list of messages of a conversation, generate a summary for the conversation.';
  const chatRequestPrompt = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: JSON.stringify(messages)
    }
  ];
  const openAIClient = new OpenAIClient(getAzureOpenAIEndpoint(), new AzureKeyCredential(getAzureOpenAIKey()));
  try {
    const result = await openAIClient.getChatCompletions(getAzureOpenAIDeploymentName(), chatRequestPrompt, {
      maxTokens: 200
    });
    const summary = result.choices[0].message.content;

    // console.log(chatRequestPrompt);
    // console.log('Messages: ' + JSON.stringify(messages));
    // console.log('Result: ' + JSON.stringify(result));
    // console.log('Summary: ' + summary);

    return summary;
  } catch (err) {
    console.log('Error: ' + JSON.stringify(err));
    if (err.innererror?.content_filter_result) {
      const filters = err.innererror.content_filter_result;
      return Object.values(filters).some((filter: { filtered: boolean }) => filter.filtered === true)
        ? '<div>Policy violated, unable to generate summary</div>'
        : JSON.stringify(err);
    }
    return JSON.stringify(err);
  }
};
