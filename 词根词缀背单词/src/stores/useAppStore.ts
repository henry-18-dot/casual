import { create } from 'zustand';
import { analyzeWords, cleanInput, splitBatches } from '../services/analysis';
import { storage } from '../lib/storage';
import type { AppSettings, Morpheme, Session } from '../types/domain';

interface AppState {
  sessions: Session[];
  morphemes: Morpheme[];
  settings: AppSettings;
  upsertSettings: (next: Partial<AppSettings>) => void;
  createSessionFromInput: (input: string) => { ok: boolean; sessionId?: string; message?: string };
  regenerateSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  generateMoreRoots: (morphemeId: string) => void;
}

const defaultSettings: AppSettings = { theme: 'dark', accent: 'blue', fontSize: 'md', avatar: '' };

const seedSessions = storage.get<Session[]>('morphlex-sessions', []);
const seedMorphemes = storage.get<Morpheme[]>('morphlex-morphemes', []);
const seedSettings = storage.get<AppSettings>('morphlex-settings', defaultSettings);

export const useAppStore = create<AppState>((set, get) => ({
  sessions: seedSessions,
  morphemes: seedMorphemes,
  settings: seedSettings,
  upsertSettings(next) {
    const settings = { ...get().settings, ...next };
    storage.set('morphlex-settings', settings);
    set({ settings });
  },
  createSessionFromInput(input) {
    const { words, cleanedCount, unrecognized } = cleanInput(input);
    if (!words.length) return { ok: false, message: '未识别到可导入单词。' };
    const batches = splitBatches(words);
    const session: Session = {
      id: crypto.randomUUID(),
      title: `导入 ${new Date().toLocaleString()}`,
      createdAt: new Date().toISOString(),
      batches,
      words,
      unrecognized,
      status: 'completed',
    };
    const sessions = [session, ...get().sessions];
    const morphemes = analyzeWords(sessions.flatMap((s) => s.words));
    storage.set('morphlex-sessions', sessions);
    storage.set('morphlex-morphemes', morphemes);
    set({ sessions, morphemes });
    return { ok: true, sessionId: session.id, message: `导入成功：${words.length} 词，清理重复 ${cleanedCount}。` };
  },
  regenerateSession(sessionId) {
    const sessions = get().sessions.map((s) => (s.id === sessionId ? { ...s, status: 'processing' } : s));
    set({ sessions });
    const morphemes = analyzeWords(sessions.flatMap((s) => s.words));
    const completed = sessions.map((s) => (s.id === sessionId ? { ...s, status: 'completed' } : s));
    storage.set('morphlex-sessions', completed);
    storage.set('morphlex-morphemes', morphemes);
    set({ sessions: completed, morphemes });
  },
  deleteSession(sessionId) {
    const sessions = get().sessions.filter((s) => s.id !== sessionId);
    const morphemes = analyzeWords(sessions.flatMap((s) => s.words));
    storage.set('morphlex-sessions', sessions);
    storage.set('morphlex-morphemes', morphemes);
    set({ sessions, morphemes });
  },
  generateMoreRoots(morphemeId) {
    const morphemes = get().morphemes.map((m) => {
      if (m.id !== morphemeId || m.type !== 'root') return m;
      const candidates = [`${m.text}ion`, `${m.text}or`, `${m.text}ive`, `${m.text}ure`, `${m.text}ed`, `${m.text}ing`, `${m.text}ly`, `${m.text}al`];
      const deduped = [...new Set([...m.generatedExamples, ...candidates])].slice(0, 16);
      return { ...m, generatedExamples: deduped };
    });
    storage.set('morphlex-morphemes', morphemes);
    set({ morphemes });
  },
}));
