"use client";

// "Nasıl üretiyoruz": factory to plot in five steps, each in the same table-model
// language; the panel layout of the visitor's model drawn as a shop drawing;
// four questions on whether a truck and a crane can reach the plot; assembly
// days per model.
import Link from "next/link";
import { useId } from "react";
import { MODELLER, modelBul, type Model } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { araSayi } from "@/lib/vaziyet/bicim";
import { useDurum } from "@/lib/vaziyet/durum";
import { erisimSonuc, useErisim, type Cevap, type Erisim } from "@/lib/vaziyet/erisim";
import { Resim } from "../ui/Resim";
import { EvIkon } from "../arac/Raf";

export function Uretim() {
  const t = tr.uretim;
  const { durum } = useDurum();
  const m = modelBul(durum.model)!;
  const gorsel: Record<string, "panel" | "tir" | "kurulum-yakin" | "model-sofa"> = { panel: "panel", tir: "tir", vinc: "kurulum-yakin", teslim: "model-sofa" };
  return (
    <>
      <section className="vz-sayfa-bas vz-mat">
        <div className="vz-wrap vz-sayfa-bas-in">
          <div>
            <h1 className="vz-h1">{t.baslik}</h1>
            <p className="vz-lead">{t.lead}</p>
          </div>
          <figure className="vz-sayfa-bas-gorsel">
            <Resim ad="kurulum" alt={t.basGorselAlt} sizes="(max-width: 899px) 100vw, 50vw" oncelik />
          </figure>
        </div>
      </section>

      <section className="vz-bant vz-bant--kagit" aria-label={t.baslik}>
        <div className="vz-wrap">
          <ol className="vz-uretim-adimlar">
            {t.adimlar.map((a, i) => (
              <li key={a.ad} className="vz-uretim-adim">
                <div className="vz-uretim-adim-yazi">
                  <span className="vz-uretim-no">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="vz-h3">{a.ad}</h2>
                  <p className="vz-uretim-sure">{a.sure}</p>
                  <p>{a.metin}</p>
                </div>
                <div className="vz-uretim-adim-gorsel">
                  {a.gorsel ? (
                    <Resim ad={gorsel[a.gorsel]} alt={a.alt ?? ""} sizes="(max-width: 899px) 100vw, 46vw" />
                  ) : (
                    <PanelPlani m={m} />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ErisimBolumu />

      <section className="vz-bant vz-bant--kart" aria-labelledby="vz-kurulum-h">
        <div className="vz-wrap">
          <h2 id="vz-kurulum-h" className="vz-h2">
            {t.kurulumTablo.baslik}
          </h2>
          <div className="vz-tablo-kap" tabIndex={0} role="region" aria-labelledby="vz-kurulum-h">
            <table className="vz-tablo vz-tablo--dar">
              <thead>
                <tr>
                  <th scope="col">{t.kurulumTablo.model}</th>
                  <th scope="col">{t.kurulumTablo.tir}</th>
                  <th scope="col">{t.kurulumTablo.vinc}</th>
                  <th scope="col">{t.kurulumTablo.kurulum}</th>
                </tr>
              </thead>
              <tbody>
                {MODELLER.map((x) => (
                  <tr key={x.id} className={x.id === m.id ? "is-secili" : undefined}>
                    <th scope="row">
                      <span className="vz-tablo-model">
                        <EvIkon m={x} className="vz-evikon vz-evikon--tablo" />
                        <span>
                          {x.ad} {x.m2}
                        </span>
                      </span>
                    </th>
                    <td>{tr.model.bilgi.tirDeger(x.tir)}</td>
                    <td>{tr.model.bilgi.gun(String(x.vincGun))}</td>
                    <td>{tr.model.bilgi.gun(araSayi(x.kurulumGun))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="vz-muted vz-not">{t.kurulumTablo.not}</p>
          <p className="vz-bant-link">
            <Link href={`${tr.base}/#arac`} className="vz-btn vz-btn--kobalt">
              {t.sonCta}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

/** The long facade split into numbered wall panels, with its openings. */
function PanelPlani({ m }: { m: Model }) {
  const id = useId();
  const w = m.w;
  const h = m.sacak;
  const n = Math.round(w / 2.4);
  const pw = w / n;
  const on = m.katlar.map((k) => k.pencereler.filter((p) => p.duvar === "on"));
  const kapi = m.katlar[0].kapilar.find((k) => k.dis);
  const Y = (y: number) => h - y;
  return (
    <svg className="vz-panelplani" viewBox={`-0.6 -1.3 ${w + 1.2} ${h + 2.6}`} role="img" aria-labelledby={id}>
      <title id={id}>{tr.uretim.panelPlaniEtiket(`${m.ad} ${m.m2}`)}</title>
      <rect x={0} y={0} width={w} height={h} fill="#3157d5" />
      {on.map((liste, f) =>
        liste.map((p, i) => (
          <rect key={`${f}-${i}`} x={p.a} y={Y(0.5 + f * 2.9 + 0.9 + 1.25)} width={p.b - p.a} height={1.25} fill="#14286e" />
        )),
      )}
      {kapi && <rect x={kapi.x} y={Y(0.5 + 2.1)} width={kapi.w} height={2.1} fill="#14286e" />}
      {Array.from({ length: n + 1 }, (_, i) => (
        <line key={i} x1={i * pw} x2={i * pw} y1={0} y2={h} stroke="#f4f1ea" strokeWidth={0.05} />
      ))}
      {m.katSayisi === 2 && <line x1={0} x2={w} y1={Y(3.4)} y2={Y(3.4)} stroke="#f4f1ea" strokeWidth={0.05} />}
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={i * pw + pw / 2 - 0.42} y={0.2} width={0.84} height={0.42} rx={0.06} fill="#f4f1ea" />
          <text x={i * pw + pw / 2} y={0.41} textAnchor="middle" dominantBaseline="central" fontSize={0.26} className="vz-panelplani-no">
            {`D-${String(i + 1).padStart(2, "0")}`}
          </text>
        </g>
      ))}
      <line x1={0} x2={w} y1={h + 0.6} y2={h + 0.6} stroke="#13201b" strokeWidth={0.03} />
      {Array.from({ length: n + 1 }, (_, i) => (
        <line key={`t${i}`} x1={i * pw} x2={i * pw} y1={h + 0.45} y2={h + 0.75} stroke="#13201b" strokeWidth={0.03} />
      ))}
      <text x={w / 2} y={h + 1.05} textAnchor="middle" fontSize={0.3} className="vz-panelplani-olcu">
        {tr.uretim.panelOlcu(n, pw.toLocaleString("tr-TR", { maximumFractionDigits: 2 }))}
      </text>
      <text x={0} y={-0.45} fontSize={0.32} className="vz-panelplani-baslik">
        {tr.uretim.panelPlaniBaslik(`${m.ad} ${m.m2}`)}
      </text>
    </svg>
  );
}

function ErisimBolumu() {
  const t = tr.uretim.erisim;
  const { erisim, yaz } = useErisim();
  const iyi = Object.fromEntries(t.sorular.map((s) => [s.id, s.iyi])) as Record<string, Cevap>;
  const sonuc = erisimSonuc(erisim, iyi);
  return (
    <section className="vz-bant vz-bant--mat vz-erisim" aria-labelledby="vz-erisim-h">
      <div className="vz-wrap vz-erisim-in">
        <div className="vz-bant-bas">
          <h2 id="vz-erisim-h" className="vz-h2">
            {t.baslik}
          </h2>
          <p className="vz-lead">{t.lead}</p>
        </div>
        <div className="vz-erisim-sorular">
          {t.sorular.map((s) => (
            <fieldset key={s.id} className="vz-soru">
              <legend>{s.soru}</legend>
              <div className="vz-soru-secenek">
                {s.secenek.map((c) => (
                  <label key={c} className={erisim[s.id as keyof Erisim] === c ? "is-secili" : undefined}>
                    <input type="radio" name={`erisim-${s.id}`} value={c} checked={erisim[s.id as keyof Erisim] === c} onChange={() => yaz(s.id as keyof Erisim, c as Cevap)} />
                    {t.cevap[c]}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <p className={`vz-erisim-sonuc is-${sonuc}`} aria-live="polite">
            {t.sonuc[sonuc]}
          </p>
          <p className="vz-muted-m vz-not">{t.not}</p>
        </div>
      </div>
    </section>
  );
}
