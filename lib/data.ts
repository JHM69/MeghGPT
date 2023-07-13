export type SystemPurposeId = 'Story' | 'Normal' | 'Tour';

export const defaultSystemPurposeId: SystemPurposeId = 'Normal';

type SystemPurposeData = {
  title: string;
  description: string | JSX.Element;
  systemMessage: string;
  symbol: string;
  examples?: string[];
};

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {
  Normal: {
    title: 'GPT',
    description: 'Normal Chat GPT Funtionality',
    systemMessage: 'normal',
    symbol: '👩‍💻',
    examples: [
      'What is BUET CSE Hackathon?',
      'Who is better? Messi op Ronaldo?',
      'Where can I find Dry Ether for Wurtz reaction as Mikcelson-Marlie told Ether doesnt Exist?',
    ],
  },

  Story: {
    title: 'Story Generator',
    description: '',
    systemMessage: 'story',
    symbol: '🖊️',
    examples: ['Write a story about a boy playing cricket'],
  },
  Tour: {
    title: 'Tour',
    description: '',
    systemMessage: 'tour',
    symbol: '⛱',
    examples: ['Write a blog about my last tour of Coxs Bazar'],
  },
};

export type ChatModelId = 'gpt-3.5-turbo' | 'gpt-4';

export const defaultChatModelId: ChatModelId = 'gpt-3.5-turbo';
export const fastChatModelId: ChatModelId = 'gpt-3.5-turbo';

type ChatModelData = {
  description: string | JSX.Element;
  title: string;
  fullName: string; // seems unused
  contextWindowSize: number;
};

export const ChatModels: { [key in ChatModelId]: ChatModelData } = {
  'gpt-4': {
    description: 'Most insightful, larger problems, but slow, expensive, and may be unavailable',
    title: 'GPT-4',
    fullName: 'MegBuzz GPT',
    contextWindowSize: 8192,
  },
  'gpt-3.5-turbo': {
    description: 'A good balance between speed and insight',
    title: 'MegBuzz',
    fullName: 'MegBuzz GPT',
    contextWindowSize: 4097,
  },
};
