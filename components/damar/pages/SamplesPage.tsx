"use client";

// Samples and quote: the sample box (kept in this browser only) and a quote
// request that turns into the message the export desk would receive.
// Nothing is sent anywhere; the page says so beside the button.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Locale } from "@/content/damar/routes";
import { FINISHES, isFinish, isStoneId, STONE_IDS, STONES, type Finish, type StoneId, type Thickness } from "@/content/damar/stones";
import { estimate, M2_MAX, PAYLOADS, type Payload } from "@/lib/damar/calc";
import { dict, num, range } from "@/lib/damar/dict";
import { addSample, BOX_MAX, removeSample, updateSample, useDamar, type SampleItem, type SampleSize } from "@/lib/damar/store";
import { Box, Check, Close, Plus } from "../ui/Icons";
import { SampleTile } from "../ui/Slab";

type Terms = "fob" | "cif" | "exw";
type Role = "importer" | "architect" | "contractor" | "other";

export function SamplesPage({ locale }: { locale: Locale }) {
  const d = dict(locale);
  return (
    <>
      <header className="dm-phead dm-wrap">
        <h1 className="dm-h1">{d.samples.h1}</h1>
        <p className="dm-lede">{d.samples.lede}</p>
      </header>
      <div className="dm-wrap dm-samples">
        <SampleBox locale={locale} />
        <QuoteForm locale={locale} />
      </div>
    </>
  );
}

function SampleBox({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const t = d.samples;
  const box = useDamar((s) => s.box);
  const ready = useDamar((s) => s.ready);
  const slots = Array.from({ length: BOX_MAX }, (_, i) => box[i] ?? null);

  const addAll = () => {
    for (const id of STONE_IDS) addSample(id, null, "polished");
  };

  return (
    <section className="dm-boxpanel" id="box" aria-labelledby="dm-boxpanel-h">
      <div className="dm-boxpanel-head">
        <h2 id="dm-boxpanel-h" className="dm-h2">
          {t.boxTitle}
        </h2>
        <p className="dm-note">{t.slots(box.length, BOX_MAX)}</p>
      </div>
      <div className="dm-tray dm-tray--box">
        <ul className="dm-boxslots">
          {slots.map((item, i) => (item ? <BoxItem key={item.key} locale={locale} item={item} /> : <li key={`empty-${i}`} className="dm-boxslot dm-boxslot--empty" aria-hidden="true" />))}
        </ul>
      </div>
      {ready && box.length === 0 && (
        <div className="dm-boxempty">
          <p>{t.empty}</p>
          <button type="button" className="dm-btn dm-btn--line" onClick={addAll}>
            <Plus />
            {t.addAll}
          </button>
        </div>
      )}
      {box.length >= BOX_MAX && <p className="dm-note">{t.full(BOX_MAX)}</p>}
      <p className="dm-boxterms">{t.terms}</p>
      <p className="dm-note">{t.termsNote}</p>
    </section>
  );
}

function BoxItem({ locale, item }: { locale: Locale; item: SampleItem }) {
  const d = dict(locale);
  const t = d.samples;
  const s = STONES[item.stone];
  const pair = item.pair ? s.pairs.find(([a]) => a === item.pair) : null;
  const id = useId();
  return (
    <li className="dm-boxslot">
      <div className="dm-boxslot-tile" data-finish={item.finish} data-ground={s.ground}>
        <SampleTile stone={item.stone} alt="" className="dm-slab" />
        <span className="dm-sheen" />
        <span className="dm-tex" />
        <span className="dm-boxslot-label">{s.block.id}</span>
      </div>
      <div className="dm-boxslot-body">
        <p className="dm-boxslot-name">{s.name}</p>
        <p className="dm-boxslot-meta dm-num">{pair ? t.item(s.block.id, range(pair[0], pair[1])) : t.itemStone(s.block.id)}</p>
        <div className="dm-boxslot-fields">
          <label htmlFor={`${id}-f`} className="dm-sr">
            {t.finish}
          </label>
          <select id={`${id}-f`} value={item.finish} onChange={(e) => isFinish(e.target.value) && updateSample(item.key, { finish: e.target.value })}>
            {FINISHES.map((f) => (
              <option key={f} value={f}>
                {d.finishes[f].name}
              </option>
            ))}
          </select>
          <label htmlFor={`${id}-s`} className="dm-sr">
            {t.size}
          </label>
          <select id={`${id}-s`} value={item.size} onChange={(e) => updateSample(item.key, { size: e.target.value as SampleSize })}>
            {(["10", "30"] as SampleSize[]).map((sz) => (
              <option key={sz} value={sz}>
                {t.sizes[sz]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="button" className="dm-boxslot-remove" onClick={() => removeSample(item.key)} aria-label={t.removeLabel(s.name)}>
        <Close size={16} />
      </button>
    </li>
  );
}

const parseM2 = (v: string) => {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? Math.min(M2_MAX, n) : NaN;
};

function QuoteForm({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const t = d.samples;
  const f = t.fields;
  const saved = useDamar((s) => s.quote);
  const box = useDamar((s) => s.box);
  const ready = useDamar((s) => s.ready);
  const [stone, setStone] = useState<StoneId>("karakalem");
  const [pair, setPair] = useState<number | null>(null);
  const [m2, setM2] = useState("120");
  const [thick, setThick] = useState<Thickness>(2);
  const [finish, setFinish] = useState<Finish>("polished");
  const [limit, setLimit] = useState<Payload>(27);
  const [terms, setTerms] = useState<Terms>("fob");
  const [port, setPort] = useState("");
  const [month, setMonth] = useState("");
  const [months, setMonths] = useState<{ v: string; l: string }[]>([]);
  const [role, setRole] = useState<Role>("importer");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [withBox, setWithBox] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const filled = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  // prefill once: the address (?stone=) wins, then the last estimate from the book
  useEffect(() => {
    if (filled.current || !ready) return;
    filled.current = true;
    const q = new URLSearchParams(window.location.search);
    const fromUrl = q.get("stone");
    if (isStoneId(fromUrl)) {
      setStone(fromUrl);
      setThick(STONES[fromUrl].block.thickness);
    } else if (saved) {
      setStone(saved.stone);
      setPair(saved.pair);
      setM2(String(saved.m2));
      setThick(saved.t);
      setFinish(saved.finish);
      setLimit(saved.limit);
    }
  }, [ready, saved]);

  // loading months: the next six, worked out in the visitor's browser
  useEffect(() => {
    const now = new Date();
    const list = Array.from({ length: 6 }, (_, i) => {
      const dt = new Date(now.getFullYear(), now.getMonth() + 1 + i, 1);
      return { v: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`, l: `${d.months[dt.getMonth()]} ${dt.getFullYear()}` };
    });
    setMonths(list);
    setMonth((m) => m || list[1].v);
  }, [d.months]);

  const s = STONES[stone];
  const area = parseM2(m2);
  const est = useMemo(() => estimate(s, area, thick, limit), [s, area, thick, limit]);
  const pairText = pair ? s.pairs.find(([a]) => a === pair) : null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!Number.isFinite(area) || area < 1) e.area = t.errors.area;
    if (!name.trim()) e.name = t.errors.name;
    if (!email.trim()) e.email = t.errors.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = t.errors.emailFormat;
    if (!country.trim()) e.country = t.errors.country;
    return e;
  };

  const message = () => {
    const m = t.message;
    const lines = [m.hello, "", m.ask, m.stone(s.name, s.block.id)];
    if (pairText) lines.push(m.pair(range(pairText[0], pairText[1])));
    lines.push(m.qty(num(locale, area), `${thick} cm`, d.finishes[finish].name.toLocaleLowerCase(d.htmlLang)));
    if (est) lines.push(m.est(`${d.calc.slabs(num(locale, est.slabs))}, ${d.calc.bundles(num(locale, est.bundles))}, ${d.calc.tonnes(num(locale, est.tonnes, 1))}, ${d.calc.containers(num(locale, est.containers))}`));
    lines.push(m.terms(f.termsOptions[terms], port.trim()));
    const ml = months.find((x) => x.v === month);
    if (ml) lines.push(m.month(ml.l));
    if (withBox && box.length) {
      const list = box
        .map((i) => {
          const st = STONES[i.stone];
          const p = i.pair ? st.pairs.find(([a]) => a === i.pair) : null;
          return `${st.name}${p ? ` ${range(p[0], p[1])}` : ""} (${d.finishes[i.finish].name.toLocaleLowerCase(d.htmlLang)}, ${t.sizes[i.size]})`;
        })
        .join("; ");
      lines.push(m.samples(list));
    }
    if (notes.trim()) lines.push(m.notes(notes.trim()));
    lines.push("", m.sign(name.trim(), f.roles[role], company.trim(), country.trim()), email.trim());
    return lines.join("\n");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setDone(message());
    setCopied(false);
    requestAnimationFrame(() => readyRef.current?.focus());
  };

  const copy = async () => {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${uid}-${k}-err` } : {});
  const errText = (k: string) =>
    errors[k] ? (
      <span id={`${uid}-${k}-err`} className="dm-err">
        {errors[k]}
      </span>
    ) : null;
  const count = Object.keys(errors).length;

  if (done) {
    return (
      <section className="dm-quote dm-onpage" id="quote" aria-labelledby="dm-ready-h">
        <div className="dm-ready" ref={readyRef} tabIndex={-1}>
          <h2 id="dm-ready-h" className="dm-h2">
            <Check size={26} /> {t.readyTitle}
          </h2>
          <p>{t.readyText}</p>
          <pre className="dm-msg">{done}</pre>
          <div className="dm-actions">
            <button type="button" className="dm-btn dm-btn--ink" onClick={copy}>
              <span aria-live="polite">{copied ? t.copied : t.copy}</span>
            </button>
            <button type="button" className="dm-btn dm-btn--inkline" onClick={() => setDone(null)}>
              {t.edit}
            </button>
          </div>
          <p className="dm-demo">{t.demo}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dm-quote dm-onpage" id="quote" aria-labelledby="dm-quote-h">
      <form className="dm-form" onSubmit={submit} noValidate>
        <h2 id="dm-quote-h" className="dm-h2">
          {t.quoteTitle}
        </h2>
        {count > 0 && (
          <div className="dm-errsum" ref={summaryRef} tabIndex={-1} role="alert">
            {t.errors.summary(count)}
          </div>
        )}

        <fieldset className="dm-fs">
          <div className="dm-field">
            <label htmlFor={`${uid}-stone`}>{f.stone}</label>
            <select
              id={`${uid}-stone`}
              value={stone}
              onChange={(e) => {
                const v = e.target.value;
                if (isStoneId(v)) {
                  setStone(v);
                  setPair(null);
                  setThick(STONES[v].block.thickness);
                }
              }}
            >
              {STONE_IDS.map((id) => (
                <option key={id} value={id}>
                  {STONES[id].name} · {STONES[id].block.id}
                </option>
              ))}
            </select>
          </div>
          <div className="dm-field dm-field--sm">
            <label htmlFor={`${uid}-area`}>{f.area}</label>
            <input id={`${uid}-area`} type="number" inputMode="decimal" min={1} max={M2_MAX} value={m2} onChange={(e) => setM2(e.target.value)} {...err("area")} />
            {errText("area")}
          </div>
          <div className="dm-field dm-field--sm">
            <span className="dm-flabel" id={`${uid}-t`}>
              {f.thickness}
            </span>
            <div className="dm-seg dm-seg--ink" role="group" aria-labelledby={`${uid}-t`}>
              {([2, 3] as Thickness[]).map((x) => (
                <button key={x} type="button" aria-pressed={thick === x} onClick={() => setThick(x)}>
                  {x} cm
                </button>
              ))}
            </div>
          </div>
          <div className="dm-field">
            <span className="dm-flabel" id={`${uid}-fin`}>
              {f.finish}
            </span>
            <div className="dm-seg dm-seg--ink" role="group" aria-labelledby={`${uid}-fin`}>
              {FINISHES.map((x) => (
                <button key={x} type="button" aria-pressed={finish === x} onClick={() => setFinish(x)}>
                  {d.finishes[x].name}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <div className="dm-estimate" aria-live="polite">
          <p className="dm-flabel">{t.estimateTitle}</p>
          {est ? (
            <p className="dm-num">
              <b>{d.calc.slabs(num(locale, est.slabs))}</b> · {d.calc.bundles(num(locale, est.bundles))} · {d.calc.tonnes(num(locale, est.tonnes, 1))} ·{" "}
              <b>{d.calc.containers(num(locale, est.containers))}</b>
            </p>
          ) : (
            <p>{d.calc.empty}</p>
          )}
          <p className="dm-note-ink">
            {pairText ? `${s.name} ${range(pairText[0], pairText[1])} · ` : ""}
            {d.calc.waste}. {d.calc.estimate}
          </p>
          <label className="dm-field dm-field--inline">
            <span>{d.calc.payload}</span>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value) as Payload)}>
              {PAYLOADS.map((x) => (
                <option key={x} value={x}>
                  {d.calc.payloads[x]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="dm-fs">
          <div className="dm-field">
            <span className="dm-flabel" id={`${uid}-terms`}>
              {f.terms}
            </span>
            <div className="dm-seg dm-seg--ink" role="group" aria-labelledby={`${uid}-terms`}>
              {(["fob", "cif", "exw"] as Terms[]).map((x) => (
                <button key={x} type="button" aria-pressed={terms === x} onClick={() => setTerms(x)}>
                  {f.termsOptions[x]}
                </button>
              ))}
            </div>
          </div>
          <div className="dm-field">
            <label htmlFor={`${uid}-port`}>{f.port}</label>
            <input id={`${uid}-port`} type="text" value={port} onChange={(e) => setPort(e.target.value)} placeholder={f.portHint} autoComplete="off" />
          </div>
          <div className="dm-field dm-field--sm">
            <label htmlFor={`${uid}-month`}>{f.month}</label>
            <select id={`${uid}-month`} value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m.v} value={m.v}>
                  {m.l}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="dm-fs">
          <div className="dm-field">
            <label htmlFor={`${uid}-role`}>{f.role}</label>
            <select id={`${uid}-role`} value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {(Object.keys(f.roles) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {f.roles[r]}
                </option>
              ))}
            </select>
          </div>
          <div className="dm-field">
            <label htmlFor={`${uid}-company`}>{f.company}</label>
            <input id={`${uid}-company`} type="text" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
          </div>
          <div className="dm-field">
            <label htmlFor={`${uid}-name`}>
              {f.name} <span className="dm-req">({f.required})</span>
            </label>
            <input id={`${uid}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required {...err("name")} />
            {errText("name")}
          </div>
          <div className="dm-field">
            <label htmlFor={`${uid}-email`}>
              {f.email} <span className="dm-req">({f.required})</span>
            </label>
            <input id={`${uid}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required {...err("email")} />
            {errText("email")}
          </div>
          <div className="dm-field">
            <label htmlFor={`${uid}-country`}>
              {f.country} <span className="dm-req">({f.required})</span>
            </label>
            <input id={`${uid}-country`} type="text" value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country-name" required {...err("country")} />
            {errText("country")}
          </div>
          <div className="dm-field dm-field--wide">
            <label htmlFor={`${uid}-notes`}>{f.notes}</label>
            <textarea id={`${uid}-notes`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={f.notesHint} />
          </div>
          {box.length > 0 && (
            <label className="dm-check">
              <input type="checkbox" checked={withBox} onChange={(e) => setWithBox(e.target.checked)} />
              <span>
                <Box /> {f.samples} ({box.length})
              </span>
            </label>
          )}
        </fieldset>

        <div className="dm-submit" data-dm-bar-hide>
          <button type="submit" className="dm-btn dm-btn--ink">
            {t.submit}
          </button>
          <p className="dm-demo">{t.demo}</p>
        </div>
      </form>
    </section>
  );
}
