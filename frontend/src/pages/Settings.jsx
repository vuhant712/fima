import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';

const FEEDBACK_EMAIL = 'email-cua-ban@gmail.com'; // TODO: đổi thành email của bạn

export default function Settings() {
  const { user, logout } = useAuth();
  const { dark, setDark, toast } = useApp();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [nc, setNc] = useState({ type: 'EXPENSE', name: '', icon: '📁' });
  const [fb, setFb] = useState('');
  const [sent, setSent] = useState(false);

  const load = () => api.get('/categories').then((r) => setCats(r.data));
  useEffect(() => { load(); }, []);

  const addCat = async (e) => {
    e.preventDefault();
    try { await api.post('/categories', nc); setNc({ ...nc, name: '' }); load(); } catch (err) { toast(errMsg(err), 'err'); }
  };
  const delCat = async (c) => { if (confirm(`Xóa danh mục "${c.name}"?`)) { await api.delete(`/categories/${c.id}`); load(); } };

  const sendFeedback = (e) => {
    e.preventDefault();
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('Góp ý FiMa')}&body=${encodeURIComponent(fb)}`;
    setSent(true);
    setFb('');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card flex items-center gap-4">
        {user.avatarUrl && <img src={user.avatarUrl} referrerPolicy="no-referrer" alt="" className="h-14 w-14 rounded-full" />}
        <div className="mr-auto"><p className="font-bold">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p></div>
        <button className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }}>Đăng xuất</button>
      </div>

      <div className="card settings-theme-card">
        <div className="settings-theme-card__intro">
          <span className="settings-theme-card__icon" aria-hidden="true">{dark ? '🌙' : '☀️'}</span>
          <div>
            <h3>Giao diện</h3>
            <p>Chọn chế độ hiển thị phù hợp với bạn.</p>
          </div>
        </div>
        <div className="settings-theme-toggle" role="group" aria-label="Chọn giao diện">
          <button
            type="button"
            className={`settings-theme-toggle__option${!dark ? ' settings-theme-toggle__option--active' : ''}`}
            aria-pressed={!dark}
            onClick={() => setDark(false)}
          >
            <span aria-hidden="true">☀</span> Sáng
          </button>
          <button
            type="button"
            className={`settings-theme-toggle__option${dark ? ' settings-theme-toggle__option--active' : ''}`}
            aria-pressed={dark}
            onClick={() => setDark(true)}
          >
            <span aria-hidden="true">☾</span> Tối
          </button>
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold">Quản lý danh mục</h3>
        <form onSubmit={addCat} className="flex flex-wrap gap-2">
          <select className="input w-auto" value={nc.type} onChange={(e) => setNc({ ...nc, type: e.target.value })}><option value="EXPENSE">Chi</option><option value="INCOME">Thu</option></select>
          <input className="input w-20" value={nc.icon} onChange={(e) => setNc({ ...nc, icon: e.target.value })} />
          <input required className="input flex-1" placeholder="Tên danh mục" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} />
          <button className="btn btn-primary">Thêm</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <span key={c.id} className={`rounded-full px-3 py-1 text-sm ${c.type === 'EXPENSE' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
              {c.icon} {c.name} <button onClick={() => delCat(c)} className="ml-1 opacity-60">✕</button>
            </span>
          ))}
        </div>
      </div>

      <div className="card relative overflow-hidden">
        <h3 className="mb-2 font-semibold">Báo lỗi / Góp ý</h3>
        {sent ? (
          <div className="py-8 text-center">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="confetti text-xl" style={{ left: `${(i * 7 + 4) % 94}%`, animationDelay: `${(i % 6) * 0.12}s` }}>
                {['🎉', '✨', '💚', '🎊'][i % 4]}
              </span>
            ))}
            <div className="pop text-6xl">💚</div>
            <p className="pop mt-3 text-xl font-bold">Cảm ơn bạn đã góp ý!</p>
            <p className="text-sm text-slate-500">FiMa sẽ ngày càng tốt hơn nhờ ý kiến của bạn.</p>
            <button className="btn btn-ghost mt-4" onClick={() => setSent(false)}>Gửi góp ý khác</button>
          </div>
        ) : (
          <form onSubmit={sendFeedback} className="space-y-2">
            <textarea required className="input" rows="3" value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Nhập góp ý của bạn..." />
            <button className="btn btn-primary">Gửi góp ý</button>
          </form>
        )}
      </div>
    </div>
  );
}