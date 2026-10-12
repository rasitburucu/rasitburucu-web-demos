"use client";

// "Arsanızın kuralları": the plot and the planning values, read off the
// zoning certificate. Every row says where that value sits on the document;
// a row turns ✕ when the house breaks it. "Belgem elimde yok" explains the
// defaults and how to get the real values.
import { useEffect, useId, useRef, useState } from "react";
import { SINIR, YONETMELIK, type Durum, type Nitelik, type SayiAlan, type Sonuc, type Yon } from "@/lib/vaziyet/hesap";
import { oku, sayi } from "@/lib/vaziyet/bicim";
import { tr } from "@/content/vaziyet/tr";

type Ipucu = keyof typeof tr.arac.ipucu;
const ALANLAR: SayiAlan[] = ["W", "D", "taks", "kaks", "on", "yan", "arka", "hmax"];
const IPUCU: Record<SayiAlan, Ipucu> = { W: "arsa", D: "arsa", taks: "taks", kaks: "kaks", on: "bahce", yan: "bahce", arka: "bahce", hmax: "hmax" };
const goster = (k: SayiAlan, v: number) => (k === "taks" || k === "kaks" ? v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : sayi(v));

function Isaret({ ok }: { ok: boolean }) {
  const t = tr.arac.durumKural;
  return (
    <span className={`vz-isaret ${ok ? "is-ok" : "is-no"}`}>
      <span aria-hidden="true">{ok ? "✓" : "✕"}</span>
      <span className="vz-sr">{ok ? t.tamam : t.ihlal}</span>
    </span>
  );
}

export function Kurallar({ durum, sonuc, guncelle }: { durum: Durum; sonuc: Sonuc; guncelle: (p: Partial<Durum>) => void }) {
  const t = tr.arac;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [metin, setMetin] = useState<Record<SayiAlan, string>>(() => Object.fromEntries(ALANLAR.map((k) => [k, goster(k, durum[k])])) as Record<SayiAlan, string>);
  const [hatali, setHatali] = useState<Partial<Record<SayiAlan, boolean>>>({});
  const [odak, setOdak] = useState<Ipucu | null>(null);
  const [belgeYok, setBelgeYok] = useState(false);
  const yaziyor = useRef<SayiAlan | null>(null);

  // values changed elsewhere (reset, a shared link): show them, unless the field is being typed in
  useEffect(() => {
    setMetin((eski) => {
      const yeni = { ...eski };
      for (const k of ALANLAR) if (yaziyor.current !== k && oku(eski[k]) !== durum[k]) yeni[k] = goster(k, durum[k]);
      return yeni;
    });
  }, [durum]);

  const degis = (k: SayiAlan, s: string) => {
    setMetin((m) => ({ ...m, [k]: s }));
    const v = oku(s);
    const [a, b] = SINIR[k];
    const ok = v !== null && v >= a && v <= b;
    setHatali((h) => ({ ...h, [k]: !ok }));
    if (ok) guncelle({ [k]: v } as Partial<Durum>);
  };

  const alan = (k: SayiAlan, etiket: string, genis = false) => (
    <input
      id={`${uid}-${k}`}
      className={`vz-girdi ${genis ? "vz-girdi--genis" : ""}`}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      enterKeyHint="next"
      value={metin[k]}
      aria-label={etiket}
      aria-invalid={hatali[k] || undefined}
      aria-describedby={hatali[k] ? `${uid}-${k}-h` : undefined}
      onChange={(e) => degis(k, e.target.value)}
      onFocus={(e) => {
        yaziyor.current = k;
        setOdak(IPUCU[k]);
        e.currentTarget.select();
      }}
      onBlur={() => {
        yaziyor.current = null;
        setHatali((h) => ({ ...h, [k]: false }));
        setMetin((m) => ({ ...m, [k]: goster(k, durum[k]) }));
      }}
    />
  );
  const hata = (ks: SayiAlan[]) =>
    ks
      .filter((k) => hatali[k])
      .map((k) => (
        <p key={k} id={`${uid}-${k}-h`} className="vz-girdi-hata" role="alert">
          {t.gecersiz(sayi(SINIR[k][0]), sayi(SINIR[k][1]))}
        </p>
      ));

  const ip = odak ? t.ipucu[odak] : null;
  const k = sonuc.kurallar;

  return (
    <div className="vz-kart vz-kurallar">
      <h2 className="vz-kart-baslik">
        {t.kartBaslik} <span>{t.kartNot}</span>
      </h2>

      <div className="vz-kural">
        <label htmlFor={`${uid}-W`} className="vz-kural-ad">
          {t.arsa} <small>{t.arsaAlt}</small>
        </label>
        <span className="vz-kural-deger">
          {alan("W", t.cephe)}
          <span aria-hidden="true">×</span>
          {alan("D", t.derinlik)}
          <span className="vz-birim">{t.birim}</span>
        </span>
        <span className="vz-isaret-yer" />
        {hata(["W", "D"])}
      </div>

      <div className="vz-kural vz-kural--nitelik" role="group" aria-labelledby={`${uid}-n`}>
        <span id={`${uid}-n`} className="vz-kural-ad">
          {t.nitelik}
        </span>
        <span className="vz-secenek" onFocus={() => setOdak("nitelik")}>
          {(["arsa", "tarla", "bilmiyorum"] as Nitelik[]).map((n) => (
            <button key={n} type="button" aria-pressed={durum.nitelik === n} onClick={() => guncelle({ nitelik: n })} className={n === "tarla" ? "is-uyari" : undefined}>
              {t.nitelikAd[n]}
            </button>
          ))}
        </span>
        <span className="vz-isaret-yer" />
      </div>

      <div className="vz-kural">
        <label htmlFor={`${uid}-taks`} className="vz-kural-ad">
          {t.taks} <small>{t.taksAlt}</small>
        </label>
        <span className="vz-kural-deger">{alan("taks", `${t.taks}, ${t.taksAlt}`)}</span>
        <Isaret ok={k.taks} />
        {hata(["taks"])}
      </div>

      <div className="vz-kural">
        <label htmlFor={`${uid}-kaks`} className="vz-kural-ad">
          {t.kaks} <small>{t.kaksAlt}</small>
        </label>
        <span className="vz-kural-deger">{alan("kaks", `${t.kaks}, ${t.kaksAlt}`)}</span>
        <Isaret ok={k.kaks} />
        {hata(["kaks"])}
      </div>

      <div className="vz-kural">
        <label htmlFor={`${uid}-on`} className="vz-kural-ad">
          {t.bahce} <small>{t.bahceAlt}</small>
        </label>
        <span className="vz-kural-deger">
          {alan("on", t.on)}
          {alan("yan", t.yan)}
          {alan("arka", t.arka)}
          <span className="vz-birim">{t.birim}</span>
        </span>
        <Isaret ok={k.cekme} />
        {hata(["on", "yan", "arka"])}
      </div>

      <div className="vz-kural">
        <label htmlFor={`${uid}-hmax`} className="vz-kural-ad">
          {t.hmax} <small>{t.hmaxAlt}</small>
        </label>
        <span className="vz-kural-deger">
          {alan("hmax", `${t.hmax}, metre`)}
          <span className="vz-birim">{t.birim}</span>
        </span>
        <Isaret ok={k.hmax} />
        {hata(["hmax"])}
      </div>

      <div className="vz-kural vz-kural--yol" role="group" aria-labelledby={`${uid}-y`}>
        <span id={`${uid}-y`} className="vz-kural-ad">
          {t.yol}
        </span>
        <Pusula yol={durum.yol} onSec={(y) => guncelle({ yol: y })} onOdak={() => setOdak("yol")} />
        <span className="vz-isaret-yer" />
      </div>

      <div className="vz-ipucu" aria-live="polite">
        {ip ? (
          <>
            <p className="vz-ipucu-baslik">{t.ipucuBaslik}</p>
            {ip.belge && (
              <p className="vz-belge-satir">
                <mark>{ip.belge}</mark>
              </p>
            )}
            <p>{ip.metin}</p>
          </>
        ) : (
          <p>
            <b>{t.belgeYok.baslik}:</b> {t.belgeYok.metin.split(". ")[0]}.
          </p>
        )}
        <button type="button" className="vz-link-btn" aria-expanded={belgeYok} aria-controls={`${uid}-by`} onClick={() => setBelgeYok((v) => !v)}>
          {t.belgeYok.buton}
        </button>
      </div>

      <div id={`${uid}-by`} className="vz-belgeyok" hidden={!belgeYok}>
        <p className="vz-belgeyok-baslik">{t.belgeYok.baslik}</p>
        <p>{t.belgeYok.metin}</p>
        <p>{t.belgeYok.nasil}</p>
        <div className="vz-row">
          <button
            type="button"
            className="vz-btn vz-btn--cizgi-k vz-btn--sm"
            onClick={() => guncelle({ on: YONETMELIK.on, yan: YONETMELIK.yan, arka: YONETMELIK.arka })}
          >
            {t.belgeYok.sifirla}
          </button>
          <button type="button" className="vz-link-btn" onClick={() => setBelgeYok(false)}>
            {t.belgeYok.kapat}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Which side of the plot is the road on: a 3 × 3 compass around a tiny plot. */
function Pusula({ yol, onSec, onOdak }: { yol: Yon; onSec: (y: Yon) => void; onOdak: () => void }) {
  const t = tr.arac;
  // grid order: KB K KD / B · D / GB G GD
  const sira: (Yon | null)[] = ["KB", "K", "KD", "B", null, "D", "GB", "G", "GD"];
  const aci: Record<Yon, number> = { K: 0, KD: 45, D: 90, GD: 135, G: 180, GB: 225, B: 270, KB: 315 };
  return (
    <span className="vz-pusula" onFocus={onOdak}>
      {sira.map((y, i) =>
        y ? (
          <button key={y} type="button" aria-pressed={yol === y} aria-label={t.yolAria(y)} title={t.yonAd[y]} onClick={() => onSec(y)}>
            {y}
          </button>
        ) : (
          <span key={i} className="vz-pusula-orta" aria-hidden="true">
            <svg viewBox="-10 -10 20 20">
              <rect x={-5.5} y={-5.5} width={11} height={11} rx={1} fill="#c89b68" stroke="#7a5530" strokeWidth={0.8} />
              <g transform={`rotate(${aci[yol]})`}>
                <rect x={-7.5} y={-9.6} width={15} height={3} rx={0.6} fill="#8c9996" />
              </g>
            </svg>
          </span>
        ),
      )}
    </span>
  );
}

