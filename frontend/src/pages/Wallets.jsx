import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import MoneyInput from '../components/MoneyInput.jsx';

const WALLET_ICONS = ['💵', '👛', '💳', '🏦', '🪙', '🐷', '📱', '🏠', '🚗', '🎓', '✈️'];

export default function Wallets() {
  const { version, bump, toast, fmt, openTxModal } = useApp();
  const [wallets, setWallets] = useState([]);
  const [form, setForm] = useState(null); // null = ẩn form thêm ví
  const [editing, setEditing] = useState(null); // { id, name, icon }

  useEffect(() => { api.get('/wallets').then((r) => setWallets(r.data)); }, [version]);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wallets', { name: form.name, icon: form.icon, balance: Number(form.balance || 0) });
      toast('Đã thêm ví'); setForm(null); bump();
    } catch (err) { toast(errMsg(err), 'err'); }
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    const name = editing.name.trim();
    if (!name) return toast('Tên ví không được để trống', 'err');
    try {
      await api.put(`/wallets/${editing.id}`, { name, icon: editing.icon.trim() || '💰' });
      toast('Đã cập nhật ví');
      setEditing(null);
      bump();
    } catch (err) { toast(errMsg(err), 'err'); }
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
        {wallets.map((w) => {
          const isEditing = editing?.id === w.id;
          return (
            <div key={w.id} className="wallet-card rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 p-5 text-white shadow-md">
              <div className="flex items-start justify-between">
                {isEditing ? (
                  <input
                    className="wallet-icon-input"
                    value={editing.icon}
                    maxLength={8}
                    aria-label="Icon ví"
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  />
                ) : (
                  <span className="text-3xl">{w.icon}</span>
                )}
                <span className="flex gap-1">
                  <button type="button" className="wallet-action" title="Sửa tên và icon" aria-label="Chỉnh sửa ví"
                    onClick={() => setEditing(isEditing ? null : { id: w.id, name: w.name, icon: w.icon })}>✏️</button>
                  <button type="button" className="wallet-action" title="Xóa ví" aria-label="Xóa ví"
                    onClick={() => remove(w)}>🗑️</button>
                </span>
              </div>

              {isEditing ? (
                <form onSubmit={saveEdit} className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {WALLET_ICONS.map((ic) => (
                      <button type="button" key={ic} className={`wallet-icon-pick${editing.icon === ic ? ' active' : ''}`}
                        onClick={() => setEditing({ ...editing, icon: ic })}>{ic}</button>
                    ))}
                  </div>
                  <input autoFocus required className="wallet-name-input" placeholder="Tên ví" maxLength={40}
                    value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  <div className="flex gap-2">
                    <button className="wallet-btn wallet-btn--save">Lưu</button>
                    <button type="button" className="wallet-btn" onClick={() => setEditing(null)}>Hủy</button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="mt-6 text-sm opacity-80">{w.name}</p>
                  <p className="text-2xl font-bold">{fmt(w.balance)}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
