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
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-700 dark:bg-slate-800 print:hidden">
      <button className="btn btn-primary px-6 py-3 text-base" onClick={() => openTxModal()}>
        + Thêm Giao Dịch Mới
      </button>
      <form onSubmit={search} className="max-w-md flex-1">
        <input name="q" className="input" placeholder="🔍 Tìm theo ghi chú hoặc danh mục..." />
      </form>
      <Link to="/settings" className="ml-auto" title="Cài đặt">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" className="h-10 w-10 rounded-full" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">{user.name[0]}</span>
        )}
      </Link>
    </header>
  );
}
