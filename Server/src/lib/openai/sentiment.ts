// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { getAzureOpenAIKey, getAzureOpenAIEndpoint, getAzureOpenAIDeploymentName } from '../envHelper';

export const getSentiment = async (message: { content: string }): Promise<string> => {
  const allowedResponse = new Set(['Positive', 'Neutral', 'Negative']);
  const content = message?.content || message?.content !== '' ? message?.content : 'neutral';
  const systemPrompt =
    "Act like you are a agent specialized in sentiment analysis that can only respond with ONLY ONE WORD of the following 'Positive' / 'Neutral' / 'Negative', by decide whether a user message's sentiment, if the message is something you cannot analyize, just respond with 'Neutral'";
  const chatRequestPrompt = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: content
    }
  ];

  const openAIClient = new OpenAIClient(getAzureOpenAIEndpoint(), new AzureKeyCredential(getAzureOpenAIKey()));
  try {
    const result = await openAIClient.getChatCompletions(getAzureOpenAIDeploymentName(), chatRequestPrompt, {
      maxTokens: 10
    });
    const sentiment = result.choices[0].message.content;

    // console.log(prompt);
    // console.log('Message: ' + JSON.stringify(message));
    // console.log('Result: ' + JSON.stringify(result));

    if (!allowedResponse.has(sentiment)) {
      return 'Neutral';
    }
    return sentiment;
  } catch (err) {
    console.log('Error: ' + JSON.stringify(err));
    if (err.innererror?.content_filter_result) {
      const filters = err.innererror.content_filter_result;
      return Object.values(filters).some((filter: { filtered: boolean }) => filter.filtered === true)
        ? 'Negative'
        : 'Neutral';
    }
    return JSON.stringify(err);
  }
};
