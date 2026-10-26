import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Header() {
  const { user } = useAuth();
  const { openTxModal } = useApp();
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    const q = new FormData(e.target).get('q').trim();
    navigate(q ? `/transactions?q=${encodeURIComponent(q)}` : '/transactions');
  };

  return (
    <header className="fima-header print:hidden">
      <form onSubmit={search} className="fima-search">
        <span aria-hidden="true">⌕</span>
        <input name="q" aria-label="Tìm theo ghi chú hoặc danh mục" placeholder="Tìm theo ghi chú hoặc danh mục..." />
      </form>
      <button className="fima-add-transaction" onClick={() => openTxModal()}>
        <span aria-hidden="true">＋</span><span>Thêm giao dịch</span>
      </button>
      <Link to="/settings" className="fima-profile" title="Cài đặt">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="fima-profile__initial">{user.name[0]}</span>
        )}
        <span className="fima-profile__name">{user.name}</span>
        <span className="fima-profile__chevron" aria-hidden="true">⌄</span>
      </Link>
    </header>
  );
}
