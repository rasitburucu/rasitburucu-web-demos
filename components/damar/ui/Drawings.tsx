// Ink drawings for the inner pages, one hand: 1.5 px lines on page white,
// no fills but page white, no shading. Positions and sizes are examples.

/** Section through the quarry benches; numbered markers where the blocks
 *  in stock were cut (legend in HTML beside the drawing). */
export const FACE_BLOCKS = [
  { n: 1, bench: 2, x: 262 },
  { n: 2, bench: 3, x: 446 },
  { n: 3, bench: 3, x: 522 },
  { n: 4, bench: 4, x: 640 },
] as const;

export function QuarryFace({ label, bench }: { label: string; bench: string }) {
  const steps = [
    { x: 40, y: 64, w: 190 },
    { x: 230, y: 134, w: 180 },
    { x: 410, y: 204, w: 180 },
    { x: 590, y: 274, w: 180 },
    { x: 770, y: 344, w: 190 },
  ];
  let d = `M0 ${steps[0].y}`;
  steps.forEach((s, i) => {
    d += ` L${s.x + s.w} ${s.y}`;
    if (i < steps.length - 1) d += ` L${s.x + s.w} ${steps[i + 1].y}`;
  });
  d += " L960 430 L0 430 Z";
  return (
    <svg viewBox="0 0 960 440" className="dm-draw" role="img" aria-label={label}>
      <defs>
        <pattern id="dm-rock" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="14" className="dm-d-hatch" />
        </pattern>
        <clipPath id="dm-hill">
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} className="dm-d-fill" />
      <rect x="0" y="0" width="960" height="440" fill="url(#dm-rock)" clipPath="url(#dm-hill)" />
      <g clipPath="url(#dm-hill)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M-20 ${150 + i * 52} C 240 ${120 + i * 52}, 520 ${190 + i * 50}, 980 ${150 + i * 54}`} className="dm-d-bed" />
        ))}
      </g>
      <path d={d} className="dm-d-line dm-d-none" />
      {FACE_BLOCKS.map((b) => {
        const top = steps[b.bench - 1].y;
        return (
          <g key={b.n}>
            <rect x={b.x} y={top} width="56" height="42" className="dm-d-cut" />
            <line x1={b.x + 28} y1={top - 12} x2={b.x + 28} y2={top} className="dm-d-thin" />
            <circle cx={b.x + 28} cy={top - 26} r="14" className="dm-d-mark" />
            <text x={b.x + 28} y={top - 21} textAnchor="middle" className="dm-d-marknum">
              {b.n}
            </text>
          </g>
        );
      })}
      {steps.slice(0, 4).map((s, i) => (
        <text key={i} x={s.x + 10} y={s.y + 66} className="dm-d-label">
          {bench} {i + 1}
        </text>
      ))}
      <line x1="0" y1="430" x2="960" y2="430" className="dm-d-line" />
    </svg>
  );
}

const S = ({ children, label }: { children: React.ReactNode; label?: string }) => (
  <svg viewBox="0 0 160 110" className="dm-draw dm-draw--station" aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
    {children}
  </svg>
);

/** Six stations of the factory line, drawn small. */
export const Stations = [
  // block yard: two numbered blocks, wetted
  () => (
    <S>
      <rect x="18" y="44" width="58" height="46" className="dm-d-box" />
      <rect x="84" y="52" width="58" height="38" className="dm-d-box" />
      <text x="47" y="72" textAnchor="middle" className="dm-d-paint">0412</text>
      <text x="113" y="76" textAnchor="middle" className="dm-d-paint">0417</text>
      <line x1="8" y1="90" x2="152" y2="90" className="dm-d-line" />
      <path d="M40 18 q2 6 0 9 M52 14 q2 7 0 10 M64 20 q2 6 0 9" className="dm-d-thin" />
    </S>
  ),
  // gangsaw: frame of blades over the block
  () => (
    <S>
      <rect x="22" y="14" width="116" height="10" className="dm-d-box" />
      <line x1="26" y1="24" x2="26" y2="92" className="dm-d-line" />
      <line x1="134" y1="24" x2="134" y2="92" className="dm-d-line" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={40 + i * 6.7} y1="24" x2={40 + i * 6.7} y2="62" className="dm-d-thin" />
      ))}
      <rect x="36" y="54" width="88" height="38" className="dm-d-box" />
      <line x1="8" y1="92" x2="152" y2="92" className="dm-d-line" />
    </S>
  ),
  // resin and mesh: a slab with its backing mesh, nozzle above
  () => (
    <S>
      <path d="M20 70 L120 70 L140 56 L40 56 Z" className="dm-d-box" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`a${i}`} x1={42 + i * 10} y1="57" x2={22 + i * 10} y2="69" className="dm-d-hair" />
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <line key={`b${i}`} x1={36 - i * 6 + 6} y1={60 + i * 4} x2={136 - i * 6 + 6 - 6} y2={60 + i * 4} className="dm-d-hair" />
      ))}
      <path d="M78 18 h14 v12 l-4 6 h-6 l-4 -6 z" className="dm-d-box" />
      <path d="M85 40 v8 M81 44 l-3 6 M89 44 l3 6" className="dm-d-thin" />
      <line x1="8" y1="86" x2="152" y2="86" className="dm-d-line" />
      <circle cx="40" cy="80" r="5" className="dm-d-box" />
      <circle cx="80" cy="80" r="5" className="dm-d-box" />
      <circle cx="120" cy="80" r="5" className="dm-d-box" />
    </S>
  ),
  // polishing line: three heads over a slab on rollers
  () => (
    <S>
      <rect x="12" y="66" width="136" height="8" className="dm-d-box" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={22 + i * 23} cy="82" r="5" className="dm-d-box" />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={38 + i * 42} y1="14" x2={38 + i * 42} y2="46" className="dm-d-line" />
          <rect x={24 + i * 42} y="46" width="28" height="16" className="dm-d-box" />
        </g>
      ))}
      <line x1="16" y1="14" x2="144" y2="14" className="dm-d-line" />
    </S>
  ),
  // photo table: slab under even light, camera above
  () => (
    <S>
      <rect x="34" y="58" width="92" height="30" className="dm-d-box" />
      <text x="118" y="83" textAnchor="end" className="dm-d-paint">21</text>
      <rect x="70" y="10" width="20" height="14" className="dm-d-box" />
      <circle cx="80" cy="17" r="4" className="dm-d-box" />
      <line x1="80" y1="24" x2="80" y2="34" className="dm-d-thin" />
      <path d="M14 22 l14 10 M146 22 l-14 10" className="dm-d-line" />
      <path d="M28 32 L60 56 M132 32 L100 56" className="dm-d-hair" strokeDasharray="3 3" />
      <line x1="8" y1="96" x2="152" y2="96" className="dm-d-line" />
      <line x1="40" y1="88" x2="40" y2="96" className="dm-d-thin" />
      <line x1="120" y1="88" x2="120" y2="96" className="dm-d-thin" />
    </S>
  ),
  // A-frame with slabs leaning both sides
  () => (
    <S>
      <path d="M80 14 L50 94 M80 14 L110 94" className="dm-d-line" />
      <line x1="40" y1="94" x2="120" y2="94" className="dm-d-line" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={74 - i * 4} y1={24} x2={46 - i * 4} y2={92} className="dm-d-thin" />
          <line x1={86 + i * 4} y1={24} x2={114 + i * 4} y2={92} className="dm-d-thin" />
        </g>
      ))}
      <line x1="8" y1="100" x2="152" y2="100" className="dm-d-line" />
    </S>
  ),
];

/** A 20 ft container in section: six bundles on A-frames, space above. */
export function ContainerSection({ label }: { label: string }) {
  // inner length 5.90 m × height 2.39 m, drawn at 100 px per metre
  return (
    <svg viewBox="0 0 640 300" className="dm-draw" role="img" aria-label={label}>
      <rect x="20" y="20" width="600" height="250" className="dm-d-box" />
      <rect x="28" y="28" width="584" height="234" className="dm-d-thin dm-d-none" />
      {Array.from({ length: 15 }, (_, i) => (
        <line key={i} x1={28 + (i + 1) * 36.5} y1="28" x2={28 + (i + 1) * 36.5} y2="36" className="dm-d-hair" />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const cx = 76 + i * 97;
        return (
          <g key={i}>
            <path d={`M${cx} 128 L${cx - 30} 262 M${cx} 128 L${cx + 30} 262`} className="dm-d-line" />
            {[0, 1, 2].map((k) => (
              <g key={k}>
                <line x1={cx - 6 - k * 5} y1={136} x2={cx - 34 - k * 5} y2={260} className="dm-d-thin" />
                <line x1={cx + 6 + k * 5} y1={136} x2={cx + 34 + k * 5} y2={260} className="dm-d-thin" />
              </g>
            ))}
          </g>
        );
      })}
      <line x1="28" y1="118" x2="612" y2="118" className="dm-d-hair" strokeDasharray="5 5" />
      <line x1="20" y1="282" x2="620" y2="282" className="dm-d-thin" />
      <line x1="20" y1="276" x2="20" y2="288" className="dm-d-thin" />
      <line x1="620" y1="276" x2="620" y2="288" className="dm-d-thin" />
    </svg>
  );
}
