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
        <FiMaLogo className="h-12 w-12" />
        <span>FiMa</span>
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
      <div className="fima-sidebar-tip">
        <span className="fima-sidebar-tip__icon" aria-hidden="true">🌱</span>
        <p>Quản lý tài chính<br />thông minh cùng FiMa</p>
        <NavLink to="/budgets" className="fima-sidebar-tip__link">Khám phá ngay <span aria-hidden="true">→</span></NavLink>
      </div>
    </aside>
  );
}
