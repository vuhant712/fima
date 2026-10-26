import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import TxTable from '../components/TxTable.jsx';

export const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6', '#ec4899', '#64748b'];

export default function Dashboard() {
  const { version, fmt } = useApp();
  const [sum, setSum] = useState({ totalAssets: 0, monthIncome: 0, monthExpense: 0 });
  const [pie, setPie] = useState([]);
  const [week, setWeek] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/reports/summary').then((r) => setSum(r.data));
    api.get('/reports/expenses').then((r) => setPie(r.data));
    api.get('/reports/weekly').then((r) => setWeek(r.data));
    api.get('/transactions', { params: { limit: 10 } }).then((r) => setRows(r.data));
  }, [version]);

  const total = pie.reduce((s, x) => s + x.value, 0);

  return (
    <div className="space-y-6">
      {/* Hàng 1: 3 thẻ */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Tổng tài sản</p><p className="text-3xl font-bold">{fmt(sum.totalAssets)}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Tổng thu tháng này</p><p className="text-3xl font-bold text-green-600">{fmt(sum.monthIncome)}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Tổng chi tháng này</p><p className="text-3xl font-bold text-red-600">{fmt(sum.monthExpense)}</p></div>
      </div>

      {/* Hàng 2: biểu đồ tròn + cột */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-2 font-semibold">Cơ cấu chi tiêu tháng này</h3>
          {pie.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label={({ name, value }) => `${name} ${Math.round((value / total) * 100)}%`}>
                  {pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="py-16 text-center text-slate-500">Chưa có khoản chi nào trong tháng.</p>}
        </div>
        <div className="card">
          <h3 className="mb-2 font-semibold"> Khoản Thu - Chi trong 7 ngày qua</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={week}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6}tr` : v >= 1e3 ? `${v / 1e3}k` : v)} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Bar dataKey="income" name="Thu" fill="#16a34a" />
              <Bar dataKey="expense" name="Chi" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hàng 3: 10 giao dịch gần nhất */}
      <div className="card">
        <h3 className="mb-2 font-semibold">Các giao dịch gần nhất</h3>
        <TxTable rows={rows} />
      </div>
    </div>
  );
}
