"use client";

// "Fiyatın içinde ne var": the cost of the house the visitor has just placed,
// line by line (factory price, transport to their province, foundation,
// assembly), with what is not included and how long it takes. Beside it the
// same house drawn as an exploded table model: house, raft, truck, crane hook.
import { useMemo } from "react";
import { hesapla } from "@/lib/vaziyet/hesap";
import { araSayi, aralik, tl } from "@/lib/vaziyet/bicim";
import { useDurum } from "@/lib/vaziyet/durum";
import type { Model } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { IlSec } from "../ui/IlSec";
import { Ornek } from "../shell/Shell";

export function Fiyat() {
  const { durum, guncelle } = useDurum();
  const s = useMemo(() => hesapla(durum), [durum]);
  const t = tr.maliyet;
  const { m, maliyet: k } = s;
  const kurulum: [number, number] = [k.montaj[0] + k.vinc[0], k.montaj[1] + k.vinc[1]];
  const satirlar = [
    { n: 1, ad: t.ev, tutar: tl(k.ev), not: t.evNot },
    { n: 2, ad: t.nakliye, tutar: aralik(k.nakliye[0], k.nakliye[1]), not: durum.il === 26 ? t.nakliyeYerel(k.tir) : t.nakliyeNot(k.tir, k.il, k.km) },
    { n: 3, ad: t.temel, tutar: aralik(k.temel[0], k.temel[1]), not: t.temelNot(m.taban) },
    { n: 4, ad: t.kurulum, tutar: aralik(kurulum[0], kurulum[1]), not: t.kurulumNot(araSayi(m.kurulumGun), m.vincGun) },
  ];
  return (
    <section className="vz-bant vz-bant--kagit vz-fiyat" id="fiyat" aria-labelledby="vz-fiyat-h">
      <div className="vz-wrap vz-fiyat-in">
        <div className="vz-fiyat-cizim">
          <div className="vz-bant-bas">
            <h2 id="vz-fiyat-h" className="vz-h2">
              {t.baslik}
            </h2>
            <p className="vz-lead">{t.lead}</p>
          </div>
          <Katmanlar m={m} />
        </div>
        <div className="vz-fis">
          <p className="vz-fis-model">
            <span className="vz-fis-model-ad">
              {m.ad} {m.m2}
            </span>
            <span>
              {m.oda} · {m.w.toLocaleString("tr-TR")} × {m.d.toLocaleString("tr-TR")} m
            </span>
            <Ornek />
          </p>
          <ol className="vz-fis-liste">
            {satirlar.map((r) => (
              <li key={r.n}>
                <span className="vz-fis-no" aria-hidden="true">
                  {r.n}
                </span>
                <span className="vz-fis-ad">{r.ad}</span>
                <span className="vz-fis-tutar">{r.tutar}</span>
                <span className="vz-fis-not">{r.not}</span>
              </li>
            ))}
          </ol>
          <p className="vz-fis-toplam">
            <span>
              {t.toplam} <small>({t.tahmini})</small>
            </span>
            <strong>{aralik(k.toplam[0], k.toplam[1])}</strong>
          </p>
          <p className="vz-fis-kdv">{t.kdv}</p>
          <IlSec il={durum.il} onSec={(il) => guncelle({ il })} />
          <div className="vz-fis-sure">
            <h3 className="vz-h3">{t.sure}</h3>
            <p className="vz-fis-sure-sayi">
              <span>{t.sureUretim(araSayi(m.uretimHafta))}</span>
              <span>{t.sureKurulum(araSayi(m.kurulumGun))}</span>
            </p>
            <p className="vz-muted">{t.sureNot}</p>
          </div>
          <details className="vz-fis-haric">
            <summary>{t.dahilDegil}</summary>
            <ul>
              {t.dahilDegilListe.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </details>
          <p className="vz-fis-yazili">{t.yazili}</p>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ exploded model
const C = 0.866;
const SN = 0.5;
type P3 = [number, number, number];

/** The house lifted off its raft, the raft off the cork plot; a truck with the
 *  panels beside it and the crane hook above. Numbers match the list. */
function Katmanlar({ m }: { m: Model }) {
  const k = 13;
  const P = ([x, y, z]: P3): [number, number] => [(x - y) * C * k, (x + y) * SN * k - z * k];
  const yuzler: { d: string; f: string; s?: string }[] = [];
  const kutu = (x0: number, y0: number, z0: number, w: number, d: number, h: number, renk: { ust: string; x: string; y: string }, kenar = "rgba(0,0,0,.18)") => {
    const q = (pts: P3[]) => `M${pts.map((p) => P(p).map((v) => v.toFixed(1)).join(" ")).join(" L")} Z`;
    yuzler.push({ d: q([[x0, y0 + d, z0], [x0 + w, y0 + d, z0], [x0 + w, y0 + d, z0 + h], [x0, y0 + d, z0 + h]]), f: renk.y, s: kenar });
    yuzler.push({ d: q([[x0 + w, y0, z0], [x0 + w, y0 + d, z0], [x0 + w, y0 + d, z0 + h], [x0 + w, y0, z0 + h]]), f: renk.x, s: kenar });
    yuzler.push({ d: q([[x0, y0, z0 + h], [x0 + w, y0, z0 + h], [x0 + w, y0 + d, z0 + h], [x0, y0 + d, z0 + h]]), f: renk.ust, s: kenar });
  };
  const { w, d, sacak: h, mahya: r } = m;
  const pw = w + 6;
  const pd = d + 6;
  // 3: cork plot and the raft above it
  kutu(0, 0, 0, pw, pd, 0.6, { ust: "#c89b68", x: "#8a6338", y: "#9e7445" });
  const tz = 3.2;
  kutu(3 - 0.3, 3 - 0.3, tz, w + 0.6, d + 0.6, 0.45, { ust: "#c9c8c0", x: "#8f8e86", y: "#a9a8a0" });
  // 1: the house, lifted
  const ez = tz + 0.45 + 3.6;
  kutu(3, 3, ez, w, d, h, { ust: "#3157d5", x: "#1e3a95", y: "#2949b5" }, "rgba(10,20,60,.35)");
  const q = (pts: P3[]) => `M${pts.map((p) => P(p).map((v) => v.toFixed(1)).join(" ")).join(" L")} Z`;
  yuzler.push({ d: q([[3 + w, 3, ez + h], [3 + w, 3 + d, ez + h], [3 + w, 3 + d / 2, ez + r]]), f: "#1e3a95" });
  yuzler.push({ d: q([[3, 3, ez + h], [3 + w, 3, ez + h], [3 + w, 3 + d / 2, ez + r], [3, 3 + d / 2, ez + r]]), f: "#3b62e0" });
  yuzler.push({ d: q([[3, 3 + d, ez + h], [3 + w, 3 + d, ez + h], [3 + w, 3 + d / 2, ez + r], [3, 3 + d / 2, ez + r]]), f: "#5a7cf0" });
  // 2: the truck, at ground level in front of the plot
  const ty = pd + 4;
  const tx = -2;
  kutu(tx, ty, 0.5, 13, 2.4, 0.5, { ust: "#2a2f31", x: "#1b1d1e", y: "#24292b" });
  kutu(tx + 13, ty, 0.5, 2.4, 2.4, 2.6, { ust: "#f1eee6", x: "#c9c5bb", y: "#dcd8ce" });
  for (let i = 0; i < 6; i++) kutu(tx + 0.8, ty + 0.15, 1.0 + i * 0.3, 5.6, 2.1, 0.26, { ust: "#3b62e0", x: "#1e3a95", y: "#2949b5" }, "rgba(10,20,60,.3)");
  for (let i = 0; i < 5; i++) kutu(tx + 6.8, ty + 0.15, 1.0 + i * 0.3, 5.6, 2.1, 0.26, { ust: "#3b62e0", x: "#1e3a95", y: "#2949b5" }, "rgba(10,20,60,.3)");

  // guides and labels
  const merkezEv = P([3 + w / 2, 3 + d / 2, ez + r]);
  const kanca = P([3 + w / 2, 3 + d / 2, ez + r + 4.5]);
  const kilavuz = [
    [P([3, 3 + d, ez]), P([3 - 0.3, 3 + d + 0.3, tz + 0.45])],
    [P([3 + w, 3 + d, ez]), P([3 + w + 0.3, 3 + d + 0.3, tz + 0.45])],
    [P([3 - 0.3, 3 + d + 0.3, tz]), P([3 - 0.3, 3 + d + 0.3, 0.6])],
    [P([3 + w + 0.3, 3 + d + 0.3, tz]), P([3 + w + 0.3, 3 + d + 0.3, 0.6])],
  ];
  const isaret = [
    { n: 1, p: P([3 + w + 1.4, 3 - 0.6, ez + h * 0.6]) },
    { n: 2, p: P([tx + 16.4, ty + 2.6, 2.2]) },
    { n: 3, p: P([3 + w + 1.6, 3 - 0.6, tz + 0.3]) },
    { n: 4, p: [kanca[0] + 22, kanca[1] + 4] as [number, number] },
  ];
  const tum = [...yuzler.flatMap((y) => y.d.match(/-?\d+(\.\d+)?/g)!.map(Number)), kanca[0], kanca[1] - 30];
  const xs = tum.filter((_, i) => i % 2 === 0);
  const ys = tum.filter((_, i) => i % 2 === 1);
  const pad = 26;
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  const vw = Math.max(...xs) - x0 + pad + 30;
  const vh = Math.max(...ys) - y0 + pad;
  return (
    <svg className="vz-katman" viewBox={`${x0.toFixed(0)} ${y0.toFixed(0)} ${vw.toFixed(0)} ${vh.toFixed(0)}`} role="img" aria-label={tr.maliyet.katmanEtiket}>
      <line x1={kanca[0]} y1={y0} x2={kanca[0]} y2={kanca[1] + 6} stroke="#2a2f31" strokeWidth={1.4} />
      <path d={`M${kanca[0] - 5} ${kanca[1] + 6} h10 l-5 9 Z`} fill="#b42318" />
      <line x1={kanca[0]} y1={kanca[1] + 14} x2={merkezEv[0]} y2={merkezEv[1]} stroke="#2a2f31" strokeWidth={1} strokeDasharray="3 3" />
      {kilavuz.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#7a6a52" strokeWidth={1} strokeDasharray="4 4" />
      ))}
      {yuzler.map((y, i) => (
        <path key={i} d={y.d} fill={y.f} stroke={y.s ?? "none"} strokeWidth={0.8} strokeLinejoin="round" />
      ))}
      {isaret.map((i) => (
        <g key={i.n} className="vz-katman-no">
          <circle cx={i.p[0]} cy={i.p[1]} r={13} />
          <text x={i.p[0]} y={i.p[1]} textAnchor="middle" dominantBaseline="central">
            {i.n}
          </text>
        </g>
      ))}
    </svg>
  );
}
