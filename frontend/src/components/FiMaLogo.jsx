import { useId } from 'react';

const columns = [
  'M222 224h12a6 6 0 0 1 6 6v38a6 6 0 0 1-6 6h-12a6 6 0 0 1-6-6v-38a6 6 0 0 1 6-6Z',
  'M249 208h12a6 6 0 0 1 6 6v54a6 6 0 0 1-6 6h-12a6 6 0 0 1-6-6v-54a6 6 0 0 1 6-6Z',
  'M275 190h12a6 6 0 0 1 6 6v72a6 6 0 0 1-6 6h-12a6 6 0 0 1-6-6v-72a6 6 0 0 1 6-6Z',
];

export default function FiMaLogo({ alt = 'FiMa', className = '' }) {
  const clipId = useId().replace(/:/g, '');
  const decorative = alt === '';

  return (
    <svg
      className={`fima-logo ${className}`}
      viewBox="0 0 512 512"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path
            clipRule="evenodd"
            d={`M0 0h512v512H0z ${columns.join(' ')}`}
          />
        </clipPath>
        <linearGradient id={`${clipId}-bars`} x1="0" x2="1" y1="1" y2="0">
          <stop offset="0%" stopColor="#087b49" />
          <stop offset="100%" stopColor="#20a558" />
        </linearGradient>
      </defs>
      <image
        href="/logo.png"
        width="512"
        height="512"
        clipPath={`url(#${clipId})`}
      />
      {columns.map((path, index) => (
        <path
          key={path}
          className={`fima-logo__bar fima-logo__bar--${index + 1}`}
          d={path}
          fill={`url(#${clipId}-bars)`}
        />
      ))}
    </svg>
  );
}
