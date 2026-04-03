import { FormEvent, useMemo, useState } from 'react';

type ScreenshotResponse = {
  ok: boolean;
  filePath?: string;
  imageUrl?: string;
  targetUrl?: string;
  message?: string;
};

type Feedback = {
  id: string;
  project: string;
  author: string;
  message: string;
  rating: number;
  createdAt: string;
};

const API_BASE = (import.meta.env.VITE_TOOL_API as string | undefined)?.replace(/\/$/, '') || 'http://127.0.0.1:8787';

export function ToolLabPage() {
  const [route, setRoute] = useState('/');
  const [status, setStatus] = useState('等待执行');
  const [capture, setCapture] = useState<ScreenshotResponse | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [author, setAuthor] = useState('phone-user');
  const [message, setMessage] = useState('手机端体验正常，页面响应快。');
  const [rating, setRating] = useState(5);

  const mobileHint = useMemo(() => `${API_BASE}/mobile-feedback?project=morphlex`, []);

  const runScreenshot = async () => {
    setStatus('截图中...');
    try {
      const res = await fetch(`${API_BASE}/api/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ route, project: 'morphlex' }),
      });
      const data = (await res.json()) as ScreenshotResponse;
      if (!res.ok || !data.ok) {
        throw new Error(data.message || '截图失败');
      }
      setCapture(data);
      setStatus('截图成功');
    } catch (error) {
      setStatus(`截图失败: ${(error as Error).message}`);
    }
  };

  const loadFeedback = async () => {
    const res = await fetch(`${API_BASE}/api/feedback?project=morphlex`);
    const data = (await res.json()) as { ok: boolean; items: Feedback[] };
    if (data.ok) {
      setFeedback(data.items);
    }
  };

  const submitFeedback = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: 'morphlex',
        author,
        message,
        rating,
      }),
    });
    if (res.ok) {
      setMessage('');
      await loadFeedback();
    }
  };

  return (
    <section className="page tool-lab">
      <h2>前端运行与截图工具</h2>
      <div className="card">
        <p className="muted">这个工具会调用本地 screenshot API（Playwright 驱动），并把结果保存到 artifacts/screenshots。</p>
        <div className="row">
          <input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="输入路由，例如 /morphemes" />
          <button onClick={runScreenshot}>运行并截图</button>
          <button onClick={loadFeedback}>刷新手机反馈</button>
        </div>
        <p>{status}</p>
        {capture?.imageUrl && (
          <div className="tool-preview">
            <p className="muted">目标地址：{capture.targetUrl}</p>
            <img src={`${API_BASE}${capture.imageUrl}`} alt="自动截图结果" />
            <p className="muted">文件：{capture.filePath}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>手机反馈通道（可被其他项目复用）</h3>
        <p className="muted">把这个地址发到手机浏览器：{mobileHint}</p>
        <form className="tool-form" onSubmit={submitFeedback}>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="昵称" required />
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="反馈内容" required />
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((v) => (
              <option key={v} value={v}>{v} 分</option>
            ))}
          </select>
          <button type="submit">提交反馈</button>
        </form>
        <ul className="tool-feedback-list">
          {feedback.map((item) => (
            <li key={item.id}>
              <strong>{item.author}</strong>
              <span>{'★'.repeat(item.rating)}</span>
              <p>{item.message}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
