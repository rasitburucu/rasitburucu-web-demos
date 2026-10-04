// The engraved rosette from the centre of the sini, drawn as a line mark.
// Used as the logo glyph and the favicon (app/kalemkar/icon.svg mirrors it).
export function Rosette({ size = 24, className }: { size?: number; className?: string }) {
  const petals = Array.from({ length: 8 }, (_, k) => k * 45);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinejoin="round"
    >
      <circle r="46" />
      <circle r="40" strokeWidth="1.6" />
      <rect x="-26" y="-26" width="52" height="52" />
      <rect x="-26" y="-26" width="52" height="52" transform="rotate(45)" />
      {petals.map((a) => (
        <path key={a} d="M0 -11 Q 7 -19 0 -27 Q -7 -19 0 -11Z" transform={`rotate(${a})`} strokeWidth="2.4" />
      ))}
      <circle r="6" fill="currentColor" stroke="none" />
    </svg>
  );
}
