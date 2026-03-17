import { create } from 'zustand';
import { analyzeWords, cleanInput, splitBatches } from '../services/analysis';
import { requestDeepseekExamples, requestDeepseekMorphemeDetail } from '../services/deepseek';
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
  generateMoreRoots: (morphemeId: string) => Promise<void>;
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
    void (async () => {
      const enriched = [...get().morphemes];
      for (const item of enriched.slice(0, 20)) {
        const remote = await requestDeepseekMorphemeDetail(item.text, item.type, item.words).catch(() => null);
        if (!remote) continue;
        const next = get().morphemes.map((m) => {
          if (m.id !== item.id) return m;
          const generatedExamples = [...new Set([...m.generatedExamples, ...remote.examples])].slice(0, 16);
          return { ...m, meaning: remote.meaning, generatedExamples };
        });
        storage.set('morphlex-morphemes', next);
        set({ morphemes: next });
      }
    })();
    return { ok: true, sessionId: session.id, message: `导入成功：${words.length} 词，清理重复 ${cleanedCount}。` };
  },
  regenerateSession(sessionId) {
    const sessions: Session[] = get().sessions.map((s) => (s.id === sessionId ? { ...s, status: 'processing' } : s));
    set({ sessions });
    const morphemes = analyzeWords(sessions.flatMap((s) => s.words));
    const completed: Session[] = sessions.map((s) => (s.id === sessionId ? { ...s, status: 'completed' } : s));
    storage.set('morphlex-sessions', completed);
    storage.set('morphlex-morphemes', morphemes);
    set({ sessions: completed, morphemes });
    void (async () => {
      for (const item of get().morphemes.slice(0, 20)) {
        const remote = await requestDeepseekMorphemeDetail(item.text, item.type, item.words).catch(() => null);
        if (!remote) continue;
        const next = get().morphemes.map((m) => {
          if (m.id !== item.id) return m;
          const generatedExamples = [...new Set([...m.generatedExamples, ...remote.examples])].slice(0, 16);
          return { ...m, meaning: remote.meaning, generatedExamples };
        });
        storage.set('morphlex-morphemes', next);
        set({ morphemes: next });
      }
    })();
  },
  deleteSession(sessionId) {
    const sessions = get().sessions.filter((s) => s.id !== sessionId);
    const morphemes = analyzeWords(sessions.flatMap((s) => s.words));
    storage.set('morphlex-sessions', sessions);
    storage.set('morphlex-morphemes', morphemes);
    set({ sessions, morphemes });
  },
  async generateMoreRoots(morphemeId) {
    const morpheme = get().morphemes.find((m) => m.id === morphemeId);
    if (!morpheme || morpheme.type !== 'root') return;
    const remote = await requestDeepseekExamples(morpheme.text).catch(() => null);
    const fallback = [`${morpheme.text}ion`, `${morpheme.text}or`, `${morpheme.text}ive`, `${morpheme.text}ure`, `${morpheme.text}ed`, `${morpheme.text}ing`, `${morpheme.text}ly`, `${morpheme.text}al`];
    const candidates = remote?.length ? remote : fallback;
    const morphemes = get().morphemes.map((m) => {
      if (m.id !== morphemeId || m.type !== 'root') return m;
      const deduped = [...new Set([...m.generatedExamples, ...candidates])].slice(0, 16);
      return { ...m, generatedExamples: deduped };
    });
    storage.set('morphlex-morphemes', morphemes);
    set({ morphemes });
  },
}));
