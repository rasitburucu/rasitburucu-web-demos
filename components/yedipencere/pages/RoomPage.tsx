// One room: its window, what it is like, the way from the street door, the
// room through its door, what to know, and the rooms next to it.

import Link from "next/link";
import { preload } from "react-dom";
import type { Lang } from "@/lib/yedipencere/dates";
import { cm, fill, steps as stepsText } from "@/lib/yedipencere/format";
import { BY_STEPS, FLIGHTS, ROOM, type RoomId } from "@/lib/yedipencere/house";
import { href } from "@/lib/yedipencere/paths";
import { COPY } from "@/content/yedipencere/copy";
import { ROOM_INTERIOR, rooms as ROOM_TEXT } from "@/content/yedipencere/rooms";
import { photoSrc } from "@/content/yedipencere/photos";
import { DoorPhoto } from "../draw/DoorPhoto";
import { Section } from "../draw/Section";
import { Arrow } from "../ui/icons";
import { RoomBuy, RoomWindow } from "./RoomParts";

function MiniWindow({ room }: { room: RoomId }) {
  return (
    <svg viewBox="0 0 64 80" aria-hidden="true">
      <defs>
        <clipPath id={`yp-mw-${room}`}>
          <rect x="12" y="10" width="40" height="56" />
        </clipPath>
      </defs>
      <rect x="12" y="10" width="40" height="56" fill="#DCE5EA" />
      <image href={photoSrc(room, 120)} x="12" y="10" width="40" height="56" preserveAspectRatio="xMidYMid slice" clipPath={`url(#yp-mw-${room})`} />
      <rect x="9" y="7" width="46" height="62" fill="none" stroke="#2A201B" strokeWidth="1.6" />
      <path d="M32 10V66M12 29H52" stroke="#FAFAF8" strokeWidth="2" />
      <path d="M32 10V66M12 29H52" stroke="#2A201B" strokeWidth="0.8" />
      <rect x="5" y="69" width="54" height="5" fill="#F7F8F7" stroke="#2A201B" strokeWidth="1" />
    </svg>
  );
}

export function RoomPage({ room, lang }: { room: RoomId; lang: Lang }) {
  // the window's view is the largest image of the page: fetch it first
  preload(photoSrc(room, Math.round(560 * 0.42 * 2)), { as: "image", fetchPriority: "high" });
  const t = COPY[lang];
  const r = ROOM[room];
  const text = ROOM_TEXT[lang][room];
  const i = BY_STEPS.indexOf(room);
  const prev = BY_STEPS[(i + BY_STEPS.length - 1) % BY_STEPS.length];
  const next = BY_STEPS[(i + 1) % BY_STEPS.length];
  const interior = ROOM_INTERIOR[room];
  return (
    <div className="yp-page">
      <p className="yp-crumb">
        <Link href={href(lang, "rooms")}>{t.room.crumb}</Link> / {r.name}
      </p>
      <div className="yp-room-head">
        <div className="yp-room-win">
          <RoomWindow room={room} lang={lang} />
        </div>
        <div className="yp-room-facts">
          <h1 className="yp-room-name">{r.name}</h1>
          <p className="yp-card-pos">{text.position}</p>
          <p className="yp-room-lead">{text.lead}</p>
          <dl className="yp-facts" aria-label={t.room.facts}>
            <div>
              <dt>{t.card.view}</dt>
              <dd>{text.view}</dd>
            </div>
            <div>
              <dt>{t.card.fromDoor}</dt>
              <dd>{stepsText(r.steps, lang)}</dd>
            </div>
            <div>
              <dt>{t.card.ceiling}</dt>
              <dd>{text.ceiling}</dd>
            </div>
            <div>
              <dt>{t.card.night}</dt>
              <dd>{text.night}</dd>
            </div>
            <div>
              <dt>{t.card.room}</dt>
              <dd>{fill(t.card.roomValue, { m2: r.m2, yatak: text.bed })}</dd>
            </div>
            <div>
              <dt>{t.room.bath}</dt>
              <dd>{text.bath}</dd>
            </div>
            <div>
              <dt>{t.room.capacity}</dt>
              <dd>{fill(t.room.capacityValue, { n: r.capacity })}</dd>
            </div>
            <div>
              <dt>{t.room.forWhom}</dt>
              <dd>{text.forWhom}</dd>
            </div>
          </dl>
          <RoomBuy room={room} lang={lang} />
        </div>
      </div>

      <section className="yp-block" aria-labelledby="yp-path-h">
        <div className="yp-block-head">
          <h2 id="yp-path-h" className="yp-h2">
            {fill(t.room.pathTitle, { basamak: stepsText(r.steps, lang) })}
          </h2>
          <p className="yp-lead">{t.room.pathLead}</p>
        </div>
        <div className="yp-room-path">
          <div className="yp-sheet-frame">
            <Section lang={lang} room={room} label={fill(t.room.pathTitle, { basamak: stepsText(r.steps, lang) })} />
          </div>
          <ol className="yp-flights">
            {r.flights.map((fid) => {
              const fl = FLIGHTS[fid];
              return (
                <li key={fid}>
                  <b>{fl.n}</b>
                  <span>{t.room.flights[fid]}</span>
                  <small>
                    {fill(t.room.flightValue, { n: fl.n, cm: cm(fl.riser) })} · {t.room.rails[fl.rail]} · {fill(t.room.width, { cm: cm(fl.width) })}
                  </small>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="yp-block yp-door" aria-labelledby="yp-in-h">
        <div className="yp-door-frame">
          <DoorPhoto photo={interior} lang={lang} id={room} />
          <p className="yp-door-cap">{fill(t.room.insideCaption, { kat: t.room.floors[r.floor] })}</p>
        </div>
        <div>
          <h2 id="yp-in-h" className="yp-h2">
            {t.room.insideTitle}
          </h2>
          <p className="yp-room-lead" style={{ marginTop: 14 }}>
            {text.body}
          </p>
          <h3 className="yp-h3" style={{ margin: "28px 0 10px" }}>
            {t.room.notesTitle}
          </h3>
          <ul className="yp-room-notes">
            {text.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      <nav className="yp-block" aria-labelledby="yp-nb-h">
        <div className="yp-block-head">
          <h2 id="yp-nb-h" className="yp-h3">
            {t.room.nextTitle}
          </h2>
        </div>
        <div className="yp-neighbours">
          {[prev, next].map((id) => (
            <Link key={id} href={href(lang, "room", id)} className="yp-neighbour">
              <MiniWindow room={id} />
              <span>
                <small>
                  {stepsText(ROOM[id].steps, lang)} · {ROOM_TEXT[lang][id].position}
                </small>
                <b>{ROOM[id].name}</b>
              </span>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 14 }}>
          <Link href={href(lang, "rooms")} className="yp-more">
            {t.room.all} <Arrow />
          </Link>
        </p>
      </nav>
    </div>
  );
}
