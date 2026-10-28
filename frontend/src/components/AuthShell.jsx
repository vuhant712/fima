import { Link } from 'react-router-dom';
import FloatingParticles from './FloatingParticles.jsx';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen">
      <div className="auth-bg relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        <FloatingParticles absolute light />   {/* THÊM */}
        <div className="float absolute -left-16 top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="float absolute bottom-10 right-0 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl [animation-delay:1.5s]" />
        <div className="slide-up relative z-10 px-12 text-center text-white">
          <div className="mx-auto mb-8 w-fit rounded-3xl bg-white p-6 shadow-2xl">
            <img src="/logo.png" alt="FiMa" className="h-40" />
          </div>
          <h2 className="text-3xl font-bold">Quản lý tài chính thông minh</h2>
          <p className="mt-2 text-green-100">Ghi chép thu chi, đặt ngân sách, theo dõi mọi ví trong một nơi.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="slide-up w-full max-w-md">
          <Link to="/" className="mb-6 inline-block text-sm text-slate-500 hover:text-green-600">← Về trang chủ</Link>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mb-6 mt-1 text-slate-500">{subtitle}</p>
          {children}
          <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
    </div>
  );
}