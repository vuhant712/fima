import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import api, { errMsg } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { initGoogle } from '../services/social.js';
import AuthShell from '../components/AuthShell.jsx';
import PasswordInput from '../components/PasswordInput.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const { toast } = useApp();
  const { state } = useLocation();
  const gRef = useRef(null);
  const [username, setUsername] = useState(state?.username || '');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');

  const fail = (msg) => {
    setError(msg);
    setShake(true);
    setBusy(false);
    setTimeout(() => setShake(false), 450);
  };

  const finish = async (url, body) => {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post(url, body);
      login(data); // có user -> tự chuyển sang /dashboard
    } catch (e) {
      fail(errMsg(e));
    }
  };

  useEffect(() => {
    initGoogle(gRef.current, (credential) => finish('/auth/google', { credential }));
  }, []);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = (e) => {
    e.preventDefault();
    finish('/auth/login', { username, password });
  };

  return (
    <AuthShell
      title="Chào mừng trở lại 👋"
      subtitle="Đăng nhập để tiếp tục quản lý tài chính của bạn."
      footer={<>Chưa có tài khoản? <Link to="/register" className="font-semibold text-green-600 hover:underline">Đăng kí ngay</Link></>}
    >
      <form onSubmit={submit} className={`space-y-4 ${shake ? 'shake' : ''}`}>
        <label className="block text-sm font-medium">Tài khoản
          <input required autoFocus autoComplete="username" className="input mt-1" placeholder="Nhập tài khoản"
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">Mật khẩu
          <div className="mt-1">
            <PasswordInput required autoComplete="current-password" placeholder="Nhập mật khẩu"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="btn btn-primary flex w-full items-center justify-center gap-2 py-3 text-base disabled:opacity-70">
          {busy && <span className="spinner" />} Đăng nhập
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> hoặc <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div ref={gRef} className="flex justify-center" />
    </AuthShell>
  );
}