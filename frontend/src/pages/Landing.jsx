import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoginModal from '../components/LoginModal.jsx';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const start = () => (user ? navigate('/dashboard') : setOpen(true));

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 p-6 text-center">
      <button className="btn btn-ghost absolute right-6 top-6" onClick={start}>Đăng nhập</button>
      <img src="/logo.png" alt="FiMa" className="h-48" />
      <h1 className="text-4xl font-bold">Quản lý thu chi cá nhân, đơn giản.</h1>
      <p className="max-w-xl text-lg text-slate-500">Ghi chép giao dịch, quản lý nhiều ví, đặt ngân sách và xem báo cáo trực quan chỉ trong vài giây.</p>
      <button className="btn btn-primary px-8 py-3 text-lg" onClick={start}>Bắt đầu ngay</button>
      <div className="mt-6 grid gap-4 text-left sm:grid-cols-3">
        {[['👛', 'Nhiều ví', 'Tiền mặt, ngân hàng, ví điện tử.'], ['🎯', 'Ngân sách', 'Cảnh báo khi sắp vượt hạn mức.'], ['📊', 'Báo cáo', 'Biểu đồ, xuất Excel/PDF.']].map(([i, t, d]) => (
          <div key={t} className="card"><div className="text-2xl">{i}</div><b>{t}</b><p className="text-sm text-slate-500">{d}</p></div>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-500"><Link to="/privacy" className="underline">Chính sách quyền riêng tư</Link> · <Link to="/data-deletion" className="underline">Xóa dữ liệu</Link></p>
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </div>
  );
}
