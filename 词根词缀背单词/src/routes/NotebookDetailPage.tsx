import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWordDetail } from '../services/analysis';
import { useAppStore } from '../stores/useAppStore';

export function NotebookDetailPage() {
  const { sessionId = '' } = useParams();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [word, setWord] = useState<string | null>(null);
  const { sessions, regenerateSession, deleteSession } = useAppStore();
  const session = sessions.find((s) => s.id === sessionId);
  const filtered = useMemo(() => session?.words.filter((w) => w.includes(q.toLowerCase())) ?? [], [session, q]);
  if (!session) return <div className="page"><p>会话不存在</p></div>;

  return (
    <div className="page">
      <h1>{session.title}</h1>
      <p>状态：{session.status}</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="在本会话中搜索" />
      <div className="word-grid">{filtered.map((w) => <button key={w} onClick={() => setWord(w)}>{w}</button>)}</div>
      <div className="row">
        <button onClick={() => regenerateSession(session.id)}>重新分析</button>
        <button onClick={() => { deleteSession(session.id); nav('/notebooks'); }}>删除会话</button>
      </div>
      {word && (
        <div className="modal" onClick={() => setWord(null)}>
          <article onClick={(e) => e.stopPropagation()}>
            <h3>{word}</h3>
            <p>{getWordDetail(word).phonetic}</p>
            <p>{getWordDetail(word).meaning}</p>
            <p>{getWordDetail(word).example}</p>
          </article>
        </div>
      )}
    </div>
  );
}
