"use client";

// One room's window, large: the view in the glass, the shutters folded back
// against the wall. Taken on the chosen dates: the shutters stay closed and the
// view behind them dims. Choosing another room swings them open again.

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/yedipencere/dates";
import { ROOM, type RoomId } from "@/lib/yedipencere/house";
import { PHOTOS, photoSrc } from "@/content/yedipencere/photos";
import { INK } from "./geom";

type Props = {
  room: RoomId;
  taken: boolean;
  lang: Lang;
  /** CSS width the drawing is shown at, to choose the photo size */
  width?: number;
  /** swing the shutters open on mount (after a user's choice) */
  animate?: boolean;
};

export function WindowDetail({ room, taken, lang, width = 360, animate = false }: Props) {
  const [open, setOpen] = useState(() => (animate ? false : !taken));
  useEffect(() => {
    const r = requestAnimationFrame(() => setOpen(!taken));
    return () => cancelAnimationFrame(r);
  }, [taken]);

  const kind = ROOM[room].window;
  const single = kind === "single" || kind === "barred";
  const n = single ? 1 : 3;
  const W = single ? 150 : 84;
  const H = single ? 218 : 178;
  const gap = 12;
  const tw = n * W + (n - 1) * gap;
  const x0 = (360 - tw) / 2;
  const y0 = (300 - H) / 2 - 6;
  const panes = Array.from({ length: n }, (_, i) => x0 + i * (W + gap));
  const clip = `yp-dcp-${room}`;
  const src = photoSrc(room, single ? Math.round(width * 0.42 * 2) : Math.round(width * 0.77 * 2));

  return (
    <svg className="yp-detail" viewBox="0 0 360 300" role="img" aria-label={PHOTOS[room].alt[lang]} data-open={open || undefined} data-taken={taken || undefined}>
      <defs>
        <clipPath id={clip}>
          {panes.map((px) => (
            <rect key={px} x={px} y={y0} width={W} height={H} />
          ))}
        </clipPath>
      </defs>
      <rect x="0" y="0" width="360" height="300" fill="#F1F0EC" />
      <path d={Array.from({ length: 9 }, (_, i) => `M0 ${18 + i * 34}H360`).join("")} stroke="#E2DDD6" strokeWidth="1" />
      <rect x={x0} y={y0} width={tw} height={H} fill="#DDE4E8" clipPath={`url(#${clip})`} />
      <image
        className="yp-detail-photo"
        href={src}
        x={x0}
        y={y0}
        width={tw}
        height={H}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clip})`}
      />
      {panes.map((px) => (
        <g key={px}>
          <rect x={px - 6} y={y0 - 6} width={W + 12} height={H + 12} fill="none" stroke={INK} strokeWidth="2.2" />
          <rect x={px - 1} y={y0 - 1} width={W + 2} height={H + 2} fill="none" stroke={INK} strokeWidth="1" />
          <path d={`M${px + W / 2} ${y0}V${y0 + H}M${px} ${y0 + H * 0.34}H${px + W}`} stroke="#F7F8F7" strokeWidth="3" />
          <path d={`M${px + W / 2} ${y0}V${y0 + H}M${px} ${y0 + H * 0.34}H${px + W}`} stroke={INK} strokeWidth="1" />
          <rect className="yp-dshut yp-dshut-l" x={px} y={y0} width={W / 2 - 2} height={H} fill="url(#yp-lamel-l)" stroke={INK} strokeWidth="1.2" />
          <rect className="yp-dshut yp-dshut-r" x={px + W / 2 + 2} y={y0} width={W / 2 - 2} height={H} fill="url(#yp-lamel-l)" stroke={INK} strokeWidth="1.2" />
          <rect x={px - 12} y={y0 + H + 6} width={W + 24} height="9" fill="#F7F8F7" stroke={INK} strokeWidth="1.2" />
        </g>
      ))}
      {kind === "barred" && (
        <path
          d={Array.from({ length: 5 }, (_, i) => `M${x0 + (W / 5) * (i + 0.5)} ${y0 - 4}V${y0 + H + 4}`).join("")}
          stroke={INK}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}
      {single && (
        <g className="yp-dfold">
          <rect className="yp-dfold-l" x={x0 - W / 2 - 14} y={y0} width={W / 2} height={H} fill="url(#yp-lamel-l)" stroke={INK} strokeWidth="1.2" />
          <rect className="yp-dfold-r" x={x0 + W + 14} y={y0} width={W / 2} height={H} fill="url(#yp-lamel-l)" stroke={INK} strokeWidth="1.2" />
        </g>
      )}
    </svg>
  );
}
