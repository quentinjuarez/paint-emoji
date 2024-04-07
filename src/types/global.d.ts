export {};

declare global {
  const __DEV__: boolean;
  const VERSION: string;

  interface CustomEmoji {
    name: string;
    url: string;
  }

  interface SlackEmoji {
    base: number[];
    alternates: Array<number[]>;
    emoticons: string[];
    shortcodes: string[];
    animated: boolean;
    directional: boolean;
  }

  interface Emoji {
    name: string;
    value: string;
    type: 'slack' | 'custom';
  }
}
