"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { tr } from "@/content/pazi/tr";
import { DEFAULT_CONFIG, LIMITS, payback } from "@/lib/pazi/plan";
import { tlRange } from "@/lib/pazi/format";
import { encodeConfig } from "@/lib/pazi/url";
import { NumberField, Segmented } from "../ui/fields";

const EXAMPLE_WAGE = 60000;

export function Savings() {
  const t = tr.savings;
  const [shifts, setShifts] = useState<1 | 2 | 3>(2);
  const [people, setPeople] = useState(1);
  const [wage, setWage] = useState(EXAMPLE_WAGE);
  const cfg = useMemo(() => ({ ...DEFAULT_CONFIG, shifts, people, wage }), [shifts, people, wage]);
  const p = useMemo(() => payback(cfg), [cfg]);
  const href = `/pazi/fizibilite/?${encodeConfig(cfg, { step: 5 })}`;

  return (
    <section id={t.id} className="pz-save" aria-labelledby="pz-save-title">
      <div className="pz-wrap pz-save-grid">
        <div className="pz-save-copy">
          <h2 id="pz-save-title" className="pz-h2">
            {t.title}
          </h2>
          <p className="pz-lead">{t.lead}</p>
        </div>
        <div className="pz-save-calc">
          <div className="pz-save-inputs">
            <Segmented
              label={t.shifts}
              value={String(shifts) as "1" | "2" | "3"}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
              onChange={(v) => setShifts(Number(v) as 1 | 2 | 3)}
            />
            <NumberField label={t.people} value={people} min={1} max={LIMITS.people[1]} onChange={setPeople} />
            <NumberField label={t.wage} unit={tr.units.tl} value={wage} min={1000} max={LIMITS.wage[1]} step={1000} onChange={setWage} hint={t.wageHint} />
          </div>
          <div className="pz-save-out" aria-live="polite">
            <div>
              <p className="pz-save-k">
                {t.saving} <span className="pz-est">{t.estimate}</span>
              </p>
              <p className="pz-save-v pz-mono">{tlRange(p.saving[0], p.saving[1])}</p>
            </div>
            <div>
              <p className="pz-save-k">
                {t.ceiling} <span className="pz-est">{t.estimate}</span>
              </p>
              <p className="pz-save-v pz-mono">{tlRange(p.ceiling[0], p.ceiling[1])}</p>
              <p className="pz-save-hint">{t.ceilingHint}</p>
            </div>
          </div>
          <p className="pz-save-note">{t.note}</p>
          <p className="pz-save-note">{t.assumptions}</p>
          <Link href={href} className="pz-btn pz-btn-primary">
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
