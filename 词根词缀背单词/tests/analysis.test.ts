import { describe, expect, it } from 'vitest';
import { cleanInput, splitBatches } from '../src/services/analysis';

describe('analysis utils', () => {
  it('dedup and clean', () => {
    const result = cleanInput('React react, hello 123');
    expect(result.words).toEqual(['react', 'hello']);
    expect(result.unrecognized).toContain('123');
  });

  it('split batches by 120', () => {
    const words = Array.from({ length: 121 }, (_, i) => `w${i}`);
    const batches = splitBatches(words, 120);
    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(120);
  });
});
