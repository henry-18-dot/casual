import { useState } from 'react';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';
import type { Morpheme } from '../types/domain';
import { WordDetailModal } from './WordDetailModal';

const typeLabel: Record<Morpheme['type'], string> = {
  prefix: '前缀',
  root: '词根',
  suffix: '后缀',
};

export function MorphemeDetailModal({ morpheme, onClose, depth = 1 }: { morpheme: Morpheme; onClose: () => void; depth?: number }) {
  const [openWord, setOpenWord] = useState<string | null>(null);
  useBodyScrollLock(true);

  const openWordAtNextDepth = (word: string) => {
    if (depth >= 5) {
      window.alert('呜呜呜别开我了');
      return;
    }
    setOpenWord(word);
  };

  return (
    <>
      <div className="modal" onClick={onClose}>
        <article className="morpheme-modal" onClick={(e) => e.stopPropagation()}>
          <header className="modal-head">
            <h2 className="morpheme-title">{morpheme.text}</h2>
            <span className="morpheme-tag">{typeLabel[morpheme.type]}</span>
          </header>
          <p className="morpheme-meaning">{morpheme.meaning}</p>
          <section className="modal-section">
            <h4>关联词</h4>
            <div className="word-list">
              {morpheme.words.length ? morpheme.words.map((w) => (
                <button key={w} className="word-pill-btn" onClick={() => openWordAtNextDepth(w)}>{w}</button>
              )) : <span className="muted">无</span>}
            </div>
          </section>
          {!!morpheme.generatedExamples.length && (
            <section className="modal-section">
              <h4>扩展</h4>
              <div className="word-list">
                {morpheme.generatedExamples.map((w) => (
                  <button key={w} className="word-pill-btn" onClick={() => openWordAtNextDepth(w)}>{w}</button>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
      {openWord && <WordDetailModal word={openWord} depth={depth + 1} onClose={() => setOpenWord(null)} />}
    </>
  );
}
