import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import api from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import { COLORS } from './Dashboard.jsx';
import { monthRange, thisMonth } from '../utils/format.js';

export default function Reports() {
  const { version, fmt } = useApp();
  const [month, setMonth] = useState(thisMonth());
  const [data, setData] = useState([]);
  const total = data.reduce((s, x) => s + x.value, 0);

  useEffect(() => {
    const [from, to] = monthRange(month);
    api.get('/reports/expenses', { params: { from, to } }).then((r) => setData(r.data));
  }, [month, version]);

  // Xuất Excel: sheet cơ cấu chi tiêu + sheet toàn bộ giao dịch trong tháng
  const exportExcel = async () => {
    const [from, to] = monthRange(month);
    const { data: txs } = await api.get('/transactions', { params: { from, to, limit: 5000 } });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.map((d) => ({ 'Danh mục': d.name, 'Số tiền': d.value, 'Tỷ lệ %': Math.round((d.value / total) * 100) }))), 'Chi tiêu');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(txs.map((t) => ({
      Ngày: new Date(t.date).toLocaleString('vi-VN'), Loại: t.type, 'Danh mục': t.category?.name || '', 'Ghi chú': t.note || '', Ví: t.wallet.name, 'Số tiền': Number(t.amount),
    }))), 'Giao dịch');
    XLSX.writeFile(wb, `FiMa-bao-cao-${month}.xlsx`);
  };

  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-bold">Báo cáo chi tiêu</h2>
        <input type="month" className="input w-auto print:hidden" value={month} onChange={(e) => setMonth(e.target.value)} />
        <button className="btn btn-ghost print:hidden" onClick={exportExcel}>📥 Xuất Excel</button>
        <button className="btn btn-ghost print:hidden" onClick={() => window.print()}>🖨️ Xuất PDF</button>
      </div>
      {data.length ? (
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={120}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              {/* Rê chuột: "Ăn uống: 3.500.000 ₫ (45%)" */}
              <Tooltip formatter={(v, name) => [`${fmt(v)} (${Math.round((v / total) * 100)}%)`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <table className="w-full text-sm">
            <thead><tr><th className="th">Danh mục</th><th className="th text-right">Số tiền</th><th className="th text-right">Tỷ lệ</th></tr></thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.name} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="td">{d.icon} {d.name}</td><td className="td text-right">{fmt(d.value)}</td><td className="td text-right">{Math.round((d.value / total) * 100)}%</td>
                </tr>
              ))}
              <tr className="border-t font-bold"><td className="td">Tổng</td><td className="td text-right">{fmt(total)}</td><td /></tr>
            </tbody>
          </table>
        </div>
      ) : <p className="py-16 text-center text-slate-500">Không có khoản chi nào trong tháng này.</p>}
    </div>
  );
}
