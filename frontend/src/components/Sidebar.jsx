import { NavLink } from 'react-router-dom';
import FiMaLogo from './FiMaLogo.jsx';

const items = [
  ['/dashboard', '🏠', 'Tổng quan'],
  ['/transactions', '🧾', 'Sổ giao dịch'],
  ['/wallets', '👛', 'Ví của tôi'],
  ['/reports', '📊', 'Báo cáo'],
  ['/budgets', '🎯', 'Ngân sách'],
  ['/savings-goals', '🌱', 'Mục tiêu tiết kiệm'],
  ['/settings', '⚙️', 'Cài đặt'],
];

export default function Sidebar() {
  return (
    <aside className="fima-sidebar print:hidden">
      <div className="fima-brand">
        <FiMaLogo alt="FiMa" className="h-14 w-14" />
      </div>
      <p className="fima-nav-label">MENU</p>
      <nav className="fima-nav">
        {items.map(([to, icon, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `fima-nav__link${isActive ? ' fima-nav__link--active' : ''}`
            }
          >
            <span className="fima-nav__icon" aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="fima-sidebar-note">
        <span className="fima-sidebar-note__icon" aria-hidden="true">✦</span>
        <div>
          <span className="fima-sidebar-note__eyebrow">SỐNG CHỦ ĐỘNG</span>
          <p>Vững vàng từng khoản chi.</p>
        </div>
      </div>
    </aside>
  );
}
