"use client";

// The windows on an elevation. Each window is a room: the glass shows the
// room's view, closed shutters mean the room is taken on the chosen dates.
// Keyboard: Tab to a window, Enter or Space chooses it.

import { stayFree } from "@/lib/yedipencere/availability";
import type { Lang } from "@/lib/yedipencere/dates";
import { fill, steps as stepsText } from "@/lib/yedipencere/format";
import { ROOM, ROOMS, type RoomId, type Side } from "@/lib/yedipencere/house";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { rooms as ROOM_TEXT } from "@/content/yedipencere/rooms";
import { photoSrc } from "@/content/yedipencere/photos";
import { INK, M, X, Y, f } from "./geom";
import { ELEV, WIN } from "./windows";

export const PICK_EVENT = "yp-pick";

function useWindowState(id: RoomId) {
  const { stay } = useStay();
  return { selected: stay.room === id, taken: !stayFree(id, stay.checkIn, stay.nights) };
}

function Win({ id, lang }: { id: RoomId; lang: Lang }) {
  const { setStay } = useStay();
  const { selected, taken } = useWindowState(id);
  const s = WIN[id];
  const ox = ELEV[s.side].ox;
  const x = (m: number) => X(ox, m);
  const gap = s.panes > 1 ? 0.16 : 0;
  const pw = (s.w - gap * (s.panes - 1)) / s.panes;
  const X0 = x(s.x);
  const Y0 = Y(s.y + s.h);
  const W = s.w * M;
  const H = s.h * M;
  const panes = Array.from({ length: s.panes }, (_, i) => ({ x: f(x(s.x + i * (pw + gap))), w: f(pw * M) }));
  const fold = s.panes === 1 ? W / 2 : 0;
  const t = COPY[lang];
  const label = fill(t.drawing.windowLabel, {
    oda: ROOM[id].name,
    konum: ROOM_TEXT[lang][id].position,
    basamak: stepsText(ROOM[id].steps, lang),
    durum: taken ? t.drawing.takenState : t.drawing.freeState,
  });
  const pick = () => {
    setStay({ room: id });
    window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: id }));
  };
  return (
    <g
      className="yp-win"
      data-room={id}
      data-sel={selected || undefined}
      data-taken={taken || undefined}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={label}
      onClick={pick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pick();
        }
      }}
    >
      <clipPath id={`yp-cp-${id}`}>
        {panes.map((p, i) => (
          <rect key={i} x={p.x + 1.5} y={Y0 + 1.5} width={p.w - 3} height={H - 3} />
        ))}
      </clipPath>
      <rect className="yp-win-hit" x={f(X0 - fold - 9)} y={f(Y0 - 9)} width={f(W + 2 * fold + 18)} height={f(H + 20)} />
      {panes.map((p, i) => (
        <rect key={`g${i}`} x={p.x} y={Y0} width={p.w} height={H} fill="#DCE5EA" />
      ))}
      <image
        className="yp-win-photo"
        href={photoSrc(id, s.panes > 1 ? 480 : 300)}
        x={X0}
        y={Y0}
        width={W}
        height={H}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#yp-cp-${id})`}
      />
      {fold > 0 && (
        <g className="yp-fold">
          <rect x={f(X0 - fold - 4)} y={Y0} width={f(fold)} height={H} fill="url(#yp-lamel)" stroke={INK} strokeWidth="0.9" />
          <rect x={f(X0 + W + 4)} y={Y0} width={f(fold)} height={H} fill="url(#yp-lamel)" stroke={INK} strokeWidth="0.9" />
        </g>
      )}
      {panes.map((p, i) => (
        <g key={`p${i}`}>
          <rect x={p.x - 2.2} y={Y0 - 2.2} width={p.w + 4.4} height={H + 4.4} className="c-ana" fill="none" />
          <line x1={p.x + p.w / 2} y1={Y0} x2={p.x + p.w / 2} y2={Y0 + H} className="c-ince" />
          <line x1={p.x} y1={f(Y0 + H * 0.34)} x2={p.x + p.w} y2={f(Y0 + H * 0.34)} className="c-ince" />
          <rect className="yp-shut yp-shut-l" x={p.x} y={Y0} width={f(p.w / 2)} height={H} fill="url(#yp-lamel)" stroke={INK} strokeWidth="0.9" />
          <rect className="yp-shut yp-shut-r" x={f(p.x + p.w / 2)} y={Y0} width={f(p.w / 2)} height={H} fill="url(#yp-lamel)" stroke={INK} strokeWidth="0.9" />
          <rect x={p.x - 5} y={f(Y0 + H + 2.2)} width={p.w + 10} height="3.2" fill="#F7F8F7" stroke={INK} strokeWidth="0.9" />
        </g>
      ))}
      {s.bars && (
        <path
          d={Array.from({ length: 5 }, (_, i) => {
            const bx = f(x(s.x + 0.19 * (i + 0.5)));
            return `M${bx} ${f(Y0 - 1)}V${f(Y0 + H + 1)}`;
          }).join("")}
          stroke={INK}
          strokeWidth="1.2"
          fill="none"
        />
      )}
      <rect className="yp-win-ring" x={f(X0 - fold - 7)} y={f(Y0 - 7)} width={f(W + 2 * fold + 14)} height={f(H + 17)} rx="2" fill="none" />
    </g>
  );
}

export function WindowLayer({ side, lang }: { side: Side; lang: Lang }) {
  return (
    <g>
      {ROOMS.filter((r) => r.side === side).map((r) => (
        <Win key={r.id} id={r.id} lang={lang} />
      ))}
    </g>
  );
}

function Label({ id, lang }: { id: RoomId; lang: Lang }) {
  const { setStay } = useStay();
  const { selected, taken } = useWindowState(id);
  const s = WIN[id];
  const ox = ELEV[s.side].ox;
  const x = (m: number) => X(ox, m);
  const text = taken ? `${ROOM[id].name} · ${COPY[lang].drawing.taken}` : ROOM[id].name;
  return (
    <g className="yp-label" data-sel={selected || undefined} data-taken={taken || undefined} aria-hidden="true" onClick={() => setStay({ room: id })}>
      {s.leader && <path d={`M${f(x(s.leader[0]))} ${f(Y(s.leader[1]))}L${f(x(s.leader[2]))} ${f(Y(s.leader[3]))}`} className="c-ince" fill="none" />}
      <text x={f(x(s.label.x))} y={f(Y(s.label.y))} textAnchor={s.label.anchor}>
        {text}
      </text>
    </g>
  );
}

export function LabelLayer({ side, lang }: { side: Side; lang: Lang }) {
  return (
    <g>
      {ROOMS.filter((r) => r.side === side).map((r) => (
        <Label key={r.id} id={r.id} lang={lang} />
      ))}
    </g>
  );
}
