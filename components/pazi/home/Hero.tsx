"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { heroConfig, tr } from "@/content/pazi/tr";
import { DEFAULT_CONFIG, LIMITS, validate, type ProductKind } from "@/lib/pazi/plan";
import { cell, useCell } from "@/lib/pazi/store";
import { encodeConfig } from "@/lib/pazi/url";
import { Cell } from "../cell/Cell";
import { Hmi } from "../cell/Hmi";
import { NumberField, Segmented } from "../ui/fields";

export function Hero() {
  const config = useCell((s) => s.config);
  const render = useCell((s) => s.render);
  const errors = useMemo(() => validate(config), [config]);
  const href = `/pazi/fizibilite/?${encodeConfig(config)}`;
  const f = tr.fields;
  const u = tr.units;

  // the home page always starts from the headline's case: a 25 kg bag
  useEffect(() => {
    const cur = cell.get().config as Record<string, unknown>;
    const same = Object.entries(heroConfig).every(([k, v]) => cur[k] === v);
    cell.set({ ...(same ? {} : { config: { ...DEFAULT_CONFIG, ...heroConfig } }), lock: null, view: "iso", paused: false, operator: null, zone: "out" });
  }, []);

  const err = (k: keyof typeof errors) => (errors[k] === "pallet" ? tr.errors.pallet : null);

  return (
    <section className="pz-hero" aria-labelledby="pz-hero-title">
      <div className="pz-hero-stage">
        <Cell frame={{ x: 0.71, y: 0.5 }} frameNarrow={{ x: 0.5, y: 0.4 }} operator zoom={1.38} zoomNarrow={2.1} className="pz-hero-cell" />
      </div>
      <div className="pz-wrap pz-hero-grid">
        <div className="pz-hero-copy">
          <h1 id="pz-hero-title" className="pz-display">
            {tr.hero.title.map((l) => (
              <span key={l} className="pz-hero-line">
                {l}
              </span>
            ))}
          </h1>
          <p className="pz-lead pz-hero-sub">{tr.hero.sub}</p>

          <form className="pz-plate" onSubmit={(e) => e.preventDefault()} aria-labelledby="pz-plate-title">
            <div className="pz-plate-head">
              <h2 id="pz-plate-title" className="pz-plate-title">
                {tr.hero.plateTitle}
              </h2>
              <p className="pz-plate-note">{tr.hero.plateNote}</p>
            </div>
            <Segmented<ProductKind>
              label={f.kind}
              hideLabel
              value={config.kind}
              options={(["torba", "koli", "shrink"] as ProductKind[]).map((k) => ({ value: k, label: f.kinds[k] }))}
              onChange={(v) => cell.setConfig({ kind: v })}
            />
            <fieldset className="pz-plate-size">
              <legend className="pz-num-label">
                {f.size} <span className="pz-unit-tag">{u.mm}</span>
              </legend>
              <div className="pz-plate-dims">
                <NumberField label={f.u} hideLabel compact value={config.u} min={LIMITS.u[0]} max={LIMITS.u[1]} step={10} onChange={(v) => cell.setConfig({ u: v })} error={err("u")} />
                <span className="pz-times" aria-hidden="true">
                  ×
                </span>
                <NumberField label={f.g} hideLabel compact value={config.g} min={LIMITS.g[0]} max={LIMITS.g[1]} step={10} onChange={(v) => cell.setConfig({ g: v })} error={err("g")} />
                <span className="pz-times" aria-hidden="true">
                  ×
                </span>
                <NumberField label={f.y} hideLabel compact value={config.y} min={LIMITS.y[0]} max={LIMITS.y[1]} step={10} onChange={(v) => cell.setConfig({ y: v })} />
              </div>
            </fieldset>
            <div className="pz-plate-row">
              <NumberField label={f.kg} unit={u.kg} value={config.kg} min={LIMITS.kg[0]} max={LIMITS.kg[1]} step={0.5} decimals={1} onChange={(v) => cell.setConfig({ kg: v })} />
              <NumberField label={f.rate} unit={u.perMin} value={config.rate} min={LIMITS.rate[0]} max={LIMITS.rate[1]} step={1} onChange={(v) => cell.setConfig({ rate: v })} />
            </div>
            <div className="pz-plate-actions">
              <Link href={href} className="pz-btn pz-btn-primary pz-btn-lg">
                {tr.hero.cta}
                <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
                  <path d="M0 6h16M11 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="pz-hero-hmi">
        <div className="pz-wrap">
          <Hmi />
          {render === "webgl" ? <p className="pz-hero-hint">{tr.view.dragHint}</p> : null}
        </div>
      </div>
    </section>
  );
}
