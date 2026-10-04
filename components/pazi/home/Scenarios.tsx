import Link from "next/link";
import { scenarioConfigs, tr } from "@/content/pazi/tr";
import { DEFAULT_CONFIG, fit, type Config } from "@/lib/pazi/plan";
import { fmt, fmt1 } from "@/lib/pazi/format";
import { encodeConfig } from "@/lib/pazi/url";

/** Small isometric drawings of the three products. */
function Product({ kind }: { kind: string }) {
  if (kind === "torba")
    return (
      <svg viewBox="0 0 160 110" className="pz-prod" aria-hidden="true">
        {/* a filled woven bag: puffy top, pinched seams, thin sides */}
        <path d="M24 52 Q52 32 82 28 Q112 34 138 50 Q112 70 80 78 Q50 72 24 52Z" fill="#ecebe4" stroke="#151615" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M24 52 Q50 72 80 78 L80 96 Q48 90 26 70 Q22 60 24 52Z" fill="#cfcdc5" stroke="#151615" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M80 78 Q112 70 138 50 Q141 60 136 68 Q112 88 80 96Z" fill="#dddbd3" stroke="#151615" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M46 46 Q74 36 104 40 L114 46 Q84 44 56 54Z" fill="#4a4e4a" />
        <path d="M100 58 L112 54 L112 62 L100 66Z" fill="#f5a800" />
        <path d="M30 54 Q54 40 82 36" fill="none" stroke="#151615" strokeOpacity="0.25" />
      </svg>
    );
  if (kind === "shrink")
    return (
      <svg viewBox="0 0 160 110" className="pz-prod" aria-hidden="true">
        <path d="M30 40 L80 22 L130 40 L80 58Z" fill="#b9ccd4" stroke="#151615" strokeWidth="1.4" />
        <path d="M30 40 L80 58 L80 98 L30 80Z" fill="#93abb6" stroke="#151615" strokeWidth="1.4" />
        <path d="M80 58 L130 40 L130 80 L80 98Z" fill="#a6bcc6" stroke="#151615" strokeWidth="1.4" />
        {[0, 1, 2].map((i) =>
          [0, 1].map((j) => <ellipse key={`${i}${j}`} cx={58 + i * 17 + j * 12} cy={35 + j * 9 - i * 6 + 6} rx="5.5" ry="3.2" fill="#2f6f8f" />),
        )}
        <path d="M30 62 L80 80 L130 62" fill="none" stroke="#fff" strokeWidth="6" opacity="0.8" />
      </svg>
    );
  return (
    <svg viewBox="0 0 160 110" className="pz-prod" aria-hidden="true">
      <path d="M28 44 L80 24 L132 44 L80 64Z" fill="#d6b285" stroke="#151615" strokeWidth="1.4" />
      <path d="M28 44 L80 64 L80 100 L28 80Z" fill="#b48a5c" stroke="#151615" strokeWidth="1.4" />
      <path d="M80 64 L132 44 L132 80 L80 100Z" fill="#c29a6b" stroke="#151615" strokeWidth="1.4" />
      <path d="M54 34 L106 54 L114 51 L62 31Z" fill="#a57c4c" />
      <path d="M96 66 L118 58 L118 70 L96 78Z" fill="#ecece6" />
      <path d="M44 62 L50 58 L50 70 L44 74Z M40 64 L54 56" stroke="#2e5e8f" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function Scenarios() {
  const s = tr.scenarios;
  const f = tr.fields;
  return (
    <section id={s.id} className="pz-scen" aria-labelledby="pz-scen-title">
      <div className="pz-wrap">
        <div className="pz-scen-head">
          <h2 id="pz-scen-title" className="pz-h2">
            {s.title}
          </h2>
          <p className="pz-lead">{s.lead}</p>
        </div>
        <ol className="pz-scen-list">
          {s.items.map((it) => {
            const c: Config = { ...DEFAULT_CONFIG, ...scenarioConfigs[it.key] };
            const r = fit(c);
            const result = r.model ? `${r.model.name}, ${tr.grippers[r.gripper].toLocaleLowerCase("tr")}` : tr.hmi.custom;
            return (
              <li key={it.key} className="pz-scen-item">
                <Product kind={c.kind} />
                <div className="pz-scen-body">
                  <h3 className="pz-h3">{it.name}</h3>
                  <p className="pz-scen-where">{it.where}</p>
                  <p>{it.text}</p>
                </div>
                <dl className="pz-scen-spec pz-mono">
                  <div>
                    <dt>{f.size}</dt>
                    <dd>{`${fmt(c.u)} × ${fmt(c.g)} × ${fmt(c.y)} mm`}</dd>
                  </div>
                  <div>
                    <dt>{f.kg}</dt>
                    <dd>{`${fmt1(c.kg)} kg`}</dd>
                  </div>
                  <div>
                    <dt>{f.rate}</dt>
                    <dd>{`${c.rate} /dk`}</dd>
                  </div>
                  <div className="pz-scen-result">
                    <dt>{tr.flow.result.title}</dt>
                    <dd>{result}</dd>
                  </div>
                </dl>
                <Link href={`/pazi/fizibilite/?${encodeConfig(c, { step: 4 })}`} className="pz-btn pz-scen-open">
                  {s.open}
                  <span className="pz-sr">{`: ${it.name}`}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
