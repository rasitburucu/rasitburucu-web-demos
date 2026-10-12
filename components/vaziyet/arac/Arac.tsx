"use client";

// "Evi almadan önce arsanıza koyun": the signature tool of the first screen.
// Left: headline, the model shelf and the rules card. Right: the status box,
// Plan / Maket and "Evi çevir", the plot drawing, the score strip and the
// permit note. On a phone the drawing comes first and stays in view while the
// rules below it are filled in; the result is on screen before any form.
import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cevir, hesapla, yerlestir, type Donus, type Durum, type Sonuc } from "@/lib/vaziyet/hesap";
import { aralik, f2, f0 } from "@/lib/vaziyet/bicim";
import { kodla } from "@/lib/vaziyet/url";
import { useDurum } from "@/lib/vaziyet/durum";
import { modelBul, type ModelId } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { Plan } from "./Plan";
import { Raf } from "./Raf";
import { Kurallar } from "./Kurallar";

const Maket = dynamic(() => import("./Maket").then((m) => m.Maket), { ssr: false });

class MaketSiniri extends Component<{ children: ReactNode; onHata: () => void }, { hata: boolean }> {
  state = { hata: false };
  static getDerivedStateFromError() {
    return { hata: true };
  }
  componentDidCatch() {
    this.props.onHata();
  }
  render() {
    return this.state.hata ? null : this.props.children;
  }
}

function useAzHareket() {
  const [az, setAz] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setAz(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return az;
}

export function Arac() {
  const { durum, hazir, guncelle, ayarla } = useDurum();
  const sonuc = useMemo(() => hesapla(durum), [durum]);
  const t = tr.arac;
  const azHareket = useAzHareket();
  const [gorunum, setGorunum] = useState<"plan" | "maket">("plan");
  const [maketAcik, setMaketAcik] = useState(false);
  const [maketGorunur, setMaketGorunur] = useState(false);
  const [maketHazir, setMaketHazir] = useState(false);
  const [maketHata, setMaketHata] = useState(false);
  // "ilk": the house lands once on page load (pure CSS, so it also runs before hydration)
  const [inis, setInis] = useState<string | undefined>("ilk");
  // the house lands again when the model or its turn changes; the state read
  // from the address or the session on load does not count as a change
  const inisAnahtari = `${durum.model}-${durum.rot}`;
  const sonAnahtar = useRef<string | null>(null);
  useEffect(() => {
    if (!hazir) return;
    if (sonAnahtar.current === null) {
      sonAnahtar.current = inisAnahtari;
      return;
    }
    if (sonAnahtar.current !== inisAnahtari) {
      sonAnahtar.current = inisAnahtari;
      setInis(inisAnahtari);
    }
  }, [hazir, inisAnahtari]);

  const modelSec = useCallback((id: ModelId) => guncelle({ model: id, x: null, y: null }), [guncelle]);
  const evCevir = useCallback((rot?: Donus) => ayarla(cevir(durum, rot)), [ayarla, durum]);
  const tasi = useCallback((x: number, y: number) => guncelle({ x, y }), [guncelle]);

  const maketeGec = () => {
    setGorunum("maket");
    setMaketAcik(true);
    if (maketHazir) setMaketGorunur(true);
  };
  const planaGec = () => setGorunum("plan");
  // start fetching the 3D code when the pointer or focus reaches the button
  const onizle = () => {
    void import("./Maket");
  };

  return (
    <section className="vz-arac" id="arac" aria-labelledby="vz-h1">
      <div className="vz-arac-in">
        <div className="vz-arac-sol">
          <h1 id="vz-h1" className="vz-h1">
            {t.h1}
          </h1>
          <p className="vz-arac-lead">{t.lead}</p>
          <Raf secili={durum.model} onSec={modelSec} />
          <Kurallar durum={durum} sonuc={sonuc} guncelle={guncelle} />
        </div>

        <div className="vz-arac-sag">
          <div className="vz-arac-ust">
            <DurumKutusu durum={durum} sonuc={sonuc} onCevir={evCevir} onYerlestir={() => ayarla(yerlestir(durum))} onModel={modelSec} />
            <div className="vz-arac-arac">
              <div className="vz-gorunum" role="group" aria-label={t.gorunum}>
                <button type="button" aria-pressed={gorunum === "plan"} onClick={planaGec}>
                  {t.plan}
                </button>
                <button
                  type="button"
                  aria-pressed={gorunum === "maket"}
                  onClick={maketeGec}
                  onPointerEnter={onizle}
                  onFocus={onizle}
                  disabled={maketHata}
                >
                  {t.maket}
                </button>
              </div>
              <button
                type="button"
                className={`vz-btn vz-btn--cizgi vz-btn--sm vz-cevir ${sonuc.oneri?.tur === "cevir" ? "is-oneri" : ""}`}
                onClick={() => evCevir()}
                aria-label={t.cevirAria}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="vz-ico">
                  <path d="M20 12a8 8 0 1 1-2.34-5.66" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.cevir}
              </button>
            </div>
          </div>

          <div className="vz-sahne" data-gorunum={gorunum}>
            <div className="vz-sahne-plan" aria-hidden={maketGorunur || undefined}>
              <Plan durum={durum} sonuc={sonuc} etkilesim={!maketGorunur} onTasi={tasi} onCevir={() => evCevir()} inis={inis} />
            </div>
            {maketAcik && !maketHata && (
              <div
                className={`vz-sahne-maket ${maketGorunur ? "is-gorunur" : ""}`}
                role="img"
                aria-label={`${t.maket}: ${t.svgOzet(durum.W, durum.D, `${sonuc.m.ad} ${sonuc.m.m2}`, sonuc.sigar)} ${t.cizim.yukseklik(durum.hmax)}.`}
                aria-hidden={!maketGorunur || undefined}
              >
                <MaketSiniri
                  onHata={() => {
                    setMaketHata(true);
                    setMaketGorunur(false);
                    setGorunum("plan");
                  }}
                >
                  <Maket
                    durum={durum}
                    sonuc={sonuc}
                    hedef={gorunum === "maket" ? 1 : 0}
                    inis={inis}
                    azHareket={azHareket}
                    onHazir={() => {
                      setMaketHazir(true);
                      setMaketGorunur(true);
                    }}
                    onDuz={() => setMaketGorunur(false)}
                  />
                </MaketSiniri>
              </div>
            )}
            {gorunum === "maket" && !maketGorunur && !maketHata && <p className="vz-sahne-not">{t.maketYukleniyor}</p>}
            {maketHata && <p className="vz-sahne-not">{t.maketHata}</p>}
          </div>
          <p className="vz-surukle">{gorunum === "plan" ? t.surukle : " "}</p>

          <Skor durum={durum} sonuc={sonuc} />
          <RuhsatNotu durum={durum} />
        </div>
      </div>
    </section>
  );
}

function DurumKutusu({
  durum,
  sonuc,
  onCevir,
  onYerlestir,
  onModel,
}: {
  durum: Durum;
  sonuc: Sonuc;
  onCevir: (rot?: Donus) => void;
  onYerlestir: () => void;
  onModel: (id: ModelId) => void;
}) {
  const t = tr.arac;
  const o = sonuc.oneri;
  const oneriSatiri = () => {
    if (!o) return null;
    switch (o.tur) {
      case "cevir":
        return (
          <p className="vz-durum-oneri">
            <b>{t.oneri.cevir}</b>{" "}
            <button type="button" className="vz-btn vz-btn--kobalt vz-btn--xs" onClick={() => onCevir(o.rot)}>
              {t.oneri.cevirBtn}
            </button>
          </p>
        );
      case "yerlestir":
        return (
          <p className="vz-durum-oneri">
            <b>{t.oneri.yerlestir}</b>{" "}
            <button type="button" className="vz-btn vz-btn--kobalt vz-btn--xs" onClick={onYerlestir}>
              {t.oneri.yerlestirBtn}
            </button>
          </p>
        );
      case "salon":
        return (
          <p className="vz-durum-oneri">
            {t.oneri.salon(o.yon)}{" "}
            <button type="button" className="vz-btn vz-btn--cizgi vz-btn--xs" onClick={() => onCevir(o.rot)}>
              {t.oneri.salonBtn}
            </button>
          </p>
        );
      case "model": {
        const m = modelBul(o.model)!;
        return (
          <p className="vz-durum-oneri">
            <b>{t.oneri.model(`${m.ad} ${m.m2}`)}</b>{" "}
            <button type="button" className="vz-btn vz-btn--kobalt vz-btn--xs" onClick={() => onModel(o.model)}>
              {t.oneri.modelBtn(`${m.ad} ${m.m2}`)}
            </button>
          </p>
        );
      }
      case "yok":
        return <p className="vz-durum-oneri">{t.oneri.yok}</p>;
    }
  };

  if (sonuc.sigar) {
    return (
      <div className="vz-durum" role="status">
        <p className="vz-durum-baslik">{t.sigiyor(sonuc.bahce)}</p>
        <p>{t.salon(sonuc.salonYon)}</p>
        {oneriSatiri()}
      </div>
    );
  }
  const [ilk, ikinci, ...kalan] = sonuc.ihlaller;
  return (
    <div className="vz-durum is-ihlal" role="status" data-nitelik={durum.nitelik}>
      <p className="vz-durum-baslik">{t.sigmiyor}</p>
      <p>
        <span className="vz-ihlal-etiket">{t.olasiIhlal}</span> {t.ihlal(ilk)}
      </p>
      {ikinci && (
        <p>
          <span className="vz-ihlal-etiket">{t.olasiIhlal}</span> {t.ihlal(ikinci)}
          {kalan.length > 0 && <span className="vz-durum-dahasi"> ({t.dahaFazla(kalan.length)})</span>}
        </p>
      )}
      {oneriSatiri()}
    </div>
  );
}

function Skor({ durum, sonuc }: { durum: Durum; sonuc: Sonuc }) {
  const t = tr.arac.skor;
  const { m, maliyet } = sonuc;
  return (
    <div className="vz-skor">
      <dl className="vz-skor-sayilar">
        <div>
          <dt>{t.taban}</dt>
          <dd className={sonuc.kurallar.taks ? "" : "is-kirmizi"}>
            {f0(m.taban)} <small>/ {f0(Math.floor(sonuc.taksHak))} m²</small>
          </dd>
        </div>
        <div>
          <dt>{t.bahce}</dt>
          <dd>
            {f0(sonuc.bahce)} <small>m²</small>
          </dd>
        </div>
        <div>
          <dt>{t.sacak}</dt>
          <dd className={sonuc.kurallar.hmax ? "" : "is-kirmizi"}>
            {f2(m.sacak)} <small>/ {f2(durum.hmax)} m</small>
          </dd>
        </div>
        <div>
          <dt>{t.salon}</dt>
          <dd>{tr.arac.yonAd[sonuc.salonYon]}</dd>
        </div>
      </dl>
      <div className="vz-skor-fiyat">
        <p className="vz-skor-fiyat-etiket">
          {t.fiyat} <span className="vz-ornek">{tr.ornek}</span>
        </p>
        <p className="vz-skor-tutar">{aralik(maliyet.toplam[0], maliyet.toplam[1])}</p>
        <p className="vz-skor-not">{t.fiyatNot}</p>
        <div className="vz-skor-act">
          <Link href={`${tr.base}/teklif/?${kodla(durum)}`} className="vz-btn vz-btn--kobalt">
            {t.teklif}
          </Link>
          <a href="#fiyat" className="vz-link-acik">
            {t.dokum}
          </a>
        </div>
      </div>
    </div>
  );
}

function RuhsatNotu({ durum }: { durum: Durum }) {
  const r = tr.arac.ruhsat[durum.nitelik];
  return (
    <p className={`vz-ruhsat-not ${durum.nitelik !== "arsa" ? "is-uyari" : ""}`}>
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="vz-ico">
        <circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 8.6v5.4M10 5.6v.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>
        <b>{r[0]}</b> {r[1]}{" "}
        <Link href={`${tr.base}/ruhsat-ve-imar/`} className="vz-link-acik">
          {tr.arac.ruhsat.link}
        </Link>
      </span>
    </p>
  );
}
