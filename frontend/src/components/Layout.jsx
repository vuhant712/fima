import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import TransactionModal from './TransactionModal.jsx';

export default function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  // Chưa có ví nào -> chuyển sang màn hình thiết lập lần đầu
  useEffect(() => {
    if (!user) return;
    api.get('/wallets').then((r) => (r.data.length ? setReady(true) : navigate('/setup', { replace: true })));
  }, [user, navigate]);

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <TransactionModal />
    </div>
  );
}
