import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Reveal from '../components/Reveal.jsx';
import FiMaLogo from '../components/FiMaLogo.jsx';

const features = [
  ['👛', 'Nhiều ví', 'Tiền mặt, ngân hàng, ví điện tử, tất cả trong một nơi.'],
  ['🎯', 'Ngân sách thông minh', 'Cảnh báo ngay khi chi tiêu sắp vượt hạn mức.'],
  ['📊', 'Báo cáo trực quan', 'Biểu đồ rõ ràng, xuất Excel hoặc PDF chỉ một chạm.'],
];
const steps = [
  ['1', 'Đăng nhập', 'Một chạm với Google hoặc Facebook.'],
  ['2', 'Tạo ví', 'Nhập số dư hiện tại của bạn.'],
  ['3', 'Ghi chép', 'Thêm thu chi và theo dõi báo cáo mỗi ngày.'],
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const root = useRef(null);
  const start = () => navigate(user ? '/dashboard' : '/register');

  // Parallax: cập nhật biến --y theo vị trí cuộn
  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => root.current?.style.setProperty('--y', window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const p = (k) => ({ transform: `translateY(calc(var(--y, 0) * ${k}px))` });

  return (
    <div ref={root} className="overflow-x-hidden">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/70 px-6 py-3 backdrop-blur dark:bg-slate-900/70">
        <img src="/logo.png" alt="FiMa" className="h-10" />
        <div className="flex gap-2">
          {user ? (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Vào ứng dụng</button>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate('/login')}>Đăng nhập</button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>Đăng kí</button>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 text-center">
        <div style={p(0.45)} className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-green-300/40 blur-3xl" />
        <div style={p(0.25)} className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-amber-200/50 blur-3xl" />
        <div style={p(0.6)} className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
        <span style={p(0.35)} className="absolute left-[12%] top-[22%] text-5xl"><span className="float inline-block">💰</span></span>
        <span style={p(0.55)} className="absolute right-[14%] top-[30%] text-5xl"><span className="float inline-block [animation-delay:1s]">📈</span></span>
        <span style={p(0.7)} className="absolute bottom-[18%] left-[20%] text-4xl"><span className="float inline-block [animation-delay:2s]">🪙</span></span>
        <span style={p(0.4)} className="absolute bottom-[22%] right-[22%] text-4xl"><span className="float inline-block [animation-delay:.5s]">💳</span></span>

        <div style={p(0.15)} className="relative z-10 flex flex-col items-center gap-6">
          <Reveal><FiMaLogo className="float h-48" /></Reveal>
          <Reveal delay={150}><h1 className="gradient-text text-4xl font-extrabold md:text-6xl">Quản lý thu chi, đơn giản.</h1></Reveal>
          <Reveal delay={300}><p className="max-w-xl text-lg text-slate-500">Ghi chép giao dịch, quản lý nhiều ví, đặt ngân sách và xem báo cáo trực quan chỉ trong vài giây.</p></Reveal>
          <Reveal delay={450}><button className="btn btn-primary px-10 py-3 text-lg shadow-lg hover:scale-105" onClick={start}>Bắt đầu ngay</button></Reveal>
        </div>
      </section>

      {/* TÍNH NĂNG */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal><h2 className="mb-10 text-center text-3xl font-bold">Mọi thứ bạn cần để làm chủ tài chính</h2></Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(([icon, title, desc], i) => (
            <Reveal key={title} delay={i * 150}>
              <div className="card h-full p-6 text-center">
                <div className="mb-3 text-5xl">{icon}</div>
                <h3 className="mb-1 text-lg font-bold">{title}</h3>
                <p className="text-slate-500">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CÁCH HOẠT ĐỘNG */}
      <section className="relative overflow-hidden bg-green-50 py-20 dark:bg-slate-800/50">
        <div style={{ transform: 'translateY(calc(var(--y, 0) * -0.08px))' }} className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal><h2 className="mb-10 text-center text-3xl font-bold">Chỉ 3 bước để bắt đầu</h2></Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 200}>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white shadow-lg">{n}</div>
                  <h3 className="font-bold">{t}</h3>
                  <p className="text-slate-500">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <Reveal>
          <h2 className="mb-6 text-3xl font-bold">Sẵn sàng quản lý tài chính thông minh hơn?</h2>
          <button className="btn btn-primary px-10 py-3 text-lg shadow-lg hover:scale-105" onClick={start}>Dùng FiMa miễn phí</button>
        </Reveal>
        <p className="mt-12 text-sm text-slate-500">
          <Link to="/privacy" className="underline">Chính sách quyền riêng tư</Link> · <Link to="/data-deletion" className="underline">Xóa dữ liệu</Link>
        </p>
      </section>

    </div>
  );
}