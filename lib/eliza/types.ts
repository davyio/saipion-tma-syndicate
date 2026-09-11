export interface MessageExample {
  user: string;
  content: {
    text: string;
  };
}

export interface ElizaCharacter {
  name: string;
  username: string;
  plugins?: string[];
  clients?: string[];
  modelProvider?: string;
  settings?: {
    secrets?: Record<string, string>;
    voice?: {
      model?: string;
    };
  };
  system?: string;
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: MessageExample[][];
  postExamples: string[];
  topics: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  adjectives: string[];
}
