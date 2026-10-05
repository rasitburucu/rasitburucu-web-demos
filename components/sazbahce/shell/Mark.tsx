/** Sazbahçe mark: the pier reaching into the lake under a low sun. Same drawing as app/sazbahce/icon.svg. */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg className="sb-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#1D3830" />
      <circle cx="11" cy="12" r="4.6" fill="#E8AF56" />
      <path d="M4 19.5h24M4 23.5h24" stroke="#9DBDB8" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17 16.5h11" stroke="#F3F5F1" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M19.5 16.5v6M25.5 16.5v6" stroke="#F3F5F1" strokeWidth="1.3" />
    </svg>
  );
}
