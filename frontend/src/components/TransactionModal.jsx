import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import MoneyInput from './MoneyInput.jsx';
import { nowLocalInput } from '../utils/format.js';

const TABS = [['EXPENSE', 'Tiền Chi'], ['INCOME', 'Tiền Thu'], ['TRANSFER', 'Chuyển khoản'], ['ADJUSTMENT', 'Điều chỉnh số dư']];
const toLocalInput = (d) => new Date(new Date(d).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export default function TransactionModal() {
  const { txModal, closeTxModal, toast, bump } = useApp();
  const { open, editing, tab: initialTab } = txModal;
  const [tab, setTab] = useState('EXPENSE');
  const [wallets, setWallets] = useState([]);
  const [cats, setCats] = useState([]);
  const [f, setF] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  // Mỗi lần mở: tải ví + danh mục, nạp sẵn dữ liệu (thêm mới hoặc đang sửa)
  useEffect(() => {
    if (!open) return;
    Promise.all([api.get('/wallets'), api.get('/categories')]).then(([w, c]) => {
      setWallets(w.data);
      setCats(c.data);
      const firstWallet = w.data[0]?.id || '';
      if (editing) {
        setTab(editing.type);
        setF({
          amount: String(Math.abs(Number(editing.amount))), walletId: editing.walletId, toWalletId: editing.toWalletId || '',
          categoryId: editing.categoryId || '', note: editing.note || '', date: toLocalInput(editing.date),
        });
      } else {
        setTab(initialTab);
        setF({ amount: '', walletId: firstWallet, toWalletId: '', categoryId: '', note: '', date: nowLocalInput() });
      }
    });
  }, [open, editing, initialTab]);

  if (!open) return null;

  const catList = cats.filter((c) => c.type === tab);
  const curWallet = wallets.find((w) => w.id === Number(f.walletId));

  const submit = async (e) => {
    e.preventDefault();
    let amount = Number(f.amount);
    if (tab === 'ADJUSTMENT') amount = amount - Number(curWallet?.balance || 0); // nhập số dư mới -> tính chênh lệch
    if (!amount) return toast('Số tiền không hợp lệ', 'err');
    const body = {
      type: tab, amount, walletId: Number(f.walletId), note: f.note, date: new Date(f.date).toISOString(),
      toWalletId: tab === 'TRANSFER' ? Number(f.toWalletId) : undefined,
      categoryId: tab === 'INCOME' || tab === 'EXPENSE' ? Number(f.categoryId) : undefined,
    };
    setSaving(true);
    try {
      if (editing) await api.put(`/transactions/${editing.id}`, body);
      else await api.post('/transactions', body);
      toast(editing ? 'Đã cập nhật giao dịch' : 'Đã thêm giao dịch thành công');
      bump();
      closeTxModal();
    } catch (err) {
      toast(errMsg(err), 'err');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeTxModal}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
          {TABS.filter(([k]) => !editing || k === tab).map(([k, l]) => (
            <button type="button" key={k} onClick={() => setTab(k)} className={`flex-1 rounded-md px-2 py-1.5 text-sm font-medium ${tab === k ? 'bg-green-600 text-white' : ''}`}>
              {l}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium">{tab === 'ADJUSTMENT' ? 'Số dư mới của ví' : 'Số tiền'}
          <MoneyInput required autoFocus value={f.amount} onChange={(v) => set('amount', v)} className="mt-1 text-2xl font-bold" />
        </label>

        {(tab === 'EXPENSE' || tab === 'INCOME') && (
          <label className="block text-sm font-medium">Danh mục
            <select required className="input mt-1" value={f.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              <option value="">-- Chọn danh mục --</option>
              {catList.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </label>
        )}

        <label className="block text-sm font-medium">{tab === 'TRANSFER' ? 'Từ ví' : 'Chọn ví'}
          <select required className="input mt-1" value={f.walletId} onChange={(e) => set('walletId', e.target.value)}>
            {wallets.map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
          </select>
        </label>

        {tab === 'TRANSFER' && (
          <label className="block text-sm font-medium">Đến ví
            <select required className="input mt-1" value={f.toWalletId} onChange={(e) => set('toWalletId', e.target.value)}>
              <option value="">-- Chọn ví đích --</option>
              {wallets.filter((w) => w.id !== Number(f.walletId)).map((w) => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
            </select>
          </label>
        )}

        <label className="block text-sm font-medium">Ghi chú
          <input className="input mt-1" value={f.note} onChange={(e) => set('note', e.target.value)} placeholder="VD: Ăn trưa với đối tác" />
        </label>
        <label className="block text-sm font-medium">Ngày giờ
          <input type="datetime-local" required className="input mt-1" value={f.date} onChange={(e) => set('date', e.target.value)} />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn btn-ghost" onClick={closeTxModal}>Hủy</button>
          <button disabled={saving} className="btn btn-primary">Lưu giao dịch</button>
        </div>
      </form>
    </div>
  );
}
