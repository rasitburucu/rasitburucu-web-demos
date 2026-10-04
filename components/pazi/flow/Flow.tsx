"use client";

// "Hat sonu ön fizibilite": six steps on the left, the live cell and the
// numbers on the right. Every change is written to the address bar (product,
// line, pallet and payback numbers only), so the link can go to a purchaser.

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { tr } from "@/content/pazi/tr";
import { LIMITS, modelById, patternOptions, payback, validate, type Config, type ModelId, type PatternChoice, type ProductKind } from "@/lib/pazi/plan";
import { fmt, fmt1, tlRange } from "@/lib/pazi/format";
import { cell, useCell } from "@/lib/pazi/store";
import { decodeConfig, encodeConfig } from "@/lib/pazi/url";
import { summaryText, type Contact } from "@/lib/pazi/summary";
import { Cell } from "../cell/Cell";
import { Hmi, useFit } from "../cell/Hmi";
import { NumberField, Segmented, Toggle } from "../ui/fields";
import { LayerPlan } from "../ui/LayerPlan";
import { Warnings } from "./Warnings";

const STEPS = 6;

export function Flow() {
  const fl = tr.flow;
  const config = useCell((s) => s.config);
  const lock = useCell((s) => s.lock);
  const f = useFit();
  const [step, setStep] = useState(1);
  const [ready, setReady] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const errors = useMemo(() => validate(config), [config]);

  // read the address once; then keep it in step with every change
  useEffect(() => {
    const d = decodeConfig(location.search);
    cell.set({ config: d.config, lock: d.model, view: "iso", paused: false, operator: null, zone: "out" });
    if (d.step) setStep(d.step);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const q = encodeConfig(config, { model: lock, step: step > 1 ? step : undefined });
    history.replaceState(history.state, "", `?${q}`);
  }, [config, lock, step, ready]);

  const set = (patch: Partial<Config>) => cell.setConfig(patch);
  const go = (n: number) => {
    setStep(Math.min(STEPS, Math.max(1, n)));
    requestAnimationFrame(() => {
      panel.current?.focus({ preventScroll: true });
      const top = (panel.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120;
      if (top < window.scrollY) window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  };
  const err = (k: keyof Config) => {
    const e = errors[k];
    if (e === "pallet") return tr.errors.pallet;
    if (e === "range" && k === "y" && config.y > config.maxH) return tr.errors.taller;
    return null;
  };
  const hasBlocking = Object.keys(errors).length > 0;

  return (
    <div className="pz-flow">
      <div className="pz-wrap pz-flow-head">
        <h1 className="pz-h2">{fl.title}</h1>
        <p className="pz-lead">{fl.lead}</p>
      </div>
      <noscript>
        <p className="pz-wrap pz-flow-noscript">
          {fl.noscript} <a href={`mailto:${tr.brand.email}`}>{tr.brand.email}</a>
        </p>
      </noscript>
      <div className="pz-wrap pz-flow-grid">
        <div className="pz-flow-main">
          <nav aria-label={fl.title} className="pz-stepper">
            <ol>
              {fl.steps.map((name, i) => {
                const n = i + 1;
                return (
                  <li key={name}>
                    <button type="button" onClick={() => go(n)} aria-current={step === n ? "step" : undefined} data-done={n < step ? "true" : "false"}>
                      <span className="pz-mono">{String(n).padStart(2, "0")}</span>
                      <span>{name}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div ref={panel} tabIndex={-1} className="pz-flow-panel" aria-labelledby="pz-step-title">
            <p className="pz-flow-stepof pz-mono">{fl.stepOf(step, STEPS)}</p>
            {step === 1 ? <StepProduct config={config} set={set} err={err} /> : null}
            {step === 2 ? <StepLine config={config} set={set} /> : null}
            {step === 3 ? <StepPallet config={config} set={set} err={err} /> : null}
            {step === 4 ? <StepResult lock={lock} /> : null}
            {step === 5 ? <StepPayback config={config} set={set} /> : null}
            {step === 6 ? <StepSend config={config} lock={lock} /> : null}

            {step < 4 || step === 5 ? <Warnings fit={f} only={step === 1 ? ["over-cobot", "bag-claw"] : step === 2 ? ["two-cells", "too-slow", "needs-double"] : step === 3 ? ["overhang", "weight-limited", "needs-lift", "column-unstable"] : []} /> : null}

            <div className="pz-flow-nav">
              {step > 1 ? (
                <button type="button" className="pz-btn" onClick={() => go(step - 1)}>
                  {fl.back}
                </button>
              ) : (
                <span />
              )}
              {step < STEPS ? (
                <div className="pz-flow-nav-right">
                  {step === 5 ? (
                    <button type="button" className="pz-btn pz-btn-ghost" onClick={() => go(6)}>
                      {fl.skip}
                    </button>
                  ) : null}
                  <button type="button" className="pz-btn pz-btn-primary" onClick={() => go(step + 1)} disabled={hasBlocking && step <= 3}>
                    {fl.next}
                    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
                      <path d="M0 6h16M11 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="pz-flow-preview" aria-label={fl.preview}>
          <div className="pz-flow-sticky">
            <div className="pz-flow-cell">
              <Cell frame={{ x: 0.5, y: 0.52 }} operator zoom={1.25} />
            </div>
            <Hmi />
            <dl className="pz-flow-nums">
              <div>
                <dt>{fl.numbers.layers}</dt>
                <dd className="pz-mono">{f.stack.layers}</dd>
              </div>
              <div>
                <dt>{fl.numbers.total}</dt>
                <dd className="pz-mono">{f.stack.total}</dd>
              </div>
              <div>
                <dt>{fl.numbers.height}</dt>
                <dd className="pz-mono">{`${fmt(f.stack.height)} mm`}</dd>
              </div>
              <div>
                <dt>{fl.numbers.load}</dt>
                <dd className="pz-mono">{`${fmt(f.stack.loadKg)} kg`}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ steps */

type SetFn = (p: Partial<Config>) => void;
type ErrFn = (k: keyof Config) => string | null;

function StepHead({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="pz-flow-stephead">
      <h2 id="pz-step-title" className="pz-h3">
        {title}
      </h2>
      <p>{lead}</p>
    </div>
  );
}

function StepProduct({ config, set, err }: { config: Config; set: SetFn; err: ErrFn }) {
  const fi = tr.fields;
  const u = tr.units;
  return (
    <>
      <StepHead title={tr.flow.product.title} lead={tr.flow.product.lead} />
      <div className="pz-flow-fields">
        <Segmented<ProductKind>
          label={fi.kind}
          value={config.kind}
          options={(["koli", "torba", "shrink"] as ProductKind[]).map((k) => ({ value: k, label: fi.kinds[k] }))}
          onChange={(v) => set({ kind: v })}
        />
        <div className="pz-flow-three">
          <NumberField label={fi.u} unit={u.mm} value={config.u} min={LIMITS.u[0]} max={LIMITS.u[1]} step={10} onChange={(v) => set({ u: v })} error={err("u")} />
          <NumberField label={fi.g} unit={u.mm} value={config.g} min={LIMITS.g[0]} max={LIMITS.g[1]} step={10} onChange={(v) => set({ g: v })} error={err("g")} />
          <NumberField label={fi.y} unit={u.mm} value={config.y} min={LIMITS.y[0]} max={LIMITS.y[1]} step={10} onChange={(v) => set({ y: v })} error={err("y")} />
        </div>
        <div className="pz-flow-two">
          <NumberField label={fi.kg} unit={u.kg} value={config.kg} min={LIMITS.kg[0]} max={LIMITS.kg[1]} step={0.5} decimals={1} onChange={(v) => set({ kg: v })} />
        </div>
      </div>
    </>
  );
}

function StepLine({ config, set }: { config: Config; set: SetFn }) {
  const fi = tr.fields;
  return (
    <>
      <StepHead title={tr.flow.line.title} lead={tr.flow.line.lead} />
      <div className="pz-flow-fields">
        <div className="pz-flow-two">
          <NumberField label={fi.rate} unit={tr.units.perMin} value={config.rate} min={LIMITS.rate[0]} max={LIMITS.rate[1]} onChange={(v) => set({ rate: v })} />
        </div>
        <Segmented<"1" | "2"> label={fi.lines} value={String(config.lines) as "1" | "2"} options={[{ value: "1", label: "1" }, { value: "2", label: "2" }]} onChange={(v) => set({ lines: v === "2" ? 2 : 1 })} />
        <Segmented<"1" | "2" | "3">
          label={fi.shifts}
          value={String(config.shifts) as "1" | "2" | "3"}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
          ]}
          onChange={(v) => set({ shifts: Number(v) as 1 | 2 | 3 })}
        />
      </div>
    </>
  );
}

function StepPallet({ config, set, err }: { config: Config; set: SetFn; err: ErrFn }) {
  const fi = tr.fields;
  const fl = tr.flow;
  const f = useFit();
  const opts = patternOptions(config);
  const off = (id: string) => !opts.find((o) => o.id === id)?.available;
  return (
    <>
      <StepHead title={fl.pallet.title} lead={fl.pallet.lead} />
      <div className="pz-flow-fields">
        <Segmented<Config["pallet"]>
          label={fi.pallet}
          value={config.pallet}
          options={[
            { value: "eur", label: fi.pallets.eur },
            { value: "end", label: fi.pallets.end },
            { value: "ozel", label: fi.pallets.ozel },
          ]}
          onChange={(v) => set({ pallet: v })}
        />
        {config.pallet === "ozel" ? (
          <div className="pz-flow-two">
            <NumberField label={fi.pl} unit={tr.units.mm} value={config.pl} min={LIMITS.pl[0]} max={LIMITS.pl[1]} step={10} onChange={(v) => set({ pl: v })} />
            <NumberField label={fi.pw} unit={tr.units.mm} value={config.pw} min={LIMITS.pw[0]} max={LIMITS.pw[1]} step={10} onChange={(v) => set({ pw: v })} />
          </div>
        ) : null}
        <div className="pz-flow-two">
          <NumberField label={fi.maxH} unit={tr.units.mm} value={config.maxH} min={LIMITS.maxH[0]} max={LIMITS.maxH[1]} step={50} onChange={(v) => set({ maxH: v })} hint={fi.maxHHint} error={err("maxH")} />
          <div className="pz-flow-toggle">
            <Toggle label={fi.sheet} checked={config.sheet} onChange={(v) => set({ sheet: v })} />
          </div>
        </div>
        <Segmented<PatternChoice>
          label={fi.pattern}
          value={config.pattern}
          options={[
            { value: "oto", label: `${fi.patterns.oto} (${fi.patterns[f.plan.pattern]})` },
            { value: "sutun", label: fi.patterns.sutun, disabled: off("sutun"), note: fi.patternOff },
            { value: "orgu", label: fi.patterns.orgu, disabled: off("orgu"), note: fi.patternOff },
            { value: "firildak", label: fi.patterns.firildak, disabled: off("firildak"), note: fi.patternOff },
          ]}
          onChange={(v) => set({ pattern: v })}
        />
        <p className="pz-flow-hint">{fi.patternHint[f.plan.pattern]}</p>
        {opts.some((o) => !o.available) ? <p className="pz-flow-hint">{`${opts.filter((o) => !o.available).map((o) => fi.patterns[o.id]).join(", ")}: ${fi.patternOff.toLocaleLowerCase("tr")}.`}</p> : null}
        <figure className="pz-flow-plans">
          <figcaption className="pz-num-label">{fl.plan}</figcaption>
          <div className="pz-flow-plans-row">
            <div>
              <LayerPlan config={config} plan={f.plan} layer={0} title={`${fl.plan}: ${fl.planOdd}`} />
              <p className="pz-mono">{fl.planOdd}</p>
            </div>
            {f.plan.layers[0] !== f.plan.layers[1] ? (
              <div>
                <LayerPlan config={config} plan={f.plan} layer={1} title={`${fl.plan}: ${fl.planEven}`} />
                <p className="pz-mono">{fl.planEven}</p>
              </div>
            ) : null}
          </div>
          {f.plan.overhang > 0 ? <p className="pz-flow-overhang">{`${tr.overhangMm(f.plan.overhang)} ${tr.warnings.overhang}`}</p> : null}
        </figure>
        <dl className="pz-flow-figures">
          <div>
            <dt>{fl.numbers.perLayer}</dt>
            <dd className="pz-mono">{f.plan.perLayer}</dd>
          </div>
          <div>
            <dt>{fl.numbers.layers}</dt>
            <dd className="pz-mono">{f.stack.layers}</dd>
          </div>
          <div>
            <dt>{fl.numbers.total}</dt>
            <dd className="pz-mono">{f.stack.total}</dd>
          </div>
          <div>
            <dt>{fl.numbers.fill}</dt>
            <dd className="pz-mono">{`%${fmt(f.plan.fill * 100)}`}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}

function StepResult({ lock }: { lock: ModelId | null }) {
  const fl = tr.flow;
  const r = fl.result;
  const f = useFit();
  const config = useCell((s) => s.config);
  const ok = f.status === "ok" && !!f.model;
  const opts = [f.lift ? r.lift : "", f.double ? r.double : "", config.sheet ? r.sheet : ""].filter(Boolean);
  return (
    <>
      <StepHead title={r.title} lead={r.lead} />
      {lock ? (
        <p className="pz-flow-lock">
          {r.locked(modelById(lock)?.name ?? lock)}{" "}
          <button type="button" className="pz-btn pz-btn-ghost" onClick={() => cell.set({ lock: null })}>
            {r.unlock}
          </button>
        </p>
      ) : null}
      {ok ? (
        <div className="pz-result">
          <div className="pz-result-model">
            <p className="pz-num-label">{r.model}</p>
            <p className="pz-result-name">{`Pazı ${f.model!.name}`}</p>
            <p>{tr.models.fit[f.model!.id]}</p>
          </div>
          <dl className="pz-result-list">
            <div>
              <dt>{r.gripper}</dt>
              <dd>{tr.grippers[f.gripper]}</dd>
            </div>
            <div>
              <dt>
                {r.capacity} <span className="pz-est">{r.estimate}</span>
              </dt>
              <dd className="pz-mono">{`~${fmt1(f.capacity)} /dk`}</dd>
            </div>
            <div>
              <dt>{r.required}</dt>
              <dd className="pz-mono">{`${f.required} /dk`}</dd>
            </div>
            <div>
              <dt>
                {r.cycle} <span className="pz-est">{r.estimate}</span>
              </dt>
              <dd className="pz-mono">{`${fmt1(f.cycleSec)} sn`}</dd>
            </div>
            <div>
              <dt>
                {r.area} <span className="pz-est">{r.estimate}</span>
              </dt>
              <dd className="pz-mono">{`${fmt1(f.cell.w)} × ${fmt1(f.cell.d)} m (${fmt1(f.cell.area)} m²)`}</dd>
            </div>
            <div>
              <dt>{r.options}</dt>
              <dd>{opts.length ? opts.join(", ") : r.none}</dd>
            </div>
          </dl>
          <div className="pz-meter" aria-hidden="true">
            <span style={{ width: `${Math.min(100, (f.required / Math.max(f.capacity, f.required)) * 100)}%` }} />
          </div>
          <p className="pz-flow-hint">{r.safety}</p>
        </div>
      ) : (
        <div className="pz-result pz-result-custom">
          <p className="pz-result-name">{r.customTitle}</p>
          <p>{r.customText}</p>
          <a className="pz-btn pz-btn-primary" href={`mailto:${tr.brand.email}?subject=${encodeURIComponent(fl.send.subject)}`}>
            {fl.send.engineer}
          </a>
        </div>
      )}
      <Warnings fit={f} />
      <details className="pz-assume">
        <summary>{r.assumptions}</summary>
        <ul>
          {r.assumptionList.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </details>
    </>
  );
}

function StepPayback({ config, set }: { config: Config; set: SetFn }) {
  const pb = tr.flow.payback;
  const p = useMemo(() => payback(config), [config]);
  return (
    <>
      <StepHead title={pb.title} lead={pb.lead} />
      <div className="pz-flow-fields">
        <Segmented<Config["mode"]>
          label={pb.mode}
          value={config.mode}
          options={[
            { value: "satin", label: pb.modes.satin },
            { value: "kira", label: pb.modes.kira },
          ]}
          onChange={(v) => set({ mode: v })}
        />
        <div className="pz-flow-two">
          <NumberField label={pb.people} value={config.people} min={0} max={LIMITS.people[1]} onChange={(v) => set({ people: v })} />
          <NumberField label={pb.wage} unit={tr.units.tl} value={config.wage} min={0} max={LIMITS.wage[1]} step={1000} onChange={(v) => set({ wage: v })} hint={config.wage ? undefined : tr.savings.wageHint} />
        </div>
        {config.mode === "satin" ? (
          <NumberField label={pb.invest} unit={tr.units.tl} value={config.invest} min={0} max={LIMITS.invest[1]} step={50000} onChange={(v) => set({ invest: v })} hint={pb.investHint} />
        ) : (
          <NumberField label={pb.rent} unit={tr.units.tl} value={config.rent} min={0} max={LIMITS.rent[1]} step={1000} onChange={(v) => set({ rent: v })} hint={pb.investHint} />
        )}
        <div className="pz-pay" aria-live="polite">
          <div>
            <p className="pz-save-k">
              {pb.saving} <span className="pz-est">{tr.flow.result.estimate}</span>
            </p>
            <p className="pz-save-v pz-mono">{config.wage && config.people ? tlRange(p.saving[0], p.saving[1]) : "—"}</p>
          </div>
          {config.mode === "satin" ? (
            <div>
              <p className="pz-save-k">
                {pb.months} <span className="pz-est">{tr.flow.result.estimate}</span>
              </p>
              <p className="pz-save-v pz-mono">{p.months ? pb.monthsValue(p.months[0], p.months[1]) : "—"}</p>
              {config.invest > 0 ? <p className="pz-save-hint">{`${pb.upkeep}: ~${fmt(Math.round(p.upkeep / 1000) * 1000)} TL`}</p> : null}
            </div>
          ) : (
            <div>
              <p className="pz-save-k">
                {pb.rentGap} <span className="pz-est">{tr.flow.result.estimate}</span>
              </p>
              <p className="pz-save-v pz-mono">{p.rentGap ? tlRange(p.rentGap[0], p.rentGap[1]) : "—"}</p>
            </div>
          )}
        </div>
        {p.never ? <p className="pz-warn pz-warn-hard">{pb.never}</p> : null}
        {!p.never && config.mode === "kira" && p.rentGap ? <p className="pz-flow-hint">{p.rentGap[0] > 0 ? pb.rentOk : pb.rentNo}</p> : null}
        {!p.months && !p.rentGap && !p.never ? <p className="pz-flow-hint">{pb.empty}</p> : null}
        <p className="pz-flow-hint">{pb.note}</p>
        <p className="pz-flow-hint">{tr.savings.assumptions}</p>
      </div>
    </>
  );
}

function StepSend({ config, lock }: { config: Config; lock: ModelId | null }) {
  const s = tr.flow.send;
  const f = useFit();
  const [c, setC] = useState<Contact>({ name: "", company: "", email: "", phone: "", city: "", note: "" });
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const [copiedSum, setCopiedSum] = useState(false);
  const link = typeof window === "undefined" ? "" : `${location.origin}${location.pathname}?${encodeConfig(config, { model: lock })}`;
  const errs = {
    name: !c.name.trim() ? s.required : "",
    company: !c.company.trim() ? s.required : "",
    email: !c.email.trim() ? s.required : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim()) ? s.emailBad : "",
  };
  const valid = !errs.name && !errs.company && !errs.email;
  const body = summaryText(config, f, link, c);
  const printHref = `/pazi/fizibilite/foy/?${encodeConfig(config, { model: lock })}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) {
      const first = (["name", "company", "email"] as const).find((k) => errs[k]);
      if (first) document.getElementById(`pz-send-${first}`)?.focus();
      return;
    }
    const href = `mailto:${tr.brand.email}?subject=${encodeURIComponent(`${s.subject}: ${c.company}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setDone(true);
  };

  const copy = async (text: string, after: () => void, fail?: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      after();
    } catch {
      fail?.();
    }
  };

  const field = (k: keyof Contact, label: string, type = "text", auto?: string, required = false) => {
    const e = touched ? (errs as Record<string, string>)[k] : "";
    const id = `pz-send-${k}`;
    return (
      <div className={`pz-text${e ? " is-error" : ""}`}>
        <label htmlFor={id}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {k === "note" ? (
          <textarea id={id} value={c[k]} rows={3} onChange={(ev) => setC({ ...c, [k]: ev.target.value })} />
        ) : (
          <input id={id} type={type} autoComplete={auto} value={c[k]} required={required} aria-invalid={e ? true : undefined} aria-describedby={e ? `${id}-e` : undefined} onChange={(ev) => setC({ ...c, [k]: ev.target.value })} />
        )}
        {e ? (
          <p id={`${id}-e`} className="pz-num-error">
            {e}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <StepHead title={s.title} lead={s.lead} />
      <div className="pz-send">
        <section className="pz-send-block" aria-labelledby="pz-send-eng">
          <h3 id="pz-send-eng" className="pz-send-h">
            {s.engineer}
          </h3>
          <p className="pz-flow-hint">{s.engineerLead}</p>
          {done ? (
            <div className="pz-send-done" role="status">
              <p className="pz-send-done-t">{s.done}</p>
              <p>{s.doneNote}</p>
              <p className="pz-flow-hint">{s.fallback}</p>
              <pre className="pz-send-pre">{body}</pre>
              <button type="button" className="pz-btn" onClick={() => copy(body, () => setCopiedSum(true))}>
                {copiedSum ? s.copied : s.copySummary}
              </button>
            </div>
          ) : (
            <form className="pz-send-form" onSubmit={submit} noValidate>
              <div className="pz-flow-two">
                {field("name", s.name, "text", "name", true)}
                {field("company", s.company, "text", "organization", true)}
              </div>
              <div className="pz-flow-two">
                {field("email", s.email, "email", "email", true)}
                {field("phone", s.phone, "tel", "tel")}
              </div>
              {field("city", s.city, "text", "address-level2")}
              {field("note", s.note)}
              <button type="submit" className="pz-btn pz-btn-primary">
                {s.submit}
              </button>
            </form>
          )}
        </section>
        <div className="pz-send-side">
          <section className="pz-send-block">
            <h3 className="pz-send-h">{s.print}</h3>
            <p className="pz-flow-hint">{s.printLead}</p>
            <Link href={printHref} className="pz-btn">
              {s.print}
            </Link>
          </section>
          <section className="pz-send-block">
            <h3 className="pz-send-h">{s.copy}</h3>
            <p className="pz-flow-hint">{s.copyLead}</p>
            <button
              type="button"
              className="pz-btn"
              onClick={() =>
                copy(
                  link,
                  () => setCopied("ok"),
                  () => setCopied("fail"),
                )
              }
            >
              {s.copy}
            </button>
            <p className="pz-flow-hint" role="status">
              {copied === "ok" ? s.copied : copied === "fail" ? s.copyFail : ""}
            </p>
          </section>
          <section className="pz-send-block">
            <h3 className="pz-send-h">{s.trial}</h3>
            <a className="pz-btn" href={`mailto:${tr.brand.trialEmail}?subject=${encodeURIComponent(tr.trial.mailSubject)}&body=${encodeURIComponent(`${tr.trial.mailBody}\n\n${link}`)}`}>
              {tr.trial.cta}
            </a>
          </section>
        </div>
      </div>
    </>
  );
}

