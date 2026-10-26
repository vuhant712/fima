import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import TxTable from '../components/TxTable.jsx';
import { monthRange } from '../utils/format.js';

export default function Transactions() {
  const { version, bump, toast, openTxModal } = useApp();
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [f, setF] = useState({ type: '', walletId: '', month: '' });
  const [wallets, setWallets] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => { api.get('/wallets').then((r) => setWallets(r.data)); }, []);

  useEffect(() => {
    const p = { q: q || undefined, type: f.type || undefined, walletId: f.walletId || undefined };
    if (f.month) [p.from, p.to] = monthRange(f.month);
    api.get('/transactions', { params: p }).then((r) => setRows(r.data));
  }, [f, q, version]);

  const remove = async (t) => {
    if (!confirm('Xóa giao dịch này? Số dư ví sẽ được hoàn lại.')) return;
    try { await api.delete(`/transactions/${t.id}`); toast('Đã xóa giao dịch'); bump(); } catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-bold">Sổ giao dịch {q && <span className="text-sm font-normal text-slate-500">— tìm “{q}”</span>}</h2>
        <select className="input w-auto" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
          <option value="">Tất cả loại</option><option value="EXPENSE">Chỉ khoản Chi</option><option value="INCOME">Chỉ khoản Thu</option>
          <option value="TRANSFER">Chuyển khoản</option><option value="ADJUSTMENT">Điều chỉnh số dư</option>
        </select>
        <select className="input w-auto" value={f.walletId} onChange={(e) => setF({ ...f, walletId: e.target.value })}>
          <option value="">Tất cả ví</option>
          {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <input type="month" className="input w-auto" value={f.month} onChange={(e) => setF({ ...f, month: e.target.value })} />
      </div>
      <TxTable rows={rows} onEdit={(t) => openTxModal(t)} onDelete={remove} />
      <p className="text-xs text-slate-500">Mẹo nhỏ: bấm đúp vào một dòng để sửa nhanh hơn.</p>
    </div>
  );
}
