import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import MoneyInput from '../components/MoneyInput.jsx';
import FiMaLogo from '../components/FiMaLogo.jsx';
import { fireConfetti } from '../utils/confetti.js';

export default function Setup() {
  const { user, loading } = useAuth();
  const { toast } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wallets', { name, balance: Number(balance || 0) });
      toast('🎉 Tuyệt vời, bắt đầu quản lý tài chính thôi!');
      fireConfetti();
      navigate('/dashboard');
    } catch (err) {
      toast(errMsg(err), 'err');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-8">
        <FiMaLogo alt="" className="mx-auto h-24" />
        <h1 className="text-center text-xl font-bold">Xin chào bạn mới, hãy tạo một chiếc ví đầu tiên nhé!</h1>
        <label className="block text-sm font-medium">Tên ví
          <input required className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tiền mặt, Techcombank..." />
        </label>
        <label className="block text-sm font-medium">Số dư hiện tại
          <MoneyInput className="mt-1" value={balance} onChange={setBalance} placeholder="5,000,000" />
        </label>
        <button className="btn btn-primary w-full">Hoàn tất</button>
      </form>
    </div>
  );
}
