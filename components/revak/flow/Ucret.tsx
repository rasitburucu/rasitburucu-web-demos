"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { KADEMELER, isKademe, readParam, useShared, type Kademe } from "@/lib/revak/store";
import { emailOk, phoneOk } from "@/lib/revak/format";
import { KvkkLink } from "../ui/Drawer";
import { Choices, DemoNote, KvkkCheck, PhoneField, SealMark, TextField, useFlowForm, useFocusOnMount } from "./kit";

const c = tr.flows.common;
const t = tr.flows.ucret;

type V = { kademe: Kademe | ""; yil: string; veliAd: string; kanal: "email" | "phone" | ""; telefon: string; eposta: string; kvkk: boolean };
const FIELDS: (keyof V & string)[] = ["kademe", "veliAd", "kanal", "eposta", "telefon", "kvkk"];

/** Fee information request: one short screen, then a clear answer. */
export function UcretFlow() {
  const { shared, update, ready } = useShared();
  const [done, setDone] = useState(false);
  const applied = useRef(false);
  const h1 = useRef<HTMLHeadingElement>(null);

  const f = useFlowForm<V>(
    { kademe: "", yil: t.yillar[0], veliAd: "", kanal: "email", telefon: "", eposta: "", kvkk: false },
    {
      kademe: (v) => (v.kademe ? "" : t.errors.kademe),
      veliAd: (v) => (v.veliAd.trim().includes(" ") ? "" : c.fieldErrors.veliAd),
      kanal: (v) => (v.kanal ? "" : t.errors.kanal),
      eposta: (v) => (v.kanal === "email" && !emailOk(v.eposta) ? c.errors.email : ""),
      telefon: (v) => (v.kanal === "phone" && !phoneOk(v.telefon) ? c.errors.phone : ""),
      kvkk: (v) => (v.kvkk ? "" : c.kvkkError),
    },
  );
  const v = f.values;

  useEffect(() => {
    if (!ready || applied.current) return;
    applied.current = true;
    const qk = readParam("kademe");
    const k = isKademe(qk) ? qk : shared.kademe;
    f.patch({
      ...(k ? { kademe: k } : {}),
      ...(shared.veliAd ? { veliAd: shared.veliAd } : {}),
      ...(shared.telefon ? { telefon: shared.telefon } : {}),
      ...(shared.eposta ? { eposta: shared.eposta } : {}),
    });
  }, [ready, shared, f]);

  if (done) return <Done v={v} />;

  return (
    <div className="rv-wrap rv-flow">
      <div className="rv-flow-rail">
        <p className="rv-flow-name">{t.name}</p>
      </div>
      <form
        className="rv-flow-main"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!f.check(FIELDS)) return;
          update({
            kademe: v.kademe || undefined,
            veliAd: v.veliAd.trim(),
            ...(v.telefon ? { telefon: v.telefon } : {}),
            ...(v.eposta ? { eposta: v.eposta.trim() } : {}),
          });
          setDone(true);
        }}
      >
        <h1 ref={h1} tabIndex={-1}>
          {t.title}
        </h1>
        <p className="rv-lede" style={{ marginTop: "-1rem", marginBottom: "2rem" }}>
          {t.intro}
        </p>
        <div className="rv-flow-fields">
          <Choices
            name="kademe"
            label={t.kademe}
            variant="chips"
            value={v.kademe}
            error={f.shown("kademe")}
            onChange={(x) => f.set("kademe", x as Kademe)}
            options={KADEMELER.map((k) => ({ value: k, label: c.kademe[k] }))}
          />
          <Choices name="yil" label={t.yil} variant="chips" value={v.yil} onChange={(x) => f.set("yil", x as string)} options={t.yillar.map((y) => ({ value: y, label: y }))} />
          <TextField name="veliAd" label={c.fields.veliAd} value={v.veliAd} autoComplete="name" error={f.shown("veliAd")} onChange={(x) => f.set("veliAd", x)} onBlur={() => f.blur("veliAd")} />
          <Choices
            name="kanal"
            label={t.kanal}
            variant="wide"
            value={v.kanal}
            error={f.shown("kanal")}
            onChange={(x) => f.set("kanal", x as V["kanal"])}
            options={(["email", "phone"] as const).map((k) => ({ value: k, label: t.kanallar[k] }))}
          />
          {v.kanal === "email" ? (
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
          ) : (
            <PhoneField name="telefon" label={c.fields.telefon} value={v.telefon} error={f.shown("telefon")} onChange={(x) => f.set("telefon", x)} onBlur={() => f.blur("telefon")} />
          )}
          <KvkkCheck checked={v.kvkk} onChange={(x) => f.set("kvkk", x)} error={f.shown("kvkk")} drawer={<KvkkLink label={c.kvkkLink} />} />
        </div>
        <div className="rv-flow-actions">
          <Link href="/revak/kabul/" className="rv-btn rv-btn--quiet">
            {c.back}
          </Link>
          <button type="submit" className="rv-btn rv-btn--seal">
            {t.submit}
          </button>
          <DemoNote />
        </div>
      </form>
      <aside className="rv-flow-aside rv-fee-aside" aria-labelledby="rv-fee-aside">
        <div className="rv-summary-card">
          <h2 id="rv-fee-aside">{t.asideTitle}</h2>
          <ul>
            {t.aside.map((a) => (
              <li key={a.text}>
                <strong>{a.rate}</strong>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
          <Link href="/revak/kabul/#bursluluk" className="rv-textlink">
            {t.asideLink}
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Done({ v }: { v: V }) {
  const h = useFocusOnMount<HTMLHeadingElement>();
  const d = t.done;
  return (
    <div className="rv-wrap rv-done">
      <SealMark />
      <h1 ref={h} tabIndex={-1}>
        {d.title}
      </h1>
      <p className="rv-done-lede">{v.kanal === "email" ? d.email(v.eposta.trim()) : d.phone}</p>
      <div className="rv-next-cards">
        <div className="rv-next-card">
          <h2>{d.tour}</h2>
          <p>{tr.kabul.paths[1].text}</p>
          <Link href={`/revak/kabul/kampus-turu/${v.kademe ? `?kademe=${v.kademe}` : ""}`} className="rv-btn rv-btn--seal">
            {d.tourCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
