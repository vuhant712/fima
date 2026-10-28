export function fireConfetti({ count = 140 } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const w = window.innerWidth, h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 300 });
  canvas.width = w * dpr; canvas.height = h * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const colors = ['#16a34a', '#22c55e', '#f59e0b', '#fde047', '#3b82f6', '#ec4899', '#8b5cf6'];
  const bits = Array.from({ length: count }, () => ({
    x: w / 2, y: h * 0.6,
    vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 6,
    size: 6 + Math.random() * 6,
    rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
    color: colors[(Math.random() * colors.length) | 0],
  }));

  const start = performance.now();
  const tick = (now) => {
    const t = now - start;
    ctx.clearRect(0, 0, w, h);
    for (const b of bits) {
      b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - t / 3200);
      ctx.translate(b.x, b.y); ctx.rotate(b.rot);
      ctx.fillStyle = b.color;
      ctx.fillRect(-b.size / 2, -b.size / 4, b.size, b.size / 2);
      ctx.restore();
    }
    if (t < 3200) requestAnimationFrame(tick); else canvas.remove();
  };
  requestAnimationFrame(tick);
}