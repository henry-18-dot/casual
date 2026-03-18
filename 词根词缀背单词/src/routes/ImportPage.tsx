import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import type { MorphemeType } from '../types/domain';

const presets: Array<{ label: string; value: MorphemeType }> = [
  { label: '前缀', value: 'prefix' },
  { label: '词根', value: 'root' },
  { label: '后缀', value: 'suffix' },
];

export function ImportPage() {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [probeText, setProbeText] = useState('tract');
  const [probeType, setProbeType] = useState<MorphemeType>('root');
  const createSessionFromInput = useAppStore((s) => s.createSessionFromInput);
  const deepseekDemo = useAppStore((s) => s.deepseekDemo);
  const runDeepseekDemo = useAppStore((s) => s.runDeepseekDemo);
  const nav = useNavigate();

  const checkedAt = useMemo(() => (
    deepseekDemo.lastCheckedAt ? new Date(deepseekDemo.lastCheckedAt).toLocaleString() : '尚未检测'
  ), [deepseekDemo.lastCheckedAt]);

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

      <section className="card deepseek-panel">
        <div className="deepseek-panel-head">
          <div>
            <h3>DeepSeek 实测面板</h3>
            <p className="muted">直接调用你配置的 DeepSeek 接口，验证词根词缀分析不是本地假数据。</p>
          </div>
          <span className={`status-badge ${deepseekDemo.connection?.ok ? 'ok' : 'idle'}`}>
            {deepseekDemo.loading ? '请求中...' : deepseekDemo.connection?.ok ? '已连通' : '待验证'}
          </span>
        </div>

        <div className="deepseek-form row">
          <input value={probeText} onChange={(e) => setProbeText(e.target.value)} placeholder="输入 morpheme，如 tract / re / tion" />
          <select value={probeType} onChange={(e) => setProbeType(e.target.value as MorphemeType)}>
            {presets.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <button type="button" onClick={() => void runDeepseekDemo(probeText, probeType)} disabled={deepseekDemo.loading}>
            用 DeepSeek 分析
          </button>
        </div>

        <div className="deepseek-meta">
          <span>最近检测：{checkedAt}</span>
          <span>模型：{deepseekDemo.connection?.model ?? 'deepseek-chat'}</span>
          <span>API Key：{deepseekDemo.connection?.hasApiKey ? '已配置' : '未配置'}</span>
        </div>

        <div className="deepseek-grid">
          <article className="deepseek-result-card">
            <h4>连接结果</h4>
            <p><strong>Endpoint：</strong>{deepseekDemo.connection?.endpoint ?? '未调用'}</p>
            <p><strong>模型回声：</strong>{deepseekDemo.connection?.reply ?? '暂无'}</p>
            <p><strong>错误：</strong>{deepseekDemo.error ?? '无'}</p>
          </article>

          <article className="deepseek-result-card">
            <h4>词根词缀结果</h4>
            {deepseekDemo.result ? (
              <>
                <p><strong>词素：</strong>{deepseekDemo.result.morpheme} / {deepseekDemo.result.type}</p>
                <p><strong>释义：</strong>{deepseekDemo.result.meaning}</p>
                <div className="word-list">
                  {deepseekDemo.result.examples.map((example) => (
                    <span key={example} className="word-pill">{example}</span>
                  ))}
                </div>
              </>
            ) : (
              <p className="muted">点击“用 DeepSeek 分析”后，这里会展示真实返回的释义和示例词。</p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
