"use client";

// The bird's-eye plan of the plot: cork plot on the green cutting mat, the
// darker setback strip, the dashed buildable line, the grey road, sponge
// trees, the cobalt house with its ridge, the living-room arrow and the north
// arrow. Overflowing parts of the house turn red with the metres they cross.
// The same drawing serves the home check (draggable), the quote summary and
// the printable sheet (`tur="pafta"`: white paper, distances to the
// boundaries, no mat).
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { snap, plotaSigdir, type Durum, type Sonuc } from "@/lib/vaziyet/hesap";
import { tr } from "@/content/vaziyet/tr";

type Props = {
  durum: Durum;
  sonuc: Sonuc;
  tur?: "arac" | "kucuk" | "pafta" | "bos";
  etkilesim?: boolean;
  onTasi?: (x: number, y: number) => void;
  onCevir?: () => void;
  /** changes whenever the house should land again (model or turn) */
  inis?: string;
  className?: string;
  baslikId?: string;
};

const c = tr.arac.cizim;
const K = {
  matCizgi: "#2a6251",
  matAna: "#3a7562",
  yol: "#8c9996",
  yolKenar: "#5f6a67",
  yolCizgi: "#e8eeec",
  mantar: "#c89b68",
  mantarNokta: "#b3854f",
  mantarAcik: "#dcb98b",
  mantarKenar: "#7a5530",
  serit: "rgba(110, 74, 38, 0.42)",
  sinir: "#fff4e0",
  tas: "#3157d5",
  tasKenar: "#0f205e",
  mahya: "#9db2ff",
  kirmizi: "#e5392d",
  etiket: "#fff4e0",
  hale: "rgba(40, 24, 8, 0.62)",
  agac: "#3e8a4e",
  agacIsik: "#5ba86a",
};

export function Plan({ durum, sonuc, tur = "arac", etkilesim = false, onTasi, onCevir, inis, className, baslikId }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [px, setPx] = useState(tur === "pafta" ? 700 : 820);
  const [odak, setOdak] = useState(false);
  const [surukluyor, setSurukluyor] = useState(false);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { W, D } = durum;
  const { b, ev, m, tasmalar, kuzey, salonN, salonYon } = sonuc;
  const pafta = tur === "pafta";
  const evVar = tur !== "bos";

  // viewBox: plot, road, the north arrow column; the sheet adds dimension lines
  const vb = useMemo(() => {
    const sol = pafta ? -4.2 : -1.6;
    const sag = W + (pafta ? 6.2 : 5.2);
    const ust = D + (pafta ? 3.4 : 1.6);
    const alt = pafta ? -9.4 : -8.2;
    return { x: sol, y: -ust, w: sag - sol, h: ust - alt };
  }, [W, D, pafta]);

  // keep labels about 12.5 px on screen (scaled with the root font on large screens) whatever the plot size
  const [kok, setKok] = useState(16);
  useEffect(() => {
    const el = svgRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setPx(Math.min(r.width / vb.w, r.height / vb.h) * vb.w);
      setKok(parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [vb.w, vb.h]);

  const ppu = px / vb.w; // screen px per metre
  const fs = Math.min(Math.max(((pafta ? 10.5 : 12.5) * (kok / 16)) / ppu, 0.32), 2.4);
  const hale = fs * 0.24;

  // ------------------------------------------------------------------ drag
  const bas = useRef<{ x: number; y: number; ex: number; ey: number; id: number } | null>(null);
  const dunyaNoktasi = useCallback((e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: -p.y };
  }, []);

  const onDown = (e: React.PointerEvent<SVGGElement>) => {
    if (!etkilesim || !onTasi) return;
    const p = dunyaNoktasi(e);
    if (!p) return;
    e.preventDefault();
    (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
    bas.current = { x: p.x, y: p.y, ex: ev.x0, ey: ev.y0, id: e.pointerId };
    setSurukluyor(true);
  };
  const onMove = (e: React.PointerEvent<SVGGElement>) => {
    const s = bas.current;
    if (!s || s.id !== e.pointerId || !onTasi) return;
    const p = dunyaNoktasi(e);
    if (!p) return;
    const [nx, ny] = plotaSigdir(s.ex + snap(p.x - s.x), s.ey + snap(p.y - s.y), sonuc.w, sonuc.d, W, D);
    if (Math.abs(nx - ev.x0) > 1e-6 || Math.abs(ny - ev.y0) > 1e-6) onTasi(nx, ny);
  };
  const onUp = (e: React.PointerEvent<SVGGElement>) => {
    if (bas.current?.id === e.pointerId) bas.current = null;
    setSurukluyor(false);
  };
  const onKey = (e: React.KeyboardEvent<SVGGElement>) => {
    if (!etkilesim) return;
    const adim: Record<string, [number, number]> = { ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, 0.5], ArrowDown: [0, -0.5] };
    const a = adim[e.key];
    if (a && onTasi) {
      e.preventDefault();
      const [nx, ny] = plotaSigdir(ev.x0 + a[0], ev.y0 + a[1], sonuc.w, sonuc.d, W, D);
      onTasi(nx, ny);
    } else if ((e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "r") && onCevir) {
      e.preventDefault();
      onCevir();
    }
  };

  // ------------------------------------------------------------------ helpers
  const Y = (y: number) => -y;
  const rect = (r: { x0: number; y0: number; x1: number; y1: number }) => ({ x: r.x0, y: Y(r.y1), width: Math.max(0, r.x1 - r.x0), height: Math.max(0, r.y1 - r.y0) });
  const yazi = (x: number, y: number, s: string, o: { renk?: string; anchor?: "start" | "middle" | "end"; boy?: number; kalin?: number; hale?: string; key?: string; rot?: number } = {}) => (
    <text
      key={o.key ?? `${s}-${x}-${y}`}
      x={x}
      y={Y(y)}
      fontSize={(o.boy ?? 1) * fs}
      fill={o.renk ?? (pafta ? "#13201b" : K.etiket)}
      textAnchor={o.anchor ?? "middle"}
      dominantBaseline="central"
      fontWeight={o.kalin ?? 650}
      stroke={o.hale ?? (pafta ? "#fff" : K.hale)}
      strokeWidth={hale}
      strokeLinejoin="round"
      paintOrder="stroke"
      transform={o.rot ? `rotate(${o.rot} ${x} ${Y(y)})` : undefined}
      className="vz-plan-yazi"
    >
      {s}
    </text>
  );

  // trees: sponge balls near the corners, never on the house
  const agaclar = useMemo(() => {
    if (pafta || W < 9 || D < 9) return [];
    const r = 1.1;
    const aday: [number, number][] = [
      [1.9, D - 1.9],
      [W - 1.9, D - 2.3],
      [1.7, 2.0],
      [W - 1.7, 2.6],
      [W / 2 + 0.3, D - 1.6],
    ];
    return aday.filter(([x, y]) => !evVar || !(x + r > ev.x0 - 0.6 && x - r < ev.x1 + 0.6 && y + r > ev.y0 - 0.6 && y - r < ev.y1 + 0.6)).slice(0, 4);
  }, [W, D, ev, pafta, evVar]);

  // living-room arrow: from the middle of the garden-side facade outward
  const salon = useMemo(() => {
    if (!evVar) return null;
    const [nx, ny] = salonN;
    const cx = (ev.x0 + ev.x1) / 2;
    const cy = (ev.y0 + ev.y1) / 2;
    const ex = cx + (nx * (ev.x1 - ev.x0)) / 2;
    const ey = cy + (ny * (ev.y1 - ev.y0)) / 2;
    // room to the plot edge in that direction
    const bosluk = nx > 0 ? W - ev.x1 : nx < 0 ? ev.x0 : ny > 0 ? D - ev.y1 : ev.y0;
    const boy = Math.min(Math.max(bosluk - 0.9, 1.4), 3.6);
    return { x1: ex + nx * 0.5, y1: ey + ny * 0.5, x2: ex + nx * (0.5 + boy), y2: ey + ny * (0.5 + boy), nx, ny };
  }, [ev, salonN, W, D, evVar]);

  const kuzeyKonum = { x: W + 2.7, y: D - 2.0 };
  const yerYok = !sonuc.alanVar;
  const paftaCizgi = "#13201b";

  return (
    <svg
      ref={svgRef}
      className={`vz-plan vz-plan--${tur} ${surukluyor ? "is-surukle" : ""} ${className ?? ""}`}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      preserveAspectRatio="xMidYMid meet"
      role={etkilesim ? "group" : "img"}
      aria-labelledby={baslikId ? `${baslikId} ${uid}-d` : `${uid}-t ${uid}-d`}
    >
      {!baslikId && <title id={`${uid}-t`}>{tr.arac.svgBaslik}</title>}
      <desc id={`${uid}-d`}>{tr.arac.svgOzet(W, D, `${m.ad} ${m.m2}`, sonuc.sigar)}</desc>
      <defs>
        <pattern id={`${uid}-mat`} width={5} height={5} patternUnits="userSpaceOnUse" x={0} y={0}>
          {[1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line x1={i} y1={0} x2={i} y2={5} stroke={K.matCizgi} strokeWidth={0.035} />
              <line x1={0} y1={i} x2={5} y2={i} stroke={K.matCizgi} strokeWidth={0.035} />
            </g>
          ))}
          <line x1={0} y1={0} x2={0} y2={5} stroke={K.matAna} strokeWidth={0.07} />
          <line x1={0} y1={0} x2={5} y2={0} stroke={K.matAna} strokeWidth={0.07} />
        </pattern>
        <pattern id={`${uid}-mantar`} width={1.1} height={1.1} patternUnits="userSpaceOnUse">
          <rect width={1.1} height={1.1} fill={pafta ? "#efe2cf" : K.mantar} />
          {!pafta &&
            [
              [0.2, 0.3, 0.07],
              [0.7, 0.15, 0.05],
              [0.5, 0.7, 0.06],
              [0.9, 0.85, 0.05],
              [0.15, 0.9, 0.04],
              [0.85, 0.45, 0.04],
            ].map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={K.mantarNokta} />)}
          {!pafta &&
            [
              [0.35, 0.5, 0.04],
              [0.62, 0.92, 0.04],
              [0.05, 0.55, 0.03],
            ].map(([x, y, r]) => <circle key={`a${x}${y}`} cx={x} cy={y} r={r} fill={K.mantarAcik} />)}
        </pattern>
        <pattern id={`${uid}-kir`} width={0.6} height={0.6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={0.6} height={0.6} fill={K.kirmizi} />
          <line x1={0} y1={0} x2={0} y2={0.6} stroke="#ffd0cb" strokeWidth={0.13} />
        </pattern>
        <pattern id={`${uid}-serit`} width={0.5} height={0.5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={0.5} stroke="#9e7445" strokeWidth={0.06} />
        </pattern>
        <marker id={`${uid}-ok`} viewBox="0 0 6 6" refX={3} refY={3} markerWidth={3.4} markerHeight={3.4} orient="auto-start-reverse">
          <path d="M0 0 L6 3 L0 6 Z" fill={pafta ? paftaCizgi : K.etiket} />
        </marker>
        <marker id={`${uid}-ok2`} viewBox="0 0 6 6" refX={3} refY={3} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0 0 L6 3 L0 6 Z" fill={pafta ? paftaCizgi : "#f3f6f2"} />
        </marker>
        <marker id={`${uid}-ucK`} viewBox="0 0 6 6" refX={3} refY={3} markerWidth={2.6} markerHeight={2.6} orient="auto-start-reverse">
          <path d="M0 0 L6 3 L0 6 Z" fill={pafta ? "#b42318" : "#fff"} />
        </marker>
      </defs>

      {/* cutting mat */}
      {!pafta && <rect x={vb.x - 2} y={vb.y - 2} width={vb.w + 4} height={vb.h + 4} fill={`url(#${uid}-mat)`} />}

      {/* road: grey card with a dashed centre line */}
      <rect
        x={-1.2}
        y={Y(-0.45)}
        width={W + 2.4}
        height={6.75}
        fill={pafta ? "#e4e7e6" : K.yol}
        stroke={pafta ? "#9aa3a1" : K.yolKenar}
        strokeWidth={0.08}
        rx={0.15}
      />
      <line x1={-0.6} y1={Y(-3.8)} x2={W + 0.6} y2={Y(-3.8)} stroke={pafta ? "#9aa3a1" : K.yolCizgi} strokeWidth={0.12} strokeDasharray="1.2 1" />
      {yazi(W / 2, -2.1, c.cephe(W), { boy: 1, key: "cephe", renk: pafta ? "#13201b" : "#f3f6f2", hale: "rgba(40,48,46,.7)" })}

      {/* plot: cork board with a visible edge */}
      <rect {...rect({ x0: 0, y0: 0, x1: W, y1: D })} fill={`url(#${uid}-mantar)`} stroke={pafta ? paftaCizgi : K.mantarKenar} strokeWidth={pafta ? 0.12 : 0.1} />
      {/* setback strip and the buildable line */}
      {sonuc.alanVar ? (
        <>
          <path
            d={`M0 ${Y(0)} H${W} V${Y(D)} H0 Z M${b.x0} ${Y(b.y0)} V${Y(b.y1)} H${b.x1} V${Y(b.y0)} Z`}
            fill={pafta ? `url(#${uid}-serit)` : K.serit}
            fillRule="evenodd"
          />
          <rect {...rect(b)} fill="none" stroke={pafta ? paftaCizgi : K.sinir} strokeWidth={pafta ? 0.07 : 0.09} strokeDasharray={pafta ? "0.45 0.3" : "0.5 0.3"} />
        </>
      ) : (
        <rect {...rect({ x0: 0, y0: 0, x1: W, y1: D })} fill={K.serit} />
      )}

      {/* setback labels, only where the strip is wide enough to hold them */}
      {/* the living-room arrow owns one strip; that strip's label steps aside */}
      {sonuc.alanVar && b.y0 > fs * 1.5 && yazi(pafta ? W * 0.72 : evVar && salonN[1] < 0 ? W * 0.24 : W / 2, b.y0 / 2, c.on(durum.on), { key: "on" })}
      {sonuc.alanVar && D - b.y1 > fs * 1.5 && yazi(pafta ? W * 0.72 : evVar && salonN[1] > 0 ? W * 0.24 : W / 2, (b.y1 + D) / 2, c.arka(durum.arka), { key: "arka" })}
      {sonuc.alanVar &&
        b.x0 > fs * 1.5 &&
        D > 10 &&
        yazi(evVar && salonN[0] < 0 ? W - (W - b.x1) / 2 : b.x0 / 2, (b.y0 + b.y1) / 2, c.yan(durum.yan), { key: "yan", rot: -90 })}

      {/* sheet: overall dimensions */}
      {pafta && (
        <g className="vz-plan-olcu">
          <line x1={0} y1={Y(-8.2)} x2={W} y2={Y(-8.2)} stroke={paftaCizgi} strokeWidth={0.05} markerStart={`url(#${uid}-ok)`} markerEnd={`url(#${uid}-ok)`} />
          {yazi(W / 2, -8.85, `${c.metre(W)}`, { key: "dimW" })}
          <line x1={-2.6} y1={Y(0)} x2={-2.6} y2={Y(D)} stroke={paftaCizgi} strokeWidth={0.05} markerStart={`url(#${uid}-ok)`} markerEnd={`url(#${uid}-ok)`} />
          {yazi(-3.3, D / 2, c.metre(D), { key: "dimD", rot: -90 })}
        </g>
      )}

      {/* trees: shadow first, then the balls */}
      {agaclar.map(([x, y]) => (
        <ellipse key={`g${x}${y}`} cx={x + 0.45} cy={Y(y - 0.55)} rx={1.15} ry={1.0} fill="rgba(6,24,18,.28)" />
      ))}
      {agaclar.map(([x, y]) => (
        <g key={`a${x}${y}`}>
          <circle cx={x} cy={Y(y)} r={1.1} fill={K.agac} />
          <circle cx={x - 0.32} cy={Y(y + 0.32)} r={0.45} fill={K.agacIsik} />
        </g>
      ))}

      {evVar && (
        <>
          {/* lamp shadow under the house */}
          {!pafta && <rect {...rect({ x0: ev.x0 + 0.45, y0: ev.y0 - 0.6, x1: ev.x1 + 0.45, y1: ev.y1 - 0.6 })} fill="rgba(6,24,18,.32)" rx={0.1} />}

          <g
            key={inis}
            className={`vz-ev ${inis ? "vz-ev--inis" : ""} ${inis === "ilk" ? "vz-ev--ilk" : ""}`}
            tabIndex={etkilesim ? 0 : undefined}
            role={etkilesim ? "button" : undefined}
            aria-label={etkilesim ? tr.arac.evAria(`${m.ad} ${m.m2}`) : undefined}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
            onFocus={() => setOdak(true)}
            onBlur={() => setOdak(false)}
            style={etkilesim ? { cursor: surukluyor ? "grabbing" : "grab", touchAction: "none" } : undefined}
          >
            <rect {...rect(ev)} fill={K.tas} stroke={K.tasKenar} strokeWidth={0.08} />
            {/* ridge along the long side */}
            {sonuc.w >= sonuc.d ? (
              <line x1={ev.x0 + 0.15} y1={Y((ev.y0 + ev.y1) / 2)} x2={ev.x1 - 0.15} y2={Y((ev.y0 + ev.y1) / 2)} stroke={K.mahya} strokeWidth={0.08} />
            ) : (
              <line x1={(ev.x0 + ev.x1) / 2} y1={Y(ev.y0 + 0.15)} x2={(ev.x0 + ev.x1) / 2} y2={Y(ev.y1 - 0.15)} stroke={K.mahya} strokeWidth={0.08} />
            )}
            {tasmalar.map((t) => (
              <rect key={t.taraf} {...rect(t.r)} fill={`url(#${uid}-kir)`} opacity={0.92} />
            ))}
            {odak && etkilesim && (
              <rect {...rect({ x0: ev.x0 - 0.35, y0: ev.y0 - 0.35, x1: ev.x1 + 0.35, y1: ev.y1 + 0.35 })} fill="none" stroke="#fff" strokeWidth={0.12} strokeDasharray="0.4 0.25" />
            )}
          </g>

          {/* how far each overflow goes: a red dimension across the piece */}
          {tasmalar.map((t) => {
            const yatay = t.taraf === "sol" || t.taraf === "sag";
            const cx = (t.r.x0 + t.r.x1) / 2;
            const cy = (t.r.y0 + t.r.y1) / 2;
            const ly = yatay ? Math.min(t.r.y1 - fs * 1.2, cy + (t.r.y1 - t.r.y0) / 4) : cy;
            const lx = yatay ? cx : Math.min(t.r.x1 - fs * 2.5, cx + (t.r.x1 - t.r.x0) / 4);
            return (
              <g key={`o${t.taraf}`}>
                {yatay ? (
                  <line x1={t.r.x0} y1={Y(ly)} x2={t.r.x1} y2={Y(ly)} stroke="#fff" strokeWidth={0.07} markerStart={`url(#${uid}-ucK)`} markerEnd={`url(#${uid}-ucK)`} />
                ) : (
                  <line x1={lx} y1={Y(t.r.y0)} x2={lx} y2={Y(t.r.y1)} stroke="#fff" strokeWidth={0.07} markerStart={`url(#${uid}-ucK)`} markerEnd={`url(#${uid}-ucK)`} />
                )}
                {yazi(yatay ? cx : lx + fs * 0.4, yatay ? ly + fs * 0.85 : cy, c.metre(t.m), {
                  key: `ot${t.taraf}`,
                  renk: "#fff",
                  hale: "rgba(110,12,6,.85)",
                  kalin: 760,
                  anchor: yatay ? "middle" : "start",
                })}
              </g>
            );
          })}

          {/* the house name, above everything */}
          {yazi((ev.x0 + ev.x1) / 2, (ev.y0 + ev.y1) / 2, `${m.ad} ${m.m2}`, {
            key: "ad",
            renk: "#fff",
            boy: 1.12,
            kalin: 760,
            hale: "rgba(10,22,60,.55)",
          })}

          {/* living-room arrow */}
          {salon && !pafta && (
            <g className="vz-plan-salon">
              <line x1={salon.x1} y1={Y(salon.y1)} x2={salon.x2} y2={Y(salon.y2)} stroke={K.etiket} strokeWidth={Math.max(0.12, fs * 0.16)} markerEnd={`url(#${uid}-ok)`} />
              {yazi(
                salon.x2 + salon.nx * fs * 0.7,
                salon.y2 + salon.ny * fs * 0.9,
                c.salon(salonYon),
                { key: "salon", anchor: salon.nx > 0 ? "start" : salon.nx < 0 ? "end" : "middle" },
              )}
            </g>
          )}

          {/* sheet: distances from the house to the four boundaries */}
          {pafta && (
            <g className="vz-plan-mesafe">
              {[
                { a: [ev.x0 + (ev.x1 - ev.x0) * 0.25, 0], z: [ev.x0 + (ev.x1 - ev.x0) * 0.25, ev.y0], m: ev.y0, dik: true },
                { a: [ev.x0 + (ev.x1 - ev.x0) * 0.25, ev.y1], z: [ev.x0 + (ev.x1 - ev.x0) * 0.25, D], m: D - ev.y1, dik: true },
                { a: [0, ev.y0 + (ev.y1 - ev.y0) * 0.3], z: [ev.x0, ev.y0 + (ev.y1 - ev.y0) * 0.3], m: ev.x0, dik: false },
                { a: [ev.x1, ev.y0 + (ev.y1 - ev.y0) * 0.3], z: [W, ev.y0 + (ev.y1 - ev.y0) * 0.3], m: W - ev.x1, dik: false },
              ]
                .filter((s) => s.m > 0.2)
                .map((s, i) => (
                  <g key={i}>
                    <line
                      x1={s.a[0]}
                      y1={Y(s.a[1])}
                      x2={s.z[0]}
                      y2={Y(s.z[1])}
                      stroke="#1b3790"
                      strokeWidth={0.05}
                      markerStart={`url(#${uid}-ok)`}
                      markerEnd={`url(#${uid}-ok)`}
                    />
                    {yazi(
                      s.dik ? s.a[0] + fs * 0.35 : (s.a[0] + s.z[0]) / 2,
                      s.dik ? (s.a[1] + s.z[1]) / 2 : s.a[1] + fs * 0.75,
                      c.metre(s.m),
                      { key: `m${i}`, renk: "#1b3790", anchor: s.dik ? "start" : "middle", boy: 0.95 },
                    )}
                  </g>
                ))}
            </g>
          )}
        </>
      )}

      {yerYok && yazi(W / 2, D / 2, tr.arac.ihlal({ kural: "alan" }), { key: "yeryok", boy: 0.9 })}

      {/* north arrow in a ring, beside the plot */}
      <g className="vz-plan-kuzey">
        <circle cx={kuzeyKonum.x} cy={Y(kuzeyKonum.y)} r={1.55} fill="none" stroke={pafta ? paftaCizgi : "rgba(243,246,242,.55)"} strokeWidth={0.06} />
        <line
          x1={kuzeyKonum.x - kuzey[0] * 1.15}
          y1={Y(kuzeyKonum.y - kuzey[1] * 1.15)}
          x2={kuzeyKonum.x + kuzey[0] * 1.05}
          y2={Y(kuzeyKonum.y + kuzey[1] * 1.05)}
          stroke={pafta ? paftaCizgi : "#f3f6f2"}
          strokeWidth={0.13}
          markerEnd={`url(#${uid}-ok2)`}
        />
        {yazi(kuzeyKonum.x + kuzey[0] * 2.25, kuzeyKonum.y + kuzey[1] * 2.25, c.kuzey, {
          key: "K",
          kalin: 800,
          renk: pafta ? paftaCizgi : "#f3f6f2",
          hale: "rgba(10,30,24,.5)",
        })}
      </g>
    </svg>
  );
}
