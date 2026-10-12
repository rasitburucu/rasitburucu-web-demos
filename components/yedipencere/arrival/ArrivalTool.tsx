"use client";

// "Kapıdan kapıya": choose how you arrive, see the last walk to our door.
// Compact on the home page, complete (before-you-go notes, plate message,
// print, share) on the arrival page.

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MODES, MODE_IDS, type StartId } from "@/lib/yedipencere/arrival";
import { fmtDay, type Lang } from "@/lib/yedipencere/dates";
import { fill, metres, minutes } from "@/lib/yedipencere/format";
import { ROOM } from "@/lib/yedipencere/house";
import { href } from "@/lib/yedipencere/paths";
import { walkOf } from "@/lib/yedipencere/route";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { arrival as ARRIVAL } from "@/content/yedipencere/arrival";
import { Strip } from "./Strip";
import { Itinerary } from "./Itinerary";

function PlateDialog({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const t = COPY[lang].arrival;
  const { stay } = useStay();
  const [plate, setPlate] = useState("");
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const msg = fill(t.plateMessage, { tarih: fmtDay(stay.checkIn, lang), oda: ROOM[stay.room].name, plaka: plate.trim() || t.plateEmpty });
  return (
    <dialog ref={ref} className="yp-dialog" aria-labelledby="yp-plate-h" onClose={onClose} onCancel={onClose}>
      <div className="yp-dialog-in">
        <h2 id="yp-plate-h">{t.plateTitle}</h2>
        <label className="yp-field">
          <span>{t.plateLabel}</span>
          <input value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder={t.platePlaceholder} autoComplete="off" spellCheck={false} maxLength={14} />
        </label>
        <p className="yp-msg">{msg}</p>
        <div className="yp-dialog-act">
          <button
            type="button"
            className="yp-btn yp-btn--accent"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(msg);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {t.plateCopy}
          </button>
          <button type="button" className="yp-btn" onClick={onClose}>
            {COPY[lang].nav.close}
          </button>
        </div>
        <p className="yp-note" role="status">
          {copied ? t.plateCopied : t.notSentMessage}
        </p>
      </div>
    </dialog>
  );
}

export function ArrivalTool({ lang, variant }: { lang: Lang; variant: "compact" | "full" }) {
  const { trip, setTrip, stay } = useStay();
  const t = COPY[lang];
  const a = ARRIVAL[lang];
  const walk = useMemo(() => walkOf(trip.start, trip.luggage), [trip.start, trip.luggage]);
  const [plateOpen, setPlateOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const room = ROOM[stay.room];
  const startName = a.starts[trip.start];

  const down = walk.legs.filter((l) => l.kind === "steps" && l.dir === "down").reduce((s, l) => s + l.steps, 0);
  const up = walk.legs.filter((l) => l.kind === "steps" && l.dir !== "down").reduce((s, l) => s + l.steps, 0);
  const stepsPart =
    walk.steps === 0
      ? t.arrival.stepFree
      : [down ? fill(t.arrival.stepsDown, { n: down }) : "", up ? fill(t.arrival.stepsUp, { n: up }) : ""].filter(Boolean).join(", ") + (walk.stepsSample ? ` (${t.measuredSample})` : "");
  const climb = walk.ele1 - walk.ele0;
  const climbPart = climb > 2 ? fill(t.arrival.climb, { m: climb }) : climb < -2 ? fill(t.arrival.descent, { m: -climb }) : t.arrival.flat;
  const timePart = `${fill(t.arrival.about, { dk: minutes(walk.minutes, lang) })}, ${fill(t.arrival.withLuggage, { dk: minutes(walk.minutesLuggage, lang) })}`;
  const before = a.before[trip.mode][trip.start] ?? "";
  const full = variant === "full";

  return (
    <div className="yp-arr" data-variant={variant}>
      <div className="yp-arr-modes" role="group" aria-label={t.arrival.from}>
        {MODE_IDS.map((m) => (
          <button key={m} type="button" className="yp-chip" aria-pressed={trip.mode === m} onClick={() => setTrip({ mode: m })}>
            {a.modes[m]}
          </button>
        ))}
      </div>
      {MODES[trip.mode].length > 1 && (
        <div className="yp-arr-starts" role="group" aria-label={t.arrival.startFrom}>
          {MODES[trip.mode].map((s: StartId) => (
            <button key={s} type="button" className="yp-seg" aria-pressed={trip.start === s} onClick={() => setTrip({ start: s })}>
              {a.how[trip.mode][s]}
            </button>
          ))}
        </div>
      )}

      <div className="yp-arr-grid">
        <div className="yp-arr-main">
          <div className="yp-arr-sum" aria-live="polite">
            <strong>{metres(walk.m, lang)}</strong>
            {/* each part stays on one line, so "10 m" never parts from "iniş" */}
            <span>
              <span className="yp-nw">{stepsPart}</span> · <span className="yp-nw">{timePart}</span> · <span className="yp-nw">{climbPart}</span>
            </span>
          </div>
          {walk.hasLuggageWay && (
            <label className="yp-check">
              <input type="checkbox" checked={trip.luggage} onChange={(e) => setTrip({ luggage: e.target.checked })} />
              <span>{t.arrival.luggage}</span>
            </label>
          )}
          <div className="yp-arr-strip">
            <Strip walk={walk} lang={lang} roomName={room.name} roomSteps={room.steps} startName={startName} />
          </div>
          <div className="yp-arr-itin" data-variant={variant}>
            {full && <h3 className="yp-h4">{t.arrival.steps}</h3>}
            <Itinerary walk={walk} lang={lang} startName={startName} roomName={room.name} roomSteps={room.steps} handover={a.luggage[trip.start]} />
          </div>
          <p className="yp-attr">
            {t.arrival.attribution}
            {walk.stepsSample || walk.pieces.some((p) => p.surfaceSample) ? ` · ${t.arrival.sampleNote}` : ""}
          </p>
          {!full && (
            <Link href={href(lang, "arrival")} className="yp-more">
              {t.arrival.more}
              <span aria-hidden="true"> →</span>
            </Link>
          )}
        </div>

        <aside className="yp-arr-side">
          <h3 className="yp-h4">{t.arrival.before}</h3>
          <p>{before}</p>
          {trip.mode === "marina" && <p className="yp-arr-lift">{a.lift}</p>}
          <h3 className="yp-h4">
            {t.arrival.service} <span className="yp-tag">{t.arrival.serviceSample}</span>
          </h3>
          <p>{a.luggage[trip.start]}</p>
          {trip.mode === "arac" && (
            <>
              <h3 className="yp-h4">{t.arrival.car}</h3>
              <p>{a.car}</p>
              {full && (
                <button type="button" className="yp-btn" onClick={() => setPlateOpen(true)} aria-haspopup="dialog">
                  {t.arrival.plateButton}
                </button>
              )}
            </>
          )}
          {full && (
            <div className="yp-arr-actions">
              <button type="button" className="yp-btn" onClick={() => window.print()}>
                {t.arrival.print}
              </button>
              <button
                type="button"
                className="yp-btn"
                onClick={async () => {
                  try {
                    const u = new URL(window.location.href);
                    u.search = `?yol=${trip.mode}`;
                    await navigator.clipboard.writeText(u.toString());
                    setLinkCopied(true);
                  } catch {
                    setLinkCopied(false);
                  }
                }}
              >
                {t.arrival.copyLink}
              </button>
              <p className="yp-note" role="status">
                {linkCopied ? t.arrival.linkCopied : ""}
              </p>
            </div>
          )}
        </aside>
      </div>
      {full && <PlateDialog lang={lang} open={plateOpen} onClose={() => setPlateOpen(false)} />}
    </div>
  );
}
