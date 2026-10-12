"use client";

// "Ruhsattan anahtara": who does what, and when, drawn on the cutting mat's
// own grid used as a week ruler. The clock starts the day the permit is out;
// the paperwork before it is hatched, because the municipality sets its pace.
import { useMemo } from "react";
import { modelBul } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { useDurum } from "@/lib/vaziyet/durum";
import { araSayi } from "@/lib/vaziyet/bicim";

export function Surec() {
  const { durum } = useDurum();
  const m = modelBul(durum.model)!;
  const t = tr.surec;
  const u = m.uretimHafta[1];
  const kur = m.kurulumGun[1] / 7;
  const son = Math.ceil(u + kur + 1.5);
  const satir = useMemo(
    () =>
      t.adimlar.map((a) => {
        switch (a.id) {
          case "imar":
            return { ...a, bas: -4, bit: -3, tur: "belirsiz" as const, etiket: "" };
          case "ruhsat":
            return { ...a, bas: -3, bit: 0, tur: "belirsiz" as const, etiket: t.degisir };
          case "uretim":
            return { ...a, bas: 0, bit: u, tur: "is" as const, etiket: `${araSayi(m.uretimHafta)} ${t.hafta}` };
          case "temel":
            return { ...a, bas: Math.max(0.5, u - 3), bit: Math.max(2, u - 1), tur: "is" as const, etiket: t.temelSure };
          case "nakliye":
            return { ...a, bas: u, bit: u + 0.2, tur: "is" as const, etiket: t.nakliyeSure };
          case "kurulum":
            return { ...a, bas: u + 0.2, bit: u + 0.2 + kur, tur: "is" as const, etiket: `${araSayi(m.kurulumGun)} ${t.gun}` };
          default:
            return { ...a, bas: u + 0.2 + kur, bit: son, tur: "sonra" as const, etiket: "" };
        }
      }),
    [t, u, kur, son, m.uretimHafta, m.kurulumGun],
  );
  const min = -4;
  const yuzde = (v: number) => `${((v - min) / (son - min)) * 100}%`;
  const haftalar = Array.from({ length: son + 1 }, (_, i) => i);

  return (
    <section className="vz-bant vz-bant--mat vz-surec" id="surec" aria-labelledby="vz-surec-h">
      <div className="vz-wrap">
        <div className="vz-bant-bas">
          <h2 id="vz-surec-h" className="vz-h2">
            {t.baslik}
          </h2>
          <p className="vz-lead">{t.lead}</p>
        </div>
        <div className="vz-cetvel" aria-hidden="true">
          <span className="vz-cetvel-sifir" style={{ left: yuzde(0) }}>
            {t.sifir}
          </span>
          {haftalar.map((h) => (
            <span key={h} className={`vz-cetvel-cizgi ${h % 5 === 0 ? "is-ana" : ""}`} style={{ left: yuzde(h) }} />
          ))}
          {haftalar
            .filter((h) => h > 0 && h % 2 === 0)
            .map((h) => (
              <span key={`s${h}`} className="vz-cetvel-sayi" style={{ left: yuzde(h) }}>
                {h}
              </span>
            ))}
          <span className="vz-cetvel-birim" style={{ left: yuzde(son) }}>
            {t.hafta}
          </span>
        </div>
        <ol className="vz-surec-liste" style={{ "--vz-hafta": son - min } as React.CSSProperties}>
          {satir.map((a, i) => (
            <li key={a.id} className={`vz-surec-adim is-${a.tur}`}>
              <div className="vz-surec-yazi">
                <span className="vz-surec-no">{i + 1}</span>
                <div>
                  <h3 className="vz-surec-ad">{a.ad}</h3>
                  <p className="vz-surec-kim">{a.kim}</p>
                  <p className="vz-surec-metin">{a.metin}</p>
                </div>
              </div>
              <div className="vz-surec-hat" aria-hidden="true">
                <span className="vz-surec-cubuk" style={{ left: yuzde(a.bas), width: `calc(${yuzde(a.bit)} - ${yuzde(a.bas)})` }} />
                {a.etiket && (
                  <span className="vz-surec-sure" style={{ left: yuzde(a.bit) }}>
                    {a.etiket}
                  </span>
                )}
              </div>
              {a.etiket && <span className="vz-sr">{a.etiket}</span>}
            </li>
          ))}
        </ol>
        <p className="vz-surec-not">{t.ornek(`${m.ad} ${m.m2}`)}</p>
      </div>
    </section>
  );
}
