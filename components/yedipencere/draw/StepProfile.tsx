"use client";

// "Konakta asansör yok": every room placed on the climb from the street door.
// Wide screens get the profile drawing; narrow screens a list of rulers.
// Each marker is a small window (shuttered when taken); choosing one selects the room.

import { stayFree } from "@/lib/yedipencere/availability";
import type { Lang } from "@/lib/yedipencere/dates";
import { steps as stepsText } from "@/lib/yedipencere/format";
import { BY_STEPS, ROOM, type RoomId } from "@/lib/yedipencere/house";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { rooms as ROOM_TEXT } from "@/content/yedipencere/rooms";
import { BEGONVIL, INK, f } from "./geom";
import { PICK_EVENT } from "./WindowLayer";

const SX = (n: number) => f(74 + n * 13.4);
const SY = (lv: number) => f(198 - lv * 22);

// markers that share a step count stand side by side
const OFFSET: Partial<Record<RoomId, number>> = { cumba: -10, sofa: 10 };

type Lab = { text: (lang: Lang) => string; x: number; y: number; anchor: "start" | "middle" | "end"; rooms: RoomId[] };

const name = (id: RoomId) => ROOM[id].name;
const LABELS: Lab[] = [
  { text: () => `${name("taslik")} · 1`, x: SX(1), y: SY(0) - 28, anchor: "middle", rooms: ["taslik"] },
  { text: () => `${name("avlu")} · 2`, x: SX(2) + 6, y: SY(0.15) - 50, anchor: "start", rooms: ["avlu"] },
  { text: () => `${name("cumba")}, ${name("sofa")} · 21`, x: SX(21), y: SY(3.4) - 30, anchor: "middle", rooms: ["cumba", "sofa"] },
  { text: () => `${name("korfez")} · 23`, x: SX(23) + 4, y: SY(3.74) - 50, anchor: "start", rooms: ["korfez"] },
  { text: () => `${name("hidirlik")} · 35`, x: SX(35) - 8, y: SY(6.62) - 26, anchor: "end", rooms: ["hidirlik"] },
  { text: () => `${name("kosk")} · 37`, x: SX(37) + 4, y: SY(6.96) - 30, anchor: "start", rooms: ["kosk"] },
];

export function StepProfile({ lang }: { lang: Lang }) {
  const { stay, setStay } = useStay();
  const t = COPY[lang];
  const pick = (id: RoomId) => {
    setStay({ room: id });
    window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: id }));
  };
  const profile =
    `M${SX(0)} ${SY(-0.16)}H${SX(0.5)}V${SY(0)}H${SX(1)}` +
    Array.from({ length: 20 }, (_, i) => `V${SY((3.4 * (i + 1)) / 20)}H${SX(1 + i + 1)}`).join("") +
    Array.from({ length: 14 }, (_, i) => `V${SY(3.4 + (3.22 * (i + 1)) / 14)}H${SX(21 + i + 1)}`).join("") +
    `V${SY(6.79)}H${SX(36)}V${SY(6.96)}H${SX(37.8)}`;
  const branch = `M${SX(21)} ${SY(3.4)}H${SX(22)}V${SY(3.57)}H${SX(23)}V${SY(3.74)}H${SX(24.2)}`;
  const avluBranch = `M${SX(1)} ${SY(0)}H${SX(2)}V${SY(0.15)}H${SX(2.8)}`;

  return (
    <div className="yp-profile">
      <svg className="yp-profile-svg" viewBox="0 0 640 252" role="group" aria-label={t.ruler.title}>
        {(["zemin", "birinci", "kosk"] as const).map((k, i) => {
          const lv = [0, 3.4, 6.62][i];
          return (
            <g key={k} aria-hidden="true">
              <line x1={SX(-0.6)} y1={SY(lv)} x2={SX(40)} y2={SY(lv)} stroke="#E4E0DA" strokeWidth="1" strokeDasharray="2 3" />
              <text x={SX(-0.9)} y={SY(lv) + 4.5} textAnchor="end" className="yp-profile-lv">
                {t.ruler.levels[k]}
              </text>
            </g>
          );
        })}
        <path d={profile} fill="none" stroke={INK} strokeWidth="1.4" />
        <path d={branch} fill="none" stroke={INK} strokeWidth="1.4" />
        <path d={avluBranch} fill="none" stroke={INK} strokeWidth="1.4" />
        <line x1={SX(0)} y1="222" x2={SX(40)} y2="222" stroke={INK} strokeWidth="1.1" />
        <g aria-hidden="true">
          {Array.from({ length: 41 }, (_, n) => (
            <line key={n} x1={SX(n)} y1="222" x2={SX(n)} y2={222 + (n % 10 === 0 ? 8 : n % 5 === 0 ? 5 : 3)} stroke={INK} strokeWidth={n % 10 === 0 ? 1 : 0.6} />
          ))}
          {[0, 10, 20, 30, 40].map((n) => (
            <text key={n} x={SX(n)} y="246" textAnchor="middle" className="yp-profile-ax">
              {n}
            </text>
          ))}
          <text x={SX(40)} y="214" textAnchor="end" className="yp-profile-ax">
            {t.ruler.axis}
          </text>
        </g>
        {/* labels first, markers (and their hit areas) above them */}
        <g aria-hidden="true">
          {LABELS.map((l, i) => {
            const sel = l.rooms.includes(stay.room);
            return (
              <text key={i} x={l.x} y={l.y} textAnchor={l.anchor} className={`yp-pmark-t${sel ? " is-sel" : ""}`}>
                {l.text(lang)}
              </text>
            );
          })}
        </g>
        {BY_STEPS.map((id) => {
          const r = ROOM[id];
          const x = SX(r.steps) + (OFFSET[id] ?? 0);
          const y = SY(r.level);
          const sel = stay.room === id;
          const taken = !stayFree(id, stay.checkIn, stay.nights);
          const lab = LABELS.find((l) => l.rooms.includes(id))!;
          return (
            <g
              key={id}
              className="yp-pmark"
              data-sel={sel || undefined}
              data-taken={taken || undefined}
              role="button"
              tabIndex={0}
              aria-pressed={sel}
              aria-label={`${r.name}, ${stepsText(r.steps, lang)}, ${ROOM_TEXT[lang][id].position}`}
              onClick={() => pick(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick(id);
                }
              }}
            >
              <rect className="yp-pmark-hit" x={x - 13} y={Math.min(y - 24, lab.y - 16)} width="26" height={y - Math.min(y - 24, lab.y - 16) + 4} />
              <line x1={x} y1={y - 22} x2={x} y2={lab.y + 6} stroke={sel ? BEGONVIL : "#B9B0A8"} strokeWidth={sel ? 1.6 : 0.8} />
              <rect className="yp-pmark-win" x={x - 8} y={y - 22} width="16" height="20" fill={taken ? "url(#yp-lamel)" : "#DCE5EA"} stroke={sel ? BEGONVIL : INK} strokeWidth={sel ? 2 : 1.2} />
              <line x1={x} y1={y - 22} x2={x} y2={y - 2} stroke={INK} strokeWidth="0.6" />
            </g>
          );
        })}
      </svg>
      <ul className="yp-profile-list" aria-label={t.ruler.title}>
        {BY_STEPS.map((id) => {
          const r = ROOM[id];
          const sel = stay.room === id;
          const taken = !stayFree(id, stay.checkIn, stay.nights);
          return (
            <li key={id}>
              <button type="button" aria-pressed={sel} data-taken={taken || undefined} onClick={() => pick(id)}>
                <span className="yp-pl-name">{r.name}</span>
                <span className="yp-pl-bar" aria-hidden="true">
                  <i style={{ width: `${Math.max(2.5, (r.steps / 40) * 100)}%` }} />
                </span>
                <span className="yp-pl-n">{stepsText(r.steps, lang)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
