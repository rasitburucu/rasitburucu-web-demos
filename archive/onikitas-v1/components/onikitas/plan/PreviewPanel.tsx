"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { typologies, compass, type Villa } from "@/content/onikitas/villas";
import { tr } from "@/content/onikitas/tr";
import { sunLayers } from "@/lib/onikitas/geometry";
import type { LevelId } from "@/content/onikitas/plans";
import { useBooking } from "../shell/Shell";
import { FloorPlanSvg } from "./FloorPlanSvg";
import { StatusMark } from "./StatusMark";

const fmt = (n: number) => n.toLocaleString("tr-TR");
export const hourLabel = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export function PreviewPanel({
  villa,
  hour,
  setHour,
  onBack,
  variant,
}: {
  villa: Villa;
  hour: number;
  setHour: (h: number) => void;
  onBack: () => void;
  variant: "panel" | "sheet";
}) {
  const p = tr.plan.preview;
  const t = typologies[villa.type];
  const { open } = useBooking();
  const levels = t.levels.filter((l) => l !== "bahce") as LevelId[];
  const [level, setLevel] = useState<LevelId>(levels[0]);
  const sliderId = useId();
  const actions = (
    <>
      {villa.status === "sold" ? <p className="mt-6 text-[0.92rem]">{p.soldNote}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-tile"
          onClick={() => open({ villas: villa.status === "sold" ? [] : [villa.id] })}
        >
          {p.book}
        </button>
        <Link href={`/onikitas/villalar/${villa.id}`} className="btn-line">
          {p.see}
        </Link>
      </div>
    </>
  );
  const tabsId = useId();

  return (
    <article aria-labelledby={`${tabsId}-title`} className={variant === "panel" ? "border-t border-olive/40 pt-4" : "pt-1"}>
      <button type="button" onClick={onBack} className="group flex items-center gap-2 text-sm text-olive-soft hover:text-olive">
        <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden className="transition-transform group-hover:-translate-x-0.5">
          <path d="M5 1 L1 5 L5 9 M1 5 H15" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        {variant === "panel" ? p.back : p.close}
      </button>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-olive-soft">N°{villa.id}</p>
          <h3 id={`${tabsId}-title`} className="mt-1 text-[clamp(2.4rem,4vw,3.4rem)] leading-[0.95]">
            {villa.name}
          </h3>
        </div>
        <StatusMark status={villa.status} className="mt-2" />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.92rem]">
        <div>
          <dt className="text-olive-soft">{tr.plan.table.type}</dt>
          <dd>
            {t.name} <span className="label-mono">{t.layout}</span>
          </dd>
        </div>
        <div>
          <dt className="text-olive-soft">{tr.plan.table.view}</dt>
          <dd>
            {tr.view[villa.view]} <span className="label-mono">{villa.bearing}° {compass(villa.bearing)}</span>
          </dd>
        </div>
        <div>
          <dt className="text-olive-soft">{tr.plan.table.interior}</dt>
          <dd className="label-mono !text-[0.95rem]">{villa.interior} m²</dd>
        </div>
        <div>
          <dt className="text-olive-soft">{tr.plan.table.plot}</dt>
          <dd className="label-mono !text-[0.95rem]">{fmt(villa.plot)} m²</dd>
        </div>
      </dl>

      <p className="mt-5 max-w-[48ch] text-[0.95rem]">{tr.villa.notes[villa.id]}</p>

      {variant === "sheet" ? actions : null}

      {/* floor plan thumbnail */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-olive-soft">{p.plans}</p>
          <div role="tablist" aria-label={p.plans} className="flex gap-1">
            {levels.map((l) => (
              <button
                key={l}
                role="tab"
                type="button"
                id={`${tabsId}-${l}`}
                aria-selected={level === l}
                aria-controls={`${tabsId}-panel`}
                className="chip !min-h-8 !px-2.5 !text-[0.8rem]"
                data-on={level === l}
                onClick={() => setLevel(l)}
              >
                {tr.villa.plan.levels[l]}
              </button>
            ))}
          </div>
        </div>
        <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-${level}`} className="mt-3 bg-[#fbf8f2] p-2 shadow-[inset_0_0_0_1px_#3b3a2e22]">
          <FloorPlanSvg
            type={villa.type}
            level={level}
            labels={variant === "panel"}
            title={tr.villa.plan.planTitle(t.name, tr.villa.plan.levels[level])}
            className="mx-auto block h-auto max-h-[220px] w-full"
          />
        </div>
      </div>

      {/* sun slider */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <label htmlFor={sliderId} className="text-sm text-olive-soft">
            {p.sun}
          </label>
          <output htmlFor={sliderId} className="label-mono !text-[1rem] text-tile-ink">
            {hourLabel(hour)}
          </output>
        </div>
        <input
          id={sliderId}
          type="range"
          min={7}
          max={21}
          step={0.25}
          value={hour}
          onChange={(e) => setHour(parseFloat(e.target.value))}
          aria-valuetext={hourLabel(hour)}
          className="onk-range mt-2 w-full"
        />
        <div aria-hidden className="relative mt-1 h-4">
          {sunLayers.map((l) => (
            <span
              key={l.hour}
              className="label-mono absolute -translate-x-1/2 !text-[0.68rem] text-olive-soft"
              style={{ left: `${((l.hour - 7) / 14) * 100}%` }}
            >
              {hourLabel(l.hour)}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[0.8rem] text-olive-soft">{p.sunHint}</p>
      </div>

      {variant === "panel" ? actions : null}
    </article>
  );
}
