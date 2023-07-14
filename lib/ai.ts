import { ApiChatInput, ApiChatResponse } from '../pages/api/openai/chat';
import { DMessage, useChatStore } from '@/lib/store-chats';
import { fastChatModelId } from '@/lib/data';
import { useSettingsStore } from '@/lib/store-settings';
import { json } from 'stream/consumers';
import { Configuration, OpenAIApi } from 'openai';
import { PrismaClient } from '@prisma/client';

/**
 * Main function to send the chat to the assistant and receive a response (streaming)
 */




const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const generateImage = async (prompt: string) => {
  try {
    const res = await openai.createImage({
      prompt: 'Create a illustration for: ' + prompt + ', Anime Type, No Text',
      n: 1,
      size: '256x256',
    });

    console.log(res.data.data[0].url);

    return res.data.data[0].url;
  } catch (error) {
    console.error(`Error generating image: ${error.response.data.error.message}`);
  }
};


async function addBookToDatabase(book : Book){
  await prisma?.book.create({
   data : book,
  });

}

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

      var book = chatResponse.book;

      console.log(chatResponse.book)


      editMessage(conversationId, assistantMessageId, { text: updatedContent }, false);

      console.log(book);


      
    }
  } catch (error: any) {
    console.error(' : fetch request error:', error);
  }

  editMessage(conversationId, assistantMessageId, { typing: false }, false);
}

/**
 * Creates the AI titles for conversations, by taking the last 5 first-lines and asking AI what's that about
 */
