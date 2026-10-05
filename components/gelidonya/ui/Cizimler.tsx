import { tr } from "@/content/gelidonya/tr";

const INK = "#111311";

/** Labelled leader line: dot on the part, line to the label. */
function Etiket({ x, y, tx, ty, text, anchor = "start" }: { x: number; y: number; tx: number; ty: number; text: string; anchor?: "start" | "end" }) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.5" fill={INK} />
      <path d={`M${x} ${y} L${tx} ${ty}`} stroke={INK} strokeWidth="1.5" fill="none" />
      <text x={anchor === "start" ? tx + 6 : tx - 6} y={ty + 5} textAnchor={anchor} className="gd-svg-label">
        {text}
      </text>
    </g>
  );
}

/** Grow bag in section: soilless tomato, as on the Seralarımız page. */
export function TorbaKesiti() {
  const t = tr.cizim.torba;
  const stem = (x: number) => (
    <g key={x}>
      <path d={`M${x} 196 C ${x - 4} 150, ${x + 6} 100, ${x} 30`} stroke="#2f6b1a" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* lower leaves taken off, trusses left */}
      <path d={`M${x} 150 q 22 6 30 26`} stroke="#2f6b1a" strokeWidth="2.5" fill="none" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={x + 20 + (i % 2) * 12} cy={160 + i * 9} r="7.5" fill="#B3261E" />
      ))}
      <path d={`M${x} 92 q -26 4 -34 22`} stroke="#2f6b1a" strokeWidth="2.5" fill="none" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x - 26 - (i % 2) * 10} cy={104 + i * 9} r="6.5" fill="#7DA83A" />
      ))}
      <path d={`M${x} 30 L ${x + 4} 0`} stroke="#B9B39F" strokeWidth="1.5" />
    </g>
  );
  return (
    <svg viewBox="0 0 640 380" className="gd-svg" role="img" aria-labelledby="gd-torba-t gd-torba-d">
      <title id="gd-torba-t">{t.title}</title>
      <desc id="gd-torba-d">{t.desc}</desc>
      {/* gutter */}
      <path d="M40 262 L600 262 L586 300 L54 300 Z" fill="#BEC2BB" stroke={INK} strokeWidth="2" />
      {/* bag */}
      <rect x="70" y="196" width="500" height="66" rx="10" fill="#F7F7F4" stroke={INK} strokeWidth="2.5" />
      <rect x="80" y="206" width="480" height="48" rx="6" fill="#8A6A45" />
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={86 + ((i * 53) % 470)} cy={210 + ((i * 29) % 40)} r={1.4 + (i % 3) * 0.5} fill="#C9B48E" />
      ))}
      {/* drainage slit and drop */}
      <rect x="470" y="258" width="34" height="6" fill={INK} />
      <path d="M487 270 q -6 10 0 14 q 6 -4 0 -14" fill="#5E8FB8" />
      {/* drip line and stakes */}
      <path d="M40 186 L600 186" stroke={INK} strokeWidth="5" />
      {[205, 395].map((x) => (
        <g key={x}>
          <path d={`M${x + 34} 186 C ${x + 34} 196, ${x + 22} 200, ${x + 22} 214`} stroke={INK} strokeWidth="2" fill="none" />
          <path d={`M${x + 22} 214 L${x + 22} 238`} stroke="#B3261E" strokeWidth="4" />
        </g>
      ))}
      {[205, 395].map((x) => stem(x))}
      <Etiket x={590} y={186} tx={612} ty={150} text={t.drip} anchor="end" />
      <Etiket x={227} y={230} tx={196} ty={322} text={t.stake} anchor="end" />
      <Etiket x={330} y={236} tx={330} ty={322} text={t.coir} />
      <Etiket x={487} y={262} tx={500} ty={322} text={t.drain} />
      <Etiket x={66} y={292} tx={22} ty={356} text={t.gutter} />
      <Etiket x={409} y={10} tx={470} ty={22} text={t.twine} />
    </svg>
  );
}

/** A grafted seedling: scion on rootstock, held by a clip (Fidelik page). */
export function AsiNoktasi() {
  const t = tr.cizim.asi;
  return (
    <svg viewBox="0 0 520 420" className="gd-svg" role="img" aria-labelledby="gd-asi-t gd-asi-d">
      <title id="gd-asi-t">{t.title}</title>
      <desc id="gd-asi-d">{t.desc}</desc>
      {/* plug of peat */}
      <path d="M200 300 L320 300 L308 392 L212 392 Z" fill="#4A3826" stroke={INK} strokeWidth="2" />
      {Array.from({ length: 28 }, (_, i) => (
        <circle key={i} cx={214 + ((i * 37) % 92)} cy={308 + ((i * 23) % 78)} r="1.8" fill="#E9E5D8" />
      ))}
      {/* roots */}
      {[-30, -12, 8, 26].map((d, i) => (
        <path key={i} d={`M260 300 q ${d} 30 ${d * 1.4} 80`} stroke="#EDE7D6" strokeWidth="2.5" fill="none" />
      ))}
      {/* rootstock stem */}
      <path d="M260 300 L260 214" stroke="#5B7F3A" strokeWidth="11" strokeLinecap="round" />
      {/* clip */}
      <rect x="242" y="196" width="36" height="26" rx="5" fill="#F2A516" stroke={INK} strokeWidth="2" />
      <path d="M248 209 L272 209" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      {/* scion stem and leaves */}
      <path d="M260 200 L262 70" stroke="#3F8F1F" strokeWidth="9" strokeLinecap="round" />
      {[
        { y: 150, s: 1, l: 120 },
        { y: 112, s: -1, l: 110 },
        { y: 80, s: 1, l: 80 },
      ].map((lf, i) => (
        <g key={i}>
          <path d={`M261 ${lf.y} q ${lf.s * lf.l * 0.5} -26 ${lf.s * lf.l} -8`} stroke="#3F8F1F" strokeWidth="3" fill="none" />
          {[0.35, 0.65, 0.95].map((u) => (
            <ellipse key={u} cx={261 + lf.s * lf.l * u} cy={lf.y - 18 * Math.sin(u * 2.4) - 6} rx="17" ry="8" fill="#4E8F2A" transform={`rotate(${lf.s * -18} ${261 + lf.s * lf.l * u} ${lf.y - 18 * Math.sin(u * 2.4) - 6})`} />
          ))}
        </g>
      ))}
      <ellipse cx="262" cy="62" rx="12" ry="9" fill="#7DB84E" />
      <Etiket x={300} y={120} tx={392} ty={92} text={t.scion} />
      <Etiket x={278} y={209} tx={392} ty={209} text={t.clip} />
      <Etiket x={260} y={262} tx={150} ty={262} text={t.root} anchor="end" />
      <Etiket x={226} y={350} tx={150} ty={350} text={t.plug} anchor="end" />
    </svg>
  );
}

/** Schematic map of the way to the nursery (İletişim): mountains, shore, the
 *  D400 between Finike and Kumluca, the nursery road. Not traced from a map. */
export function HaritaKesiti() {
  const l = tr.iletisim.mapLabels;
  const BENCH = "#bec2bb";
  return (
    <svg viewBox="0 0 420 330" className="gd-svg" role="img" aria-labelledby="gd-map-t">
      <title id="gd-map-t">{tr.iletisim.mapAlt}</title>
      {/* sea, below the shore */}
      <path d="M0 262 C 70 250, 120 276, 190 266 S 330 240, 420 254 L420 330 L0 330 Z" fill="#dfe3e4" />
      {[282, 298, 314].map((y) => (
        <path key={y} d={`M${20 + (y % 3) * 14} ${y} h46 M${150 - (y % 5) * 6} ${y + 2} h40 M${290 + (y % 4) * 8} ${y - 2} h52`} stroke="#9ea39b" strokeWidth="1.5" />
      ))}
      <path d="M0 262 C 70 250, 120 276, 190 266 S 330 240, 420 254" fill="none" stroke={INK} strokeWidth="2" />
      {/* mountains: contour bands on the left and along the top */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M0 ${200 - i * 34} C ${40 + i * 6} ${150 - i * 30}, ${70 + i * 10} ${70 - i * 18}, ${150 - i * 14} ${40 - i * 12} S ${300 - i * 20} ${18 - i * 8}, 420 ${30 - i * 10}`}
          fill="none"
          stroke={BENCH}
          strokeWidth="2"
        />
      ))}
      {/* greenhouse blocks on the plain */}
      {[
        [120, 150], [150, 172], [214, 140], [246, 160], [300, 150], [330, 188], [180, 212], [262, 214], [360, 140], [92, 204],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="24" height="15" fill="none" stroke={BENCH} strokeWidth="1.5" />
      ))}
      {/* D400: Finike (left) to Kumluca and on to Antalya */}
      <path d="M0 236 C 80 228, 150 238, 214 226 S 330 196, 420 176" fill="none" stroke={INK} strokeWidth="6" />
      <path d="M0 236 C 80 228, 150 238, 214 226 S 330 196, 420 176" fill="none" stroke="#f3f4f1" strokeWidth="2" strokeDasharray="7 7" />
      {/* Kumluca */}
      <rect x="312" y="186" width="44" height="30" fill={INK} />
      <text x="334" y="236" textAnchor="middle" className="gd-svg-label">{l.town}</text>
      {/* the nursery road and the nursery */}
      <path d="M232 222 C 232 190, 214 166, 196 112" fill="none" stroke={INK} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
      <rect x="178" y="88" width="36" height="26" fill={INK} />
      <rect x="184" y="94" width="24" height="14" fill="none" stroke="#f3f4f1" strokeWidth="2" />
      <text x="222" y="98" className="gd-svg-label">{l.nursery}</text>
      <text x="8" y="214" className="gd-svg-label">← {l.finike}</text>
      <text x="412" y="152" textAnchor="end" className="gd-svg-label">{l.antalya} →</text>
      <text x="120" y="246" className="gd-svg-label" fill="#454a44">{l.road}</text>
      <text x="210" y="300" textAnchor="middle" className="gd-svg-label" fill="#454a44">{l.sea}</text>
    </svg>
  );
}
