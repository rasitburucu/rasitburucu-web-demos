"use client";

// Shared pieces for the admissions flows: form state with blur/submit
// validation, accessible fields, the step shell and the review block.

import { useCallback, useEffect, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { formatPhone } from "@/lib/revak/format";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";
import type { Kademe } from "@/lib/revak/store";

const c = tr.flows.common;

export const fid = (name: string) => `rv-f-${name}`;

type Validators<V> = Partial<Record<keyof V & string, (v: V) => string>>;

export function useFlowForm<V extends Record<string, unknown>>(initial: V, validators: Validators<V>) {
  const [values, setValues] = useState<V>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [forced, setForced] = useState<Record<string, boolean>>({});

  const set = useCallback(<K extends keyof V>(k: K, v: V[K]) => setValues((s) => ({ ...s, [k]: v })), []);
  const patch = useCallback((p: Partial<V>) => setValues((s) => ({ ...s, ...p })), []);
  const blur = useCallback((k: string) => setTouched((t) => (t[k] ? t : { ...t, [k]: true })), []);

  const errorOf = (k: keyof V & string) => validators[k]?.(values) ?? "";
  const shown = (k: keyof V & string) => (touched[k] || forced[k] ? errorOf(k) : "");

  /** Validate a step. Shows every error in it and focuses the first invalid field. */
  const check = (fields: (keyof V & string)[]) => {
    const bad = fields.filter((f) => errorOf(f));
    if (bad.length) {
      setForced((s) => ({ ...s, ...Object.fromEntries(bad.map((b) => [b, true])) }));
      requestAnimationFrame(() => {
        const el = document.getElementById(fid(bad[0]));
        const target = el?.matches("input,select,textarea,button") ? el : el?.querySelector<HTMLElement>("input:not([disabled]),select,button");
        target?.focus();
        target?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
      return false;
    }
    return true;
  };

  return { values, set, patch, blur, shown, check, errorOf };
}

/* ---------- fields ---------- */

type Base = { name: string; label: string; error?: string; hint?: string; optional?: boolean };

function Help({ name, error, hint }: { name: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && (
        <p className="rv-hint" id={`${fid(name)}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="rv-error" id={`${fid(name)}-err`}>
          {error}
        </p>
      )}
    </>
  );
}

const describedBy = (name: string, error?: string, hint?: string) =>
  [hint ? `${fid(name)}-hint` : "", error ? `${fid(name)}-err` : ""].filter(Boolean).join(" ") || undefined;

function Label({ name, label, optional }: { name: string; label: string; optional?: boolean }) {
  return (
    <label className="rv-label" htmlFor={fid(name)}>
      {label}
      {optional && <small>({c.optional})</small>}
    </label>
  );
}

export function TextField({
  name,
  label,
  error,
  hint,
  optional,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  inputMode,
  maxLength = 80,
}: Base & {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  type?: "text" | "email" | "date";
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
  maxLength?: number;
  min?: string;
  max?: string;
}) {
  return (
    <div className="rv-field">
      <Label name={name} label={label} optional={optional} />
      <input
        id={fid(name)}
        className="rv-input"
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={type === "date" ? undefined : maxLength}
        spellCheck={type === "email" ? false : undefined}
        autoCapitalize={type === "email" ? "none" : undefined}
        aria-invalid={!!error}
        aria-describedby={describedBy(name, error, hint)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

export function DateField({
  name,
  label,
  error,
  hint,
  value,
  onChange,
  onBlur,
  min,
  max,
}: Base & { value: string; onChange: (v: string) => void; onBlur: () => void; min: string; max: string }) {
  return (
    <div className="rv-field">
      <Label name={name} label={label} />
      <input
        id={fid(name)}
        className="rv-input"
        type="date"
        value={value}
        min={min}
        max={max}
        aria-invalid={!!error}
        aria-describedby={describedBy(name, error, hint)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

export function PhoneField({
  name,
  label,
  error,
  hint,
  optional,
  value,
  onChange,
  onBlur,
}: Base & { value: string; onChange: (v: string) => void; onBlur: () => void }) {
  return (
    <div className="rv-field">
      <Label name={name} label={label} optional={optional} />
      <div className="rv-phone">
        <span className="rv-phone-prefix" aria-hidden="true">
          {c.phonePrefix}
        </span>
        <input
          id={fid(name)}
          className="rv-input"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="5xx xxx xx xx"
          value={value}
          aria-invalid={!!error}
          aria-describedby={describedBy(name, error, hint)}
          onChange={(e) => onChange(formatPhone(e.target.value))}
          onBlur={onBlur}
        />
      </div>
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  error,
  hint,
  optional,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
}: Base & {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="rv-field">
      <Label name={name} label={label} optional={optional} />
      <select
        id={fid(name)}
        className="rv-input"
        value={value}
        aria-invalid={!!error}
        aria-describedby={describedBy(name, error, hint)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

type ChoiceOpt = { value: string; label: string; hint?: string; disabled?: boolean; render?: React.ReactNode };

/** Radio (single) or checkbox (multi) group rendered as tappable tiles. */
export function Choices({
  name,
  label,
  error,
  hint,
  optional,
  options,
  value,
  onChange,
  multi = false,
  variant = "tiles",
  className,
}: Base & {
  options: ChoiceOpt[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  variant?: "tiles" | "wide" | "chips";
  className?: string;
}) {
  const selected = (v: string) => (multi ? (value as string[]).includes(v) : value === v);
  const cls = ["rv-choices", variant === "wide" ? "rv-choices--wide" : "", variant === "chips" ? "rv-choices--chips" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <fieldset className="rv-fieldset" id={fid(name)} aria-invalid={!!error || undefined} aria-describedby={describedBy(name, error, hint)}>
      <legend>
        {label}
        {optional && <small>({c.optional})</small>}
      </legend>
      <div className={cls}>
        {options.map((o) => (
          <label key={o.value} className="rv-choice">
            <input
              type={multi ? "checkbox" : "radio"}
              name={fid(name)}
              value={o.value}
              checked={selected(o.value)}
              disabled={o.disabled}
              onChange={() => {
                if (!multi) return onChange(o.value);
                const arr = value as string[];
                onChange(arr.includes(o.value) ? arr.filter((x) => x !== o.value) : [...arr, o.value]);
              }}
            />
            <span className="rv-choice-face">
              {o.render ?? (
                <>
                  <strong className={/\d/.test(o.label) ? "rv-choice-num" : undefined}>{o.label}</strong>
                  {o.hint && <span>{o.hint}</span>}
                </>
              )}
            </span>
          </label>
        ))}
      </div>
      <Help name={name} error={error} hint={hint} />
    </fieldset>
  );
}

export function Check({
  name,
  children,
  checked,
  onChange,
  error,
  hint,
  switchStyle = false,
}: {
  name: string;
  children: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  hint?: string;
  switchStyle?: boolean;
}) {
  return (
    <div className="rv-field">
      <label className={switchStyle ? "rv-check rv-switch" : "rv-check"}>
        <input
          id={fid(name)}
          type="checkbox"
          role={switchStyle ? "switch" : undefined}
          checked={checked}
          aria-invalid={!!error}
          aria-describedby={describedBy(name, error, hint)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{children}</span>
      </label>
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

export function KvkkCheck({
  checked,
  onChange,
  error,
  drawer,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  drawer: React.ReactNode;
}) {
  return (
    <Check name="kvkk" checked={checked} onChange={onChange} error={error}>
      {drawer}
      {c.kvkkPost}
    </Check>
  );
}

export function Stepper({
  name,
  label,
  value,
  min,
  max,
  onChange,
  lessLabel,
  moreLabel,
}: {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  lessLabel: string;
  moreLabel: string;
}) {
  return (
    <div className="rv-field">
      <span className="rv-label" id={`${fid(name)}-label`}>
        {label}
      </span>
      <div className="rv-stepper" role="group" aria-labelledby={`${fid(name)}-label`}>
        <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={lessLabel}>
          <Icon name="minus" />
        </button>
        <output id={fid(name)} aria-live="polite">
          {value}
        </output>
        <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={moreLabel}>
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
}

/* ---------- step shell ---------- */

export function FlowShell({
  name,
  steps,
  step,
  onStep,
  maxReached,
  title,
  children,
  onBack,
  onNext,
  nextLabel,
  nextTone = "seal",
  nextDisabled = false,
  nextDescribedBy,
  submitNote = false,
  aside,
  plate,
}: {
  name: string;
  steps: string[];
  step: number;
  onStep: (i: number) => void;
  maxReached: number;
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextTone?: "ink" | "seal";
  /** Looks inactive (aria-disabled) until the step is answerable; a click still submits, which focuses the first missing field. */
  nextDisabled?: boolean;
  nextDescribedBy?: string;
  /** The concept's "this form goes nowhere" line beside the final submit button. */
  submitNote?: boolean;
  aside?: React.ReactNode;
  plate?: React.ReactNode;
}) {
  const h1 = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    // Move focus to the new step's heading (not on first paint).
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    h1.current?.focus({ preventScroll: true });
  }, [step]);

  return (
    <div className={aside ? "rv-wrap rv-flow" : "rv-wrap rv-flow rv-flow--noaside"}>
      <aside className="rv-flow-rail" aria-label={c.stepsLabel}>
        <p className="rv-flow-name">{name}</p>
        <ol className="rv-steps">
          {steps.map((s, i) => {
            const done = i < step;
            const reachable = i <= maxReached && i !== step;
            const inner = (
              <>
                <span className="rv-step-dot">{done ? <Icon name="check" size={13} /> : i + 1}</span>
                <span>{s}</span>
              </>
            );
            return (
              <li key={s} className={done ? "is-done" : undefined}>
                {reachable ? (
                  <button type="button" className="rv-step-btn" onClick={() => onStep(i)}>
                    {inner}
                  </button>
                ) : (
                  <span className="rv-step-lbl" aria-current={i === step ? "step" : undefined}>
                    {inner}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </aside>

      <form
        className="rv-flow-main"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className="rv-flow-progress">
          <p>
            <strong>{name}</strong>
            <span>
              {c.step(step + 1, steps.length)}: {steps[step]}
            </span>
          </p>
          <div className="rv-flow-bar" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s} data-on={i <= step} />
            ))}
          </div>
        </div>
        {plate}
        <div className="rv-flow-step" key={step}>
          <h1 ref={h1} tabIndex={-1}>
            <span className="rv-sr">{c.step(step + 1, steps.length)}. </span>
            {title}
          </h1>
          <div className="rv-flow-fields">{children}</div>
        </div>
        <div className="rv-flow-actions">
          {onBack && (
            <button type="button" className="rv-btn rv-btn--quiet" onClick={onBack}>
              <Icon name="arrowLeft" size={18} />
              {c.back}
            </button>
          )}
          <button
            type="submit"
            className={nextTone === "seal" ? "rv-btn rv-btn--seal" : "rv-btn rv-btn--ink"}
            aria-disabled={nextDisabled || undefined}
            aria-describedby={nextDisabled ? nextDescribedBy : undefined}
          >
            {nextLabel ?? c.next}
          </button>
          {submitNote && <DemoNote />}
        </div>
      </form>

      {aside && <div className="rv-flow-aside">{aside}</div>}
    </div>
  );
}

/** One line under a submit button: the concept's forms are not sent anywhere. */
export function DemoNote() {
  return <p className="rv-demo-note">{c.demoNote}</p>;
}

export function Review({ sections }: { sections: { title: string; onEdit: () => void; rows: [string, string][] }[] }) {
  return (
    <div className="rv-review">
      {sections.map((s) => (
        <section key={s.title} aria-label={s.title}>
          <div className="rv-review-head">
            <h2>{s.title}</h2>
            <button type="button" onClick={s.onEdit}>
              {c.edit}
              <span className="rv-sr">: {s.title}</span>
            </button>
          </div>
          <dl>
            {s.rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

/** Focus the success heading when it appears. */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}

/**
 * The registry seal. Without a name: a small check stamp. With the child's
 * name (ön kayıt): a round wet-ink seal with the name in the centre, the
 * payoff of "every child known by name".
 */
export function SealMark({ name, ring, label }: { name?: string; ring?: string; label?: string } = {}) {
  if (!name || !ring)
    return (
      <div className="rv-seal-mark" aria-hidden="true">
        <Icon name="check" size={30} />
      </div>
    );
  const shown = name.toLocaleUpperCase("tr");
  const size = shown.length > 9 ? 15 : shown.length > 6 ? 19 : 23;
  return (
    <svg className="rv-seal-stamp" viewBox="0 0 160 160" role="img" aria-label={label}>
      <defs>
        <path id="rv-seal-ring" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
        <filter id="rv-seal-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.35" result="speck" />
          <feComposite in="SourceGraphic" in2="speck" operator="in" />
        </filter>
      </defs>
      <g filter="url(#rv-seal-ink)" fill="none" stroke="currentColor">
        <circle cx="80" cy="80" r="74" strokeWidth="3.5" />
        <circle cx="80" cy="80" r="46" strokeWidth="1.5" />
        <text fill="currentColor" stroke="none" fontSize="12.5">
          <textPath href="#rv-seal-ring" textLength="358" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        <path d="M66 58 V50 A14 14 0 0 1 94 50 V58" strokeWidth="2" />
        <text x="80" y={86 + size * 0.3} fill="currentColor" stroke="none" fontSize={size} textAnchor="middle">
          {shown}
        </text>
      </g>
    </svg>
  );
}

/**
 * The chosen level as a small arch plate. It carries
 * `view-transition-name: rv-arch`, so the arch clicked on the home page walk
 * lands here (see archNavigate in shell/Motion).
 */
export function KademePlate({ kademe }: { kademe: Kademe | "" }) {
  if (!kademe) return <div className="rv-plate rv-plate--empty" aria-hidden="true" />;
  const l = tr.levels.items[kademe];
  return (
    <div className="rv-plate">
      {/* Same sizes as the walk's arch so the transition reuses the cached file. */}
      <Photo k={l.image} arch priority sizes="(max-width: 860px) 70vw, 34vw" className="rv-plate-arch" alt="" />
      <p>
        <span className="rv-plate-label">{c.plateLabel}</span>
        <strong>{l.name}</strong>
        <span>{l.range}</span>
      </p>
    </div>
  );
}

export function HelpCard({ note }: { note: string }) {
  return (
    <div className="rv-summary-card rv-help">
      <p className="rv-help-note">{note}</p>
      <h2>{c.help.title}</h2>
      <p>{c.help.text}</p>
      <a href={tr.contact.phoneHref} className="rv-textlink">
        <Icon name="phone" size={18} />
        {tr.contact.phone}
      </a>
    </div>
  );
}
