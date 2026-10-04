"use client";

// Small accessible form pieces shared by the reservation flow, the waitlist and
// the private-invitation form. Errors appear after blur or a submit attempt.

import { useId } from "react";
import { tr } from "@/content/kalemkar/tr";
import { formatPhone, tl } from "@/lib/kalemkar/format";

type Base = { label: string; error?: string; hint?: string; optional?: boolean };

function Help({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && (
        <p className="kk-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="kk-error" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </>
  );
}
const described = (id: string, error?: string, hint?: string) => [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;

export function TextField({
  id,
  label,
  error,
  hint,
  optional,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  placeholder,
  maxLength = 80,
  multiline,
}: Base & {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: "text" | "email";
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
}) {
  return (
    <div className="kk-field">
      <label className="kk-label" htmlFor={id}>
        {label}
        {optional && <small> (isteğe bağlı)</small>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className="kk-input kk-input--area"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={3}
          aria-invalid={!!error || undefined}
          aria-describedby={described(id, error, hint)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      ) : (
        <input
          id={id}
          className="kk-input"
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={maxLength}
          spellCheck={type === "email" ? false : undefined}
          autoCapitalize={type === "email" ? "none" : undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={described(id, error, hint)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

export function PhoneField({ id, label, error, value, onChange, onBlur }: Base & { id: string; value: string; onChange: (v: string) => void; onBlur?: () => void }) {
  return (
    <div className="kk-field">
      <label className="kk-label" htmlFor={id}>
        {label}
      </label>
      <div className="kk-phone">
        <span aria-hidden="true">{tr.flow.contact.phonePrefix}</span>
        <input
          id={id}
          className="kk-input"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="5xx xxx xx xx"
          value={value}
          aria-invalid={!!error || undefined}
          aria-describedby={described(id, error)}
          onChange={(e) => onChange(formatPhone(e.target.value))}
          onBlur={onBlur}
        />
      </div>
      <Help id={id} error={error} />
    </div>
  );
}

export function Check({ id, label, checked, onChange, error, hint }: { id: string; label: React.ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string; hint?: string }) {
  return (
    <div className="kk-field">
      <label className="kk-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error || undefined} aria-describedby={described(id, error, hint)} />
        <span className="kk-check-box" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 8.5l3 3 7-7" />
          </svg>
        </span>
        <span>{label}</span>
      </label>
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

/** Single-choice chips as a radio group (arrow keys move, like native radios). */
export function ChipRadio<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { value: T; label: React.ReactNode; disabled?: boolean; note?: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
  className?: string;
}) {
  const gid = useId();
  const enabled = options.filter((o) => !o.disabled);
  const onKey = (e: React.KeyboardEvent, v: T) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = enabled.findIndex((o) => o.value === v);
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const next = enabled[(i + d + enabled.length) % enabled.length];
    onChange(next.value);
    requestAnimationFrame(() => document.getElementById(`${gid}-${String(next.value)}`)?.focus());
  };
  const focusable = value !== undefined && enabled.some((o) => o.value === value) ? value : enabled[0]?.value;
  return (
    <div role="radiogroup" aria-label={label} className={className ?? "kk-chips"}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          id={`${gid}-${String(o.value)}`}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-disabled={o.disabled || undefined}
          tabIndex={o.value === focusable ? 0 : -1}
          className="kk-chip"
          onClick={() => !o.disabled && onChange(o.value)}
          onKeyDown={(e) => onKey(e, o.value)}
        >
          {o.label}
          {o.note && <small className="kk-chip-note">{o.note}</small>}
        </button>
      ))}
    </div>
  );
}

/** A price with the small "örnek" tag that keeps the concept honest. */
export function Price({ n, per }: { n: number; per?: string }) {
  return (
    <span className="kk-price">
      {tl(n)}
      {per && <span className="kk-price-per"> {per}</span>}
      <span className="kk-sample" title={tr.sampleLong}>
        {tr.sample}
      </span>
    </span>
  );
}

export function Note({ tone = "info", children }: { tone?: "info" | "warn"; children: React.ReactNode }) {
  return (
    <div className="kk-note" data-tone={tone}>
      {children}
    </div>
  );
}
