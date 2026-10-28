import { useEffect, useRef } from 'react';

export default function FloatingParticles({ absolute = false, light = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, dots = [], raf;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor((w * h) / 22000));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: 1.5 + Math.random() * 2.5,
        amber: Math.random() < 0.25,
      }));
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const main = light ? '255,255,255' : '0,201,149';
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.x - mouse.x, dy = d.y - mouse.y, dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) { d.x += (dx / dist) * 1.4; d.y += (dy / dist) * 1.4; }
        if (!reduce) { d.x += d.vx; d.y += d.vy; }
        d.x = Math.max(0, Math.min(w, d.x));
        d.y = Math.max(0, Math.min(h, d.y));
        if (d.x <= 0 || d.x >= w) d.vx *= -1;
        if (d.y <= 0 || d.y >= h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.amber ? 'rgba(245,166,35,.6)' : `rgba(${main},.55)`;
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const e = dots[j], l = Math.hypot(d.x - e.x, d.y - e.y);
          if (l < 120) {
            ctx.strokeStyle = `rgba(${main},${(1 - l / 120) * 0.2})`;
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.stroke();
          }
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('mousemove', onMove);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('mousemove', onMove); };
  }, [light]);

  return <canvas ref={ref} aria-hidden="true" className={`particles-canvas${absolute ? ' particles-canvas--absolute' : ''}`} />;
}