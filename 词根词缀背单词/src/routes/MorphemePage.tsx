import { Link, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import type { Morpheme } from '../types/domain';
import { WordDetailModal } from '../components/WordDetailModal';
import { MorphemeDetailModal } from '../components/MorphemeDetailModal';

const typeLabel: Record<Morpheme['type'], string> = {
  prefix: '前缀',
  root: '词根',
  suffix: '后缀',
};

function renderHighlighted(word: string, hit: string, limit: number) {
  const lower = word.toLowerCase();
  const idx = lower.indexOf(hit.toLowerCase());
  const visible = word.slice(0, limit);
  if (idx === -1 || idx >= limit) return <span>{visible}</span>;
  const before = visible.slice(0, idx);
  const mid = visible.slice(idx, idx + hit.length);
  const after = visible.slice(idx + hit.length);
  return (
    <span>
      {before}
      <span className="morpheme-hit">{mid}</span>
      {after}
    </span>
  );
}

export function MorphemePage() {
  const path = useLocation().pathname;
  const generateMoreRoots = useAppStore((s) => s.generateMoreRoots);
  const allMorphemes = useAppStore((s) => s.morphemes);
  const [word, setWord] = useState<string | null>(null);
  const [morpheme, setMorpheme] = useState<Morpheme | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const morphemes = useMemo(() => allMorphemes.filter((m) => {
    if (path.endsWith('/prefixes')) return m.type === 'prefix';
    if (path.endsWith('/roots')) return m.type === 'root';
    if (path.endsWith('/suffixes')) return m.type === 'suffix';
    return true;
  }), [allMorphemes, path]);
  return (
    <div className="page">
      <h1>词素集合</h1>
      <div className="row">
        <Link to="/morphemes/prefixes">前缀</Link>
        <Link to="/morphemes/roots">词根</Link>
        <Link to="/morphemes/suffixes">后缀</Link>
      </div>
      {morphemes.map((m) => (
        <section className="card morpheme-card" key={m.id}>
          <header className="morpheme-head">
            <button className="morpheme-title-btn" onClick={() => setMorpheme(m)}>
              <span className="morpheme-text">{m.text}</span>
              <span className="morpheme-type">{typeLabel[m.type]}</span>
            </button>
          </header>
          <p className="morpheme-meaning">{m.meaning}</p>
          <div className="morpheme-words">
            <span className="morpheme-label">关联词</span>
            <div className="word-list">
              {m.words.length ? m.words.map((w) => {
                const key = `${m.id}-${w}`;
                const isLong = w.length > 20;
                const isExpanded = expanded[key];
                return (
                  <button key={w} className="word-chip" onClick={() => setWord(w)}>
                    {isLong && !isExpanded ? renderHighlighted(w, m.text, 20) : renderHighlighted(w, m.text, w.length)}
                    {isLong && !isExpanded && (
                      <span
                        className="ellipsis-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded((prev) => ({ ...prev, [key]: true }));
                        }}
                      >
                        …
                      </span>
                    )}
                  </button>
                );
              }) : <span className="muted">无</span>}
            </div>
          </div>
          {m.type === 'root' && (
            <button onClick={() => void generateMoreRoots(m.id)} className="ghost-btn">扩展词汇</button>
          )}
          {!!m.generatedExamples.length && (
            <div className="morpheme-words">
              <span className="morpheme-label">扩展</span>
              <div className="word-list">
                {m.generatedExamples.map((w) => (
                  <button key={w} className="word-chip" onClick={() => setWord(w)}>{w}</button>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
      {word && <WordDetailModal word={word} onClose={() => setWord(null)} />}
      {morpheme && <MorphemeDetailModal morpheme={morpheme} onClose={() => setMorpheme(null)} />}
    </div>
  );
}
