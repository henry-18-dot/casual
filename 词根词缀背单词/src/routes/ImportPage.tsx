import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

export function ImportPage() {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const createSessionFromInput = useAppStore((s) => s.createSessionFromInput);
  const nav = useNavigate();

  const handleSubmit = () => {
    const result = createSessionFromInput(text);
    setMsg(result.message ?? '');
    if (result.ok && result.sessionId) nav(`/notebooks/${result.sessionId}`);
  };

  return (
    <div className="page">
      <h1>导入单词</h1>
      <div className="import-box">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit();
          }}
          rows={14}
          placeholder="粘贴英文单词列表，逗号/空格/换行分隔。
支持单词本导出，建议每次不超过 120 词。
按 Ctrl/⌘ + Enter 立即创建导入会话。"
        />
        <div className="import-actions">
          <button type="button" onClick={handleSubmit} disabled={!text.trim()}>
            提交
          </button>
        </div>
        {msg && <div className="import-msg">{msg}</div>}
      </div>
    </div>
  );
}
