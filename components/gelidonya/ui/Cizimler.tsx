import { tr } from "@/content/gelidonya/tr";

// Technical drawings in the manner of an agriculture handbook plate: flat
// colour, ink outlines, numbered callouts. The numbers are explained in an HTML
// list under each figure, so every label stays readable at any width; the SVG
// carries only numbers and dimensions. Measurements are examples (said so).

const INK = "#111311";
const PAPER = "#f3f4f1";
const STEM = "#3e7a23";
const STEM_D = "#2b5a17";
const LEAF = "#4f8f2b";
const LEAF_D = "#2f6418";
const COIR = "#7a5a3a";
const COIR_D = "#5e4329";
const ROOT = "#efe4c8";
const PEAT = "#4a3826";
const WATER = "#5e8fb8";
const STEEL = "#c4c8c1";
const TWINE = "#b8a47e";
const CLIP = "#e3b02b";

/** Deterministic jitter so the drawing is the same on server and client. */
function rnd(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const f1 = (n: number) => Math.round(n * 10) / 10;

/** One pointed leaflet along +x, length l, half width w. */
const leaflet = (l: number, w: number) =>
  `M0 0C${f1(l * 0.28)} ${f1(-w)} ${f1(l * 0.72)} ${f1(-w * 0.85)} ${l} 0C${f1(l * 0.72)} ${f1(w * 0.85)} ${f1(l * 0.28)} ${f1(w)} 0 0Z`;

/** A compound tomato leaf: a drooping rachis with paired leaflets and a
 *  terminal one. (x, y) is where it leaves the stem; a in degrees (0 = right). */
function Yaprak({ x, y, a, L, s = 1, seed = 1 }: { x: number; y: number; a: number; L: number; s?: number; seed?: number }) {
  const r = rnd(seed);
  const rad = (a * Math.PI) / 180;
  const ex = x + L * Math.cos(rad);
  const ey = y + L * Math.sin(rad);
  const cx = (x + ex) / 2;
  const cy = (y + ey) / 2 - L * 0.12 + L * 0.22 * Math.abs(Math.cos(rad)) * 0.6;
  const at = (t: number) => {
    const u = 1 - t;
    return [u * u * x + 2 * u * t * cx + t * t * ex, u * u * y + 2 * u * t * cy + t * t * ey];
  };
  const dir = (t: number) => {
    const dx = 2 * (1 - t) * (cx - x) + 2 * t * (ex - cx);
    const dy = 2 * (1 - t) * (cy - y) + 2 * t * (ey - cy);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };
  const parts: React.ReactNode[] = [];
  [0.34, 0.6, 0.84].forEach((t, i) => {
    const [px, py] = at(t);
    const d = dir(t);
    const l = (15 + i * 3.5 + r() * 4) * s;
    const w = l * 0.36;
    for (const side of [-1, 1]) {
      const ang = d + side * (52 - i * 6 + r() * 10);
      parts.push(
        <g key={`${i}${side}`} transform={`translate(${f1(px)} ${f1(py)}) rotate(${f1(ang)})`}>
          <path d={leaflet(l, w)} fill={LEAF} stroke={LEAF_D} strokeWidth={0.8} />
          <path d={`M1 0L${f1(l * 0.85)} 0`} stroke={LEAF_D} strokeWidth={0.6} />
        </g>,
      );
    }
  });
  const ld = dir(1);
  const tl = (23 + r() * 4) * s;
  return (
    <g>
      <path d={`M${f1(x)} ${f1(y)}Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}`} fill="none" stroke={STEM_D} strokeWidth={1.6 * s} strokeLinecap="round" />
      {parts}
      <g transform={`translate(${f1(ex)} ${f1(ey)}) rotate(${f1(ld)})`}>
        <path d={leaflet(tl, tl * 0.38)} fill={LEAF} stroke={LEAF_D} strokeWidth={0.8} />
        <path d={`M1 0L${f1(tl * 0.85)} 0`} stroke={LEAF_D} strokeWidth={0.6} />
      </g>
    </g>
  );
}

/** Numbered callout: dot on the part, leader, ink disc with the number. */
function Num({ n, x, y, tx, ty }: { n: number; x: number; y: number; tx: number; ty: number }) {
  return (
    <g className="gd-num-call">
      <path d={`M${x} ${y}L${tx} ${ty}`} stroke={INK} strokeWidth={1.4} fill="none" />
      <circle cx={x} cy={y} r={3.2} fill={INK} stroke={PAPER} strokeWidth={1} />
      <circle cx={tx} cy={ty} r={15} fill={INK} />
      <text x={tx} y={ty + 6} textAnchor="middle" fill="#fff" fontSize={17} fontWeight={700}>
        {n}
      </text>
    </g>
  );
}

/** Dimension line with slash ticks and the value on a paper patch. */
function Dim({ x1, y1, x2, y2, label, ext = 0, right = false }: { x1: number; y1: number; x2: number; y2: number; label: string; ext?: number; right?: boolean }) {
  const vertical = x1 === x2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const tick = (x: number, y: number) => <path d={`M${x - 5} ${y + 5}L${x + 5} ${y - 5}`} stroke={INK} strokeWidth={1.6} />;
  return (
    <g>
      {ext > 0 && !vertical && (
        <>
          <path d={`M${x1} ${y1 - ext}V${y1 + 6}M${x2} ${y2 - ext}V${y2 + 6}`} stroke={INK} strokeWidth={0.8} strokeDasharray="3 3" />
        </>
      )}
      {ext > 0 && vertical && <path d={`M${x1 + ext} ${y1}H${x1 - 6}M${x2 + ext} ${y2}H${x2 - 6}`} stroke={INK} strokeWidth={0.8} strokeDasharray="3 3" />}
      <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={INK} strokeWidth={1.2} />
      {tick(x1, y1)}
      {tick(x2, y2)}
      <text
        x={vertical ? (right ? mx + 10 : mx - 8) : mx}
        y={vertical ? my + 6 : my - 8}
        textAnchor={vertical ? (right ? "start" : "end") : "middle"}
        className="gd-svg-dim"
        paintOrder="stroke"
        stroke={PAPER}
        strokeWidth={6}
        strokeLinejoin="round"
        fill={INK}
      >
        {label}
      </text>
    </g>
  );
}

/** Break mark on a long element (the twine runs ~3.5 m up to the crop wire). */
const Break = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 9} y={y - 7} width={18} height={14} fill={PAPER} />
    <path d={`M${x - 9} ${y - 2}L${x + 9} ${y - 8}M${x - 9} ${y + 8}L${x + 9} ${y + 2}`} stroke={INK} strokeWidth={1.2} />
  </g>
);

/** Coir texture: fibres and perlite-like flecks inside the bag. */
function Coir({ x, y, w, h, seed }: { x: number; y: number; w: number; h: number; seed: number }) {
  const r = rnd(seed);
  const n = Math.round((w * h) / 90);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const px = x + 3 + r() * (w - 6);
    const py = y + 3 + r() * (h - 6);
    if (r() < 0.62) {
      const a = r() * Math.PI;
      const l = 3 + r() * 6;
      out.push(<path key={i} d={`M${f1(px)} ${f1(py)}l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}`} stroke={COIR_D} strokeWidth={1} strokeLinecap="round" />);
    } else out.push(<circle key={i} cx={f1(px)} cy={f1(py)} r={f1(0.8 + r() * 1.1)} fill="#d6c4a0" />);
  }
  return <g>{out}</g>;
}

/** Fine roots spreading from (x, y) downwards inside a box. */
function Roots({ x, y, spread, depth, n, seed, color = ROOT, width = 1.3 }: { x: number; y: number; spread: number; depth: number; n: number; seed: number; color?: string; width?: number }) {
  const r = rnd(seed);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const dx = (r() - 0.5) * 2 * spread;
    const dy = depth * (0.45 + r() * 0.55);
    const c1x = x + dx * 0.15 + (r() - 0.5) * 10;
    const c1y = y + dy * 0.45;
    const c2x = x + dx * 0.75;
    const c2y = y + dy * 0.7 + (r() - 0.5) * 8;
    const w = width * (0.6 + r() * 0.8);
    out.push(
      <path
        key={i}
        d={`M${f1(x + (r() - 0.5) * 8)} ${y}C${f1(c1x)} ${f1(c1y)} ${f1(c2x)} ${f1(c2y)} ${f1(x + dx)} ${f1(y + dy)}`}
        fill="none"
        stroke={color}
        strokeWidth={f1(w)}
        strokeLinecap="round"
      />,
    );
  }
  return <g>{out}</g>;
}

/** A young plant in the bag: stem from the cube up to the twine, leaves, the
 *  first truss with flowers and set fruit, and a clip holding it to the twine. */
function Bitki({ x, seed, base = 300, top = 150 }: { x: number; seed: number; base?: number; top?: number }) {
  const r = rnd(seed);
  const sway = (r() - 0.5) * 6;
  const stem = `M${x} ${base}C${x + 4} ${base - 50} ${x - 5 + sway} ${top + 60} ${x + sway} ${top}`;
  const leaves = [
    { y: base - 22, a: -150 + r() * 8, L: 52 },
    { y: base - 54, a: -28 - r() * 8, L: 58 },
    { y: base - 88, a: -158 + r() * 8, L: 54 },
    { y: base - 118, a: -22 - r() * 8, L: 48 },
    { y: top + 14, a: -125, L: 30 },
    { y: top + 10, a: -60, L: 28 },
  ];
  // the first truss leaves the stem between leaves 2 and 3, on the right
  const ty = base - 72;
  const truss = `M${x + 1} ${ty}q 16 -2 26 14 q 6 10 14 12`;
  return (
    <g>
      <path d={stem} fill="none" stroke={STEM} strokeWidth={5} strokeLinecap="round" />
      {leaves.map((l, i) => (
        <Yaprak key={i} x={x + (l.a < -90 ? -1 : 1)} y={l.y} a={l.a} L={l.L} s={0.95} seed={seed * 10 + i} />
      ))}
      <path d={truss} fill="none" stroke={STEM_D} strokeWidth={1.8} strokeLinecap="round" />
      {[
        [x + 16, ty + 2, 6.5],
        [x + 26, ty + 12, 7.5],
        [x + 34, ty + 22, 6],
      ].map(([cx, cy, rr], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy + rr} r={rr} fill="#86b346" stroke={LEAF_D} strokeWidth={0.8} />
          <path d={`M${cx - 3} ${cy + 1}l3 2 3 -2`} stroke={LEAF_D} strokeWidth={1} fill="none" />
        </g>
      ))}
      {[0, 1].map((i) => (
        <g key={`f${i}`} transform={`translate(${x + 44 + i * 6} ${ty + 30 + i * 6})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-3.2} rx={1.6} ry={3.2} fill="#e4c246" transform={`rotate(${a})`} />
          ))}
          <circle r={1.4} fill="#b48a1a" />
        </g>
      ))}
    </g>
  );
}

// ------------------------------------------------------------------ torba

function TorbaBoyuna() {
  const plants = [160, 360, 560];
  const bagTop = 340;
  const bagBot = 400;
  return (
    <g>
      {/* crop wire with the twine running up to it */}
      <path d="M20 40H700" stroke={INK} strokeWidth={2.4} />
      {plants.map((x) => (
        <g key={`t${x}`}>
          <path d={`M${x + 8} 40V${bagTop - 46}`} stroke={TWINE} strokeWidth={2} />
          <path d={`M${x + 2} 40c4 4 8 4 12 0`} stroke={INK} strokeWidth={1.2} fill="none" />
          <Break x={x + 8} y={92} />
          {/* the twine's spare length, wound on a hook at the foot of the plant */}
          <path d={`M${x + 8} ${bagTop - 46}c0 10 -10 12 -14 18`} stroke={TWINE} strokeWidth={2} fill="none" />
        </g>
      ))}
      {/* gutter, seen from the side, falling gently towards the right */}
      <path d={`M30 ${bagBot}L690 ${bagBot + 6}L690 ${bagBot + 42}L30 ${bagBot + 36}Z`} fill={STEEL} stroke={INK} strokeWidth={2} />
      <path d={`M40 ${bagBot + 30}L680 ${bagBot + 37}`} stroke={WATER} strokeWidth={4} strokeLinecap="round" />
      <path d={`M640 ${bagBot + 24}l26 3m-8 -7l8 7-9 5`} stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* the bag: white UV film round a slab of coir */}
      <rect x={60} y={bagTop} width={600} height={bagBot - bagTop} rx={14} fill="#fbfbf8" stroke={INK} strokeWidth={2.2} />
      <rect x={68} y={bagTop + 6} width={584} height={bagBot - bagTop - 12} rx={8} fill={COIR} />
      <Coir x={68} y={bagTop + 6} w={584} h={bagBot - bagTop - 12} seed={7} />
      {/* roots spread through the slab under each cube */}
      {plants.map((x, i) => (
        <Roots key={`r${x}`} x={x} y={bagTop + 4} spread={84} depth={46} n={22} seed={30 + i} />
      ))}
      {/* drainage slits in the underside near the low end, drops into the gutter */}
      {[600, 628].map((x) => (
        <g key={`d${x}`}>
          <rect x={x} y={bagBot - 3} width={16} height={5} fill={INK} />
          <path d={`M${x + 8} ${bagBot + 8}q-4 7 0 10q4 -3 0 -10`} fill={WATER} />
        </g>
      ))}
      {/* drip lateral along the bag, a dripper per plant, microtube to the stake */}
      <path d={`M24 ${bagTop - 8}H690`} stroke="#202320" strokeWidth={7} strokeLinecap="round" />
      {plants.map((x) => (
        <g key={`p${x}`}>
          <rect x={x + 30} y={bagTop - 14} width={12} height={12} rx={2} fill="#2e6f9e" stroke={INK} strokeWidth={1} />
          <path d={`M${x + 36} ${bagTop - 14}C${x + 40} ${bagTop - 40} ${x + 52} ${bagTop - 36} ${x + 34} ${bagTop - 30}`} stroke="#202320" strokeWidth={1.6} fill="none" />
          <path d={`M${x + 34} ${bagTop - 30}L${x + 22} ${bagTop + 2}`} stroke="#3a3d39" strokeWidth={3.4} strokeLinecap="round" />
        </g>
      ))}
      {/* the propagation cube sits on the slab, the plant in it */}
      {plants.map((x, i) => (
        <g key={`c${x}`}>
          <rect x={x - 30} y={bagTop - 40} width={60} height={40} fill="#8a6a45" stroke={INK} strokeWidth={1.6} />
          <Coir x={x - 30} y={bagTop - 40} w={60} h={40} seed={50 + i} />
          <Bitki x={x} seed={3 + i} base={bagTop - 40} top={128} />
          {/* stem clip on the twine */}
          <rect x={x - 2} y={226} width={14} height={9} rx={3} fill={CLIP} stroke={INK} strokeWidth={1.2} transform={`rotate(-8 ${x + 5} 230)`} />
        </g>
      ))}

      <Dim x1={60} y1={500} x2={660} y2={500} label={tr.cizim.torba.dims.bag} ext={60} />
      <Dim x1={160} y1={470} x2={360} y2={470} label={tr.cizim.torba.dims.plant} />
      <Dim x1={40} y1={bagTop} x2={40} y2={bagBot} label={tr.cizim.torba.dims.height} ext={18} />
      <text x={194} y={88} className="gd-svg-dim">
        {tr.cizim.torba.dims.wire}
      </text>

      <Num n={1} x={368} y={150} tx={420} ty={120} />
      <Num n={2} x={170} y={230} tx={230} ty={170} />
      <Num n={3} x={132} y={316} tx={96} ty={262} />
      <Num n={4} x={386} y={326} tx={440} ty={262} />
      <Num n={5} x={250} y={bagTop - 8} tx={270} ty={268} />
      <Num n={6} x={76} y={bagTop + 14} tx={18} ty={318} />
      <Num n={7} x={404} y={bagTop + 34} tx={452} ty={472} />
      <Num n={8} x={608} y={bagBot} tx={566} ty={bagBot + 66} />
      <Num n={9} x={90} y={bagBot + 26} tx={120} ty={bagBot + 66} />
    </g>
  );
}

function TorbaEnine() {
  const bagTop = 340;
  const bagBot = 400;
  const x = 150;
  return (
    <g>
      <circle cx={x + 8} cy={40} r={4} fill={INK} />
      <path d={`M${x + 8} 40V${bagTop - 46}`} stroke={TWINE} strokeWidth={2} />
      <Break x={x + 8} y={92} />
      {/* gutter profile on its stand */}
      <path d={`M${x - 80} ${bagBot - 6}L${x - 70} ${bagBot + 40}H${x + 70}L${x + 80} ${bagBot - 6}`} fill={STEEL} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x - 66} ${bagBot + 32}H${x + 66}`} stroke={WATER} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${x - 50} ${bagBot + 40}V${bagBot + 92}M${x + 50} ${bagBot + 40}V${bagBot + 92}`} stroke={INK} strokeWidth={3} />
      <path d={`M${x - 100} ${bagBot + 92}H${x + 100}`} stroke={INK} strokeWidth={1.4} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M${x - 96 + i * 26} ${bagBot + 92}l-10 10`} stroke={INK} strokeWidth={1} />
      ))}
      {/* bag in section: 20 cm wide, 10 cm high */}
      <rect x={x - 60} y={bagTop} width={120} height={bagBot - bagTop} rx={14} fill="#fbfbf8" stroke={INK} strokeWidth={2.2} />
      <rect x={x - 53} y={bagTop + 6} width={106} height={bagBot - bagTop - 12} rx={8} fill={COIR} />
      <Coir x={x - 53} y={bagTop + 6} w={106} h={bagBot - bagTop - 12} seed={9} />
      <Roots x={x} y={bagTop + 4} spread={44} depth={46} n={16} seed={41} />
      <rect x={x - 8} y={bagBot - 3} width={16} height={5} fill={INK} />
      {/* drip lateral end-on beside the cube, microtube and stake */}
      <circle cx={x - 46} cy={bagTop - 8} r={6} fill="#202320" />
      <path d={`M${x - 46} ${bagTop - 14}C${x - 46} ${bagTop - 44} ${x - 24} ${bagTop - 44} ${x - 22} ${bagTop - 30}`} stroke="#202320" strokeWidth={1.6} fill="none" />
      <path d={`M${x - 22} ${bagTop - 30}L${x - 14} ${bagTop + 2}`} stroke="#3a3d39" strokeWidth={3.4} strokeLinecap="round" />
      <rect x={x - 30} y={bagTop - 40} width={60} height={40} fill="#8a6a45" stroke={INK} strokeWidth={1.6} />
      <Coir x={x - 30} y={bagTop - 40} w={60} h={40} seed={53} />
      <Bitki x={x} seed={11} base={bagTop - 40} top={128} />
      <rect x={x - 2} y={226} width={14} height={9} rx={3} fill={CLIP} stroke={INK} strokeWidth={1.2} />

      <Dim x1={x - 60} y1={bagBot + 124} x2={x + 60} y2={bagBot + 124} label={tr.cizim.torba.dims.width} ext={124} />
      <Dim x1={x + 92} y1={bagTop} x2={x + 92} y2={bagBot} label={tr.cizim.torba.dims.height} ext={-26} right />

      <Num n={5} x={x - 46} y={bagTop - 8} tx={x - 98} ty={bagTop - 40} />
      <Num n={6} x={x - 58} y={bagTop + 30} tx={x - 112} ty={bagTop + 30} />
      <Num n={9} x={x + 74} y={bagBot + 14} tx={x + 118} ty={bagBot + 54} />
    </g>
  );
}

/** Same drawing twice with different frames: the wide one for desktop, a
 *  tighter crop for phones, so numbers and dimensions keep a readable size. */
function Svg2({ id, wide, narrow, title, desc, children }: { id: string; wide: string; narrow?: string; title: string; desc?: string; children: React.ReactNode }) {
  const one = (vb: string, k: string, cls: string) => (
    <svg viewBox={vb} className={`gd-svg ${cls}`} role="img" aria-labelledby={`${id}-${k}-t${desc ? ` ${id}-${k}-d` : ""}`}>
      <title id={`${id}-${k}-t`}>{title}</title>
      {desc && <desc id={`${id}-${k}-d`}>{desc}</desc>}
      {children}
    </svg>
  );
  if (!narrow) return one(wide, "w", "");
  return (
    <>
      {one(wide, "w", "gd-svg--wide")}
      {one(narrow, "n", "gd-svg--narrow")}
    </>
  );
}

function Legend({ parts, start = 1 }: { parts: string[]; start?: number }) {
  return (
    <ol className="gd-legend" start={start} aria-label={tr.cizim.legend}>
      {parts.map((p, i) => (
        <li key={p}>
          <span className="gd-legend-n gd-tnum" aria-hidden="true">
            {i + start}
          </span>
          {p}
        </li>
      ))}
    </ol>
  );
}

/** Grow bag in section, along and across: soilless tomato (Seralarımız). */
export function TorbaKesiti() {
  const t = tr.cizim.torba;
  return (
    <figure className="gd-plate gd-plate--torba">
      <div className="gd-plate-views">
        <div className="gd-plate-view gd-plate-view--long">
          <p className="gd-plate-cap">{t.long}</p>
          <Svg2 id="gd-torba-l" wide="-36 0 756 540" narrow="-30 0 500 540" title={t.title} desc={t.desc}>
            <TorbaBoyuna />
          </Svg2>
        </div>
        <div className="gd-plate-view gd-plate-view--cross">
          <p className="gd-plate-cap">{t.cross}</p>
          <Svg2 id="gd-torba-c" wide="0 0 330 540" title={`${t.title}: ${t.cross}`}>
            <TorbaEnine />
          </Svg2>
        </div>
      </div>
      <figcaption>
        <Legend parts={t.parts} />
        <p className="gd-note">{tr.cizim.note}</p>
      </figcaption>
    </figure>
  );
}

// ------------------------------------------------------------------ aşı

const SOIL_Y = 470;

function Plug({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 34} ${SOIL_Y - 2}L${x + 34} ${SOIL_Y - 2}L${x + 24} ${SOIL_Y + 86}L${x - 24} ${SOIL_Y + 86}Z`} fill={PEAT} stroke={INK} strokeWidth={1.6} />
      <Coir x={x - 28} y={SOIL_Y + 2} w={56} h={78} seed={x} />
    </g>
  );
}

function Soil() {
  return (
    <g>
      <rect x={0} y={SOIL_Y} width={380} height={140} fill="#e9dfcc" />
      <path d={`M0 ${SOIL_Y}H380`} stroke={INK} strokeWidth={1.4} strokeDasharray="8 6" />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={8 + ((i * 53) % 364)} cy={SOIL_Y + 12 + ((i * 37) % 118)} r={1.6 + (i % 3) * 0.5} fill="#cbb994" />
      ))}
    </g>
  );
}

function Asili() {
  const x = 190;
  const g = 404; // graft point, ≥ 3 cm above the planting line
  return (
    <g>
      <Soil />
      <Roots x={x} y={SOIL_Y + 60} spread={150} depth={70} n={28} seed={71} color="#8b6d46" width={2.2} />
      <Plug x={x} />
      <Roots x={x} y={SOIL_Y + 4} spread={22} depth={78} n={22} seed={72} width={1.8} />
      {/* rootstock stem up to the graft */}
      <path d={`M${x} ${SOIL_Y + 6}L${x} ${g + 6}`} stroke="#5d7f35" strokeWidth={9} strokeLinecap="round" />
      {/* scion: short stem, first true leaves, the topped stub and two shoots */}
      <path d={`M${x} ${g - 4}L${x + 1} 300`} stroke={STEM} strokeWidth={7.5} strokeLinecap="round" />
      <Yaprak x={x - 2} y={360} a={-168} L={74} seed={81} />
      <Yaprak x={x + 2} y={334} a={-14} L={70} seed={82} />
      {/* topped above the second leaf: the cut stub */}
      <path d={`M${x + 1} 300L${x + 1} 288`} stroke={STEM} strokeWidth={7} />
      <path d={`M${x - 6} 287L${x + 8} 287`} stroke="#b3261e" strokeWidth={2.4} />
      {/* two shoots from the leaf axils, each its own stem */}
      <path d={`M${x} 344C${x - 30} 320 ${x - 70} 250 ${x - 84} 110`} fill="none" stroke={STEM} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${x + 2} 318C${x + 30} 296 ${x + 68} 230 ${x + 80} 110`} fill="none" stroke={STEM} strokeWidth={6} strokeLinecap="round" />
      <Yaprak x={x - 46} y={278} a={-176} L={56} s={0.9} seed={83} />
      <Yaprak x={x - 70} y={196} a={-10} L={52} s={0.85} seed={84} />
      <Yaprak x={x - 80} y={140} a={-160} L={42} s={0.8} seed={85} />
      <Yaprak x={x + 46} y={262} a={-6} L={56} s={0.9} seed={86} />
      <Yaprak x={x + 68} y={190} a={-172} L={50} s={0.85} seed={87} />
      <Yaprak x={x + 77} y={136} a={-24} L={42} s={0.8} seed={88} />
      <path d={`M${x - 84} 110l-6 -14m6 14l7 -12`} stroke={STEM} strokeWidth={3} strokeLinecap="round" />
      <path d={`M${x + 80} 110l-6 -14m6 14l7 -12`} stroke={STEM} strokeWidth={3} strokeLinecap="round" />
      {/* silicone clip round the graft */}
      <rect x={x - 11} y={g - 14} width={22} height={30} rx={6} fill={CLIP} stroke={INK} strokeWidth={1.6} />
      <path d={`M${x} ${g - 12}V${g + 14}`} stroke={INK} strokeWidth={1} />
      <path d={`M${x - 16} ${g + 1}H${x + 16}`} stroke="#b3261e" strokeWidth={1.4} strokeDasharray="2 2" />

      <Dim x1={x - 44} y1={g + 1} x2={x - 44} y2={SOIL_Y} label={tr.cizim.asi.gap} ext={44} />
      <text x={372} y={SOIL_Y + 24} textAnchor="end" className="gd-svg-dim">
        {tr.cizim.asi.soil}
      </text>

      <Num n={1} x={x + 1} y={372} tx={x + 78} ty={354} />
      <Num n={2} x={x + 1} y={290} tx={x - 4} ty={236} />
      <Num n={3} x={x - 66} y={210} tx={x - 140} ty={244} />
      <Num n={4} x={x - 10} y={g - 8} tx={x - 74} ty={g - 40} />
      <Num n={5} x={x + 11} y={g + 1} tx={x + 70} ty={g + 6} />
      <Num n={6} x={x + 4} y={448} tx={x + 64} ty={450} />
      <Num n={7} x={x + 120} y={SOIL_Y + 100} tx={x + 150} ty={SOIL_Y + 52} />
      <Num n={8} x={x - 22} y={SOIL_Y + 60} tx={x - 96} ty={SOIL_Y + 58} />
    </g>
  );
}

function Asisiz() {
  const x = 190;
  return (
    <g>
      <Soil />
      <Roots x={x} y={SOIL_Y + 60} spread={70} depth={52} n={14} seed={91} color="#8b6d46" width={1.5} />
      <Plug x={x} />
      <Roots x={x} y={SOIL_Y + 4} spread={20} depth={78} n={16} seed={92} width={1.4} />
      <path d={`M${x} ${SOIL_Y + 6}C${x + 3} 380 ${x - 4} 220 ${x + 2} 96`} fill="none" stroke={STEM} strokeWidth={6.5} strokeLinecap="round" />
      {/* cotyledons */}
      <g transform={`translate(${x} 452)`}>
        <path d={leaflet(26, 7)} fill="#6aa23c" stroke={LEAF_D} strokeWidth={0.8} transform="rotate(-160)" />
        <path d={leaflet(26, 7)} fill="#6aa23c" stroke={LEAF_D} strokeWidth={0.8} transform="rotate(-20)" />
      </g>
      <Yaprak x={x - 1} y={400} a={-170} L={64} seed={93} />
      <Yaprak x={x + 1} y={344} a={-12} L={68} seed={94} />
      <Yaprak x={x - 1} y={282} a={-168} L={64} seed={95} />
      <Yaprak x={x + 1} y={222} a={-14} L={58} seed={96} />
      <Yaprak x={x} y={162} a={-162} L={46} s={0.85} seed={97} />
      <Yaprak x={x + 1} y={124} a={-30} L={36} s={0.8} seed={98} />
      <path d={`M${x + 2} 96l-6 -14m6 14l7 -12`} stroke={STEM} strokeWidth={3} strokeLinecap="round" />
      <text x={372} y={SOIL_Y + 24} textAnchor="end" className="gd-svg-dim">
        {tr.cizim.asi.soil}
      </text>
      <Num n={9} x={x + 2} y={300} tx={x + 96} ty={300} />
      <Num n={8} x={x + 22} y={SOIL_Y + 60} tx={x + 96} ty={SOIL_Y + 58} />
    </g>
  );
}

/** Grafted (two stems) beside ungrafted (one stem): the plate on Fidelik. */
export function AsiKarsilastirma() {
  const a = tr.cizim.asi;
  return (
    <figure className="gd-plate gd-plate--asi">
      <div className="gd-plate-views gd-plate-views--pair">
        <div className="gd-plate-view">
          <p className="gd-plate-cap">{a.grafted}</p>
          <Svg2 id="gd-asi-a" wide="0 70 380 540" title={`${a.title}: ${a.grafted}`} desc={a.desc}>
            <Asili />
          </Svg2>
        </div>
        <div className="gd-plate-view">
          <p className="gd-plate-cap">{a.plain}</p>
          <Svg2 id="gd-asi-b" wide="0 70 380 540" title={`${a.title}: ${a.plain}`}>
            <Asisiz />
          </Svg2>
        </div>
      </div>
      <figcaption>
        <Legend parts={a.parts} />
      </figcaption>
    </figure>
  );
}

// ------------------------------------------------------------------ ambalaj

const KRAFT = "#c9a46c";
const KRAFT_D = "#9c7a45";
const WOOD = "#d8bf8f";
const WOOD_D = "#a88a57";
const RED = "#c8372b";
const RED_D = "#8f2219";

/** A truss of tomatoes seen from above: a short vine and round fruit. */
function Salkim({ x, y, n = 5, r = 9, seed = 1 }: { x: number; y: number; n?: number; r?: number; seed?: number }) {
  const rr = rnd(seed);
  const fruit = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rr();
    const d = i === 0 ? 0 : r * 1.35;
    return [x + Math.cos(a) * d, y + Math.sin(a) * d] as const;
  });
  return (
    <g>
      <path d={`M${x - r * 2.2} ${y - r * 1.6}Q${x - r} ${y - r * 2.2} ${x} ${y - r * 0.4}`} stroke={STEM_D} strokeWidth={2} fill="none" />
      {fruit.map(([fx, fy], i) => (
        <g key={i}>
          <circle cx={f1(fx)} cy={f1(fy)} r={r} fill={RED} stroke={RED_D} strokeWidth={1} />
          <path d={`M${f1(fx - 3)} ${f1(fy - 1)}l3 -2 3 2`} stroke={LEAF_D} strokeWidth={1.4} fill="none" />
          <circle cx={f1(fx - r * 0.35)} cy={f1(fy - r * 0.35)} r={f1(r * 0.22)} fill="#fff" opacity={0.45} />
        </g>
      ))}
    </g>
  );
}

function AmbalajCizim() {
  const px = 40; // pallet left
  const base = 392; // floor line
  const k = 3; // units per cm
  const cols = 3;
  const kw = 40 * k; // carton face 40 cm
  const kh = 12 * k; // carton height 12 cm
  const layers = 7;
  const deck = 14.4 * k;
  const top = base - deck - layers * kh;
  const right = px + 120 * k;
  return (
    <g>
      <path d={`M10 ${base}H750`} stroke={INK} strokeWidth={1.4} />
      {/* Euro pallet, front: deck boards and three blocks */}
      <rect x={px} y={base - deck} width={120 * k} height={2.2 * k} fill={WOOD} stroke={WOOD_D} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={px + (i * (120 * k - 14.5 * k)) / 2} y={base - 12.2 * k} width={14.5 * k} height={7.8 * k} fill={WOOD} stroke={WOOD_D} />
      ))}
      <rect x={px} y={base - 4.4 * k} width={120 * k} height={2.2 * k} fill={WOOD} stroke={WOOD_D} />
      <rect x={px} y={base - 2.2 * k} width={120 * k} height={2.2 * k} fill={WOOD_D} />
      {/* cartons: seven layers, three faces each */}
      {Array.from({ length: layers }, (_, l) =>
        Array.from({ length: cols }, (_, c) => {
          const x = px + c * kw;
          const y = base - deck - (l + 1) * kh;
          return (
            <g key={`${l}-${c}`}>
              <rect x={x} y={y} width={kw} height={kh} fill={KRAFT} stroke={KRAFT_D} strokeWidth={1.2} />
              <rect x={x + kw / 2 - 9} y={y + kh / 2 - 4} width={18} height={8} rx={4} fill="#5a4426" opacity={0.8} />
            </g>
          );
        }),
      )}
      {/* corner boards and straps */}
      <rect x={px - 6} y={top} width={8} height={layers * kh} fill="#e8e2d2" stroke={INK} strokeWidth={1} />
      <rect x={right - 2} y={top} width={8} height={layers * kh} fill="#e8e2d2" stroke={INK} strokeWidth={1} />
      {[top + kh * 1.5, top + kh * 5.5].map((y) => (
        <rect key={y} x={px - 8} y={y} width={120 * k + 16} height={5} fill="#2e6f9e" opacity={0.9} />
      ))}
      {/* pallet label */}
      <rect x={px + kw + 14} y={top + kh * 2.2} width={kw - 28} height={kh * 1.6} fill="#fff" stroke={INK} strokeWidth={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${px + kw + 22} ${top + kh * 2.2 + 12 + i * 11}h${i === 0 ? 60 : 72 - i * 8}`} stroke={INK} strokeWidth={i === 0 ? 3 : 1.6} />
      ))}
      <Dim x1={px} y1={base + 26} x2={right} y2={base + 26} label="120 cm" ext={22} />
      <Dim x1={right + 34} y1={top} x2={right + 34} y2={base} label="≈ 2 m" ext={-30} right />

      {/* a carton from above, open: one layer of truss tomatoes */}
      <g transform="translate(500 40)">
        <rect x={0} y={0} width={200} height={150} fill={KRAFT} stroke={KRAFT_D} strokeWidth={2} />
        <rect x={8} y={8} width={184} height={134} fill="#efe4cc" stroke={KRAFT_D} />
        {[
          [44, 42],
          [100, 36],
          [156, 44],
          [46, 104],
          [102, 110],
          [154, 102],
        ].map(([x, y], i) => (
          <Salkim key={i} x={x} y={y} seed={20 + i} />
        ))}
        {[0, 1].map((i) => (
          <rect key={i} x={i ? 192 : -2} y={60} width={10} height={30} rx={5} fill="#5a4426" opacity={0.8} />
        ))}
        <Dim x1={0} y1={176} x2={200} y2={176} label="40 cm" />
        <Dim x1={222} y1={0} x2={222} y2={150} label="30 cm" ext={-18} right />
      </g>
      {/* punnets: 250 g and 500 g of cocktail tomatoes */}
      <g transform="translate(500 270)">
        {[
          { x: 0, w: 80, h: 58, n: 6, per: 3 },
          { x: 104, w: 104, h: 76, n: 12, per: 4 },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={0} width={p.w} height={p.h} rx={6} fill="#f4f7f8" stroke={INK} strokeWidth={1.4} />
            {Array.from({ length: p.n }, (_, j) => (
              <circle key={j} cx={p.x + 16 + (j % p.per) * ((p.w - 32) / (p.per - 1))} cy={16 + Math.floor(j / p.per) * 16} r={7.5} fill={RED} stroke={RED_D} />
            ))}
          </g>
        ))}
        <text x={40} y={82} textAnchor="middle" className="gd-svg-dim">
          250 g
        </text>
        <text x={156} y={100} textAnchor="middle" className="gd-svg-dim">
          500 g
        </text>
      </g>

      <Num n={1} x={px + kw * 2 + 30} y={base - deck - kh * 4.5} tx={right + 70} ty={top + kh * 3.1} />
      <Num n={2} x={520} y={300} tx={474} ty={330} />
      <Num n={3} x={right - 20} y={base - 8} tx={right + 70} ty={base - 18} />
      <Num n={4} x={px - 2} y={top + 20} tx={px + 26} ty={top - 26} />
      <Num n={5} x={right - 30} y={top + kh * 1.5 + 2} tx={right - 10} ty={top - 26} />
      <Num n={6} x={px + kw + 40} y={top + kh * 2.6} tx={px + kw + 10} ty={top - 26} />
      <Num n={7} x={502} y={114} tx={472} ty={150} />
    </g>
  );
}

/** Pack and load plate (Ürün ve ihracat). Sizes are examples. */
export function AmbalajPlakasi() {
  const a = tr.cizim.ambalaj;
  return (
    <figure className="gd-plate gd-plate--ambalaj">
      <div className="gd-plate-views gd-plate-views--one">
        <div className="gd-plate-view">
          <p className="gd-plate-cap">{a.cap}</p>
          <Svg2 id="gd-amb" wide="0 0 800 440" title={a.title} desc={a.desc}>
            <AmbalajCizim />
          </Svg2>
        </div>
      </div>
      <figcaption>
        <Legend parts={a.parts} />
        <p className="gd-note">{a.note}</p>
      </figcaption>
    </figure>
  );
}
