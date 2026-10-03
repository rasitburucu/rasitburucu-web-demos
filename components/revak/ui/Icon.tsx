// A deliberately tiny, hand-authored stroke set (1.5px, round caps) so the
// demo needs no icon dependency. Decorative by default (aria-hidden).

type Name = "arrow" | "arrowLeft" | "plus" | "minus" | "check" | "close" | "menu" | "phone" | "calendar" | "chevron" | "print" | "pin";

const paths: Record<Name, React.ReactNode> = {
  arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M20 12H5m5-5-5 5 5 5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  phone: (
    <path d="M6.6 3.8h2.6l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v2.6a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.9a2 2 0 0 1 2-2.1Z" />
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  chevron: <path d="m7 10 5 5 5-5" />,
  print: (
    <>
      <path d="M7 9V4h10v5" />
      <rect x="4" y="9" width="16" height="7" rx="1.5" />
      <path d="M7 14h10v6H7z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.3" />
    </>
  ),
};

export function Icon({ name, size = 20, className }: { name: Name; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

/** The Revak mark: an arch within an arch, cut from one stone. */
export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size * 0.82} height={size} viewBox="0 0 23 28" aria-hidden="true" focusable="false">
      <path d="M0 28V11.5a11.5 11.5 0 0 1 23 0V28h-5.5V12a6 6 0 0 0-12 0v16Z" fill="currentColor" />
      <rect x="9.25" y="17" width="4.5" height="11" fill="var(--rv-seal)" />
    </svg>
  );
}
