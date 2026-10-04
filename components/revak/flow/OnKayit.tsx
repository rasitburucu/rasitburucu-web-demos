"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { KADEMELER, isKademe, readParam, useShared, type Kademe } from "@/lib/revak/store";
import { ageOn, emailOk, phoneOk } from "@/lib/revak/format";
import { KvkkLink } from "../ui/Drawer";
import { HelpCard, KademePlate, Check, Choices, DateField, FlowShell, KvkkCheck, PhoneField, Review, SealMark, SelectField, TextField, useFlowForm, useFocusOnMount } from "./kit";

const c = tr.flows.common;
const t = tr.flows.onKayit;

type V = {
  yil: string;
  kademe: Kademe | "";
  sinif: string;
  ad: string;
  soyad: string;
  dogum: string;
  okul: string;
  ingilizce: string;
  kardes: boolean;
  ozel: boolean;
  yakinlik: string;
  veliAd: string;
  telefon: string;
  eposta: string;
  kanal: string;
  saat: string;
  ikinci: boolean;
  ikinciAd: string;
  ikinciTel: string;
  kvkk: boolean;
  etk: boolean;
};

const STEP_FIELDS: (keyof V & string)[][] = [
  ["yil", "kademe", "sinif"],
  ["ad", "soyad", "dogum", "okul"],
  ["yakinlik", "veliAd", "telefon", "eposta", "ikinciAd", "ikinciTel"],
  ["kvkk"],
];

const sinifOf = (v: Pick<V, "kademe" | "sinif">) => (v.kademe ? c.siniflar[v.kademe].find((s) => s.id === v.sinif) : undefined);
const refDate = (yil: string) => (yil === "2026-2027" ? "2026-09-01" : "2027-09-01");

export function OnKayitFlow() {
  const { shared, update, ready } = useShared();
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [review, setReview] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const applied = useRef(false);

  const f = useFlowForm<V>(
    {
      yil: "2027-2028",
      kademe: "",
      sinif: "",
      ad: "",
      soyad: "",
      dogum: "",
      okul: "",
      ingilizce: "",
      kardes: false,
      ozel: false,
      yakinlik: "",
      veliAd: "",
      telefon: "",
      eposta: "",
      kanal: "Telefon",
      saat: "",
      ikinci: false,
      ikinciAd: "",
      ikinciTel: "",
      kvkk: false,
      etk: false,
    },
    {
      yil: (v) => (v.yil ? "" : t.s1.errors.yil),
      kademe: (v) => (v.kademe ? "" : t.s1.errors.kademe),
      sinif: (v) => (sinifOf(v) ? "" : t.s1.errors.sinif),
      ad: (v) => (v.ad.trim() ? "" : t.s2.errors.ad),
      soyad: (v) => (v.soyad.trim() ? "" : t.s2.errors.soyad),
      dogum: (v) => (!v.dogum ? t.s2.errors.dogum : v.dogum < "2006-01-01" || v.dogum > "2025-01-01" ? t.s2.errors.dogumRange : ""),
      okul: (v) => (v.kademe && v.kademe !== "anaokulu" && !v.okul.trim() ? t.s2.errors.okul : ""),
      yakinlik: (v) => (v.yakinlik ? "" : t.s3.errors.yakinlik),
      veliAd: (v) => (v.veliAd.trim().includes(" ") ? "" : c.fieldErrors.veliAd),
      telefon: (v) => (phoneOk(v.telefon) ? "" : c.errors.phone),
      eposta: (v) => (emailOk(v.eposta) ? "" : c.errors.email),
      ikinciAd: (v) => (v.ikinci && !v.ikinciAd.trim() ? t.s3.errors.ikinciAd : ""),
      ikinciTel: (v) => (v.ikinci && !phoneOk(v.ikinciTel) ? c.errors.phone : ""),
      kvkk: (v) => (v.kvkk ? "" : c.kvkkError),
    },
  );
  const v = f.values;

  // Prefill once: URL (?kademe=&sinif=) wins over what other flows left behind.
  useEffect(() => {
    if (!ready || applied.current) return;
    applied.current = true;
    const qk = readParam("kademe");
    const qs = readParam("sinif");
    const kademe = isKademe(qk) ? qk : shared.kademe;
    const sinifId = qs ?? (kademe === shared.kademe ? shared.sinif : undefined);
    const valid = kademe && sinifId && c.siniflar[kademe].some((s) => s.id === sinifId);
    f.patch({
      ...(kademe ? { kademe } : {}),
      ...(valid ? { sinif: sinifId } : {}),
      ...(shared.yil ? { yil: shared.yil } : {}),
      ...(shared.veliAd ? { veliAd: shared.veliAd } : {}),
      ...(shared.telefon ? { telefon: shared.telefon } : {}),
      ...(shared.eposta ? { eposta: shared.eposta } : {}),
      ...(shared.ogrenciAd ? { ad: shared.ogrenciAd } : {}),
      ...(shared.ogrenciSoyad ? { soyad: shared.ogrenciSoyad } : {}),
      ...(shared.okul ? { okul: shared.okul } : {}),
    });
  }, [ready, shared, f]);

  const go = (n: number) => {
    setStep(n);
    setMaxReached((m) => Math.max(m, n));
  };
  const next = () => {
    if (!f.check(STEP_FIELDS[step])) return;
    if (step === 0) update({ kademe: v.kademe || undefined, sinif: v.sinif, yil: v.yil });
    if (step === 1) update({ ogrenciAd: v.ad.trim(), ogrenciSoyad: v.soyad.trim(), okul: v.okul.trim() });
    if (step === 2) update({ veliAd: v.veliAd.trim(), telefon: v.telefon, eposta: v.eposta.trim() });
    if (step === 3) {
      setDone(`RV-${v.yil.slice(2, 4)}-${String(Math.floor(1000 + Math.random() * 8999))}`);
      return;
    }
    if (review) {
      setReview(false);
      return go(3);
    }
    go(step + 1);
  };

  if (done) return <Done refNo={done} v={v} />;

  const cls = sinifOf(v);
  const age = v.dogum && cls ? ageOn(v.dogum, refDate(v.yil)) : null;
  const ageWarn = age !== null && cls && (age < cls.age[0] || age > cls.age[1]);

  const titles = [t.s1.title, t.s2.title, t.s3.title, t.s4.title];

  return (
    <FlowShell
      name={t.name}
      steps={t.steps}
      step={step}
      maxReached={maxReached}
      onStep={(i) => go(i)}
      title={titles[step]}
      onBack={step > 0 ? () => (review ? (setReview(false), go(3)) : go(step - 1)) : undefined}
      onNext={next}
      nextLabel={step === 3 ? t.s4.submit : review ? c.toSummary : undefined}
      nextDisabled={step === 0 && !v.kademe}
      nextDescribedBy={f.shown("kademe") ? "rv-f-kademe-err" : "rv-f-sinif"}
      submitNote={step === 3}
      aside={<HelpCard note={t.helpNote} />}
      plate={step < 3 && !review ? <KademePlate kademe={v.kademe || shared.kademe || ""} /> : undefined}
    >
      {step === 0 && (
        <>
          <Choices
            name="yil"
            label={t.s1.yil}
            variant="wide"
            value={v.yil}
            error={f.shown("yil")}
            onChange={(x) => f.set("yil", x as string)}
            options={t.s1.yillar.map((y) => ({ value: y.id, label: y.label, hint: y.hint }))}
          />
          <Choices
            name="kademe"
            label={t.s1.kademe}
            value={v.kademe}
            error={f.shown("kademe")}
            onChange={(x) => {
              const k = x as Kademe;
              f.patch({ kademe: k, sinif: c.siniflar[k].some((s) => s.id === v.sinif) ? v.sinif : "" });
            }}
            options={KADEMELER.map((k) => ({ value: k, label: c.kademe[k], hint: c.kademeHint[k] }))}
          />
          {v.kademe ? (
            <Choices
              name="sinif"
              label={t.s1.sinif}
              variant="chips"
              value={v.sinif}
              error={f.shown("sinif")}
              onChange={(x) => f.set("sinif", x as string)}
              options={c.siniflar[v.kademe].map((s) => ({ value: s.id, label: s.label }))}
            />
          ) : f.shown("kademe") ? null : (
            <p className="rv-hint" id="rv-f-sinif">
              {t.s1.sinifPick}
            </p>
          )}
        </>
      )}

      {step === 1 && (
        <>
          <div className="rv-field-row">
            <TextField name="ad" label={t.s2.ad} value={v.ad} autoComplete="off" error={f.shown("ad")} onChange={(x) => f.set("ad", x)} onBlur={() => f.blur("ad")} />
            <TextField name="soyad" label={t.s2.soyad} value={v.soyad} autoComplete="off" error={f.shown("soyad")} onChange={(x) => f.set("soyad", x)} onBlur={() => f.blur("soyad")} />
          </div>
          <DateField name="dogum" label={t.s2.dogum} value={v.dogum} min="2006-01-01" max="2025-01-01" error={f.shown("dogum")} onChange={(x) => f.set("dogum", x)} onBlur={() => f.blur("dogum")} />
          {ageWarn && !f.shown("dogum") && <p className="rv-warn">{t.s2.ageWarn}</p>}
          <TextField
            name="okul"
            label={t.s2.okul}
            value={v.okul}
            optional={v.kademe === "anaokulu"}
            error={f.shown("okul")}
            onChange={(x) => f.set("okul", x)}
            onBlur={() => f.blur("okul")}
          />
          <Choices
            name="ingilizce"
            label={t.s2.ingilizce}
            optional
            variant="chips"
            value={v.ingilizce}
            onChange={(x) => f.set("ingilizce", x as string)}
            options={t.s2.seviyeler.map((s) => ({ value: s, label: s }))}
          />
          <Check name="kardes" checked={v.kardes} onChange={(x) => f.set("kardes", x)}>
            {t.s2.kardes}
          </Check>
          <Check name="ozel" checked={v.ozel} onChange={(x) => f.set("ozel", x)} hint={t.s2.ozelHint}>
            {t.s2.ozel}
          </Check>
        </>
      )}

      {step === 2 && (
        <>
          <Choices
            name="yakinlik"
            label={t.s3.yakinlik}
            variant="chips"
            value={v.yakinlik}
            error={f.shown("yakinlik")}
            onChange={(x) => f.set("yakinlik", x as string)}
            options={t.s3.yakinliklar.map((s) => ({ value: s, label: s }))}
          />
          <TextField name="veliAd" label={c.fields.veliAd} value={v.veliAd} autoComplete="name" error={f.shown("veliAd")} onChange={(x) => f.set("veliAd", x)} onBlur={() => f.blur("veliAd")} />
          <div className="rv-field-row">
            <PhoneField name="telefon" label={c.fields.telefon} value={v.telefon} error={f.shown("telefon")} onChange={(x) => f.set("telefon", x)} onBlur={() => f.blur("telefon")} />
            <TextField
              name="eposta"
              label={c.fields.eposta}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={v.eposta}
              error={f.shown("eposta")}
              onChange={(x) => f.set("eposta", x)}
              onBlur={() => f.blur("eposta")}
            />
          </div>
          <Choices name="kanal" label={t.s3.kanal} variant="chips" value={v.kanal} onChange={(x) => f.set("kanal", x as string)} options={t.s3.kanallar.map((s) => ({ value: s, label: s }))} />
          <SelectField
            name="saat"
            label={t.s3.saat}
            optional
            placeholder={c.select}
            value={v.saat}
            onChange={(x) => f.set("saat", x)}
            onBlur={() => f.blur("saat")}
            options={t.s3.saatler.map((s) => ({ value: s, label: s }))}
          />
          {v.ikinci ? (
            <div className="rv-subgroup">
              <div className="rv-field-row">
                <TextField name="ikinciAd" label={t.s3.ikinciAd} value={v.ikinciAd} autoComplete="off" error={f.shown("ikinciAd")} onChange={(x) => f.set("ikinciAd", x)} onBlur={() => f.blur("ikinciAd")} />
                <PhoneField name="ikinciTel" label={t.s3.ikinciTel} value={v.ikinciTel} error={f.shown("ikinciTel")} onChange={(x) => f.set("ikinciTel", x)} onBlur={() => f.blur("ikinciTel")} />
              </div>
              <button type="button" className="rv-addlink" onClick={() => f.patch({ ikinci: false, ikinciAd: "", ikinciTel: "" })}>
                {t.s3.ikinciKaldir}
              </button>
            </div>
          ) : (
            <button type="button" className="rv-addlink" onClick={() => f.set("ikinci", true)}>
              + {t.s3.ikinci}
            </button>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <Review
            sections={[
              {
                title: t.s4.sections.sinif,
                onEdit: () => (setReview(true), go(0)),
                rows: [
                  [t.s1.yil, t.s1.yillar.find((y) => y.id === v.yil)?.label ?? ""],
                  [t.s1.kademe, v.kademe ? c.kademe[v.kademe] : ""],
                  [t.s1.sinif, cls?.label ?? ""],
                ],
              },
              {
                title: t.s4.sections.ogrenci,
                onEdit: () => (setReview(true), go(1)),
                rows: [
                  [`${t.s2.ad} ${t.s2.soyad.toLocaleLowerCase("tr")}`, `${v.ad} ${v.soyad}`.trim()],
                  [t.s2.dogum, v.dogum ? v.dogum.split("-").reverse().join(".") : ""],
                  [t.s2.okul, v.okul],
                  [t.s2.ingilizce, v.ingilizce],
                  [t.s2.kardes, v.kardes ? t.s4.yes : ""],
                  [t.s2.ozel, v.ozel ? t.s4.yes : ""],
                ],
              },
              {
                title: t.s4.sections.veli,
                onEdit: () => (setReview(true), go(2)),
                rows: [
                  [t.s3.yakinlik, v.yakinlik],
                  [c.fields.veliAd, v.veliAd],
                  [c.fields.telefon, v.telefon ? `+90 ${v.telefon}` : ""],
                  [c.fields.eposta, v.eposta],
                  [t.s3.kanal, v.kanal],
                  [t.s3.saat, v.saat],
                  [t.s3.ikinciAd, v.ikinci ? `${v.ikinciAd}, +90 ${v.ikinciTel}` : ""],
                ],
              },
            ]}
          />
          <KvkkCheck checked={v.kvkk} onChange={(x) => f.set("kvkk", x)} error={f.shown("kvkk")} drawer={<KvkkLink label={c.kvkkLink} />} />
          <Check name="etk" checked={v.etk} onChange={(x) => f.set("etk", x)}>
            {c.marketing}
          </Check>
        </>
      )}
    </FlowShell>
  );
}

function Done({ refNo, v }: { refNo: string; v: V }) {
  const h = useFocusOnMount<HTMLHeadingElement>();
  const d = t.done;
  const target = v.sinif === "hz" ? 9 : Number(v.sinif);
  const bursOk = !Number.isNaN(target) && target >= 5 && target <= 12;
  return (
    <div className="rv-wrap rv-done">
      <SealMark name={v.ad.trim()} ring={d.seal(v.yil)} label={d.sealLabel(v.ad.trim())} />
      <h1 ref={h} tabIndex={-1}>
        {d.title}
      </h1>
      <p className="rv-done-lede">{d.text(v.ad.trim(), d.channel[v.kanal] ?? d.channel.Telefon)}</p>
      <p className="rv-ref">
        <span>{d.ref}</span>
        <strong>{refNo}</strong>
      </p>

      <div className="rv-timeline">
        <h2>{d.nextTitle}</h2>
        <ol>
          {d.next.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
      </div>

      <div className="rv-next-cards">
        <div className="rv-next-card">
          <h2>{d.tour}</h2>
          <p>{d.tourText}</p>
          <Link href={`/revak/kabul/kampus-turu/?kademe=${v.kademe}`} className="rv-btn rv-btn--seal">
            {tr.kabul.paths[1].cta}
          </Link>
        </div>
        {bursOk && (
          <div className="rv-next-card">
            <h2>{d.burs}</h2>
            <p>{d.bursText}</p>
            <Link href={`/revak/kabul/bursluluk/?sinif=${target - 1}`} className="rv-btn rv-btn--line">
              {tr.kabul.paths[2].cta}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
