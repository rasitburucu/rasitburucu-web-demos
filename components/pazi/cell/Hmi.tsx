"use client";

// The status bar under the cell, styled like the panel on a real machine.
// Every number is the calculation's output (lib/pazi/plan.ts), the same one the
// robot runs on; the layer counter is published by the engine as it works.

import { useEffect, useMemo, useState } from "react";
import { tr } from "@/content/pazi/tr";
import { fit } from "@/lib/pazi/plan";
import { fmt1 } from "@/lib/pazi/format";
import { cell, useCell, type View } from "@/lib/pazi/store";

export function useFit() {
  const config = useCell((s) => s.config);
  const lock = useCell((s) => s.lock);
  return useMemo(() => fit(config, lock), [config, lock]);
}

export type Status = "ok" | "custom" | "slow";

export function statusOf(f: ReturnType<typeof fit>): Status {
  if (f.status === "ok") return "ok";
  if (f.model && (f.warnings.includes("two-cells") || f.warnings.includes("too-slow"))) return "slow";
  return "custom";
}

export function Hmi({ controls = true }: { controls?: boolean }) {
  const f = useFit();
  const placed = useCell((s) => s.live.placed);
  const render = useCell((s) => s.render);
  const h = tr.hmi;
  const per = Math.max(1, f.plan.perLayer);
  const layer = Math.min(f.stack.layers, Math.max(1, Math.ceil(placed / per)));
  const st = statusOf(f);
  const label = st === "ok" ? h.ok : st === "slow" ? h.slow : h.custom;

  // screen-reader summary: only when the configuration changes, not every box
  const [summary, setSummary] = useState("");
  useEffect(() => {
    const t = window.setTimeout(
      () =>
        setSummary(
          h.summary({
            model: f.model?.name ?? h.custom,
            layer: f.stack.layers,
            layers: f.stack.layers,
            perLayer: f.plan.perLayer,
            required: f.required,
            capacity: fmt1(f.capacity),
            status: label,
          }),
        ),
      600,
    );
    return () => window.clearTimeout(t);
  }, [f, h, label]);

  return (
    <div className="pz-hmi" data-status={st} data-render={render}>
      <dl className="pz-hmi-cells" aria-label={h.label}>
        <div>
          <dt>{h.model}</dt>
          <dd>{f.model ? f.model.name : "—"}</dd>
        </div>
        <div>
          <dt>{h.layer}</dt>
          <dd>
            {layer}
            <small>/{f.stack.layers}</small>
          </dd>
        </div>
        <div>
          <dt>{h.perLayer}</dt>
          <dd>{f.plan.perLayer}</dd>
        </div>
        <div>
          <dt>{h.required}</dt>
          <dd>
            {f.required}
            <small>{tr.units.perMin}</small>
          </dd>
        </div>
        <div>
          <dt>{h.capacity}</dt>
          <dd>
            {f.capacity > 0 ? `~${fmt1(f.capacity)}` : "—"}
            <small>{tr.units.perMin}</small>
          </dd>
        </div>
        <div className="pz-hmi-status">
          <dt>{h.status}</dt>
          <dd>
            <span className="pz-lamp" aria-hidden="true" />
            {label}
          </dd>
        </div>
      </dl>
      {/* without a running 3D cell the view and speed buttons would do nothing */}
      {controls && render !== "vector" ? <CellControls /> : null}
      {controls && render === "vector" ? <p className="pz-hmi-still">{tr.view.still}</p> : null}
      <p className="pz-sr" aria-live="polite">
        {summary}
      </p>
    </div>
  );
}

export function CellControls() {
  const view = useCell((s) => s.view);
  const speed = useCell((s) => s.speed);
  const paused = useCell((s) => s.paused);
  const v = tr.view;
  const views: { id: View; label: string }[] = [
    { id: "iso", label: v.iso },
    { id: "top", label: v.top },
    { id: "op", label: v.op },
  ];
  return (
    <div className="pz-hmi-ctrl">
      <div role="group" aria-label={v.label} className="pz-hmi-group">
        {views.map((x) => (
          <button key={x.id} type="button" aria-pressed={view === x.id} onClick={() => cell.set({ view: x.id })}>
            {x.label}
          </button>
        ))}
      </div>
      <div role="group" aria-label={v.time} className="pz-hmi-group">
        <button type="button" aria-pressed={speed === 1} onClick={() => cell.set({ speed: 1 })}>
          {v.speed1}
        </button>
        <button type="button" aria-pressed={speed === 4} onClick={() => cell.set({ speed: 4 })}>
          {v.speed4}
        </button>
        <button type="button" aria-pressed={paused} onClick={() => cell.set({ paused: !paused })}>
          {paused ? v.play : v.pause}
        </button>
      </div>
    </div>
  );
}
