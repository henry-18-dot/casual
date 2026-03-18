export type MorphemeType = 'prefix' | 'root' | 'suffix';

export interface WordDetail {
  word: string;
  phonetic: string;
  meaning: string;
  breakdown: { text: string; type: MorphemeType }[];
  examples: { type: 'general' | 'academic'; text: string; translation: string }[];
}

export interface Morpheme {
  id: string;
  text: string;
  type: MorphemeType;
  meaning: string;
  words: string[];
  generatedExamples: string[];
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  batches: string[][];
  words: string[];
  unrecognized: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AppSettings {
  theme: 'dark' | 'light';
  accent: 'orange' | 'green' | 'blue' | 'purple';
  fontSize: 'sm' | 'md' | 'lg';
  avatar: string;
}

export interface DeepseekDemoState {
  loading: boolean;
  lastCheckedAt?: string;
  connection: {
    ok: boolean;
    endpoint: string;
    model: string;
    hasApiKey: boolean;
    reply?: string;
    error?: string;
  } | null;
  result: {
    morpheme: string;
    type: MorphemeType;
    meaning: string;
    examples: string[];
  } | null;
  error?: string;
}
