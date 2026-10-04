"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { readParam, useShared } from "@/lib/revak/store";
import { EXAM_SESSIONS, istanbul, openSessions, type ExamSession } from "@/lib/revak/schedule";
import { dayMonth, emailOk, longDate, phoneOk } from "@/lib/revak/format";
import { downloadIcs } from "@/lib/revak/ics";
import { Icon, Mark } from "../ui/Icon";
import { DrawerLink, KvkkLink } from "../ui/Drawer";
import { HelpCard, Check, Choices, FlowShell, KvkkCheck, PhoneField, Review, SealMark, TextField, useFlowForm, useFocusOnMount } from "./kit";

const c = tr.flows.common;
const t = tr.flows.burs;
const GRADES = [4, 5, 6, 7, 8, 9, 10, 11];

type V = {
  sinif: string;
  oturum: string;
  adayAd: string;
  adaySoyad: string;
  okul: string;
  veliAd: string;
  telefon: string;
  eposta: string;
  sartname: boolean;
  kvkk: boolean;
};

const STEP_FIELDS: (keyof V & string)[][] = [["sinif", "oturum"], ["adayAd", "adaySoyad", "okul", "veliAd", "telefon", "eposta"], ["sartname", "kvkk"]];

export function BurslulukFlow() {
  const { shared, update, ready } = useShared();
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ExamSession[] | null>(null);
  const applied = useRef(false);

  const f = useFlowForm<V>(
    { sinif: "", oturum: "", adayAd: "", adaySoyad: "", okul: "", veliAd: "", telefon: "", eposta: "", sartname: false, kvkk: false },
    {
      sinif: (v) => (v.sinif ? "" : t.s1.errors.sinif),
      oturum: (v) => (v.oturum ? "" : t.s1.errors.oturum),
      adayAd: (v) => (v.adayAd.trim() ? "" : t.s2.errors.adayAd),
      adaySoyad: (v) => (v.adaySoyad.trim() ? "" : t.s2.errors.adaySoyad),
      okul: (v) => (v.okul.trim() ? "" : t.s2.errors.okul),
      veliAd: (v) => (v.veliAd.trim().includes(" ") ? "" : c.fieldErrors.veliAd),
      telefon: (v) => (phoneOk(v.telefon) ? "" : c.errors.phone),
      eposta: (v) => (emailOk(v.eposta) ? "" : c.errors.email),
      sartname: (v) => (v.sartname ? "" : t.s3.rulesError),
      kvkk: (v) => (v.kvkk ? "" : c.kvkkError),
    },
  );
  const v = f.values;

  useEffect(() => {
    if (!ready || applied.current) return;
    applied.current = true;
    setSessions(openSessions(new Date()));
    const qs = readParam("sinif");
    f.patch({
      ...(qs && GRADES.includes(Number(qs)) ? { sinif: qs } : {}),
      ...(shared.ogrenciAd ? { adayAd: shared.ogrenciAd } : {}),
      ...(shared.ogrenciSoyad ? { adaySoyad: shared.ogrenciSoyad } : {}),
      ...(shared.okul ? { okul: shared.okul } : {}),
      ...(shared.veliAd ? { veliAd: shared.veliAd } : {}),
      ...(shared.telefon ? { telefon: shared.telefon } : {}),
      ...(shared.eposta ? { eposta: shared.eposta } : {}),
    });
  }, [ready, shared, f]);

  const forGrade = (sessions ?? []).filter((s) => v.sinif && s.grades.includes(Number(v.sinif)));
  const session = EXAM_SESSIONS.find((s) => s.id === v.oturum);

  const go = (n: number) => {
    setStep(n);
    setMaxReached((m) => Math.max(m, n));
  };
  const next = () => {
    if (!f.check(STEP_FIELDS[step])) return;
    if (step === 1) update({ ogrenciAd: v.adayAd.trim(), ogrenciSoyad: v.adaySoyad.trim(), okul: v.okul.trim(), veliAd: v.veliAd.trim(), telefon: v.telefon, eposta: v.eposta.trim() });
    if (step === 2) {
      setDone(`${v.oturum.replace("-", "").slice(2)}-${String(Math.floor(1000 + Math.random() * 8999))}`);
      return;
    }
    go(step + 1);
  };

  if (done && session) return <Done v={v} session={session} no={done} />;

  const titles = [t.s1.title, t.s2.title, t.s3.title];

  return (
    <FlowShell
      name={t.name}
      steps={t.steps}
      step={step}
      maxReached={maxReached}
      onStep={go}
      title={titles[step]}
      onBack={step > 0 ? () => go(step - 1) : undefined}
      onNext={next}
      nextLabel={step === 2 ? t.s3.submit : undefined}
      submitNote={step === 2}
      aside={<HelpCard note={t.helpNote} />}
    >
      {step === 0 && (
        <>
          <Choices
            name="sinif"
            label={t.s1.sinif}
            variant="chips"
            value={v.sinif}
            error={f.shown("sinif")}
            onChange={(x) => {
              const g = Number(x);
              const keep = session && session.grades.includes(g) && session.left > 0;
              f.patch({ sinif: x as string, ...(keep ? {} : { oturum: "" }) });
            }}
            options={GRADES.map((g) => ({ value: String(g), label: t.s1.sinifLabel(g) }))}
          />
          {!v.sinif ? (
            <p className="rv-hint" id="rv-f-oturum">
              {t.s1.pickGrade}
            </p>
          ) : forGrade.length === 0 ? (
            <p className="rv-note" id="rv-f-oturum">
              {t.s1.none}
            </p>
          ) : (
            <Choices
              name="oturum"
              label={t.s1.oturum}
              variant="wide"
              className="rv-sessions-pick"
              value={v.oturum}
              error={f.shown("oturum")}
              onChange={(x) => f.set("oturum", x as string)}
              options={forGrade.map((s) => ({
                value: s.id,
                label: longDate(s.iso),
                disabled: s.left === 0,
                render: (
                  <span className="rv-session" style={{ display: "contents" }}>
                    <strong>{longDate(s.iso)}</strong>
                    <em className={s.left > 0 && s.left < 50 ? "rv-few" : undefined}>{s.left === 0 ? t.s1.full : s.left < 50 ? t.s1.few : t.s1.left(s.left)}</em>
                    <span>
                      {s.time}, {t.s1.place}. {t.s1.deadline(dayMonth(s.deadline))}
                      {s.left > 0 && s.left < 50 ? `. ${t.s1.left(s.left)}` : ""}
                    </span>
                  </span>
                ),
              }))}
            />
          )}
        </>
      )}

      {step === 1 && (
        <>
          <div className="rv-field-row">
            <TextField name="adayAd" label={t.s2.adayAd} value={v.adayAd} autoComplete="off" error={f.shown("adayAd")} onChange={(x) => f.set("adayAd", x)} onBlur={() => f.blur("adayAd")} />
            <TextField name="adaySoyad" label={t.s2.adaySoyad} value={v.adaySoyad} autoComplete="off" error={f.shown("adaySoyad")} onChange={(x) => f.set("adaySoyad", x)} onBlur={() => f.blur("adaySoyad")} />
          </div>
          <TextField name="okul" label={t.s2.okul} value={v.okul} error={f.shown("okul")} onChange={(x) => f.set("okul", x)} onBlur={() => f.blur("okul")} />
          <p className="rv-note">{t.s2.idNote}</p>
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
        </>
      )}

      {step === 2 && (
        <>
          <Review
            sections={[
              {
                title: t.s3.sections.oturum,
                onEdit: () => go(0),
                rows: [
                  [t.s1.sinif, v.sinif ? t.s1.sinifLabel(Number(v.sinif)) : ""],
                  [t.s1.oturum, session ? `${longDate(session.iso)}, ${session.time}` : ""],
                ],
              },
              {
                title: t.s3.sections.aday,
                onEdit: () => go(1),
                rows: [
                  [tr.flows.burs.done.candidate, `${v.adayAd} ${v.adaySoyad}`.trim()],
                  [t.s2.okul, v.okul],
                  [c.fields.veliAd, v.veliAd],
                  [c.fields.telefon, v.telefon ? `+90 ${v.telefon}` : ""],
                  [c.fields.eposta, v.eposta],
                ],
              },
            ]}
          />
          <Check name="sartname" checked={v.sartname} onChange={(x) => f.set("sartname", x)} error={f.shown("sartname")}>
            <DrawerLink label={t.s3.rulesLink} title={t.rules.title} body={t.rules.body} />
            {t.s3.rulesPost}
          </Check>
          <KvkkCheck checked={v.kvkk} onChange={(x) => f.set("kvkk", x)} error={f.shown("kvkk")} drawer={<KvkkLink label={c.kvkkLink} />} />
        </>
      )}
    </FlowShell>
  );
}

function Done({ v, session, no }: { v: V; session: ExamSession; no: string }) {
  const h = useFocusOnMount<HTMLHeadingElement>();
  const d = t.done;
  return (
    <div className="rv-wrap rv-done">
      <SealMark />
      <h1 ref={h} tabIndex={-1}>
        {d.title}
      </h1>
      <p className="rv-done-lede">{d.text}</p>

      <article className="rv-ticket rv-print" aria-label={d.card}>
        <div className="rv-ticket-main">
          <p className="rv-ticket-kicker">{d.card}</p>
          <p className="rv-ticket-date">
            {v.adayAd} {v.adaySoyad}
          </p>
          <dl>
            <div>
              <dt>{d.grade}</dt>
              <dd>{t.s1.sinifLabel(Number(v.sinif))}</dd>
            </div>
            <div>
              <dt>{d.session}</dt>
              <dd>{longDate(session.iso)}</dd>
            </div>
            <div>
              <dt>{d.entry}</dt>
              <dd>{session.entry}</dd>
            </div>
            <div>
              <dt>{d.start}</dt>
              <dd>{session.time}</dd>
            </div>
            <div>
              <dt>{d.room}</dt>
              <dd>{session.room}</dd>
            </div>
            <div>
              <dt>{tr.flows.burs.s1.place}</dt>
              <dd>{d.place}</dd>
            </div>
          </dl>
        </div>
        <div className="rv-ticket-stub">
          <Mark size={40} className="rv-mark" />
          <span>{d.number}</span>
          <strong>{no}</strong>
        </div>
      </article>
      <p className="rv-ticket-note">{d.note}</p>

      <div className="rv-ticket-actions">
        <button type="button" className="rv-btn rv-btn--ink" onClick={() => window.print()}>
          <Icon name="print" size={18} />
          {d.print}
        </button>
        <button
          type="button"
          className="rv-btn rv-btn--line"
          onClick={() =>
            downloadIcs(
              {
                uid: `burs-${session.id}-${no}`,
                title: d.icsTitle,
                start: istanbul(session.iso, session.entry),
                minutes: 120,
                location: `${d.place}, ${session.room}`,
                description: `${d.number}: ${no}. ${d.note}`,
              },
              "revak-bursluluk-sinavi.ics",
            )
          }
        >
          <Icon name="calendar" size={18} />
          {d.ics}
        </button>
      </div>

      <div className="rv-next-cards">
        <div className="rv-next-card">
          <h2>{d.onKayit}</h2>
          <p>{tr.kabul.paths[0].text}</p>
          <Link href="/revak/kabul/on-kayit/" className="rv-btn rv-btn--seal">
            {tr.kabul.paths[0].cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
