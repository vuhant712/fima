import { fmtDate } from '../utils/format.js';
import { useApp } from '../context/AppContext.jsx';

// Hiển thị số tiền + màu theo loại giao dịch
function Amount({ t }) {
  const { fmt } = useApp();
  const n = Number(t.amount);
  if (t.type === 'INCOME') return <span className="font-semibold text-green-600">+{fmt(n)}</span>;
  if (t.type === 'EXPENSE') return <span className="font-semibold text-red-600">-{fmt(n)}</span>;
  if (t.type === 'TRANSFER') return <span className="font-semibold text-blue-600">{fmt(n)}</span>;
  return <span className={`font-semibold ${n >= 0 ? 'text-green-600' : 'text-red-600'}`}>{n >= 0 ? '+' : '-'}{fmt(Math.abs(n))}</span>;
}

const label = (t) =>
  t.type === 'TRANSFER' ? '🔁 Chuyển khoản' : t.type === 'ADJUSTMENT' ? '⚖️ Điều chỉnh số dư' : `${t.category?.icon || ''} ${t.category?.name || '—'}`;
const walletText = (t) => (t.type === 'TRANSFER' ? `${t.wallet.name} → ${t.toWallet?.name}` : t.wallet.name);

export default function TxTable({ rows, onEdit, onDelete }) {
  if (!rows.length) return <p className="py-6 text-center text-slate-500">Chưa có giao dịch nào.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="th">Ngày</th><th className="th">Danh mục</th><th className="th">Ghi chú</th><th className="th">Ví</th>
            <th className="th text-right">Số tiền</th>
            {onDelete && <th className="th" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-t border-slate-100 dark:border-slate-700" onDoubleClick={() => t.type !== 'ADJUSTMENT' && onEdit?.(t)}>
              <td className="td whitespace-nowrap">{fmtDate(t.date)}</td>
              <td className="td">{label(t)}</td>
              <td className="td">{t.note}</td>
              <td className="td">{walletText(t)}</td>
              <td className="td text-right"><Amount t={t} /></td>
              {onDelete && (
                <td className="td whitespace-nowrap text-right">
                  {t.type !== 'ADJUSTMENT' && <button className="mr-2" title="Sửa" onClick={() => onEdit(t)}>✏️</button>}
                  <button title="Xóa" onClick={() => onDelete(t)}>🗑️</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
