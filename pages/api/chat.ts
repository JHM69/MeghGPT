import { NextRequest, NextResponse } from 'next/server';

import { OpenAIAPI } from '@/types/api-openai';
import { Configuration, OpenAIApi } from 'openai';

if (!process.env.OPENAI_API_KEY)
  console.warn(
    'OPENAI_API_KEY has not been provided in this deployment environment. ' + 'Will use the optional keys incoming from the client, which is not recommended.',
  );

interface Book {
  content: string;
  title: string;
  thumbnail: string | undefined;
}

// helper functions

const checks: Record<string, string> = {
  story: `Write a kids' story about below message, Always develop a JSON object, content should be in html formatted. The story will must have different sections. each section will must contain a image. each section where image will be placed in third brackets, example: [A green frog in a lake]. Note that the story should not exceed 300 words
    Your output will must in JSON formatted: Remember to use <br> instead of \n. Example-

    {content: "
      Story Content started.......
      ......
      [A nice image of frog]
      Story Continues.....
      .....
      [Blue Sky with Mountain]
      .......",
    title: "My Nice Story Title"
    thumbnile: "A appropiate propmpt"
    }   
  `,
  normal: 'Normal GPT',
  tour: 'Make a tour blog',
};

export async function extractOpenaiChatInputs(req: NextRequest): Promise<ApiChatInput> {
  const { api: userApi = {}, model, messages, temperature = 0.5, max_tokens = 1024 } = (await req.json()) as Partial<ApiChatInput>;
  if (!model || !messages) throw new Error('Missing required parameters: api, model, messages');

  console.log(messages[0].content);

  const content = messages[0].content;
  messages[0].content = content === 'story' ? checks['story'] : content === 'tour' ? checks['tour'] : checks['normal'];

  const api: OpenAIAPI.Configuration = {
    apiKey: (userApi.apiKey || process.env.OPENAI_API_KEY || '').trim(),
    apiHost: (userApi.apiHost || process.env.OPENAI_API_HOST || 'api.openai.com').trim().replaceAll('https://', ''),
    apiOrganizationId: (userApi.apiOrganizationId || process.env.OPENAI_API_ORG_ID || '').trim(),
  };
  if (!api.apiKey) throw new Error('Missing OpenAI API Key. Add it on the client side (Settings icon) or server side (your deployment).');

  return { api, model, messages, temperature, max_tokens };
}




const openAIHeaders = (api: OpenAIAPI.Configuration): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${api.apiKey}`,
  ...(api.apiOrganizationId && { 'OpenAI-Organization': api.apiOrganizationId }),
});

export const chatCompletionPayload = (input: Omit<ApiChatInput, 'api'>, stream: boolean): OpenAIAPI.Chat.CompletionsRequest => ({
  model: input.model,
  messages: input.messages,
  ...(input.temperature && { temperature: input.temperature }),
  ...(input.max_tokens && { max_tokens: input.max_tokens }),
  stream,
  n: 1,
});

async function rethrowOpenAIError(response: Response) {
  if (!response.ok) {
    let errorPayload: object | null = null;
    try {
      errorPayload = await response.json();
    } catch (e) {
      // ignore
    }
    throw new Error(`${response.status} · ${response.statusText}${errorPayload ? ' · ' + JSON.stringify(errorPayload) : ''}`);
  }
}

export async function getOpenAIJson<TJson extends object>(api: OpenAIAPI.Configuration, apiPath: string): Promise<TJson> {
  const response = await fetch(`https://${api.apiHost}${apiPath}`, {
    method: 'GET',
    headers: openAIHeaders(api),
  });
  await rethrowOpenAIError(response);
  return await response.json();
}

export async function postToOpenAI<TBody extends object>(api: OpenAIAPI.Configuration, apiPath: string, body: TBody, signal?: AbortSignal): Promise<Response> {
  const response = await fetch(`https://${api.apiHost}${apiPath}`, {
    method: 'POST',
    headers: openAIHeaders(api),
    body: JSON.stringify(body),
    signal,
  });
  await rethrowOpenAIError(response);
  return response;
}

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const generateImage = async (prompt: string) => {
  try {
    console.log('Starting image generation');
    const response = await fetch('https://hook.eu1.make.com/chcfail16s5j07k4mucj3rjp98aywfx8?prompt='+ encodeURIComponent(prompt), {
      method: 'GET',
    });

    const data = await response.json();
    console.log(data);

    return data[0].url;
  } catch (error) {
    console.error(`Error generating image: ${error}`);
  }
};
// I/O types for this endpoint

export interface ApiChatInput {
  api: OpenAIAPI.Configuration;
  model: string;
  messages: OpenAIAPI.Chat.Message[];
  temperature?: number;
  max_tokens?: number;
}

export interface ApiChatResponse {
  message: OpenAIAPI.Chat.Message;
  book: Book;
}
 

export default async function handler(req: NextRequest) {
  const book = {}
  try {
    const { api, ...rest } = await extractOpenaiChatInputs(req);
    const response = await postToOpenAI(api, '/v1/chat/completions', chatCompletionPayload(rest, false));
    const completion: OpenAIAPI.Chat.CompletionsResponse = await response.json();

    var text = completion.choices[0].message.content;

    console.log('text');
    console.log(text);

    //editMessage(conversationId, assistantMessageId, { text: text }, false);

    const book: Book = JSON.parse(text); //

    const { content } = book;

    const imagePromptPattern = /\[(.*?)\]/g;

    // Find all image prompt substrings in the content
    const imagePrompts = content.match(imagePromptPattern);

    console.log('imagePrompts');
    console.log(imagePrompts);

    const generatedImageURLs = [];

    if (imagePrompts) {
      console.log(imagePrompts);
      for (const imagePrompt of imagePrompts) {
        console.log('imagePrompt');
        console.log(imagePrompt);
        generatedImageURLs.push(await generateImage(imagePrompt));
      }
    }

    console.log('generatedImageURLs');
    console.log(generatedImageURLs);

    let updatedContent = content;
    for (let i = 0; i < generatedImageURLs.length; i++) {
      try {
        updatedContent = updatedContent.replace(imagePrompts[i], `<img src="${generatedImageURLs[i]}" alt="${imagePrompts[i]}" />`);
      } catch (e) {
        console.log(e);
      }
    }
    book.content = updatedContent;
    book.thumbnail = generatedImageURLs[0];

    console.log();
    return new NextResponse(
      JSON.stringify({
        book: book,
      } as ApiChatResponse),
    );
  } catch (error: any) {
    console.error('Fetch request failed:', error);
    return new NextResponse(
      JSON.stringify({
        book: book,
      } as ApiChatResponse),
    );
   
  }
}

// noinspection JSUnusedGlobalSymbols
export const config = {
  runtime: 'edge',
};
