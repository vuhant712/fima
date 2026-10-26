import { NavLink } from 'react-router-dom';
import FiMaLogo from './FiMaLogo.jsx';

const items = [
  ['/dashboard', '🏠', 'Tổng quan'],
  ['/transactions', '🧾', 'Sổ giao dịch'],
  ['/wallets', '👛', 'Ví của tôi'],
  ['/reports', '📊', 'Báo cáo'],
  ['/budgets', '🎯', 'Ngân sách'],
  ['/settings', '⚙️', 'Cài đặt'],
];

export default function Sidebar() {
  return (
    <aside className="w-1/5 min-w-[200px] border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 print:hidden">
      <FiMaLogo className="mx-auto mb-6 h-24" />
      <nav className="space-y-1">
        {items.map(([to, icon, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 font-medium ${isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
