"use client";

// Form controls in the HMI idiom: big monospaced digits, ± steppers, the unit
// printed beside the value. Values commit to the store as soon as they parse
// inside the limits; anything else shows a plain-language error under the field.

import { useEffect, useId, useState } from "react";
import { tr } from "@/content/pazi/tr";
import { fmt, fmt1 } from "@/lib/pazi/format";

/** Turkish input first ("1.200", "12,5"), English decimals tolerated ("12.5"). */
const parse = (s: string) => {
  let t = s.replace(/[\s  ]/g, "");
  if (t === "") return NaN;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  return Number(t);
};

type NumProps = {
  label: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  decimals?: 0 | 1;
  onChange: (v: number) => void;
  hint?: string;
  /** Extra validation on top of min/max (returns a message or null). */
  check?: (v: number) => string | null;
  /** External error (e.g. from plan validation). */
  error?: string | null;
  compact?: boolean;
  hideLabel?: boolean;
  id?: string;
  big?: boolean;
};

export function NumberField({ label, unit, value, min, max, step = 1, decimals = 0, onChange, hint, check, error, compact, hideLabel, id, big }: NumProps) {
  const auto = useId();
  const fid = id ?? auto;
  const show = (v: number) => (decimals ? fmt1(v) : fmt(v));
  const [text, setText] = useState(show(value));
  const [local, setLocal] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(show(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, focused]);

  const commit = (s: string) => {
    setText(s);
    const v = parse(s);
    if (!Number.isFinite(v)) {
      setLocal(tr.errors.empty);
      return;
    }
    if (v < min || v > max) {
      setLocal(tr.errors.range(show(min), `${show(max)}${unit ? ` ${unit}` : ""}`));
      return;
    }
    const extra = check?.(v) ?? null;
    if (extra) {
      setLocal(extra);
      return;
    }
    setLocal(null);
    onChange(decimals ? Math.round(v * 10) / 10 : Math.round(v));
  };

  const bump = (dir: 1 | -1) => {
    const base = Number.isFinite(parse(text)) ? parse(text) : value;
    const next = Math.min(max, Math.max(min, Math.round((base + dir * step) / step) * step));
    commit(show(next));
  };

  const msg = local ?? error ?? null;
  const hid = `${fid}-hint`;
  const eid = `${fid}-err`;
  return (
    <div className={`pz-num${compact ? " pz-num-compact" : ""}${big ? " pz-num-big" : ""}${msg ? " is-error" : ""}`}>
      <label htmlFor={fid} className={hideLabel ? "pz-sr" : "pz-num-label"}>
        {label}
      </label>
      <div className="pz-num-box">
        <button type="button" className="pz-num-step" onClick={() => bump(-1)} aria-label={`${label}: ${tr.fields.minus}`} tabIndex={-1}>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 6h10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <input
          id={fid}
          className="pz-num-input"
          type="text"
          inputMode={decimals ? "decimal" : "numeric"}
          autoComplete="off"
          spellCheck={false}
          value={text}
          aria-invalid={msg ? true : undefined}
          aria-describedby={[hint ? hid : "", msg ? eid : ""].filter(Boolean).join(" ") || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (!local) setText(show(value));
          }}
          onChange={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              bump(1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              bump(-1);
            }
          }}
        />
        {unit ? (
          <span className="pz-num-unit" aria-hidden="true">
            {unit}
          </span>
        ) : null}
        <button type="button" className="pz-num-step" onClick={() => bump(1)} aria-label={`${label}: ${tr.fields.plus}`} tabIndex={-1}>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 6h10M6 1v10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      {hint ? (
        <p id={hid} className="pz-num-hint">
          {hint}
        </p>
      ) : null}
      {msg ? (
        <p id={eid} className="pz-num-error" role="alert">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

type Opt<T extends string> = { value: T; label: string; disabled?: boolean; note?: string };

export function Segmented<T extends string>({ label, value, options, onChange, hideLabel }: { label: string; value: T; options: Opt<T>[]; onChange: (v: T) => void; hideLabel?: boolean }) {
  const name = useId();
  return (
    <fieldset className="pz-seg">
      <legend className={hideLabel ? "pz-sr" : "pz-seg-label"}>{label}</legend>
      <div className="pz-seg-row">
        {options.map((o) => (
          <label key={o.value} className={`pz-seg-opt${o.disabled ? " is-off" : ""}`} title={o.disabled ? o.note : undefined}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
            {o.disabled && o.note ? <span className="pz-sr">{`(${o.note})`}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="pz-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="pz-toggle-box" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}
