import type { Morpheme, MorphemeType, WordDetail } from '../types/domain';

const roots = ['tract', 'spect', 'dict', 'graph', 'struct', 'form', 'port', 'press', 'scribe', 'rupt'];
const prefixes = ['re', 'pro', 'sub', 'inter', 'trans', 'pre', 'dis', 'anti', 'co'];
const suffixes = ['tion', 'able', 'ment', 'ness', 'ology', 'ist', 'ive', 'ize', 'ful'];

const pool: Record<MorphemeType, string[]> = { prefix: prefixes, root: roots, suffix: suffixes };

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
  return {
    phonetic: `/${word.slice(0, 3)}.../`,
    meaning: `${word} 的示例释义（本地 mock）`,
    example: `This is a sentence using ${word}.`,
  };
}
