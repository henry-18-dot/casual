import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cleanInput } from '../services/analysis';
import { useAppStore } from '../stores/useAppStore';

export function ImportPage() {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const createSessionFromInput = useAppStore((s) => s.createSessionFromInput);
  const nav = useNavigate();

  const preview = cleanInput(text);

  return (
    <div className="page">
      <h1>导入单词</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="请输入英文单词列表，逗号/空格/换行分隔" />
      <p>有效词：{preview.words.length}，清理计数：{preview.cleanedCount}，超限：{preview.words.length > 120 ? '是' : '否'}</p>
      <p>未识别：{preview.unrecognized.slice(0, 8).join(', ') || '无'}</p>
      <button onClick={() => {
        const result = createSessionFromInput(text);
        setMsg(result.message ?? '');
        if (result.ok && result.sessionId) nav(`/notebooks/${result.sessionId}`);
      }}>创建导入会话</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
