// Line icons drawn for Damar: 1.75 px strokes, square ends, no fills.
// Albert Sans has no arrow glyphs, so arrows are SVG everywhere.
type P = { className?: string; size?: number };

const svg = (size: number, className: string | undefined, children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className={className ? `dm-ico ${className}` : "dm-ico"}>
    {children}
  </svg>
);

export const ArrowLeft = ({ className, size = 18 }: P) =>
  svg(size, className, <path d="M19 12H5.5M11 5.5 4.5 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />);

export const ArrowRight = ({ className, size = 18 }: P) =>
  svg(size, className, <path d="M5 12h13.5M13 5.5l6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />);

export const Plus = ({ className, size = 18 }: P) =>
  svg(size, className, <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />);

export const Close = ({ className, size = 18 }: P) =>
  svg(size, className, <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />);

export const Check = ({ className, size = 18 }: P) =>
  svg(size, className, <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />);

/** Open book: the four-way icon folds this down. */
export const Pair = ({ className, size = 18 }: P) =>
  svg(
    size,
    className,
    <>
      <path d="M3.5 5.5h7.5v13H3.5zM13 5.5h7.5v13H13z" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </>,
  );

export const Quad = ({ className, size = 18 }: P) =>
  svg(
    size,
    className,
    <path d="M3.5 6h7.5v5.5H3.5zM13 6h7.5v5.5H13zM3.5 13.5h7.5V19H3.5zM13 13.5h7.5V19H13z" fill="none" stroke="currentColor" strokeWidth="1.75" />,
  );

export const Box = ({ className, size = 18 }: P) =>
  svg(
    size,
    className,
    <path d="M3.5 8.5h17v11h-17zM3.5 8.5 6 4.5h12l2.5 4M9.5 12.5h5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="miter" />,
  );

export const Sheet = ({ className, size = 18 }: P) =>
  svg(size, className, <path d="M6 3.5h8.5l3.5 3.5v13.5H6zM14 3.5V7.5h4M8.5 11.5h7M8.5 14.5h7M8.5 17.5h4" fill="none" stroke="currentColor" strokeWidth="1.75" />);

export const Menu = ({ className, size = 20 }: P) =>
  svg(size, className, <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />);
