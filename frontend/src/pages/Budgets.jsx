import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import MoneyInput from '../components/MoneyInput.jsx';
import { thisMonth } from '../utils/format.js';

export default function Budgets() {
  const { version, bump, toast, fmt } = useApp();
  const [month, setMonth] = useState(thisMonth());
  const [list, setList] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => { api.get('/categories').then((r) => setCats(r.data.filter((c) => c.type === 'EXPENSE'))); }, []);
  useEffect(() => { api.get('/budgets', { params: { month } }).then((r) => setList(r.data)); }, [month, version]);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { categoryId: Number(form.categoryId), limitAmount: Number(form.limit), month });
      toast('Đã lưu ngân sách'); setForm(null); bump();
    } catch (err) { toast(errMsg(err), 'err'); }
  };
  const remove = async (b) => { await api.delete(`/budgets/${b.id}`); bump(); };
  const saveEdit = async (e, b) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { categoryId: b.categoryId, limitAmount: Number(editing.limit), month: b.month });
      toast('Đã cập nhật hạn mức');
      setEditing(null);
      bump();
    } catch (err) { toast(errMsg(err), 'err'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="mr-auto text-lg font-bold">Ngân sách</h2>
        <input type="month" className="input w-auto" value={month} onChange={(e) => setMonth(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setForm({ categoryId: '', limit: '' })}>+ Tạo ngân sách mới</button>
      </div>

      {form && (
        <form onSubmit={create} className="card flex flex-wrap items-end gap-3">
          <label className="flex-1 text-sm font-medium">Danh mục
            <select required className="input mt-1" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">-- Chọn --</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </label>
          <label className="flex-1 text-sm font-medium">Hạn mức<MoneyInput required className="mt-1" value={form.limit} onChange={(v) => setForm({ ...form, limit: v })} /></label>
          <button className="btn btn-primary">Lưu</button>
          <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Hủy</button>
        </form>
      )}

      {!list.length && <p className="text-slate-500">Chưa có ngân sách nào cho tháng này.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((b) => {
          const pct = (b.spent / b.limitAmount) * 100;
          const color = pct > 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-400' : 'bg-green-500'; // >=80% vàng, >100% đỏ
          return (
            <div key={b.id} className="card space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span>{b.category.icon} {b.category.name}</span>
                <div className="flex items-center gap-1">
                  <button type="button" className="budget-action" title="Chỉnh sửa hạn mức" aria-label="Chỉnh sửa hạn mức"
                    onClick={() => setEditing({ id: b.id, limit: String(b.limitAmount) })}>✏️</button>
                  <button type="button" className="budget-action budget-action--danger" title="Xóa ngân sách" aria-label="Xóa ngân sách"
                    onClick={() => remove(b)}>🗑️</button>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className={`h-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              {editing?.id === b.id ? (
                <form onSubmit={(e) => saveEdit(e, b)} className="flex flex-wrap items-center gap-2">
                  <MoneyInput required autoFocus className="min-w-0 flex-1" value={editing.limit}
                    onChange={(v) => setEditing({ ...editing, limit: v })} />
                  <button className="btn btn-primary">Lưu</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Hủy</button>
                </form>
              ) : (
                <p className="text-sm">{fmt(b.spent)} / {fmt(b.limitAmount)} ({Math.round(pct)}%)</p>
              )}
              {pct > 100 && <p className="text-sm font-semibold text-red-600">⚠️ Đã vượt ngân sách! Bấm ✏️ để nâng hạn mức.</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
