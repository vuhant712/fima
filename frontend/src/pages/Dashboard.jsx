import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import TxTable from '../components/TxTable.jsx';
import CountUp from '../components/CountUp.jsx';

export const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6', '#ec4899', '#64748b'];
const chartTooltip = {
  contentStyle: { background: '#071c1e', border: '1px solid #164448', borderRadius: 12, color: '#e5f5f2' },
  labelStyle: { color: '#d5e8e5' },
  itemStyle: { color: '#e5f5f2' },
};

function StatCard({ icon, label, value, note, tone, money, wallets }) {
  const { fmt } = useApp();
  const [open, setOpen] = useState(false);
  const expandable = Array.isArray(wallets);

  return (
    <article className={`dashboard-stat dashboard-stat--${tone}${expandable ? ' dashboard-stat--expandable' : ''}`}>
      <div className="dashboard-stat__icon" aria-hidden="true">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="dashboard-muted text-sm">{label}</p>
        <p className="dashboard-stat__value">{money != null ? <CountUp value={money} format={fmt} /> : value}</p>
        <div className="dashboard-stat__foot">
          <p className="dashboard-stat__note">{note}</p>
          {expandable && (
            <button
              type="button"
              className="dashboard-stat__toggle"
              aria-expanded={open}
              aria-label={open ? 'Ẩn số dư các ví' : 'Xem số dư từng ví'}
              onClick={() => setOpen((v) => !v)}
            >
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {expandable && (
        <div className={`dashboard-stat__wallets${open ? ' open' : ''}`} aria-hidden={!open}>
          <ul>
            {wallets.length ? wallets.map((w) => (
              <li key={w.id}>
                <span className="dashboard-stat__wname"><span>{w.icon}</span><span className="truncate">{w.name}</span></span>
                <strong>{fmt(Number(w.balance))}</strong>
              </li>
            )) : <li>Chưa có ví nào</li>}
          </ul>
        </div>
      )}
      <span className="dashboard-stat__glow" aria-hidden="true" />
    </article>
  );
}

const DashboardSkeleton = () => (
  <div className="dashboard-page" aria-busy="true">
    <div className="skeleton h-14 w-72" />
    <div className="dashboard-stats">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-28" />)}</div>
    <div className="dashboard-charts"><div className="skeleton h-64" /><div className="skeleton h-64" /></div>
    <div className="dashboard-lower"><div className="skeleton h-72" /><div className="skeleton h-72" /></div>
  </div>
);

export default function Dashboard() {
  const { version, fmt, dark } = useApp();
  const { user } = useAuth();
  const [sum, setSum] = useState({ totalAssets: 0, monthIncome: 0, monthExpense: 0 });
  const [pie, setPie] = useState([]);
  const [week, setWeek] = useState([]);
  const [rows, setRows] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);
  const net = sum.monthIncome - sum.monthExpense;
  const pieTotal = pie.reduce((total, item) => total + item.value, 0);
  const today = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const tooltip = dark ? chartTooltip : {
    contentStyle: { background: '#ffffff', border: '1px solid #dce8e6', borderRadius: 12, color: '#193331' },
    labelStyle: { color: '#294541' },
    itemStyle: { color: '#193331' },
  };
  const axisColor = dark ? '#8da7a6' : '#718581';

  useEffect(() => {
    Promise.allSettled([
      api.get('/reports/summary').then((r) => setSum(r.data)),
      api.get('/reports/expenses').then((r) => setPie(r.data)),
      api.get('/reports/weekly').then((r) => setWeek(r.data)),
      api.get('/transactions', { params: { limit: 8 } }).then((r) => setRows(r.data)),
      api.get('/savings-goals').then((r) => setGoals(r.data)),
      api.get('/wallets').then((r) => setWallets(r.data)),
    ]).finally(() => setLoading(false));
  }, [version]);

  const activeGoals = goals.filter((goal) => goal.savedAmount < goal.targetAmount);
  const savedTotal = goals.reduce((total, goal) => total + goal.savedAmount, 0);
  const remainingTotal = goals.reduce((total, goal) => total + Math.max(0, goal.targetAmount - goal.savedAmount), 0);
  const topExpense = pie[0];
  const insights = [
    topExpense && {
      icon: '↗',
      tone: 'mint',
      title: `Chi tiêu ${topExpense.name.toLowerCase()} là khoản lớn nhất`,
      message: `Chiếm ${pieTotal ? Math.round((topExpense.value / pieTotal) * 100) : 0}% tổng chi tháng này. Hãy thử đặt hạn mức phù hợp.`,
    },
    activeGoals.length > 0 && {
      icon: '🎯',
      tone: 'amber',
      title: `Bạn còn thiếu ${fmt(remainingTotal)}`,
      message: `để hoàn thành ${activeGoals.length} mục tiêu tiết kiệm đang thực hiện.`,
    },
    sum.monthIncome > 0 && {
      icon: '◈',
      tone: 'violet',
      title: net >= 0 ? 'Dòng tiền tháng này đang tích cực' : 'Chi tiêu đang cao hơn thu nhập',
      message: net >= 0
        ? `Bạn đang giữ lại ${fmt(net)}. Duy trì thói quen để tiến gần hơn tới mục tiêu.`
        : `Chênh lệch hiện tại là ${fmt(Math.abs(net))}. Cân nhắc điều chỉnh ngân sách tháng này.`,
    },
  ].filter(Boolean).slice(0, 3);

  if (loading) return <DashboardSkeleton />;
  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">TỔNG QUAN TÀI CHÍNH</p>
          <h1>Chào bạn, {user?.name || 'bạn'} <span aria-hidden="true">👋</span></h1>
          <p className="dashboard-muted">Cùng FiMa quản lý tài chính cá nhân thông minh và hiệu quả hơn.</p>
        </div>
        <div className="dashboard-date"><span aria-hidden="true">◷</span>{today}</div>
      </div>

      <section className="dashboard-stats" aria-label="Tóm tắt tài chính">
        <StatCard icon="▣" label="Tổng tài sản" money={sum.totalAssets} note="Số dư tất cả ví của bạn" tone="green" wallets={wallets} />
        <StatCard icon="↗" label="Tổng thu tháng này" money={sum.monthIncome} note="Thu nhập trong tháng" tone="mint" />
        <StatCard icon="↘" label="Tổng chi tháng này" money={sum.monthExpense} note="Chi tiêu trong tháng" tone="orange" />
        <StatCard icon="◈" label="Dòng tiền ròng" money={net} note="Thu nhập trừ chi tiêu" tone="purple" />
      </section>

      <section className="dashboard-charts">
        <article className="card dashboard-panel dashboard-spending">
          <div className="dashboard-panel__heading">
            <div>
              <h2>Cơ cấu chi tiêu</h2>
              <p className="dashboard-muted">Theo danh mục trong tháng này</p>
            </div>
            <span className="dashboard-panel__badge">Tháng này</span>
          </div>
          {pie.length ? (
            <div className="dashboard-spending__content">
              <div className="dashboard-donut">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pie} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="92%" paddingAngle={3} stroke="none">
                      {pie.map((item, index) => <Cell key={`${item.name}-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [fmt(value), name]} {...tooltip} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="dashboard-donut__center">
                  <span className="dashboard-muted">Tổng chi</span>
                  <strong>{fmt(pieTotal)}</strong>
                </div>
              </div>
              <div className="dashboard-categories">
                {pie.slice(0, 6).map((item, index) => (
                  <div className="dashboard-category" key={`${item.name}-${index}`}>
                    <span className="dashboard-category__name"><i style={{ backgroundColor: COLORS[index % COLORS.length] }} />{item.icon} {item.name}</span>
                    <span className="dashboard-category__percent">{pieTotal ? Math.round((item.value / pieTotal) * 100) : 0}%</span>
                    <span className="dashboard-category__amount">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="dashboard-empty">Chưa có khoản chi nào trong tháng.</p>}
        </article>

        <article className="card dashboard-panel dashboard-weekly">
          <div className="dashboard-panel__heading">
            <div>
              <h2>Dòng tiền 7 ngày qua</h2>
              <p className="dashboard-muted">So sánh khoản thu và chi mỗi ngày</p>
            </div>
            <div className="dashboard-legend"><span><i className="dashboard-legend__income" />Thu</span><span><i className="dashboard-legend__expense" />Chi</span></div>
          </div>
          <div className="dashboard-weekly__chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week} margin={{ top: 10, right: 4, left: -18, bottom: 0 }} barGap={5}>
                <CartesianGrid stroke={dark ? '#17383a' : '#e1ebe9'} strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} axisLine={{ stroke: dark ? '#244749' : '#d5e2df' }} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => value >= 1e6 ? `${value / 1e6}tr` : value >= 1e3 ? `${value / 1e3}k` : value} />
                <Tooltip formatter={(value) => fmt(value)} {...tooltip} />
                <Bar dataKey="income" name="Thu" fill="#08c995" radius={[5, 5, 0, 0]} maxBarSize={24} />
                <Bar dataKey="expense" name="Chi" fill="#f5a623" radius={[5, 5, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="dashboard-lower">
        <article className="card dashboard-panel dashboard-transactions">
          <div className="dashboard-panel__heading">
            <div>
              <h2>Giao dịch gần đây</h2>
              <p className="dashboard-muted">Theo dõi những khoản thu chi mới nhất</p>
            </div>
            <Link className="dashboard-link" to="/transactions">Xem tất cả <span aria-hidden="true">→</span></Link>
          </div>
          <TxTable rows={rows} />
        </article>
        <aside className="dashboard-side-panels">
          <section className="card dashboard-panel dashboard-goals">
            <div className="dashboard-panel__heading">
              <h2>Mục tiêu tiết kiệm</h2>
              <Link className="dashboard-link" to="/savings-goals">Xem tất cả →</Link>
            </div>
            {activeGoals.length ? activeGoals.slice(0, 3).map((goal) => {
              const progress = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
              return (
                <Link className="dashboard-goal" to="/savings-goals" key={goal.id}>
                  <span className="dashboard-goal__icon">{goal.icon}</span>
                  <span className="dashboard-goal__details">
                    <strong>{goal.name}</strong>
                    <small>{fmt(goal.savedAmount)} / {fmt(goal.targetAmount)}</small>
                    <span className="dashboard-goal__bar"><i style={{ width: `${progress}%` }} /></span>
                  </span>
                  <span className="dashboard-goal__percent">{progress}%</span>
                </Link>
              );
            }) : (
              <div className="dashboard-goals-empty">
                <span>🌱</span><p>{goals.length ? `Đã tiết kiệm ${fmt(savedTotal)} — bạn đã hoàn thành mọi mục tiêu!` : 'Bắt đầu lên kế hoạch cho ước mơ của bạn.'}</p>
                <Link className="dashboard-link" to="/savings-goals">{goals.length ? 'Xem mục tiêu' : 'Tạo mục tiêu'} →</Link>
              </div>
            )}
          </section>
          <section className="card dashboard-panel dashboard-insights">
            <div className="dashboard-panel__heading">
              <h2><span aria-hidden="true">💡</span> FiMa Insights</h2>
              <Link className="dashboard-link" to="/reports">Xem báo cáo →</Link>
            </div>
            {insights.length ? insights.map((insight) => (
              <article className={`dashboard-insight dashboard-insight--${insight.tone}`} key={insight.title}>
                <span>{insight.icon}</span><div><strong>{insight.title}</strong><p>{insight.message}</p></div>
              </article>
            )) : <p className="dashboard-insights-empty">Thêm giao dịch để FiMa phân tích tình hình tài chính của bạn.</p>}
          </section>
        </aside>
      </section>
    </div>
  );
}
