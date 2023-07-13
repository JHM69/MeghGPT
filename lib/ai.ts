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
    generateImage("Tiger");

    return;
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const chatResponse: ApiChatResponse = await response.json();

      var text = chatResponse.message.content;

      const data: Book = JSON.parse(text);

      editMessage(conversationId, assistantMessageId, { text: text }, false);

      const { content, title, thumbnail } = data;

      const imagePromptPattern = /\[(.*?)\]/g;

      // Find all image prompt substrings in the content
      const imagePrompts = content.match(imagePromptPattern);
      const generatedImageURLs: string[] = [];

      if (imagePrompts) {
        console.log(imagePrompts);
        for (const imagePrompt of imagePrompts) {
          console.log(imagePrompt);
          generatedImageURLs.push(generateImage(imagePrompt));
        }
      }

      // Replace the image prompt substrings with the HTML code for image tags using the generated image URLs
      let updatedContent = content;
      for (let i = 0; i < generatedImageURLs.length; i++) {
        try {
          updatedContent = updatedContent.replace(imagePrompts[i], `<img src="${generatedImageURLs[i]}" alt="${imagePrompts[i]}" />`);
        } catch (e) {
          console.log(e);
        }
      }

      // Update the content field in the JSON object
      data.content = updatedContent;

      console.log(data);

      // Use the updated JSON object as desired
      const updatedJSONStr = JSON.stringify(data, null, 2);
      console.log(updatedJSONStr);

      console.log(chatResponse.message.content);
    }
  } catch (error: any) {
    console.error(' : fetch request error:', error);
  }

  // try {
  //   const response = await fetch('/api/openai/chat', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //     signal: abortSignal,
  //   });

  //   if (response.body) {
  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder('utf-8');

  //     // loop forever until the read is done, or the abort controller is triggered
  //     let incrementalText = '';
  //     let parsedFirstPacket = false;
  //     let sentFirstParagraph = false;

  //     while (true) {
  //       const { value, done } = await reader.read();
  //       if (done) break;
  //       incrementalText += decoder.decode(value, { stream: true });

  //       // there may be a JSON object at the beginning of the message, which contains the model name (streaming workaround)
  //       if (!parsedFirstPacket && incrementalText.startsWith('{')) {
  //         const endOfJson = incrementalText.indexOf('}');
  //         if (endOfJson > 0) {
  //           const json = incrementalText.substring(0, endOfJson + 1);
  //           incrementalText = incrementalText.substring(endOfJson + 1);
  //           console.log(incrementalText);
  //           try {
  //             const parsed = JSON.parse(json);
  //             console.log(parsed);
  //             editMessage(conversationId, assistantMessageId, { originLLM: parsed.model }, false);
  //             parsedFirstPacket = true;
  //           } catch (e) {
  //             // error parsing JSON, ignore
  //             console.log('Error parsing JSON: ' + e);
  //           }
  //         }
  //       }

  //       // if the first paragraph (after the first packet) is complete, call the callback
  //       if (parsedFirstPacket && onFirstParagraph && !sentFirstParagraph) {
  //         let cutPoint = incrementalText.lastIndexOf('\n');
  //         if (cutPoint < 0) cutPoint = incrementalText.lastIndexOf('. ');
  //         if (cutPoint > 100 && cutPoint < 400) {
  //           const firstParagraph = incrementalText.substring(0, cutPoint);
  //           onFirstParagraph(firstParagraph);
  //           sentFirstParagraph = true;
  //         }
  //       }

  //       editMessage(conversationId, assistantMessageId, { text: incrementalText }, false);
  //     }
  //     console.log(incrementalText);

  //     const data: Book = JSON.parse(incrementalText);
  //     const { content, title, thumbnail } = data;

  //     const imagePromptPattern = /\[(.*?)\]/;

  //     const imagePromptMatch = content.match(imagePromptPattern);
  //     const imagePrompt = imagePromptMatch ? imagePromptMatch[1] : '';

  //     const generatedImageURL = generateImage(imagePrompt)

  //     const updatedContent = content.replace(imagePromptPattern, `<img src="${generatedImageURL}" alt="${imagePrompt}" />`);

  //     data.content = updatedContent;

  //     const updatedJSONStr = JSON.stringify(data, null, 2);
  //     console.log(updatedJSONStr);

  //   }
  // } catch (error: any) {
  //   if (error?.name === 'AbortError') {
  //     // expected, the user clicked the "stop" button
  //   } else {
  //     // TODO: show an error to the UI
  //     console.error('Fetch request error:', error);
  //   }
  // }

  // finally, stop the typing animation

  editMessage(conversationId, assistantMessageId, { typing: false }, false);
}

/**
 * Creates the AI titles for conversations, by taking the last 5 first-lines and asking AI what's that about
 */
