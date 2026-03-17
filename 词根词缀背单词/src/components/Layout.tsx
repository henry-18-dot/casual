import { NavLink, Outlet } from 'react-router-dom';
import { BookText, Files, Home, Puzzle, Settings, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { AccountPanel } from './panels/AccountPanel';
import { SettingsPanel } from './panels/SettingsPanel';

const links = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/import', icon: Files, label: '导入' },
  { to: '/notebooks', icon: BookText, label: '导入记录' },
  { to: '/morphemes', icon: Puzzle, label: '词素库' },
];

export function Layout() {
  const [open, setOpen] = useState<'account' | 'settings' | null>(null);
  return (
    <div className="shell">
      <aside className="sidebar">
        <button onClick={() => setOpen('account')} className="icon-btn"><UserCircle2 size={18} /></button>
        <nav>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `icon-btn ${isActive ? 'active' : ''}`}>
              <item.icon size={18} /><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setOpen('settings')} className="icon-btn"><Settings size={18} /></button>
      </aside>
      <main className="content"><Outlet /></main>
      {open === 'account' && <AccountPanel onClose={() => setOpen(null)} />}
      {open === 'settings' && <SettingsPanel onClose={() => setOpen(null)} />}
    </div>
  );
}
