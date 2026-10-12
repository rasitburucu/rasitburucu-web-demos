"use client";

// One model: the table-model photo, the plan (two floors for Cumba), the outside
// size that decides whether it fits, the smallest plot it needs (drawn), price
// and timing. "Arsama koy" carries the model into the plot check.
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { MODELLER, netAlan, type Model } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { enKucukArsa, hesapla, maliyet, VARSAYILAN, type Durum } from "@/lib/vaziyet/hesap";
import { araSayi, aralik, f1, tl } from "@/lib/vaziyet/bicim";
import { kodla } from "@/lib/vaziyet/url";
import { useDurum } from "@/lib/vaziyet/durum";
import { Resim } from "../ui/Resim";
import { IlSec } from "../ui/IlSec";
import { Ornek } from "../shell/Shell";
import { Plan } from "../arac/Plan";
import { KatPlani } from "./KatPlani";

export function ModelSayfa({ m }: { m: Model }) {
  const { durum, guncelle } = useDurum();
  const t = tr.model;
  const b = t.bilgi;
  const k = maliyet(m, durum.il);
  const [kat, setKat] = useState(0);
  const planId = useId();
  const ek = enKucukArsa(m);
  // the smallest plot, drawn with the house in it
  const ornekArsa: Durum = useMemo(
    () => ({ ...VARSAYILAN, W: ek.cephe, D: Math.max(ek.derinlik, Math.ceil(ek.alan / ek.cephe)), model: m.id, rot: 0, x: null, y: null, yol: durum.yol }),
    [ek.cephe, ek.derinlik, ek.alan, m.id, durum.yol],
  );
  const ornekSonuc = useMemo(() => hesapla(ornekArsa), [ornekArsa]);
  const koyHref = `${tr.base}/?${kodla({ ...durum, model: m.id, x: null, y: null })}#arac`;
  const digerleri = MODELLER.filter((x) => x.id !== m.id);

  return (
    <>
      <section className="vz-model-bas vz-mat">
        <div className="vz-wrap vz-model-bas-in">
          <div className="vz-model-bas-yazi">
            <nav aria-label={tr.modeller.baslik} className="vz-iz">
              <Link href={`${tr.base}/modeller/`}>{tr.modeller.baslik}</Link> <span aria-hidden="true">/</span> <span aria-current="page">{m.ad}</span>
            </nav>
            <h1 className="vz-h1">
              {m.ad} {m.m2}
            </h1>
            <p className="vz-model-alt">
              {m.oda} · {tr.modeller.kat(m.katSayisi)} · {f1(m.w)} × {f1(m.d)} m
            </p>
            <p className="vz-lead">{t.tanitim[m.id]}</p>
            <div className="vz-model-fiyat">
              <p>
                <span>{t.fabrika}</span>
                <strong>{tl(m.fiyat)}</strong> <Ornek />
              </p>
              <p>
                <span>{t.kurulu}</span>
                <strong>{aralik(k.toplam[0], k.toplam[1])}</strong>
              </p>
            </div>
            <IlSec il={durum.il} onSec={(il) => guncelle({ il })} className="vz-ilsec--mat" />
            <div className="vz-row vz-model-act">
              <Link href={koyHref} className="vz-btn vz-btn--kobalt vz-btn--big">
                {t.koy}
              </Link>
              <Link href={`${tr.base}/teklif/?${kodla({ ...durum, model: m.id, x: null, y: null })}`} className="vz-btn vz-btn--cizgi vz-btn--big">
                {t.teklif}
              </Link>
            </div>
          </div>
          <figure className="vz-model-bas-gorsel">
            <Resim ad={`model-${m.id}` as "model-sofa"} alt={t.gorselAlt(`${m.ad} ${m.m2}`)} sizes="(max-width: 899px) 100vw, 52vw" oncelik />
          </figure>
        </div>
      </section>

      <section className="vz-bant vz-bant--kagit" aria-labelledby={planId}>
        <div className="vz-wrap vz-model-plan">
          <div className="vz-model-plan-cizim">
            <div className="vz-model-plan-bas">
              <h2 id={planId} className="vz-h2">
                {t.planBaslik}
              </h2>
              {m.katlar.length > 1 && (
                <div className="vz-sekme" role="group" aria-label={t.katSec}>
                  {m.katlar.map((kk, i) => (
                    <button key={kk.ad} type="button" aria-pressed={kat === i} onClick={() => setKat(i)}>
                      {kk.ad}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <KatPlani m={m} kat={m.katlar[kat]} baslikId={planId} />
            <p className="vz-muted vz-not">{t.planNot}</p>
          </div>
          <div className="vz-model-bilgi">
            <dl className="vz-bilgi">
              <div>
                <dt>{b.alan}</dt>
                <dd>{m.m2} m²</dd>
              </div>
              <div>
                <dt>{b.oda}</dt>
                <dd>{m.oda}</dd>
              </div>
              <div>
                <dt>{b.kat}</dt>
                <dd>{m.katSayisi}</dd>
              </div>
              <div className="is-vurgu">
                <dt>
                  {b.olcu} <small>{b.olcuNot}</small>
                </dt>
                <dd>
                  {f1(m.w)} × {f1(m.d)} m
                </dd>
              </div>
              <div>
                <dt>{b.taban}</dt>
                <dd>{m.taban} m²</dd>
              </div>
              <div>
                <dt>{b.sacak}</dt>
                <dd>{m.sacak.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} m</dd>
              </div>
              <div>
                <dt>{b.mahya}</dt>
                <dd>{m.mahya.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} m</dd>
              </div>
              <div>
                <dt>{b.tir}</dt>
                <dd>{b.tirDeger(m.tir)}</dd>
              </div>
              <div>
                <dt>{b.uretim}</dt>
                <dd>{b.hafta(araSayi(m.uretimHafta))}</dd>
              </div>
              <div>
                <dt>{b.kurulum}</dt>
                <dd>{b.gun(araSayi(m.kurulumGun))}</dd>
              </div>
            </dl>
            <p className="vz-muted vz-not">{t.toplamNet(netAlan(m).toLocaleString("tr-TR", { maximumFractionDigits: 1 }))}</p>
          </div>
        </div>
      </section>

      <section className="vz-bant vz-bant--mat vz-model-arsa" aria-labelledby={`${planId}-a`}>
        <div className="vz-wrap vz-model-arsa-in">
          <div className="vz-model-arsa-yazi">
            <h2 id={`${planId}-a`} className="vz-h2">
              {t.sigarBaslik}
            </h2>
            <p className="vz-lead">{t.sigar(f1(ek.cephe), f1(ek.derinlik))}</p>
            <p>{t.cevrilince(f1(ek.cevrilince.cephe), f1(ek.cevrilince.derinlik))}</p>
            <p className="vz-muted-m">{t.alanSarti(ek.alan.toLocaleString("tr-TR"))}</p>
            <p>
              <Link href={koyHref} className="vz-btn vz-btn--kobalt">
                {t.koy}
              </Link>
            </p>
          </div>
          <div className="vz-model-arsa-plan">
            <Plan durum={ornekArsa} sonuc={ornekSonuc} tur="kucuk" />
          </div>
        </div>
      </section>

      <section className="vz-bant vz-bant--kagit">
        <div className="vz-wrap vz-model-dahil">
          <div>
            <h2 className="vz-h3">{t.dahilBaslik}</h2>
            <ul className="vz-madde">
              {t.dahil.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="vz-muted vz-not">{t.statik}</p>
          </div>
          <div>
            <h2 className="vz-h3">{tr.maliyet.dahilDegil}</h2>
            <ul className="vz-madde vz-madde--gri">
              {tr.maliyet.dahilDegilListe.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="vz-not">
              <Link href={`${tr.base}/#fiyat`} className="vz-link">
                {t.dokumLink}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <nav className="vz-bant vz-bant--derin vz-diger" aria-label={t.digerleri}>
        <div className="vz-wrap">
          <h2 className="vz-h3">{t.digerleri}</h2>
          <ul>
            {digerleri.map((x) => (
              <li key={x.id}>
                <Link href={`${tr.base}/modeller/${x.id}/`}>
                  <strong>
                    {x.ad} {x.m2}
                  </strong>
                  <span>
                    {x.oda} · {f1(x.w)} × {f1(x.d)} m · {tl(x.fiyat)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
