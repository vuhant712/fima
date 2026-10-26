import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import MoneyInput from '../components/MoneyInput.jsx';

export default function Wallets() {
  const { version, bump, toast, fmt, openTxModal } = useApp();
  const [wallets, setWallets] = useState([]);
  const [form, setForm] = useState(null); // null = ẩn form thêm ví

  useEffect(() => { api.get('/wallets').then((r) => setWallets(r.data)); }, [version]);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wallets', { name: form.name, icon: form.icon, balance: Number(form.balance || 0) });
      toast('Đã thêm ví'); setForm(null); bump();
    } catch (err) { toast(errMsg(err), 'err'); }
  };
  const rename = async (w) => {
    const name = prompt('Tên ví mới:', w.name);
    if (name?.trim()) { await api.put(`/wallets/${w.id}`, { name: name.trim(), icon: w.icon }); bump(); }
  };
  const remove = async (w) => {
    if (!confirm(`Xóa ví "${w.name}"?`)) return;
    try { await api.delete(`/wallets/${w.id}`); bump(); } catch (err) { toast(errMsg(err), 'err'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <h2 className="mr-auto text-lg font-bold">Ví của tôi</h2>
        <button className="btn btn-ghost" onClick={() => openTxModal(null, 'TRANSFER')}>🔁 Chuyển tiền</button>
        <button className="btn btn-primary" onClick={() => setForm({ name: '', icon: '💰', balance: '' })}>+ Thêm ví</button>
      </div>

      {form && (
        <form onSubmit={create} className="card flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium">Icon<input className="input mt-1 w-20" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></label>
          <label className="flex-1 text-sm font-medium">Tên ví<input required className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="text-sm font-medium">Số dư ban đầu<MoneyInput className="mt-1" value={form.balance} onChange={(v) => setForm({ ...form, balance: v })} /></label>
          <button className="btn btn-primary">Lưu</button>
          <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Hủy</button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {wallets.map((w) => (
          <div key={w.id} className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 p-5 text-white shadow-md">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{w.icon}</span>
              <span className="space-x-2"><button onClick={() => rename(w)}>✏️</button><button onClick={() => remove(w)}>🗑️</button></span>
            </div>
            <p className="mt-6 text-sm opacity-80">{w.name}</p>
            <p className="text-2xl font-bold">{fmt(w.balance)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
