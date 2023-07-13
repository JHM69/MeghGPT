import { ApiChatInput, ApiChatResponse } from '../pages/api/openai/chat';
import { DMessage, useChatStore } from '@/lib/store-chats';
import { fastChatModelId } from '@/lib/data';
import { useSettingsStore } from '@/lib/store-settings';
import { json } from 'stream/consumers';
import { Configuration, OpenAIApi } from 'openai';

/**
 * Main function to send the chat to the assistant and receive a response (streaming)
 */

interface Book {
  content: string;
  title: string;
  thumbnail: string;
}

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const generateImage = async (prompt : string) => {
  try {
    const res = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '512x512',
    });

    console.log(res.data.data[0].url);

    return res.data.data[0].url
  } catch (error) {
    console.error(`Error generating image: ${error.response.data.error.message}`);
  }
};

export async function streamAssistantMessage(
  conversationId: string,
  assistantMessageId: string,
  history: DMessage[],
  apiKey: string | undefined,
  apiHost: string | undefined,
  apiOrganizationId: string | undefined,
  chatModelId: string,
  modelTemperature: number,
  modelMaxResponseTokens: number,
  editMessage: (conversationId: string, messageId: string, updatedMessage: Partial<DMessage>, touch: boolean) => void,
  abortSignal: AbortSignal,
  onFirstParagraph?: (firstParagraph: string) => void,
) {
  const payload: ApiChatInput = {
    api: {
      ...(apiKey && { apiKey }),
      ...(apiHost && { apiHost }),
      ...(apiOrganizationId && { apiOrganizationId }),
    },
    model: chatModelId,
    messages: history.map(({ role, text }) => ({
      role: role,
      content: text,
    })),
    temperature: modelTemperature,
    max_tokens: modelMaxResponseTokens,
  };

  try {
    //generateImage("Tiger");

    //return;
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const chatResponse: ApiChatResponse = await response.json();

      var text = chatResponse.message.content;

    

      editMessage(conversationId, assistantMessageId, { text: text }, false);

      const data : Book = JSON.parse(text.replace(/\n\n/g, '<br><br>'));

      const { content } = data;

   


      const imagePromptPattern = /\[(.*?)\]/g;

      // Find all image prompt substrings in the content
      const imagePrompts = content.match(imagePromptPattern);

      console.log(imagePrompts)
      
      const generatedImageURLs = [];

      if (imagePrompts) {
        console.log(imagePrompts);
        for (const imagePrompt of imagePrompts) {
          console.log(imagePrompt);
          generatedImageURLs.push(generateImage(imagePrompt));
        }
      }
      
      let updatedContent = content;
      for (let i = 0; i < generatedImageURLs.length; i++) {
        try {
          updatedContent = updatedContent.replace(imagePrompts[i], `<img src="${generatedImageURLs[i]}" alt="${imagePrompts[i]}" />`);
        } catch (e) {
          console.log(e);
        }
      }
  data.content = updatedContent;

  editMessage(conversationId, assistantMessageId, { text: updatedContent }, false);

      console.log(data);
    }
  } catch (error: any) {
    console.error(' : fetch request error:', error);
  }

 

  editMessage(conversationId, assistantMessageId, { typing: false }, false);
}

/**
 * Creates the AI titles for conversations, by taking the last 5 first-lines and asking AI what's that about
 */
