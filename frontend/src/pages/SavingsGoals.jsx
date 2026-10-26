import { useEffect, useMemo, useState } from 'react';
import api, { errMsg } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import MoneyInput from '../components/MoneyInput.jsx';

const icons = ['💻', '🚲', '🛡️', '🏠', '✈️', '🎓', '🎯'];
const emptyForm = { name: '', description: '', icon: icons[0], targetAmount: '', savedAmount: '', targetDate: '' };
const percentage = (goal) => Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));

export default function SavingsGoals() {
  const { fmt, toast } = useApp();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(null);
  const [contributing, setContributing] = useState(null);
  const [amount, setAmount] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await api.get('/savings-goals');
      setGoals(response.data);
    } catch (error) {
      toast(errMsg(error), 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const totals = useMemo(() => goals.reduce((result, goal) => ({
    target: result.target + goal.targetAmount,
    saved: result.saved + goal.savedAmount,
    active: result.active + (goal.savedAmount < goal.targetAmount ? 1 : 0),
  }), { target: 0, saved: 0, active: 0 }), [goals]);
  const visibleGoals = useMemo(() => goals
    .filter((goal) => filter === 'all'
      || (filter === 'active' && goal.savedAmount < goal.targetAmount)
      || (filter === 'complete' && goal.savedAmount >= goal.targetAmount))
    .sort((a, b) => sort === 'progress'
      ? percentage(b) - percentage(a)
      : new Date(b.createdAt) - new Date(a.createdAt)), [goals, filter, sort]);

  const createGoal = async (event) => {
    event.preventDefault();
    try {
      await api.post('/savings-goals', {
        ...form,
        targetAmount: Number(form.targetAmount),
        savedAmount: Number(form.savedAmount || 0),
        targetDate: form.targetDate || null,
      });
      toast('Đã tạo mục tiêu tiết kiệm');
      setForm(null);
      await refresh();
    } catch (error) {
      toast(errMsg(error), 'err');
    }
  };

  const addContribution = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/savings-goals/${contributing.id}/contributions`, { amount: Number(amount) });
      toast('Đã cập nhật khoản tiết kiệm');
      setContributing(null);
      setAmount('');
      await refresh();
    } catch (error) {
      toast(errMsg(error), 'err');
    }
  };

  const removeGoal = async (goal) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mục tiêu "${goal.name}"?`)) return;
    try {
      await api.delete(`/savings-goals/${goal.id}`);
      toast('Đã xóa mục tiêu');
      await refresh();
    } catch (error) {
      toast(errMsg(error), 'err');
    }
  };

  const daysToTarget = (goal) => goal.targetDate
    ? Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / 86400000))
    : null;

  return (
    <div className="savings-page">
      <header className="savings-heading">
        <div>
          <p className="dashboard-eyebrow">KẾ HOẠCH TƯƠNG LAI</p>
          <h1>🎯 Mục tiêu tiết kiệm</h1>
          <p className="dashboard-muted">Đặt mục tiêu hôm nay · Tự do tài chính ngày mai! 💚</p>
        </div>
        <button className="btn btn-primary savings-create" onClick={() => setForm({ ...emptyForm })}>＋ Tạo mục tiêu mới</button>
      </header>

      <section className="savings-stats" aria-label="Tổng quan mục tiêu">
        <article className="savings-stat"><span>🚀</span><div><small>Tổng mục tiêu</small><strong>{goals.length}</strong><small>đang hoạt động {totals.active}</small></div></article>
        <article className="savings-stat"><span>🐷</span><div><small>Tổng số tiền đã tiết kiệm</small><strong>{fmt(totals.saved)}</strong><small>{totals.target ? Math.round((totals.saved / totals.target) * 100) : 0}% so với mục tiêu</small></div></article>
        <article className="savings-stat savings-stat--amber"><span>🪙</span><div><small>Số tiền còn lại</small><strong>{fmt(Math.max(0, totals.target - totals.saved))}</strong><small>cần hoàn thành</small></div></article>
        <article className="savings-stat savings-stat--violet"><span>🗓️</span><div><small>Mục tiêu hoàn thành</small><strong>{goals.filter((goal) => goal.savedAmount >= goal.targetAmount).length}</strong><small>đã đạt được</small></div></article>
      </section>

      {form && (
        <form className="card savings-form" onSubmit={createGoal}>
          <div className="dashboard-panel__heading"><h2>Tạo mục tiêu mới</h2><button type="button" className="savings-close" onClick={() => setForm(null)} aria-label="Đóng">×</button></div>
          <div className="savings-form__grid">
            <label>Tên mục tiêu<input className="input mt-1" required maxLength="80" placeholder="Ví dụ: Mua laptop" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Số tiền mục tiêu<MoneyInput required className="mt-1" value={form.targetAmount} onChange={(v) => setForm({ ...form, targetAmount: v })} /></label>
            <label>Đã tiết kiệm<MoneyInput className="mt-1" value={form.savedAmount} onChange={(v) => setForm({ ...form, savedAmount: v })} /></label>
            <label>Ngày dự kiến<input className="input mt-1" type="date" min={new Date().toISOString().slice(0, 10)} value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} /></label>
            <label className="savings-form__description">Mô tả<input className="input mt-1" maxLength="240" placeholder="Điều gì khiến mục tiêu này quan trọng với bạn?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          </div>
          <div className="savings-form__bottom">
            <div className="savings-icon-picker" aria-label="Chọn biểu tượng">{icons.map((icon) => <button key={icon} type="button" className={form.icon === icon ? 'is-selected' : ''} onClick={() => setForm({ ...form, icon })} aria-label={`Chọn ${icon}`}>{icon}</button>)}</div>
            <div className="flex gap-2"><button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Hủy</button><button className="btn btn-primary">Lưu mục tiêu</button></div>
          </div>
          <p className="savings-form__hint">Số tiền đã tiết kiệm không được lớn hơn số tiền mục tiêu.</p>
        </form>
      )}

      <div className="savings-content">
        <section className="card savings-list">
          <div className="savings-list__toolbar">
            <h2>Danh sách mục tiêu</h2>
            <div className="savings-filters" role="group" aria-label="Lọc mục tiêu">
              {[['all', 'Tất cả'], ['active', 'Đang tiến hành'], ['complete', 'Hoàn thành']].map(([key, label]) => <button key={key} className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>)}
            </div>
            <select className="input savings-sort" aria-label="Sắp xếp mục tiêu" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Mới nhất</option><option value="progress">Tiến độ cao nhất</option></select>
          </div>

          {loading ? <p className="savings-empty">Đang tải mục tiêu...</p> : visibleGoals.length ? (
            <div className="savings-goal-list">
              {visibleGoals.map((goal) => {
                const pct = percentage(goal);
                const days = daysToTarget(goal);
                return (
                  <article className="savings-goal" key={goal.id}>
                    <span className="savings-goal__icon">{goal.icon}</span>
                    <div className="savings-goal__main">
                      <div className="savings-goal__title"><h3>{goal.name}</h3>{pct >= 100 && <span className="savings-complete">Hoàn thành</span>}</div>
                      {goal.description && <p className="savings-goal__description">{goal.description}</p>}
                      <strong className="savings-goal__target">{fmt(goal.targetAmount)}</strong>
                      <div className="savings-progress"><span style={{ width: `${pct}%` }} /></div>
                      <div className="savings-goal__progress-label"><span>{fmt(goal.savedAmount)} đã tiết kiệm</span><span>{pct}%</span></div>
                    </div>
                    <div className="savings-goal__amounts"><small>Đã tiết kiệm</small><strong>{fmt(goal.savedAmount)}</strong><small>Còn lại</small><strong>{fmt(Math.max(0, goal.targetAmount - goal.savedAmount))}</strong></div>
                    <div className="savings-goal__date"><small>Dự kiến hoàn thành</small><strong>{goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('vi-VN') : 'Chưa đặt ngày'}</strong>{days !== null && <small>{days === 0 ? 'Đến hạn' : `Còn ${days} ngày`}</small>}</div>
                    <div className="savings-goal__actions">
                      {pct < 100 && <button className="savings-add" onClick={() => { setContributing(goal); setAmount(''); }}>＋ Thêm tiền</button>}
                      <button className="savings-delete" onClick={() => removeGoal(goal)} aria-label={`Xóa mục tiêu ${goal.name}`} title="Xóa mục tiêu">⋯</button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <p className="savings-empty">{goals.length ? 'Không có mục tiêu nào trong bộ lọc này.' : 'Chưa có mục tiêu tiết kiệm. Hãy tạo mục tiêu đầu tiên của bạn!'}</p>}
        </section>

        <aside className="savings-side">
          <section className="card savings-progress-card">
            <h2>Tiến độ mục tiêu</h2>
            <div className="savings-progress-summary">
              <div className="savings-ring" style={{ '--progress': `${totals.target ? (totals.saved / totals.target) * 100 : 0}%` }}><strong>{totals.target ? Math.round((totals.saved / totals.target) * 100) : 0}%</strong><small>Tổng tiến độ</small></div>
              <div className="savings-legend"><span><i className="is-saved" />Đã tiết kiệm<strong>{fmt(totals.saved)}</strong></span><span><i className="is-remaining" />Còn lại<strong>{fmt(Math.max(0, totals.target - totals.saved))}</strong></span><span><i className="is-target" />Tổng mục tiêu<strong>{fmt(totals.target)}</strong></span></div>
            </div>
          </section>
          <section className="card savings-steps">
            <h2>Các bước thực hiện</h2>
            {[
              ['Đặt mục tiêu', 'Xác định số tiền và thời gian hoàn thành', '✓'],
              ['Xây dựng kế hoạch', 'Phân bổ thu nhập và cắt giảm chi tiêu', '✓'],
              ['Tiết kiệm đều đặn', 'Gửi tiền vào mục tiêu mỗi tháng', goals.length ? '↗' : '3'],
              ['Hoàn thành mục tiêu', 'Tận hưởng thành quả của bạn!', '4'],
            ].map(([title, description, icon], index) => <div className={`savings-step${index < 2 ? ' is-done' : index === 2 && goals.length ? ' is-current' : ''}`} key={title}><span>{icon}</span><div><strong>{title}</strong><small>{description}</small></div></div>)}
          </section>
          <section className="savings-quote"><span>🌿</span><p>Mỗi khoản tiết kiệm hôm nay<br />là một bước gần hơn đến ước mơ của bạn!</p><span>🎯</span></section>
        </aside>
      </div>

      {contributing && <div className="savings-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setContributing(null); }}>
        <form className="card savings-modal" onSubmit={addContribution}>
          <h2>Thêm tiền vào mục tiêu</h2><p className="dashboard-muted">{contributing.icon} {contributing.name} · Còn lại {fmt(contributing.targetAmount - contributing.savedAmount)}</p>
          <label>Số tiền đóng góp<MoneyInput required className="mt-1" value={amount} onChange={setAmount} /></label>
          <div className="flex justify-end gap-2"><button type="button" className="btn btn-ghost" onClick={() => setContributing(null)}>Hủy</button><button className="btn btn-primary">Xác nhận</button></div>
        </form>
      </div>}
    </div>
  );
}
