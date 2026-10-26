import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { initGoogle, loadFacebook, facebookLogin } from '../services/social.js';
import FiMaLogo from './FiMaLogo.jsx';

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const { toast } = useApp();
  const navigate = useNavigate();
  const gRef = useRef(null);
  const [busy, setBusy] = useState(false);

  // Gửi token của Google/Facebook lên backend -> nhận JWT -> vào Dashboard (chưa có ví thì Layout tự chuyển sang /setup)
  const finish = async (url, body) => {
    setBusy(true);
    try {
      const { data } = await api.post(url, body);
      login(data);
      navigate('/dashboard');
    } catch (e) {
      toast(errMsg(e), 'err');
      setBusy(false);
    }
  };

  useEffect(() => {
    initGoogle(gRef.current, (credential) => finish('/auth/google', { credential }));
    loadFacebook();
  }, []);

  const fb = async () => {
    try { finish('/auth/facebook', { accessToken: await facebookLogin() }); } catch (e) { toast(e.message, 'err'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-slate-800">
        <FiMaLogo className="mx-auto h-20" />
        <h2 className="text-xl font-bold">Đăng nhập vào FiMa</h2>
        <div ref={gRef} className="flex justify-center" />
        <button disabled={busy} onClick={fb} className="btn w-full bg-[#1877F2] text-white hover:opacity-90">Tiếp tục với Facebook</button>
        <button className="text-sm text-slate-500" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}
