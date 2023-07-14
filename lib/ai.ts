import { DMessage, useChatStore } from '@/lib/store-chats';
import { fastChatModelId } from '@/lib/data';
import { useSettingsStore } from '@/lib/store-settings';
import { json } from 'stream/consumers';
import { Configuration, OpenAIApi } from 'openai';
import { Book, PrismaClient } from '@prisma/client';
import { ApiChatInput, ApiChatResponse } from 'pages/api/chat';
import axios from 'axios';

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

async function addBookToDatabase(book: Book) {
  await prisma?.book.create({
    data: book,
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
    console.log('Sending request...');
    console.log(payload);

    try {
      const response = await axios.post('/api/chat', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        const chatResponse = response.data;

        var book = chatResponse.book;
        var message = chatResponse.message;

        if (book === null || book === undefined) {
          editMessage(conversationId, assistantMessageId, { text: message }, false);

          book.thumbnail = 'https://i.ibb.co/qjjNSzk/megh-GPT-2.png?fbclid=IwAR2OqL_Vwvpeny3NK-RZ4Sf-Xo_DRVS2U5LNMFtABdGUAzYaESHB_2-t3nc';

          book.title = message.substrings(0, 15);

          book.content = message;
        } else {
          editMessage(conversationId, assistantMessageId, { text: book.content }, false);
        }

        axios
          .post('/api/books', book)
          .then((response) => {
            console.log('New book created:', response.data);
            // Handle success or redirect to a success page
          })
          .catch((error) => {
            console.error('Error creating book:', error);
            // Handle error or display an error message
          });
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  } catch (error: any) {
    console.error(' : fetch request error:', error);
  }

  editMessage(conversationId, assistantMessageId, { typing: false }, false);
}

/**
 * Creates the AI titles for conversations, by taking the last 5 first-lines and asking AI what's that about
 */
