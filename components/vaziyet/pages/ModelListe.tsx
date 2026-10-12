"use client";

import Link from "next/link";
import { MODELLER } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { enKucukArsa, maliyet } from "@/lib/vaziyet/hesap";
import { araSayi, aralik, f1, f2, tl } from "@/lib/vaziyet/bicim";
import { kodla } from "@/lib/vaziyet/url";
import { useDurum } from "@/lib/vaziyet/durum";
import { Resim } from "../ui/Resim";
import { IlSec } from "../ui/IlSec";
import { EvIkon } from "../arac/Raf";

export function ModelListe() {
  const { durum, guncelle } = useDurum();
  const t = tr.modeller;
  const tb = t.tablo;
  const il = maliyet(MODELLER[0], durum.il).il;
  return (
    <>
      <section className="vz-sayfa-bas vz-mat">
        <div className="vz-wrap">
          <h1 className="vz-h1">{t.baslik}</h1>
          <p className="vz-lead">{t.lead}</p>
        </div>
        <div className="vz-raf-gorsel vz-raf-gorsel--bas" tabIndex={0} role="group" aria-label={tr.modellerBand.gorselAlt}>
          <Resim ad="raf" alt={tr.modellerBand.gorselAlt} sizes="(max-width: 899px) 1000px, 100vw" oncelik />
        </div>
      </section>

      <section className="vz-bant vz-bant--kagit" aria-labelledby="vz-tablo-h">
        <div className="vz-wrap">
          <div className="vz-tablo-ust">
            <h2 id="vz-tablo-h" className="vz-h2">
              {tb.baslik}
            </h2>
            <IlSec il={durum.il} onSec={(p) => guncelle({ il: p })} />
          </div>
          <div className="vz-tablo-kap" tabIndex={0} role="region" aria-labelledby="vz-tablo-h">
            <table className="vz-tablo">
              <thead>
                <tr>
                  <th scope="col">{tb.model}</th>
                  <th scope="col">{tb.oda}</th>
                  <th scope="col">{tb.alan}</th>
                  <th scope="col">{tb.olcu}</th>
                  <th scope="col">{tb.sacak}</th>
                  <th scope="col">{tb.arsa}</th>
                  <th scope="col">{tb.fiyat}</th>
                  <th scope="col">{tb.kurulu}</th>
                  <th scope="col">{tb.sure}</th>
                  <th scope="col">
                    <span className="vz-sr">{tr.modellerBand.koy}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODELLER.map((m) => {
                  const k = maliyet(m, durum.il);
                  const e = enKucukArsa(m);
                  return (
                    <tr key={m.id}>
                      <th scope="row">
                        <Link href={`${tr.base}/modeller/${m.id}/`} className="vz-tablo-model">
                          <EvIkon m={m} className="vz-evikon vz-evikon--tablo" />
                          <span>
                            {m.ad} {m.m2}
                          </span>
                        </Link>
                      </th>
                      <td>
                        {m.oda}
                        {m.katSayisi === 2 ? `, ${t.kat(2)}` : ""}
                      </td>
                      <td>{m.m2} m²</td>
                      <td>
                        {f1(m.w)} × {f1(m.d)} m
                      </td>
                      <td>{f2(m.sacak)} m</td>
                      <td>
                        {f1(e.cephe)} × {f1(e.derinlik)} m
                      </td>
                      <td>{tl(m.fiyat)}</td>
                      <td>{aralik(k.toplam[0], k.toplam[1])}</td>
                      <td>
                        {tb.sureDeger(araSayi(m.uretimHafta), araSayi(m.kurulumGun))}
                      </td>
                      <td>
                        <Link href={`${tr.base}/?${kodla({ ...durum, model: m.id, x: null, y: null })}#arac`} className="vz-btn vz-btn--kobalt vz-btn--xs">
                          {tr.modellerBand.koy}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="vz-muted vz-not">{t.not(il)}</p>
          <p className="vz-muted vz-not">{t.arsaNot}</p>
        </div>
      </section>

      <section className="vz-bant vz-bant--kart" aria-label={tr.modeller.baslik}>
        <div className="vz-wrap vz-model-galeri">
          {MODELLER.map((m) => (
            <Link key={m.id} href={`${tr.base}/modeller/${m.id}/`} className="vz-model-galeri-oge">
              <Resim ad={`model-${m.id}` as "model-sofa"} alt={tr.model.gorselAlt(`${m.ad} ${m.m2}`)} sizes="(max-width: 899px) 100vw, 33vw" />
              <span className="vz-model-galeri-ad">
                {m.ad} {m.m2}
              </span>
              <span className="vz-model-galeri-alt">{tr.model.tanitim[m.id]}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
