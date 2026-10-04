"use client";

// Bekleme listesi: up to three preferred evenings and a time range. If one of
// the chosen evenings still has a free seating in that range, say so and offer
// it. Nothing is sent; the success screen offers the same data as an e-mail.

import { useMemo, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { calendar, slotsFor, SALON_TIMES, COUNTER_TIME } from "@/lib/kalemkar/availability";
import { dayChip, dayLong, phoneOk } from "@/lib/kalemkar/format";
import { useBooking, useNow } from "@/lib/kalemkar/store";
import { ChipRadio, Note, PhoneField, TextField } from "./kit";

const w = tr.flow.waitlist;
type Range = "erken" | "gec" | "fark";
const inRange = (t: string, r: Range) => r === "fark" || (r === "erken" ? t <= "19.30" : t >= "21.00");

export function Waitlist({ headRef, onBack, onTake }: { headRef: React.RefObject<HTMLHeadingElement | null>; onBack: () => void; onTake: (iso: string, time: string) => void }) {
  const { booking: b, update } = useBooking();
  const now = useNow();
  const [prefs, setPrefs] = useState<string[]>(b.tarih ? [b.tarih] : []);
  const [range, setRange] = useState<Range>("fark");
  const [forced, setForced] = useState(false);
  const [sent, setSent] = useState(false);

  const evenings = useMemo(() => {
    if (!now) return [];
    const out: string[] = [];
    for (const m of calendar(now, b.deneyim, b.kisi, b.menu)) {
      if (m.locked) continue;
      for (const d of m.days) if (["bos", "az", "dolu"].includes(d.status)) out.push(d.iso);
    }
    return out;
  }, [now, b.deneyim, b.kisi, b.menu]);

  const free = useMemo(() => {
    if (!now) return null;
    for (const iso of prefs) {
      const s = slotsFor(iso, b.deneyim, b.kisi, b.menu, now).find((x) => x.ok && inRange(x.time, range));
      if (s) return { iso, time: s.time };
    }
    return null;
  }, [now, prefs, range, b.deneyim, b.kisi, b.menu]);

  const errName = !b.ad || b.ad.trim().length < 3 ? tr.flow.contact.errName : "";
  const errPhone = !phoneOk(b.telefon ?? "") ? tr.flow.contact.errPhone : "";
  const errPrefs = prefs.length === 0 ? w.prefs : "";

  const submit = () => {
    if (errName || errPhone || errPrefs) {
      setForced(true);
      return;
    }
    setSent(true);
  };

  const times = b.deneyim === "tezgah" ? [COUNTER_TIME] : [...SALON_TIMES];
  const body = [
    `${w.prefs}: ${prefs.map(dayLong).join("; ")}`,
    `${w.range}: ${w.ranges[range]}`,
    `${b.kisi} kişi, ${tr.flow.experience.options[b.deneyim].name}`,
    `${b.ad ?? ""}, +90 ${b.telefon ?? ""}`,
  ].join("\n");
  const mail = `mailto:${tr.contact.email}?subject=${encodeURIComponent(w.mailSubject)}&body=${encodeURIComponent(body)}`;

  if (sent) {
    return (
      <div className="kk-flow-step">
        <h2 className="kk-h3" ref={headRef} tabIndex={-1}>
          {w.success}
        </h2>
        <p className="kk-muted">{w.successNote}</p>
        <div className="kk-done-act">
          <a className="kk-btn kk-btn--line" href={mail}>
            {w.mail}
          </a>
          <button type="button" className="kk-btn kk-btn--accent" onClick={onBack}>
            {w.cancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kk-flow-step">
      <h2 className="kk-h3" ref={headRef} tabIndex={-1}>
        {w.title}
      </h2>
      <p className="kk-muted">{w.sub}</p>

      <h3 className="kk-flow-sub">{w.prefs}</h3>
      <div className="kk-chips kk-chips--days" role="group" aria-label={w.prefs}>
        {evenings.slice(0, 24).map((iso) => {
          const on = prefs.includes(iso);
          const full = prefs.length >= 3 && !on;
          return (
            <button
              key={iso}
              type="button"
              className="kk-chip kk-chip--sm"
              aria-pressed={on}
              aria-disabled={full || undefined}
              onClick={() => {
                if (full) return;
                setPrefs((p) => (on ? p.filter((x) => x !== iso) : [...p, iso].sort()));
              }}
            >
              {dayChip(iso)}
            </button>
          );
        })}
      </div>
      {prefs.length >= 3 && <p className="kk-hint">{w.max}</p>}
      {forced && errPrefs && <p className="kk-error">{errPrefs}</p>}

      <h3 className="kk-flow-sub">{w.range}</h3>
      <ChipRadio<Range>
        label={w.range}
        value={range}
        onChange={setRange}
        options={(Object.keys(w.ranges) as Range[]).filter((r) => b.deneyim !== "tezgah" || r === "fark").map((r) => ({ value: r, label: w.ranges[r] }))}
      />
      <div aria-live="polite">
        {free && times.includes(free.time) && (
          <Note>
            <p>{w.freeHint(dayChip(free.iso), free.time)}</p>
            <button type="button" className="kk-btn kk-btn--accent kk-btn--sm" onClick={() => onTake(free.iso, free.time)}>
              {w.take}
            </button>
          </Note>
        )}
      </div>

      <div className="kk-form-grid">
        <TextField id="kk-w-ad" label={tr.flow.contact.name} value={b.ad ?? ""} onChange={(v) => update({ ad: v })} autoComplete="name" error={forced ? errName : ""} />
        <PhoneField id="kk-w-tel" label={tr.flow.contact.phone} value={b.telefon ?? ""} onChange={(v) => update({ telefon: v })} error={forced ? errPhone : ""} />
      </div>
      <div className="kk-flow-nav">
        <button type="button" className="kk-btn kk-btn--line" onClick={onBack}>
          {w.cancel}
        </button>
        <button type="button" className="kk-btn kk-btn--accent" onClick={submit}>
          {w.submit}
        </button>
      </div>
    </div>
  );
}
