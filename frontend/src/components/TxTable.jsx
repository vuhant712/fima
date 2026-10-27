import { useMemo, useState } from 'react';
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
  const [amountSort, setAmountSort] = useState(null);
  const sortedRows = useMemo(() => {
    if (!amountSort) return rows;
    return [...rows].sort((a, b) => {
      const signedAmount = (transaction) => {
        const amount = Number(transaction.amount);
        if (transaction.type === 'EXPENSE') return -Math.abs(amount);
        if (transaction.type === 'INCOME') return Math.abs(amount);
        return amount;
      };
      const difference = signedAmount(a) - signedAmount(b);
      return amountSort === 'asc' ? difference : -difference;
    });
  }, [rows, amountSort]);

  if (!rows.length) return <p className="py-6 text-center text-slate-500">Chưa có giao dịch nào.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="th">Ngày</th><th className="th">Danh mục</th><th className="th">Ghi chú</th><th className="th">Ví</th>
            <th className="th text-right">
              <button
                type="button"
                className="group inline-flex cursor-pointer flex-col items-end rounded px-1 py-0.5 text-right transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                aria-label={`Sắp xếp số tiền${amountSort === 'asc' ? ' tăng dần' : amountSort === 'desc' ? ' giảm dần' : ' giữ nguyên thứ tự'}`}
                title="Nhấn để chuyển giữa tăng dần, giảm dần và giữ nguyên thứ tự"
                onClick={() => setAmountSort((current) => current === null ? 'asc' : current === 'asc' ? 'desc' : null)}
              >
                <span className="inline-flex items-center gap-1">
                  Số tiền
                  <span className="text-sm font-bold text-teal-500" aria-hidden="true">
                    {amountSort === 'asc' ? '↑' : amountSort === 'desc' ? '↓' : '↕'}
                  </span>
                </span>
                <span className="normal-case text-[10px] font-medium tracking-normal text-teal-500 group-hover:text-teal-400">
                  {amountSort
                    ? `Đang ${amountSort === 'asc' ? 'tăng' : 'giảm'} dần · nhấn để đảo chiều`
                    : 'Nhấn để sắp xếp · lần 3 giữ nguyên'}
                </span>
              </button>
            </th>
            {onDelete && <th className="th" />}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((t) => (
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
