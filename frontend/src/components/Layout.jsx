import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import TransactionModal from './TransactionModal.jsx';
import FiMaLogo from './FiMaLogo.jsx';
import FloatingParticles from './FloatingParticles.jsx';

const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <FiMaLogo alt="" className="h-24 animate-pulse" />
  </div>
);

const LoadError = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
    <FiMaLogo alt="" className="h-20" />
    <p className="text-slate-400">Không kết nối được máy chủ. Server có thể đang khởi động, hãy thử lại sau ít giây.</p>
    <button className="btn-primary" onClick={() => window.location.reload()}>Thử lại</button>
  </div>
);

export default function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Kiểm tra đã có ví chưa
  useEffect(() => {
    if (!user) return;
    setFailed(false);
    api.get('/wallets')
      .then((r) => (r.data.length ? setReady(true) : navigate('/setup', { replace: true })))
      .catch(() => setFailed(true));
  }, [user, navigate]);

  // Ánh sáng chạy theo chuột trên thẻ
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.('.card, .dashboard-stat');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Các return sớm phải nằm SAU toàn bộ hook
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (!ready) return failed ? <LoadError /> : <Loading />;

  return (
    <div className="fima-shell flex min-h-screen">
      <FloatingParticles />
      <div key={pathname} className="route-bar" />
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="fima-main">
          <div key={pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
      <TransactionModal />
    </div>
  );
}