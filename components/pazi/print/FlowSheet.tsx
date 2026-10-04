"use client";

// A4 summary of one configuration, read from the address. Same numbers as the
// flow; printed from the browser ("PDF olarak kaydet").

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { tr } from "@/content/pazi/tr";
import { DEFAULT_CONFIG, fit, palletSize, payback, type Config, type ModelId } from "@/lib/pazi/plan";
import { fmt, fmt1, tlRange } from "@/lib/pazi/format";
import { decodeConfig, encodeConfig } from "@/lib/pazi/url";
import { IsoCell } from "../cell/IsoCell";
import { LayerPlan } from "../ui/LayerPlan";
import { Mark, Wordmark } from "../ui/Mark";
import { PrintButton } from "./PrintButton";

export function FlowSheet() {
  const [state, setState] = useState<{ config: Config; model: ModelId | null } | null>(null);
  const [date, setDate] = useState("");
  const [base, setBase] = useState("");
  useEffect(() => {
    const d = decodeConfig(location.search);
    setState({ config: d.config, model: d.model });
    setDate(new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date()));
    setBase(`${location.origin}${location.pathname.replace(/foy\/?$/, "")}`);
  }, []);
  const config = state?.config ?? DEFAULT_CONFIG;
  const f = useMemo(() => fit(config, state?.model ?? null), [config, state]);
  const p = useMemo(() => payback(config), [config]);
  const s = tr.sheet;
  const fl = tr.flow;
  const fi = tr.fields;
  const { L, W } = palletSize(config);
  const q = encodeConfig(config, { model: state?.model });
  const link = base ? `${base}?${q}` : "";
  const opts = [f.lift ? fl.result.lift : "", f.double ? fl.result.double : "", config.sheet ? fl.result.sheet : ""].filter(Boolean);

  return (
    <div className="pz-paper-wrap">
      <div className="pz-paper-bar">
        <Link href={`/pazi/fizibilite/?${q}&a=6`} className="pz-btn pz-btn-ghost">
          {s.back}
        </Link>
        <PrintButton />
      </div>
      <article className="pz-paper" aria-labelledby="pz-paper-title">
        <header className="pz-paper-head">
          <span className="pz-brand">
            <Mark size={30} />
            <Wordmark />
          </span>
          <div className="pz-paper-meta">
            <div>{s.configTitle}</div>
            <div>{`${s.date}: ${date}`}</div>
          </div>
        </header>
        <div>
          <h1 id="pz-paper-title" className="pz-paper-title">
            {f.status === "ok" && f.model ? `Pazı ${f.model.name}` : fl.result.customTitle}
          </h1>
          <p className="pz-paper-sub">{f.status === "ok" && f.model ? `${tr.grippers[f.gripper]}${opts.length ? `, ${opts.join(", ").toLocaleLowerCase("tr")}` : ""}` : fl.result.customText}</p>
        </div>
        <div className="pz-paper-grid">
          <section>
            <h2>{s.product}</h2>
            <dl>
              <dt>{fi.kind}</dt>
              <dd>{fi.kinds[config.kind]}</dd>
              <dt>{fi.size}</dt>
              <dd>{`${fmt(config.u)} × ${fmt(config.g)} × ${fmt(config.y)} mm`}</dd>
              <dt>{fi.kg}</dt>
              <dd>{`${fmt1(config.kg)} kg`}</dd>
            </dl>
            <h2 style={{ marginTop: "5mm" }}>{s.line}</h2>
            <dl>
              <dt>{fi.rate}</dt>
              <dd>{`${config.rate} /dk`}</dd>
              <dt>{fi.lines}</dt>
              <dd>{config.lines}</dd>
              <dt>{fi.shifts}</dt>
              <dd>{config.shifts}</dd>
            </dl>
            <h2 style={{ marginTop: "5mm" }}>{`${s.result} (${fl.result.estimate})`}</h2>
            <dl>
              <dt>{fl.result.capacity}</dt>
              <dd>{f.capacity ? `~${fmt1(f.capacity)} /dk` : "—"}</dd>
              <dt>{fl.result.required}</dt>
              <dd>{`${f.required} /dk`}</dd>
              <dt>{fl.result.cycle}</dt>
              <dd>{f.cycleSec ? `${fmt1(f.cycleSec)} sn` : "—"}</dd>
              <dt>{fl.result.area}</dt>
              <dd>{`${fmt1(f.cell.w)} × ${fmt1(f.cell.d)} m`}</dd>
            </dl>
          </section>
          <section>
            <h2>{s.pallet}</h2>
            <dl>
              <dt>{fi.pallet}</dt>
              <dd>{`${fmt(W)} × ${fmt(L)} mm`}</dd>
              <dt>{fi.pattern}</dt>
              <dd>{fi.patterns[f.plan.pattern]}</dd>
              <dt>{fl.numbers.perLayer}</dt>
              <dd>{f.plan.perLayer}</dd>
              <dt>{fl.numbers.layers}</dt>
              <dd>{f.stack.layers}</dd>
              <dt>{fl.numbers.total}</dt>
              <dd>{f.stack.total}</dd>
              <dt>{fl.numbers.height}</dt>
              <dd>{`${fmt(f.stack.height)} mm`}</dd>
              <dt>{fl.numbers.load}</dt>
              <dd>{`${fmt(f.stack.loadKg)} kg`}</dd>
            </dl>
            <div style={{ marginTop: "4mm" }}>
              <LayerPlan config={config} plan={f.plan} layer={0} title={fl.plan} compact />
            </div>
          </section>
        </div>
        <div className="pz-paper-iso">
          <IsoCell config={config} />
        </div>
        {f.warnings.filter((w) => w !== "bag-claw").map((w) => (
          <p key={w} className="pz-paper-warn">
            {tr.warnings[w]}
          </p>
        ))}
        {p.months || p.never || p.rentGap ? (
          <section>
            <h2>{`${s.payback} (${fl.result.estimate})`}</h2>
            <dl>
              <dt>{fl.payback.saving}</dt>
              <dd>{tlRange(p.saving[0], p.saving[1])}</dd>
              {p.months ? (
                <>
                  <dt>{fl.payback.months}</dt>
                  <dd>{fl.payback.monthsValue(p.months[0], p.months[1])}</dd>
                </>
              ) : null}
              {p.rentGap ? (
                <>
                  <dt>{fl.payback.rentGap}</dt>
                  <dd>{tlRange(p.rentGap[0], p.rentGap[1])}</dd>
                </>
              ) : null}
            </dl>
            {p.never ? <p className="pz-paper-warn">{fl.payback.never}</p> : null}
          </section>
        ) : null}
        <footer className="pz-paper-notes">
          <strong>{fl.result.assumptions}</strong>
          <ul>
            {fl.result.assumptionList.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p style={{ margin: "2mm 0 0" }}>{s.concept}</p>
          <p style={{ margin: "1mm 0 0" }}>
            {s.ref}: <span className="pz-paper-link">{link}</span>
          </p>
        </footer>
      </article>
    </div>
  );
}
