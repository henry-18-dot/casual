import type { Morpheme, MorphemeType, WordDetail } from '../types/domain';

const roots = ['tract', 'spect', 'dict', 'graph', 'struct', 'form', 'port', 'press', 'scribe', 'rupt'];
const prefixes = ['re', 'pro', 'sub', 'inter', 'trans', 'pre', 'dis', 'anti', 'co'];
const suffixes = ['tion', 'able', 'ment', 'ness', 'ology', 'ist', 'ive', 'ize', 'ful'];

const pool: Record<MorphemeType, string[]> = { prefix: prefixes, root: roots, suffix: suffixes };

export function extractMorphemeBreakdown(word: string): { text: string; type: MorphemeType }[] {
  const normalized = word.toLowerCase();
  const breakdown = (['prefix', 'root', 'suffix'] as MorphemeType[])
    .flatMap((type) => pool[type].filter((m) => normalized.includes(m)).map((m) => ({ text: m, type })));
  return Array.from(new Map(breakdown.map((b) => [`${b.type}-${b.text}`, b])).values());
}

export function cleanInput(input: string): { words: string[]; cleanedCount: number; unrecognized: string[] } {
  const pieces = input
    .split(/[\s,;\n\r\t]+/g)
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  const valid = pieces.filter((w) => /^[a-z-]+$/.test(w));
  const unique = Array.from(new Set(valid));
  const unrecognized = pieces.filter((w) => !/^[a-z-]+$/.test(w));
  return { words: unique, cleanedCount: pieces.length - unique.length, unrecognized };
}

export function splitBatches(words: string[], max = 120): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < words.length; i += max) batches.push(words.slice(i, i + max));
  return batches;
}

export function analyzeWords(words: string[]): Morpheme[] {
  const map = new Map<string, Morpheme>();
  words.forEach((word) => {
    (Object.keys(pool) as MorphemeType[]).forEach((type) => {
      const matched = pool[type].find((m) => word.includes(m));
      if (!matched) return;
      const key = `${type}-${matched}`;
      const item = map.get(key) ?? {
        id: key,
        text: matched,
        type,
        meaning: `${matched} 的常见语义线索`,
        words: [],
        generatedExamples: [],
      };
      if (!item.words.includes(word)) item.words.push(word);
      map.set(key, item);
    });
  });
  return [...map.values()].sort((a, b) => b.words.length - a.words.length);
}

export function getWordDetail(word: string): WordDetail {
  const normalized = word.toLowerCase();
  const deduped = extractMorphemeBreakdown(word);
  return {
    word,
    phonetic: `/${normalized}/`,
    meaning: `${word} 的简明释义（本地示例，可接入词典或 Deepseek 优化）。`,
    breakdown: deduped,
    examples: [
      {
        type: 'general',
        text: `I keep a ${word} on my desk for quick reference.`,
        translation: `我把 ${word} 放在书桌上，方便随时查阅。`,
      },
      {
        type: 'general',
        text: `They decided to ${word} the plan before the meeting.`,
        translation: `他们决定在会议前先 ${word} 这个计划。`,
      },
      {
        type: 'academic',
        text: `The ${word} was documented in the final report.`,
        translation: `该 ${word} 已在最终报告中被记录。`,
      },
      {
        type: 'academic',
        text: `Researchers ${word} the data to test the hypothesis.`,
        translation: `研究人员对数据进行了 ${word} 以验证假设。`,
      },
    ],
  };
}
