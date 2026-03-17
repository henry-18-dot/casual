import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

export function HomePage() {
  const latest = useAppStore((s) => s.sessions[0]);
  return (
    <div className="page">
      <h1>MorphLex</h1>
      <div className="cards">
        <Link className="card" to="/import"><h3>批量导入单词</h3><p>粘贴或上传 .txt/.csv</p></Link>
        <Link className="card" to="/notebooks"><h3>查看导入记录</h3><p>按会话查看历史</p></Link>
        <Link className="card" to="/morphemes"><h3>浏览词根词缀</h3><p>按前缀/词根/后缀聚合</p></Link>
      </div>
      <section className="card">
        <h3>最近导入</h3>
        {latest ? <Link to={`/notebooks/${latest.id}`}>{latest.title}</Link> : <p>暂无导入记录</p>}
      </section>
    </div>
  );
}
