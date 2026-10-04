"use client";

// Özel davet: a request form for the private room (8–14) or the whole house
// (15–34). Not a quote builder. On submit it shows a confirmation and offers
// the same details as a pre-filled e-mail; nothing is sent from the page.

import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { emailOk, phoneOk } from "@/lib/kalemkar/format";
import { useBooking } from "@/lib/kalemkar/store";
import { Check, ChipRadio, Note, PhoneField, TextField } from "./kit";

const t = tr.invite;

export function Invite() {
  const { booking: b, update, ready } = useBooking();
  const [occasion, setOccasion] = useState<string>(t.occasions[0]);
  const [people, setPeople] = useState(10);
  const [dates, setDates] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [menus, setMenus] = useState<string[]>([t.menus[0]]);
  const [budget, setBudget] = useState<string>(t.budgets[3]);
  const [note, setNote] = useState("");
  const [forced, setForced] = useState(false);
  const [sent, setSent] = useState(false);
  const [carried, setCarried] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);

  // Carry the party size over from the reservation flow.
  useEffect(() => {
    if (!ready) return;
    if (b.kisi >= 7) {
      setPeople(Math.min(34, Math.max(8, b.kisi)));
      setCarried(true);
    }
    if (b.tarih) setDates((d) => d || b.tarih!.split("-").reverse().join("."));
    // once, when the store is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (sent) head.current?.focus();
  }, [sent]);

  const errPeople = people < 8 || people > 34 ? t.errPeople : "";
  const errName = !b.ad || b.ad.trim().length < 3 ? tr.flow.contact.errName : "";
  const errPhone = !phoneOk(b.telefon ?? "") ? tr.flow.contact.errPhone : "";
  const errEmail = !emailOk(b.eposta ?? "") ? tr.flow.contact.errEmail : "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (errPeople || errName || errPhone || errEmail) {
      setForced(true);
      requestAnimationFrame(() => document.querySelector<HTMLElement>(".kk-invite [aria-invalid='true']")?.focus());
      return;
    }
    setSent(true);
  };

  const body = [
    `${t.occasion}: ${occasion}`,
    `${t.people}: ${people}`,
    `${t.dates}: ${dates || "-"}${flexible ? ` (${t.flexible.toLocaleLowerCase("tr")})` : ""}`,
    `${t.menu}: ${menus.join(", ") || "-"}`,
    `${t.budget}: ${budget}`,
    note ? `${t.note}: ${note}` : "",
    "",
    `${b.ad ?? ""}`,
    `+90 ${b.telefon ?? ""}`,
    `${b.eposta ?? ""}`,
  ]
    .filter((x) => x !== undefined)
    .join("\n");
  const mail = `mailto:${tr.contact.email}?subject=${encodeURIComponent(`${t.mailSubject}: ${occasion}, ${people} kişi`)}&body=${encodeURIComponent(body)}`;

  if (sent) {
    return (
      <div className="kk-invite kk-done">
        <h2 className="kk-h2" ref={head} tabIndex={-1}>
          {t.success}
        </h2>
        <p className="kk-muted">{t.successNote}</p>
        <div className="kk-done-act">
          <a className="kk-btn kk-btn--accent" href={mail}>
            {t.mail}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="kk-invite" onSubmit={submit} noValidate>
      {carried && <Note>{t.carried}</Note>}
      <h2 className="kk-flow-sub">{t.occasion}</h2>
      <ChipRadio<string> label={t.occasion} value={occasion} onChange={setOccasion} options={t.occasions.map((o) => ({ value: o, label: o }))} />

      <div className="kk-field kk-field--inline">
        <label className="kk-label" htmlFor="kk-i-people">
          {t.people}
        </label>
        <select id="kk-i-people" className="kk-input kk-input--select" value={people} onChange={(e) => setPeople(Number(e.target.value))} aria-invalid={forced && !!errPeople ? true : undefined}>
          {Array.from({ length: 27 }, (_, i) => i + 8).map((n) => (
            <option key={n} value={n}>
              {n} kişi
            </option>
          ))}
        </select>
        <p className="kk-hint">{people <= 14 ? t.roomHint : t.houseHint}</p>
      </div>

      <TextField id="kk-i-dates" label={t.dates} placeholder={t.datesPh} value={dates} onChange={setDates} maxLength={120} />
      <Check id="kk-i-flex" label={t.flexible} checked={flexible} onChange={setFlexible} />

      <h2 className="kk-flow-sub">{t.menu}</h2>
      <div className="kk-chips" role="group" aria-label={t.menu}>
        {t.menus.map((m) => {
          const on = menus.includes(m);
          return (
            <button key={m} type="button" className="kk-chip" aria-pressed={on} onClick={() => setMenus((x) => (on ? x.filter((y) => y !== m) : [...x, m]))}>
              {m}
            </button>
          );
        })}
      </div>

      <h2 className="kk-flow-sub">{t.budget}</h2>
      <ChipRadio<string> label={t.budget} value={budget} onChange={setBudget} options={t.budgets.map((o) => ({ value: o, label: o }))} />
      <p className="kk-hint">{tr.sampleLong}</p>

      <TextField id="kk-i-note" label={t.note} value={note} onChange={setNote} multiline maxLength={600} optional />

      <div className="kk-form-grid">
        <TextField id="kk-i-ad" label={t.name} value={b.ad ?? ""} onChange={(v) => update({ ad: v })} autoComplete="name" error={forced ? errName : ""} />
        <PhoneField id="kk-i-tel" label={t.phone} value={b.telefon ?? ""} onChange={(v) => update({ telefon: v })} error={forced ? errPhone : ""} />
        <TextField id="kk-i-eposta" type="email" label={t.email} value={b.eposta ?? ""} onChange={(v) => update({ eposta: v })} autoComplete="email" error={forced ? errEmail : ""} />
      </div>
      <p className="kk-hint">{tr.flow.contact.privacy}</p>
      <button type="submit" className="kk-btn kk-btn--accent">
        {t.submit}
      </button>
    </form>
  );
}
