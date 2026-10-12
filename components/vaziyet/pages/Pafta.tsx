"use client";

// Printable "vaziyet planı taslağı": one A4 page with the plot drawn to its
// own proportions, the house and its distances to the four boundaries, the
// values entered, the result and the estimate, and the plain statement that
// this is a pre-check and not a permit, survey or legal opinion.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { tr, nitelikAd, yonAd } from "@/content/vaziyet/tr";
import { hesapla } from "@/lib/vaziyet/hesap";
import { aralik, f0, f1, f2, oran, tl } from "@/lib/vaziyet/bicim";
import { kodla } from "@/lib/vaziyet/url";
import { useDurum } from "@/lib/vaziyet/durum";
import { Plan } from "../arac/Plan";
import { Mark } from "../shell/Shell";

export function Pafta() {
  const { durum } = useDurum();
  const s = useMemo(() => hesapla(durum), [durum]);
  const t = tr.pafta;
  const tk = tr.teklif;
  const [tarih, setTarih] = useState("");
  const [link, setLink] = useState("");
  const q = kodla(durum);
  useEffect(() => {
    setTarih(new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date()));
  }, []);
  useEffect(() => {
    setLink(`${location.origin}${location.pathname}?${q}`);
  }, [q]);
  const k = s.maliyet;
  const ev = s.ev;
  const kurulum: [number, number] = [k.montaj[0] + k.vinc[0], k.montaj[1] + k.vinc[1]];

  return (
    <div className="vz-kagit-kap">
      <div className="vz-kagit-cubuk vz-baskida-yok">
        <Link href={`${tr.base}/teklif/?${q}`} className="vz-btn vz-btn--cizgi-k vz-btn--sm">
          {t.geri}
        </Link>
        <button type="button" className="vz-btn vz-btn--kobalt vz-btn--sm" onClick={() => window.print()}>
          {t.yazdir}
        </button>
      </div>
      <article className="vz-kagit" aria-labelledby="vz-kagit-h">
        <header className="vz-kagit-bas">
          <span className="vz-kagit-marka">
            <Mark size={26} />
            {tr.brand.ad}
          </span>
          <div className="vz-kagit-meta">
            <div>
              {t.tarih}: <span className="vz-kagit-tarih">{tarih}</span>
            </div>
            <div>
              {s.m.ad} {s.m.m2} · {f1(durum.W)} × {f1(durum.D)} m · {k.il}
            </div>
          </div>
        </header>
        <div className="vz-kagit-baslik">
          <h1 id="vz-kagit-h">{t.baslik}</h1>
          <p className="vz-kagit-damga">
            <strong>{t.damga}</strong> {t.damgaAlt}
          </p>
        </div>

        <div className="vz-kagit-plan">
          <Plan durum={durum} sonuc={s} tur="pafta" />
          <p className="vz-kagit-olcek">{t.olcek}</p>
        </div>

        <div className="vz-kagit-izgara">
          <section>
            <h2>{t.arsa}</h2>
            <dl>
              <dt>{tk.olcu}</dt>
              <dd>
                {f1(durum.W)} × {f1(durum.D)} m
              </dd>
              <dt>{tk.alan}</dt>
              <dd>{f0(s.alan)} m²</dd>
              <dt>{tk.nitelik}</dt>
              <dd>{nitelikAd(durum.nitelik)}</dd>
              <dt>{tk.yol}</dt>
              <dd>{yonAd(durum.yol)}</dd>
            </dl>
            <h2>{t.imar}</h2>
            <dl>
              <dt>{tk.taks}</dt>
              <dd>
                {oran(durum.taks)} · {t.hak} {f0(s.taksHak)} m² · {t.kullanilan} {f0(s.m.taban)} m²
              </dd>
              <dt>{tk.kaks}</dt>
              <dd>
                {oran(durum.kaks)} · {t.hak} {f0(s.kaksHak)} m² · {t.kullanilan} {f0(s.m.m2)} m²
              </dd>
              <dt>{tk.bahce}</dt>
              <dd>
                {f1(durum.on)} · {f1(durum.yan)} · {f1(durum.arka)} m
              </dd>
              <dt>{tk.hmax}</dt>
              <dd>
                {f2(durum.hmax)} m · {tr.arac.cizim.sacak(s.m.sacak)}
              </dd>
            </dl>
          </section>
          <section>
            <h2>{t.model}</h2>
            <dl>
              <dt>{tk.model}</dt>
              <dd>
                {s.m.ad} {s.m.m2} · {s.m.oda}
              </dd>
              <dt>{tk.disOlcu}</dt>
              <dd>
                {f1(s.m.w)} × {f1(s.m.d)} m
              </dd>
              <dt>{t.mesafeler}</dt>
              <dd>
                {t.on} {f1(ev.y0)} · {t.arka} {f1(durum.D - ev.y1)} · {t.sol} {f1(ev.x0)} · {t.sag} {f1(durum.W - ev.x1)} m
              </dd>
              <dt>{tk.kalanBahce}</dt>
              <dd>{f0(s.bahce)} m²</dd>
              <dt>{tk.salon}</dt>
              <dd>{yonAd(s.salonYon)}</dd>
              <dt>{tk.sonucBaslik}</dt>
              <dd className={s.sigar ? "" : "is-kirmizi"}>{s.sigar ? tk.sigiyor : `${tk.sigmiyor}: ${s.ihlaller.map((i) => tr.arac.ihlal(i)).join(" ")}`}</dd>
            </dl>
            <h2>{t.maliyet}</h2>
            <dl>
              <dt>{tr.maliyet.ev}</dt>
              <dd>{tl(k.ev)}</dd>
              <dt>{tr.maliyet.nakliye}</dt>
              <dd>{aralik(k.nakliye[0], k.nakliye[1])}</dd>
              <dt>{tr.maliyet.temel}</dt>
              <dd>{aralik(k.temel[0], k.temel[1])}</dd>
              <dt>{tr.maliyet.kurulum}</dt>
              <dd>{aralik(kurulum[0], kurulum[1])}</dd>
              <dt>
                <strong>{tr.maliyet.toplam}</strong>
              </dt>
              <dd>
                <strong>{aralik(k.toplam[0], k.toplam[1])}</strong>
              </dd>
            </dl>
          </section>
        </div>

        <footer className="vz-kagit-notlar">
          <ul>
            {t.notlar.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p>{t.kavram}</p>
          <p>
            {t.ref}: <span className="vz-kagit-link">{link || `https://rasitburucu.com/web${tr.base}/teklif/vaziyet-plani/?${q}`}</span>
          </p>
        </footer>
      </article>
    </div>
  );
}
