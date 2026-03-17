import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

export function MorphemePage() {
  const path = useLocation().pathname;
  const generateMoreRoots = useAppStore((s) => s.generateMoreRoots);
  const morphemes = useAppStore((s) => s.morphemes).filter((m) => {
    if (path.endsWith('/prefixes')) return m.type === 'prefix';
    if (path.endsWith('/roots')) return m.type === 'root';
    if (path.endsWith('/suffixes')) return m.type === 'suffix';
    return true;
  });
  return (
    <div className="page">
      <h1>词素集合</h1>
      <div className="row">
        <Link to="/morphemes/prefixes">前缀</Link>
        <Link to="/morphemes/roots">词根</Link>
        <Link to="/morphemes/suffixes">后缀</Link>
      </div>
      {morphemes.map((m) => (
        <section className="card" key={m.id}>
          <h3>{m.text} <small>({m.type})</small></h3>
          <p>{m.meaning}</p>
          <p>关联词：{m.words.join(', ') || '无'}</p>
          {m.type === 'root' && <button onClick={() => generateMoreRoots(m.id)}>Generate More</button>}
          {!!m.generatedExamples.length && <p>扩展：{m.generatedExamples.join(', ')}</p>}
        </section>
      ))}
    </div>
  );
}
