const particles = [
  [8, 14, 4, 6.4, -2, 'green'],
  [19, 72, 3, 7.8, -5, 'amber'],
  [27, 36, 5, 8.6, -1, 'green'],
  [36, 88, 3, 6.9, -4, 'green'],
  [44, 18, 4, 9.2, -6, 'amber'],
  [53, 63, 3, 7.2, -3, 'green'],
  [61, 43, 5, 8.1, -7, 'green'],
  [69, 91, 4, 6.7, -2, 'amber'],
  [76, 25, 3, 9.5, -5, 'green'],
  [84, 69, 5, 7.5, -1, 'green'],
  [93, 39, 3, 8.8, -4, 'amber'],
  [13, 48, 3, 9.1, -6, 'green'],
  [32, 8, 4, 7.1, -3, 'amber'],
  [48, 95, 3, 8.3, -7, 'green'],
  [72, 54, 4, 6.6, -5, 'green'],
  [89, 11, 3, 9.4, -2, 'amber'],
];

export default function FloatingParticles() {
  return (
    <div className="floating-particles" aria-hidden="true">
      {particles.map(([left, top, size, duration, delay, color], index) => (
        <span
          key={index}
          className={`floating-particles__dot floating-particles__dot--${color}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            '--drift': `${index % 2 ? -12 : 12}px`,
          }}
        />
      ))}
    </div>
  );
}
