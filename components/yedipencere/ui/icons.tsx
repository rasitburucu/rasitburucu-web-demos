// Small line icons drawn in the site's ink (the UI typeface has no arrows).

type P = { className?: string };

export const ChevronLeft = ({ className }: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
    <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ChevronRight = ({ className }: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
    <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Minus = ({ className }: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
    <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const Plus = ({ className }: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
    <path d="M3.5 8h9M8 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const Arrow = ({ className }: P) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={className}>
    <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Calendar = ({ className }: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
    <rect x="2" y="3.2" width="12" height="10.8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 6.6h12M5.2 1.8v2.6M10.8 1.8v2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const Phone = ({ className }: P) => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className={className}>
    <path
      d="M6.2 2.8 4 3.4c-.6.2-1 .8-.9 1.4.6 5.6 5.5 10.4 11.1 11.1.6.1 1.2-.3 1.4-.9l.6-2.2c.1-.5-.1-1-.6-1.2l-2.6-1.1c-.4-.2-.9-.1-1.2.2l-1 1.1a9 9 0 0 1-3.8-3.8l1.1-1c.3-.3.4-.8.2-1.2L7.4 3.4c-.2-.5-.7-.7-1.2-.6Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
