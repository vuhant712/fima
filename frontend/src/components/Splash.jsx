import { useEffect, useState } from 'react';
import FiMaLogo from './FiMaLogo.jsx';

export default function Splash() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / 1100) * 100);
      setPct(Math.round(p));
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="splash">
      <div className="splash__logo">
        <span className="splash__ring" />
        <span className="splash__ring splash__ring--2" />
        <FiMaLogo />
      </div>
      <p className="splash__title">FiMa</p>
      <p className="splash__tag">Quản lý thu chi thông minh</p>
      <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      <span className="splash__pct">{pct}%</span>
    </div>
  );
}