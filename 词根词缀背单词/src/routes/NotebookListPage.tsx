import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

export function NotebookListPage() {
  const sessions = useAppStore((s) => s.sessions);
  return (
    <div className="page">
      <h1>导入记录</h1>
      {sessions.length === 0 ? <p>暂无数据</p> : sessions.map((s) => (
        <Link className="card" key={s.id} to={`/notebooks/${s.id}`}>
          <h3>{s.title}</h3>
          <p>{new Date(s.createdAt).toLocaleString()} · {s.words.length} 词 · {s.batches.length} 批</p>
        </Link>
      ))}
    </div>
  );
}
