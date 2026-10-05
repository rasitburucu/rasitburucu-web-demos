"use client";

import { tr } from "@/content/sazbahce/tr";
import type { Assessment } from "@/lib/sazbahce/assess";
import { setupFor } from "@/lib/sazbahce/plan";
import type { AreaKey, Ceremony, Setup } from "@/lib/sazbahce/venue";

const r = tr.reading;

type Props = {
  a: Assessment;
  area: AreaKey;
  ceremony: Ceremony;
  guests: number;
  setup?: Setup;
  onArea: (a: AreaKey) => void;
  onNikah?: () => void;
  className?: string;
};

/** The plan's reading box: what the layout means, or what to change. */
export function Reading({ a, area, ceremony, guests, setup, onArea, onNikah, className }: Props) {
  const name = tr.areas[area].name;
  let title = "";
  let body = "";
  let actions: { label: string; on: () => void }[] = [];
  let warn = false;

  if (a.kind === "busy") {
    warn = true;
    title = r.busy(name, a.closed);
    body = a.free.length + a.held.length ? r.busyFree : r.busyNone;
    actions = [
      ...a.free.map((x) => ({ label: r.go(tr.areas[x].dat), on: () => onArea(x) })),
      ...a.held.map((x) => ({ label: r.goHeld(tr.areas[x].dat), on: () => onArea(x) })),
    ];
  } else if (a.kind === "iskele") {
    warn = true;
    title = r.iskeleTitle;
    body = r.iskeleBody;
    actions = [
      ...(onNikah ? [{ label: r.toNikah, on: onNikah }] : []),
      { label: r.go(tr.areas.cayir.dat), on: () => onArea("cayir") },
    ];
  } else if (a.kind === "nosetup") {
    warn = true;
    title = r.noSetup(name, tr.setups[a.setup].toLocaleLowerCase("tr"));
    body = r.noSetupBody;
  } else {
    const l = a.layout;
    const s = setupFor(ceremony, setup);
    const n = l.items.length;
    if (ceremony === "nikah") {
      title = r.chairs(l.seats);
      body = area === "iskele" ? r.nikahIskele : area === "cayir" ? r.nikahCayir : area === "ambar" ? r.nikahAmbar : r.nikahAvlu;
    } else if (s === "yuvarlak") {
      title = r.round(n, l.seats);
      const spare = Math.floor((a.cap - l.seats) / 10);
      body = `${area === "ambar" ? r.roundAmbar : area === "avlu" ? r.roundAvlu : r.roundCayir} ${spare > 2 ? r.spare(spare) : r.full}`;
    } else if (s === "uzun") {
      title = r.long(n, l.seats);
      body = area === "ambar" ? r.longNote : a.cap > l.seats ? r.room(a.cap - l.seats) : r.full;
    } else if (s === "tiyatro") {
      title = r.theatre(l.seats);
      body = a.cap > l.seats ? r.room(a.cap - l.seats) : r.full;
    } else if (s === "sinif") {
      title = r.classroom(n, l.seats);
      body = a.cap > l.seats ? r.room(a.cap - l.seats) : r.full;
    } else if (s === "u") {
      title = r.u(l.seats);
      body = a.cap > l.seats ? r.room(a.cap - l.seats) : r.full;
    } else {
      title = r.cocktail(n, l.seats);
      body = a.cap > l.seats ? r.room(a.cap - l.seats) : r.full;
    }
    if (a.kind === "over") {
      warn = true;
      title = r.overTitle(name, a.cap);
      body = a.suggest ? r.overSuggest(guests, tr.areas[a.suggest].name) : r.overNone;
      actions = a.suggest ? [{ label: r.go(tr.areas[a.suggest].dat), on: () => onArea(a.suggest as AreaKey) }] : [];
    }
  }

  return (
    <div className={`sb-reading ${className ?? ""}`} data-warn={warn || undefined} aria-live="polite">
      <strong>{title}</strong>
      <span>{body}</span>
      {actions.length > 0 && (
        <span className="sb-reading-act">
          {actions.map((x) => (
            <button key={x.label} type="button" className="sb-btn sb-btn--accent sb-btn--sm" onClick={x.on}>
              {x.label}
            </button>
          ))}
        </span>
      )}
    </div>
  );
}
