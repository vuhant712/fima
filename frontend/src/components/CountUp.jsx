import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value = 0, format = (n) => n, duration = 900 }) {
  const [n, setN] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return; }
    const start = performance.now(), a = from.current;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const cur = a + (value - a) * (1 - Math.pow(1 - t, 3));
      from.current = cur;
      setN(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{format(Math.round(n))}</>;
}