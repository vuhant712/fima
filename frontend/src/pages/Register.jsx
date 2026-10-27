import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import AuthShell from '../components/AuthShell.jsx';
import PasswordInput from '../components/PasswordInput.jsx';

export default function Register() {
  const { user } = useAuth();
  const { toast } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const uname = username.trim().toLowerCase();
  const userOk = /^[a-z0-9_.]{3,30}$/.test(uname);
  const rules = [
    ['Tối thiểu 8 ký tự', password.length >= 8],
    ['Có chữ cái', /[A-Za-z]/.test(password)],
    ['Có chữ số', /\d/.test(password)],
  ];
  const valid = userOk && rules.every((r) => r[1]);

  // Đăng kí xong: báo thành công rồi quay về trang đăng nhập
  useEffect(() => {
    if (!done) return;
    toast('Đăng kí tài khoản thành công 🎉');
    const t = setTimeout(() => navigate('/login', { state: { username: uname } }), 1800);
    return () => clearTimeout(t);
  }, [done]);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/register', { username: uname, password });
      setDone(true);
    } catch (err) {
      setError(errMsg(err));
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title={done ? 'Hoàn tất!' : 'Tạo tài khoản'}
      subtitle={done ? '' : 'Chỉ mất vài giây để bắt đầu với FiMa.'}
      footer={done ? null : <>Đã có tài khoản? <Link to="/login" className="font-semibold text-green-600 hover:underline">Đăng nhập</Link></>}
    >
      {done ? (
        <div className="py-8 text-center">
          <svg viewBox="0 0 52 52" className="pop mx-auto h-24 w-24">
            <circle cx="26" cy="26" r="24" fill="#16a34a" />
            <path className="check-path" d="M14 27l8 8 16-17" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="pop mt-4 text-2xl font-bold">Đăng kí tài khoản thành công</h2>
          <p className="mt-1 text-slate-500">Đang chuyển về trang đăng nhập...</p>
        </div>
      ) : (
        <form onSubmit={submit} className={`space-y-4 ${shake ? 'shake' : ''}`}>
          <label className="block text-sm font-medium">Tài khoản
            <input required autoFocus autoComplete="username" className="input mt-1" placeholder="VD: minh.nguyen"
              value={username} onChange={(e) => setUsername(e.target.value)} />
            <span className={`mt-1 block text-xs ${username && !userOk ? 'text-red-600' : 'text-slate-500'}`}>
              3-30 ký tự: chữ, số, dấu _ hoặc .
            </span>
          </label>

          <label className="block text-sm font-medium">Mật khẩu
            <div className="mt-1">
              <PasswordInput required autoComplete="new-password" placeholder="Tạo mật khẩu"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </label>

          <ul className="space-y-1 text-sm">
            {rules.map(([text, ok]) => (
              <li key={text} className={`flex items-center gap-2 transition-colors ${ok ? 'text-green-600' : 'text-slate-400'}`}>
                <span>{ok ? '✓' : '○'}</span> {text}
              </li>
            ))}
          </ul>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={busy || !valid} className="btn btn-primary flex w-full items-center justify-center gap-2 py-3 text-base disabled:cursor-not-allowed disabled:opacity-50">
            {busy && <span className="spinner" />} Đăng kí
          </button>
        </form>
      )}
    </AuthShell>
  );
}