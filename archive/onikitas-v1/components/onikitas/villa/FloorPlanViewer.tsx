"use client";

import { useId, useRef, useState } from "react";
import { tr } from "@/content/onikitas/tr";
import { typologies, type Villa } from "@/content/onikitas/villas";
import type { LevelId } from "@/content/onikitas/plans";
import { FloorPlanSvg, interiorArea } from "../plan/FloorPlanSvg";

export function FloorPlanViewer({ villa }: { villa: Villa }) {
  const p = tr.villa.plan;
  const t = typologies[villa.type];
  const levels = t.levels as LevelId[];
  const [level, setLevel] = useState<LevelId>(levels[0]);
  const [furnished, setFurnished] = useState(true);
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const area = interiorArea(villa.type, level);

  const onKey = (e: React.KeyboardEvent) => {
    const i = levels.indexOf(level);
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % levels.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + levels.length) % levels.length;
    else return;
    e.preventDefault();
    setLevel(levels[n]);
    document.getElementById(`${id}-tab-${levels[n]}`)?.focus();
  };

  const download = () => {
    const svg = wrapRef.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("style", "font-family: Helvetica, Arial, sans-serif; background: #fbf8f2");
    const data = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([data], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `onikitas-N${villa.id}-${level}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section id="kat-plani" aria-labelledby={`${id}-h`} className="mt-24 scroll-mt-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 id={`${id}-h`} className="text-[clamp(2rem,3.4vw,3rem)] leading-none">
          {p.heading}
        </h2>
        <div className="flex gap-2" role="group" aria-label={p.toggleLabel}>
          <button type="button" className="chip" aria-pressed={furnished} onClick={() => setFurnished(true)}>
            {p.furnished}
          </button>
          <button type="button" className="chip" aria-pressed={!furnished} onClick={() => setFurnished(false)}>
            {p.empty}
          </button>
        </div>
      </div>

      <div role="tablist" aria-label={p.heading} className="mt-6 flex gap-6 overflow-x-auto border-b border-olive/20" onKeyDown={onKey}>
        {levels.map((l) => (
          <button
            key={l}
            id={`${id}-tab-${l}`}
            role="tab"
            type="button"
            aria-selected={level === l}
            aria-controls={`${id}-panel`}
            tabIndex={level === l ? 0 : -1}
            onClick={() => setLevel(l)}
            className={`-mb-px shrink-0 border-b-2 pb-3 text-[1rem] transition-colors ${
              level === l ? "border-tile text-olive" : "border-transparent text-olive-soft hover:text-olive"
            }`}
          >
            {p.levels[l]}
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${level}`} className="mt-6">
        <div ref={wrapRef} className="overflow-x-auto overscroll-x-contain bg-[#fbf8f2] p-3 shadow-[inset_0_0_0_1px_#3b3a2e1f] sm:p-6">
          <FloorPlanSvg
            type={villa.type}
            level={level}
            furnished={furnished}
            title={p.planTitle(t.name, p.levels[level])}
            className="mx-auto block h-auto max-h-[70vh] w-full min-w-[560px] md:min-w-0"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm">
          <p className="text-olive-soft">
            {area > 0 ? (
              <>
                {p.total}: <span className="label-mono text-olive">{area} m²</span> ·{" "}
              </>
            ) : null}
            {p.typical}
          </p>
          <button type="button" className="btn-line !py-2.5" onClick={download}>
            {p.download}
          </button>
        </div>
      </div>
    </section>
  );
}
