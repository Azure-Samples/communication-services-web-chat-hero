// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { getAzureOpenAIKey, getAzureOpenAIEndpoint, getAzureOpenAIDeploymentName } from '../envHelper';

interface TranslationRequest {
  language: string;
  content: string;
}

export const getTranslation = async (req: TranslationRequest): Promise<string> => {
  const systemPrompt = `Act like you are a agent specialized in generating translation of a chat message,
please translate the given message to the ${req.language === 'default' ? 'english' : req.language}, 
but for any words in the Product Bank, keep the phrase in original language same as the Product Bank. Product Bank includes:
- Yummy Apple
- Crazy Orange

If you don't understand language or recognized words, just echo back the original message`;

  const translateMessage = req.content;
  const chatRequestPrompt = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: translateMessage
    }
  ];
  const openAIClient = new OpenAIClient(getAzureOpenAIEndpoint(), new AzureKeyCredential(getAzureOpenAIKey()));
  try {
    const result = await openAIClient.getChatCompletions(getAzureOpenAIDeploymentName(), chatRequestPrompt, {
      maxTokens: 1000
    });
    const translatedText = result.choices[0].message.content;

    // console.log(chatRequestPrompt);
    // console.log('Messages: ' + JSON.stringify(req));
    // console.log('Result: ' + JSON.stringify(result));
    // console.log('Translation: ' + translatedText);

    return translatedText;
  } catch (err) {
    console.log('Error: ' + JSON.stringify(err));
    if (err.innererror?.content_filter_result) {
      const filters = err.innererror.content_filter_result;
      return Object.values(filters).some((filter: { filtered: boolean }) => filter.filtered === true)
        ? '<div>Policy violated, unable to generate translatedText</div>'
        : JSON.stringify(err);
    }
    return JSON.stringify(err);
  }
};
