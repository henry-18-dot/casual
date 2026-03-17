import { useAppStore } from '../../stores/useAppStore';

export function AccountPanel({ onClose }: { onClose: () => void }) {
  const { settings, upsertSettings } = useAppStore();
  return (
    <section className="panel">
      <h3>账户（Guest）</h3>
      <p>手机号绑定：占位功能</p>
      <p>云同步：占位功能</p>
      <label>头像 URL（本地占位）</label>
      <input value={settings.avatar} onChange={(e) => upsertSettings({ avatar: e.target.value })} placeholder="https://..." />
      <button onClick={onClose}>关闭</button>
    </section>
  );
}
