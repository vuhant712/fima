import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';

const FEEDBACK_EMAIL = 'feedback@example.com'; // TODO: đổi thành email nhận góp ý của bạn

export default function Settings() {
  const { user, logout } = useAuth();
  const { dark, setDark, currency, setCurrency, lang, setLang, toast } = useApp();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [nc, setNc] = useState({ type: 'EXPENSE', name: '', icon: '📁' });
  const [fb, setFb] = useState('');

  const load = () => api.get('/categories').then((r) => setCats(r.data));
  useEffect(() => { load(); }, []);

  const addCat = async (e) => {
    e.preventDefault();
    try { await api.post('/categories', nc); setNc({ ...nc, name: '' }); load(); } catch (err) { toast(errMsg(err), 'err'); }
  };
  const delCat = async (c) => { if (confirm(`Xóa danh mục "${c.name}"?`)) { await api.delete(`/categories/${c.id}`); load(); } };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card flex items-center gap-4">
        {user.avatarUrl && <img src={user.avatarUrl} referrerPolicy="no-referrer" alt="" className="h-14 w-14 rounded-full" />}
        <div className="mr-auto"><p className="font-bold">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p></div>
        <button className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }}>Đăng xuất</button>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold">Cài đặt chung</h3>
        <label className="flex items-center justify-between">🌙 Chế độ tối
          <input type="checkbox" className="h-5 w-5" checked={dark} onChange={(e) => setDark(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between">Ngôn ngữ
          <select className="input w-auto" value={lang} onChange={(e) => setLang(e.target.value)}><option value="vi">Tiếng Việt</option><option value="en">English</option></select>
        </label>
        <label className="flex items-center justify-between">Tiền tệ hiển thị
          <select className="input w-auto" value={currency} onChange={(e) => setCurrency(e.target.value)}><option value="VND">VND (₫)</option><option value="USD">USD ($)</option></select>
        </label>
        <p className="text-xs text-slate-500">Tiền tệ chỉ đổi cách hiển thị, không quy đổi tỷ giá.</p>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold">Quản lý danh mục</h3>
        <form onSubmit={addCat} className="flex flex-wrap gap-2">
          <select className="input w-auto" value={nc.type} onChange={(e) => setNc({ ...nc, type: e.target.value })}><option value="EXPENSE">Chi</option><option value="INCOME">Thu</option></select>
          <input className="input w-20" value={nc.icon} onChange={(e) => setNc({ ...nc, icon: e.target.value })} />
          <input required className="input flex-1" placeholder="Tên danh mục, VD: Tiền mua sữa cho con" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} />
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

      <div className="card space-y-2">
        <h3 className="font-semibold">Báo lỗi / Góp ý</h3>
        <textarea className="input" rows="3" value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Nhập góp ý của bạn..." />
        <a className="btn btn-primary inline-block" href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('Góp ý FiMa')}&body=${encodeURIComponent(fb)}`}>Gửi góp ý</a>
      </div>
    </div>
  );
}
