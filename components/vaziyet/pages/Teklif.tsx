"use client";

// Quote summary: the visitor's plot, values, model and placement, the result
// and the itemised estimate come first; the short request form after them.
// Nothing is sent: the "ready" card shows what the sales team would receive.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { tr, nitelikAd, yonAd } from "@/content/vaziyet/tr";
import { hesapla } from "@/lib/vaziyet/hesap";
import { araSayi, aralik, f0, f1, f2, oran, tl } from "@/lib/vaziyet/bicim";
import { kodla } from "@/lib/vaziyet/url";
import { useDurum } from "@/lib/vaziyet/durum";
import { erisimSonuc, useErisim, type Cevap, type Erisim } from "@/lib/vaziyet/erisim";
import { Plan } from "../arac/Plan";
import { IlSec } from "../ui/IlSec";
import { Ornek } from "../shell/Shell";
import { WaButton } from "../shell/Wa";

type Form = { ad: string; tel: string; ilce: string; belge: string; zaman: string; donus: string; saat: string; not: string };
const BOS: Form = { ad: "", tel: "", ilce: "", belge: "", zaman: "", donus: "", saat: "", not: "" };

export function Teklif() {
  const { durum, guncelle } = useDurum();
  const s = useMemo(() => hesapla(durum), [durum]);
  const t = tr.teklif;
  const f = t.form;
  const { erisim, yaz } = useErisim();
  const [form, setForm] = useState<Form>(BOS);
  const [hata, setHata] = useState<{ ad?: boolean; tel?: boolean }>({});
  const [gonderildi, setGonderildi] = useState(false);
  const [kopya, setKopya] = useState(false);
  const [link, setLink] = useState("");
  const q = kodla(durum);

  useEffect(() => {
    setLink(`${location.origin}${location.pathname}?${q}`);
    // the visitor now has a plot of their own: the "sample plot" note goes
    try {
      if (location.search || sessionStorage.getItem("vaziyet-arsa-v1")) document.documentElement.classList.remove("vz-adres-yok");
    } catch {
      /* private mode */
    }
  }, [q]);

  const k = s.maliyet;
  const kurulum: [number, number] = [k.montaj[0] + k.vinc[0], k.montaj[1] + k.vinc[1]];
  const ev = s.ev;

  const gonder = (e: React.FormEvent) => {
    e.preventDefault();
    const tel = form.tel.replace(/\D/g, "");
    const h = { ad: form.ad.trim().split(/\s+/).length < 2, tel: !/^0?5\d{9}$/.test(tel) };
    setHata(h);
    if (h.ad || h.tel) {
      document.getElementById(h.ad ? "vz-f-ad" : "vz-f-tel")?.focus();
      return;
    }
    setGonderildi(true);
    requestAnimationFrame(() => document.getElementById("vz-hazir")?.focus());
  };
  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard blocked: the link is still on screen */
    }
    setKopya(true);
  };
  const sorular = tr.uretim.erisim.sorular;
  const iyi = Object.fromEntries(sorular.map((x) => [x.id, x.iyi])) as Record<string, Cevap>;
  const hataSay = Number(!!hata.ad) + Number(!!hata.tel);
  const mesaj = tr.wa.arsa(f1(durum.W), f1(durum.D), `${s.m.ad} ${s.m.m2}`, k.il, nitelikAd(durum.nitelik).toLocaleLowerCase("tr"));

  return (
    <>
      <section className="vz-sayfa-bas vz-mat">
        <div className="vz-wrap">
          <h1 className="vz-h1">{t.baslik}</h1>
          <p className="vz-lead">{t.lead}</p>
          <p className="vz-sayfa-not vz-adres-not">{t.bos}</p>
        </div>
      </section>

      <section className="vz-bant vz-bant--kagit vz-teklif">
        <div className="vz-wrap vz-teklif-in">
          <div className="vz-ozet">
            <div className={`vz-ozet-sonuc ${s.sigar ? "is-ok" : "is-no"}`}>
              <p className="vz-ozet-sonuc-baslik">{s.sigar ? tr.arac.sigiyor(s.bahce) : tr.arac.sigmiyor}</p>
              {s.sigar ? (
                <p>{tr.arac.salon(s.salonYon)}</p>
              ) : (
                <>
                  <ul>
                    {s.ihlaller.map((i, n) => (
                      <li key={n}>
                        <span className="vz-ihlal-etiket">{tr.arac.olasiIhlal}</span> {tr.arac.ihlal(i)}
                      </li>
                    ))}
                  </ul>
                  <p>{t.sigmiyorNot}</p>
                </>
              )}
            </div>

            <div className="vz-ozet-plan">
              <Plan durum={durum} sonuc={s} tur="kucuk" />
            </div>

            <div className="vz-ozet-bloklar">
              <div className="vz-ozet-blok">
                <h2 className="vz-ozet-blok-baslik">{t.arsaBaslik}</h2>
                <dl>
                <div>
                  <dt>{t.olcu}</dt>
                  <dd>
                    {f1(durum.W)} × {f1(durum.D)} m
                  </dd>
                </div>
                <div>
                  <dt>{t.alan}</dt>
                  <dd>{f0(s.alan)} m²</dd>
                </div>
                <div>
                  <dt>{t.nitelik}</dt>
                  <dd className={durum.nitelik !== "arsa" ? "is-uyari" : undefined}>{nitelikAd(durum.nitelik)}</dd>
                </div>
                <div>
                  <dt>{t.yol}</dt>
                  <dd>{yonAd(durum.yol)}</dd>
                </div>
              </dl>
              </div>
              <div className="vz-ozet-blok">
                <h2 className="vz-ozet-blok-baslik">{t.imarBaslik}</h2>
                <dl>
                <div>
                  <dt>{t.taks}</dt>
                  <dd>
                    {oran(durum.taks)} <small>({f0(s.taksHak)} m²)</small>
                  </dd>
                </div>
                <div>
                  <dt>{t.kaks}</dt>
                  <dd>
                    {oran(durum.kaks)} <small>({f0(s.kaksHak)} m²)</small>
                  </dd>
                </div>
                <div>
                  <dt>{t.bahce}</dt>
                  <dd>
                    {f1(durum.on)} · {f1(durum.yan)} · {f1(durum.arka)} m
                  </dd>
                </div>
                <div>
                  <dt>{t.hmax}</dt>
                  <dd>{f2(durum.hmax)} m</dd>
                </div>
              </dl>
              </div>
              <div className="vz-ozet-blok">
                <h2 className="vz-ozet-blok-baslik">{t.modelBaslik}</h2>
                <dl>
                <div>
                  <dt>{t.model}</dt>
                  <dd>
                    {s.m.ad} {s.m.m2} · {s.m.oda}
                  </dd>
                </div>
                <div>
                  <dt>{t.disOlcu}</dt>
                  <dd>
                    {f1(s.m.w)} × {f1(s.m.d)} m
                  </dd>
                </div>
                <div>
                  <dt>{t.donus}</dt>
                  <dd>{t.donusDeger(durum.rot)}</dd>
                </div>
                <div>
                  <dt>{tr.pafta.mesafeler}</dt>
                  <dd>
                    {tr.pafta.on} {f1(ev.y0)} · {tr.pafta.arka} {f1(durum.D - ev.y1)} · {tr.pafta.sol} {f1(ev.x0)} · {tr.pafta.sag} {f1(durum.W - ev.x1)} m
                  </dd>
                </div>
                <div>
                  <dt>{t.kalanBahce}</dt>
                  <dd>{f0(s.bahce)} m²</dd>
                </div>
                <div>
                  <dt>{t.salon}</dt>
                  <dd>{yonAd(s.salonYon)}</dd>
                </div>
              </dl>
              </div>
              <div className="vz-ozet-blok vz-ozet-blok--fiyat">
                <h2 className="vz-ozet-blok-baslik">
                  {t.maliyetBaslik} <Ornek />
                </h2>
                <dl>
                <div>
                  <dt>{tr.maliyet.ev}</dt>
                  <dd>{tl(k.ev)}</dd>
                </div>
                <div>
                  <dt>{tr.maliyet.nakliye}</dt>
                  <dd>{aralik(k.nakliye[0], k.nakliye[1])}</dd>
                </div>
                <div>
                  <dt>{tr.maliyet.temel}</dt>
                  <dd>{aralik(k.temel[0], k.temel[1])}</dd>
                </div>
                <div>
                  <dt>{tr.maliyet.kurulum}</dt>
                  <dd>{aralik(kurulum[0], kurulum[1])}</dd>
                </div>
                <div className="is-toplam">
                  <dt>{tr.maliyet.toplam}</dt>
                  <dd>{aralik(k.toplam[0], k.toplam[1])}</dd>
                </div>
              </dl>
                <p className="vz-ozet-kucuk">
                  {tr.maliyet.kdv} {tr.maliyet.sureUretim(araSayi(s.m.uretimHafta))}, {tr.maliyet.sureKurulum(araSayi(s.m.kurulumGun)).toLocaleLowerCase("tr")}.
                </p>
                <IlSec il={durum.il} onSec={(il) => guncelle({ il })} />
              </div>
            </div>

            <div className="vz-ozet-act">
              <Link href={`${tr.base}/teklif/vaziyet-plani/?${q}`} className="vz-btn vz-btn--kobalt">
                {t.taslak}
              </Link>
              <Link href={`${tr.base}/?${q}#arac`} className="vz-btn vz-btn--cizgi-k">
                {t.duzenle}
              </Link>
              <button type="button" className="vz-btn vz-btn--cizgi-k" onClick={kopyala}>
                <span aria-live="polite">{kopya ? t.kopyalandi : t.kopyala}</span>
              </button>
            </div>
            <p className="vz-muted vz-not">
              {t.taslakNot} {t.kopyalaNot}
            </p>
          </div>

          <div className="vz-talep" id="talep">
            {!gonderildi ? (
              <form className="vz-form" onSubmit={gonder} noValidate>
                <h2 className="vz-h2">{f.baslik}</h2>
                <p className="vz-muted">{f.lead}</p>
                {hataSay > 0 && (
                  <p className="vz-form-hata-ozet" role="alert">
                    {f.hataOzet(hataSay)}
                  </p>
                )}
                <div className="vz-alan">
                  <label htmlFor="vz-f-ad">{f.ad}</label>
                  <input
                    id="vz-f-ad"
                    autoComplete="name"
                    value={form.ad}
                    onChange={(e) => setForm({ ...form, ad: e.target.value })}
                    aria-invalid={hata.ad || undefined}
                    aria-describedby={hata.ad ? "vz-f-ad-h" : undefined}
                  />
                  {hata.ad && (
                    <p id="vz-f-ad-h" className="vz-alan-hata">
                      {f.hataAd}
                    </p>
                  )}
                </div>
                <div className="vz-alan">
                  <label htmlFor="vz-f-tel">{f.tel}</label>
                  <input
                    id="vz-f-tel"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={f.telIpucu}
                    value={form.tel}
                    onChange={(e) => setForm({ ...form, tel: e.target.value })}
                    aria-invalid={hata.tel || undefined}
                    aria-describedby={hata.tel ? "vz-f-tel-h" : undefined}
                  />
                  {hata.tel && (
                    <p id="vz-f-tel-h" className="vz-alan-hata">
                      {f.hataTel}
                    </p>
                  )}
                </div>
                <div className="vz-alan">
                  <label htmlFor="vz-f-ilce">
                    {f.ilce} <small>({f.istege})</small>
                  </label>
                  <input id="vz-f-ilce" value={form.ilce} onChange={(e) => setForm({ ...form, ilce: e.target.value })} />
                </div>

                <fieldset className="vz-alan-grup">
                  <legend>{f.erisim}</legend>
                  {sorular.map((x) => (
                    <fieldset key={x.id} className="vz-soru vz-soru--acik">
                      <legend>{x.soru}</legend>
                      <div className="vz-soru-secenek">
                        {x.secenek.map((c) => (
                          <label key={c} className={erisim[x.id as keyof Erisim] === c ? "is-secili" : undefined}>
                            <input type="radio" name={`t-${x.id}`} value={c} checked={erisim[x.id as keyof Erisim] === c} onChange={() => yaz(x.id as keyof Erisim, c as Cevap)} />
                            {tr.uretim.erisim.cevap[c]}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <p className={`vz-erisim-sonuc vz-erisim-sonuc--acik is-${erisimSonuc(erisim, iyi)}`}>{tr.uretim.erisim.sonuc[erisimSonuc(erisim, iyi)]}</p>
                </fieldset>

                <Secim ad="belge" baslik={f.belge} secenek={f.belgeSecenek} deger={form.belge} onSec={(v) => setForm({ ...form, belge: v })} />
                <Secim ad="zaman" baslik={f.zaman} secenek={f.zamanSecenek} deger={form.zaman} onSec={(v) => setForm({ ...form, zaman: v })} />
                <Secim ad="donus" baslik={f.donus} secenek={f.donusSecenek} deger={form.donus} onSec={(v) => setForm({ ...form, donus: v })} />
                <Secim ad="saat" baslik={f.saat} secenek={f.saatSecenek} deger={form.saat} onSec={(v) => setForm({ ...form, saat: v })} />

                <div className="vz-alan">
                  <label htmlFor="vz-f-not">
                    {f.not} <small>({f.istege})</small>
                  </label>
                  <textarea id="vz-f-not" rows={3} value={form.not} onChange={(e) => setForm({ ...form, not: e.target.value })} />
                </div>
                <div className="vz-form-gonder" data-vz-bar-hide>
                  <button type="submit" className="vz-btn vz-btn--kobalt vz-btn--big">
                    {f.gonder}
                  </button>
                  <p className="vz-demo">{f.demo}</p>
                </div>
              </form>
            ) : (
              <div className="vz-hazir" id="vz-hazir" tabIndex={-1}>
                <h2 className="vz-h2">{t.hazir.baslik}</h2>
                <p>{t.hazir.metin}</p>
                <dl className="vz-ozet-blok">
                  <div>
                    <dt>{f.ad}</dt>
                    <dd>{form.ad}</dd>
                  </div>
                  <div>
                    <dt>{f.tel}</dt>
                    <dd>{form.tel}</dd>
                  </div>
                  {form.ilce && (
                    <div>
                      <dt>{f.ilce}</dt>
                      <dd>{form.ilce}</dd>
                    </div>
                  )}
                  <div>
                    <dt>{t.model}</dt>
                    <dd>
                      {s.m.ad} {s.m.m2} · {f1(durum.W)} × {f1(durum.D)} m · {k.il}
                    </dd>
                  </div>
                  {[form.belge, form.zaman, form.donus, form.saat].filter(Boolean).length > 0 && (
                    <div>
                      <dt>{f.donus}</dt>
                      <dd>{[form.belge, form.zaman, form.donus, form.saat].filter(Boolean).join(" · ")}</dd>
                    </div>
                  )}
                </dl>
                <p className="vz-demo">{f.demo}</p>
                <div className="vz-row">
                  <Link href={`${tr.base}/teklif/vaziyet-plani/?${q}`} className="vz-btn vz-btn--kobalt">
                    {t.taslak}
                  </Link>
                  <WaButton message={mesaj} className="vz-btn vz-btn--cizgi-k" />
                  <button type="button" className="vz-link-btn" onClick={() => setGonderildi(false)}>
                    {t.hazir.duzenle}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Secim({ ad, baslik, secenek, deger, onSec }: { ad: string; baslik: string; secenek: string[]; deger: string; onSec: (v: string) => void }) {
  return (
    <fieldset className="vz-soru vz-soru--acik">
      <legend>{baslik}</legend>
      <div className="vz-soru-secenek">
        {secenek.map((c) => (
          <label key={c} className={deger === c ? "is-secili" : undefined}>
            <input type="radio" name={`t-${ad}`} value={c} checked={deger === c} onChange={() => onSec(c)} />
            {c}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
