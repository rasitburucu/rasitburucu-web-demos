// Floor plan of one storey, drawn from the room rectangles in
// content/vaziyet/modeller.ts: walls are what is left between the rooms, so
// the drawing and the m² written in each room always agree. Front (entrance,
// road side) at the bottom, garden side at the top, outside dimensions.
import { odaAlan, type Kat, type Model } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";

const RENK = { gun: "#fbf8f0", islak: "#e4ecf3", servis: "#efe9dd", yatak: "#f6f3ec" };
const DUVAR = "#1f2b26";
const m1 = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const m2 = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function satirla(ad: string, genislik: number, fs: number) {
  const kar = 0.56 * fs; // rough average glyph width
  const sigan = Math.max(4, Math.floor((genislik - 0.25) / kar));
  if (ad.length <= sigan) return [ad];
  const kelime = ad.split(" ");
  const satir: string[] = [];
  let cur = "";
  for (const k of kelime) {
    if ((cur + " " + k).trim().length > sigan && cur) {
      satir.push(cur);
      cur = k;
    } else cur = (cur + " " + k).trim();
  }
  if (cur) satir.push(cur);
  return satir;
}

export function KatPlani({ m, kat, baslikId }: { m: Model; kat: Kat; baslikId?: string }) {
  const { w, d } = m;
  const Y = (y: number) => -y;
  const vb = { x: -1.9, y: -(d + 1.9), w: w + 3.1, h: d + 4.3 };
  const t = 0.1;
  return (
    <svg className="vz-katplani" viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} role="img" aria-labelledby={baslikId}>
      <defs>
        <marker id={`kp-ok-${m.id}`} viewBox="0 0 6 6" refX={3} refY={3} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0 0 L6 3 L0 6 Z" fill={DUVAR} />
        </marker>
      </defs>
      {/* walls: the whole footprint, rooms cut out of it */}
      <rect x={0} y={Y(d)} width={w} height={d} fill={DUVAR} />
      {kat.odalar.map((o, i) => (
        <rect
          key={i}
          x={o.x0}
          y={Y(o.y1)}
          width={o.x1 - o.x0}
          height={o.y1 - o.y0}
          fill={o.tur === "islak" ? RENK.islak : o.tur === "servis" ? RENK.servis : o.tur === "gun" ? RENK.gun : RENK.yatak}
        />
      ))}
      {/* stairs */}
      {kat.merdiven && (
        <g stroke={DUVAR} strokeWidth={0.025}>
          {Array.from({ length: Math.floor((kat.merdiven.y1 - kat.merdiven.y0) / 0.27) + 1 }, (_, i) => (
            <line key={i} x1={kat.merdiven!.x0} x2={kat.merdiven!.x1} y1={Y(kat.merdiven!.y0 + i * 0.27)} y2={Y(kat.merdiven!.y0 + i * 0.27)} />
          ))}
          <line
            x1={(kat.merdiven.x0 + kat.merdiven.x1) / 2}
            x2={(kat.merdiven.x0 + kat.merdiven.x1) / 2}
            y1={Y(kat.merdiven.y0 + 0.15)}
            y2={Y(kat.merdiven.y1 - 0.2)}
            markerEnd={`url(#kp-ok-${m.id})`}
          />
        </g>
      )}
      {/* windows: white glazing lines inside the outer walls */}
      {kat.pencereler.map((p, i) => {
        const tt = 0.15;
        const r =
          p.duvar === "on"
            ? { x: p.a, y: Y(tt), w: p.b - p.a, h: tt, yatay: true }
            : p.duvar === "arka"
              ? { x: p.a, y: Y(d), w: p.b - p.a, h: tt, yatay: true }
              : p.duvar === "sol"
                ? { x: 0, y: Y(p.b), w: tt, h: p.b - p.a, yatay: false }
                : { x: w - tt, y: Y(p.b), w: tt, h: p.b - p.a, yatay: false };
        return (
          <g key={i}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="#fff" stroke={DUVAR} strokeWidth={0.02} />
            {r.yatay ? (
              <line x1={r.x} x2={r.x + r.w} y1={r.y + r.h / 2} y2={r.y + r.h / 2} stroke={DUVAR} strokeWidth={0.02} />
            ) : (
              <line x1={r.x + r.w / 2} x2={r.x + r.w / 2} y1={r.y} y2={r.y + r.h} stroke={DUVAR} strokeWidth={0.02} />
            )}
          </g>
        );
      })}
      {/* doors: an opening in the wall, the leaf and its swing */}
      {kat.kapilar.map((k, i) => {
        if (k.eksen === "x") {
          const y0 = k.dis ? 0 : k.y - t / 2;
          const y1 = k.dis ? 0.15 : k.y + t / 2;
          const hy = k.dis ? 0.15 : k.y + (k.s > 0 ? t / 2 : -t / 2);
          const uc = hy + k.s * k.w;
          return (
            <g key={i}>
              <rect x={k.x} y={Y(y1)} width={k.w} height={y1 - y0} fill={RENK.gun} />
              {!k.acik && (
                <>
                  <line x1={k.x} y1={Y(hy)} x2={k.x} y2={Y(uc)} stroke={DUVAR} strokeWidth={0.04} />
                  <path d={`M${k.x} ${Y(uc)} A${k.w} ${k.w} 0 0 ${k.s > 0 ? 1 : 0} ${k.x + k.w} ${Y(hy)}`} fill="none" stroke={DUVAR} strokeWidth={0.018} />
                </>
              )}
            </g>
          );
        }
        const x0 = k.x - t / 2;
        const hx = k.x + (k.s > 0 ? t / 2 : -t / 2);
        const uc = hx + k.s * k.w;
        return (
          <g key={i}>
            <rect x={x0} y={Y(k.y + k.w)} width={t} height={k.w} fill={RENK.gun} />
            {!k.acik && (
              <>
                <line x1={hx} y1={Y(k.y)} x2={uc} y2={Y(k.y)} stroke={DUVAR} strokeWidth={0.04} />
                <path d={`M${uc} ${Y(k.y)} A${k.w} ${k.w} 0 0 ${k.s > 0 ? 0 : 1} ${hx} ${Y(k.y + k.w)}`} fill="none" stroke={DUVAR} strokeWidth={0.018} />
              </>
            )}
          </g>
        );
      })}
      {/* room names and areas */}
      {kat.odalar.map((o, i) => {
        const st = kat.merdiven;
        const serbest = st && st.x0 >= o.x0 - 0.05 && st.x1 <= o.x1 + 0.05 && st.y1 <= o.y1 + 0.05 && st.y0 >= o.y0 - 0.05 ? o.x1 - st.x1 : 0;
        const gw = serbest > 1.4 ? serbest : o.x1 - o.x0;
        const zemin = o.tur === "islak" ? RENK.islak : o.tur === "servis" ? RENK.servis : o.tur === "gun" ? RENK.gun : RENK.yatak;
        const gh = o.y1 - o.y0;
        const fs = Math.min(0.34, Math.max(0.2, gw / 6.2));
        const satir = satirla(o.ad, gw, fs);
        // keep the label clear of the stairs and of door swings that open into this room
        const mr = kat.merdiven;
        const merdivenli = mr && mr.x0 >= o.x0 - 0.05 && mr.x1 <= o.x1 + 0.05 && mr.y0 >= o.y0 - 0.05 && mr.y1 <= o.y1 + 0.05;
        let cx = merdivenli && o.x1 - mr.x1 > 1.4 ? (mr.x1 + o.x1) / 2 : (o.x0 + o.x1) / 2;
        let cy = (o.y0 + o.y1) / 2;
        for (const k of kat.kapilar) {
          if (k.acik) continue;
          if (k.eksen === "y" && k.y >= o.y0 - 0.05 && k.y + k.w <= o.y1 + 0.05) {
            if (Math.abs(k.x - o.x0) < 0.12 && k.s > 0) cx += k.w * 0.45;
            if (Math.abs(k.x - o.x1) < 0.12 && k.s < 0) cx -= k.w * 0.45;
          }
          if (k.eksen === "x" && k.x >= o.x0 - 0.05 && k.x + k.w <= o.x1 + 0.05) {
            if ((Math.abs(k.y - o.y0) < 0.12 || (k.dis && o.y0 < 0.2)) && k.s > 0) cy += k.w * 0.4;
            if (Math.abs(k.y - o.y1) < 0.12 && k.s < 0) cy -= k.w * 0.4;
          }
        }
        const ust = cy + ((satir.length - 1) * fs * 1.15) / 2 + fs * 0.5;
        if (gh < fs * (satir.length + 1.4)) return null;
        return (
          <text
            key={i}
            x={cx}
            y={Y(ust)}
            textAnchor="middle"
            className="vz-katplani-yazi"
            fontSize={fs}
            stroke={zemin}
            strokeWidth={fs * 0.32}
            strokeLinejoin="round"
            paintOrder="stroke"
          >
            {satir.map((s, j) => (
              <tspan key={j} x={cx} dy={j === 0 ? 0 : fs * 1.15}>
                {s}
              </tspan>
            ))}
            <tspan x={cx} dy={fs * 1.3} className="vz-katplani-m2" fontSize={fs * 0.9}>
              {m2(odaAlan(o))} m²
            </tspan>
          </text>
        );
      })}
      {/* outside dimensions */}
      <g stroke={DUVAR} strokeWidth={0.025} fill="none">
        <line x1={0} y1={Y(-0.75)} x2={w} y2={Y(-0.75)} markerStart={`url(#kp-ok-${m.id})`} markerEnd={`url(#kp-ok-${m.id})`} />
        <line x1={0} y1={Y(-0.35)} x2={0} y2={Y(-0.95)} />
        <line x1={w} y1={Y(-0.35)} x2={w} y2={Y(-0.95)} />
        <line x1={-0.75} y1={Y(0)} x2={-0.75} y2={Y(d)} markerStart={`url(#kp-ok-${m.id})`} markerEnd={`url(#kp-ok-${m.id})`} />
        <line x1={-0.35} y1={Y(0)} x2={-0.95} y2={Y(0)} />
        <line x1={-0.35} y1={Y(d)} x2={-0.95} y2={Y(d)} />
      </g>
      <text x={w / 2} y={Y(-1.25)} textAnchor="middle" className="vz-katplani-olcu" fontSize={0.34}>
        {m1(w)} m
      </text>
      <text x={-1.25} y={Y(d / 2)} textAnchor="middle" className="vz-katplani-olcu" fontSize={0.34} transform={`rotate(-90 ${-1.25} ${Y(d / 2)})`}>
        {m1(d)} m
      </text>
      <text x={w / 2} y={Y(-1.85)} textAnchor="middle" className="vz-katplani-not" fontSize={0.3}>
        ↓ {tr.model.yolTarafi}
      </text>
      <text x={w / 2} y={Y(d + 0.55)} textAnchor="middle" className="vz-katplani-not" fontSize={0.3}>
        ↑ {tr.model.bahceTarafi}
      </text>
    </svg>
  );
}
