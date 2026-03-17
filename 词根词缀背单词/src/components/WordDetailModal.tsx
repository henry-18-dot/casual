import { useMemo, useState } from 'react';
import { getWordDetail } from '../services/analysis';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';
import { useAppStore } from '../stores/useAppStore';
import type { Morpheme, MorphemeType } from '../types/domain';
import { MorphemeDetailModal } from './MorphemeDetailModal';

const typeLabel: Record<MorphemeType, string> = {
  prefix: '前缀',
  root: '词根',
  suffix: '后缀',
};

function highlightWord(text: string, word: string) {
  const lower = text.toLowerCase();
  const key = word.toLowerCase();
  const index = lower.indexOf(key);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <strong>{text.slice(index, index + word.length)}</strong>
      {text.slice(index + word.length)}
    </>
  );
}

export function WordDetailModal({ word, onClose, depth = 1 }: { word: string; onClose: () => void; depth?: number }) {
  const detail = useMemo(() => getWordDetail(word), [word]);
  const morphemes = useAppStore((s) => s.morphemes);
  const [openMorpheme, setOpenMorpheme] = useState<Morpheme | null>(null);
  useBodyScrollLock(true);

  const resolveMorpheme = (text: string, type: MorphemeType) => {
    const hit = morphemes.find((m) => m.text === text && m.type === type);
    return hit ?? {
      id: `${type}-${text}`,
      text,
      type,
      meaning: `${text} 的语义线索（本地示例）`,
      words: [],
      generatedExamples: [],
    };
  };

  const openMorphemeAtNextDepth = (text: string, type: MorphemeType) => {
    if (depth >= 5) {
      window.alert('呜呜呜别开我了');
      return;
    }
    setOpenMorpheme(resolveMorpheme(text, type));
  };

  return (
    <>
      <div className="modal" onClick={onClose}>
        <article className="word-modal" onClick={(e) => e.stopPropagation()}>
          <header className="modal-head">
            <div>
              <h2 className="word-title">{detail.word}</h2>
              <p className="phonetic">{detail.phonetic}</p>
            </div>
          </header>
          <p className="word-meaning">{detail.meaning}</p>
          <section className="modal-section">
            <h4>词根词缀拆解</h4>
            <div className="morpheme-breakdown">
              {detail.breakdown.length ? detail.breakdown.map((b) => (
                <button
                  key={`${b.type}-${b.text}`}
                  className="morpheme-chip"
                  onClick={() => openMorphemeAtNextDepth(b.text, b.type)}
                >
                  {b.text}
                  <small>{typeLabel[b.type]}</small>
                </button>
              )) : <span className="muted">无</span>}
            </div>
          </section>
          <section className="modal-section">
            <h4>例句</h4>
            <div className="example-group">
              <p className="example-label">普通用法</p>
              {detail.examples.filter((e) => e.type === 'general').map((e, idx) => (
                <p key={`g-${idx}`} className="example-line">
                  {highlightWord(e.text, detail.word)}
                  <span className="example-translation">{e.translation}</span>
                </p>
              ))}
            </div>
            <div className="example-group">
              <p className="example-label">学术用法</p>
              {detail.examples.filter((e) => e.type === 'academic').map((e, idx) => (
                <p key={`a-${idx}`} className="example-line">
                  {highlightWord(e.text, detail.word)}
                  <span className="example-translation">{e.translation}</span>
                </p>
              ))}
            </div>
          </section>
        </article>
      </div>
      {openMorpheme && (
        <MorphemeDetailModal morpheme={openMorpheme} depth={depth + 1} onClose={() => setOpenMorpheme(null)} />
      )}
    </>
  );
}
