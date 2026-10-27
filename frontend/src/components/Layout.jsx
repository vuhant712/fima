import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import TransactionModal from './TransactionModal.jsx';
import FiMaLogo from './FiMaLogo.jsx';

const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <FiMaLogo alt="" className="h-24 animate-pulse" />
  </div>
);

export default function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get('/wallets').then((r) => (r.data.length ? setReady(true) : navigate('/setup', { replace: true })));
  }, [user, navigate]);

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (!ready) return <Loading />;

  return (
    <div className="fima-shell flex min-h-screen">
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