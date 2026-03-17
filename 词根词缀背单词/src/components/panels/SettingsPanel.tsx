import { useAppStore } from '../../stores/useAppStore';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, upsertSettings } = useAppStore();
  return (
    <section className="panel">
      <h3>设置</h3>
      <label>主题</label>
      <select value={settings.theme} onChange={(e) => upsertSettings({ theme: e.target.value as 'dark' | 'light' })}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      <label>强调色</label>
      <select value={settings.accent} onChange={(e) => upsertSettings({ accent: e.target.value as 'orange' | 'green' | 'blue' | 'purple' })}>
        <option value="orange">Orange</option><option value="green">Green</option><option value="blue">Blue</option><option value="purple">Purple</option>
      </select>
      <label>字号</label>
      <select value={settings.fontSize} onChange={(e) => upsertSettings({ fontSize: e.target.value as 'sm' | 'md' | 'lg' })}>
        <option value="sm">小</option><option value="md">中</option><option value="lg">大</option>
      </select>
      <button onClick={() => upsertSettings({ theme: 'dark', accent: 'blue', fontSize: 'md' })}>恢复默认</button>
      <button onClick={onClose}>关闭</button>
    </section>
  );
}
