import { NavLink, Outlet } from 'react-router-dom';
import { BookText, Files, Home, Puzzle, Settings, UserCircle2, Wrench } from 'lucide-react';
import { useState } from 'react';
import { AccountPanel } from './panels/AccountPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';

const links = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/import', icon: Files, label: '导入' },
  { to: '/notebooks', icon: BookText, label: '导入记录' },
  { to: '/morphemes', icon: Puzzle, label: '词素库' },
  { to: '/tools', icon: Wrench, label: '工具' },
];

export function Layout() {
  const [open, setOpen] = useState<'account' | 'settings' | null>(null);
  useBodyScrollLock(open !== null);

  return (
    <div className="shell">
      <aside className="sidebar">
        <button onClick={() => setOpen('account')} className={`icon-btn ${open === 'account' ? 'active' : ''}`}><UserCircle2 size={18} /></button>
        <nav>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `icon-btn ${isActive ? 'active' : ''}`}>
              <item.icon size={18} /><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setOpen('settings')} className={`icon-btn ${open === 'settings' ? 'active' : ''}`}><Settings size={18} /></button>
      </aside>
      <main className="content"><Outlet /></main>
      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            {open === 'account' && <AccountPanel className="panel panel-left" onClose={() => setOpen(null)} />}
            {open === 'settings' && <SettingsPanel className="panel panel-left" onClose={() => setOpen(null)} />}
          </div>
        </div>
      )}
    </div>
  );
}
