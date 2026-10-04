"use client";

import { useId, useState } from "react";

type Scenario = { id: string; label: string; steps: { who: string; what: string }[] };

// "Bir şey olursa": pick a situation, read the chain of who does what, in order.
// A radio group (native inputs, arrow keys for free) and a numbered list.
export function Scenarios({ items, label }: { items: Scenario[]; label: string }) {
  const id = useId();
  const [pick, setPick] = useState(items[0].id);
  const s = items.find((x) => x.id === pick) ?? items[0];
  return (
    <div className="rv-scen">
      <fieldset className="rv-scen-pick">
        <legend className="rv-sr">{label}</legend>
        {items.map((x) => (
          <label key={x.id} className={x.id === pick ? "is-on" : undefined}>
            <input type="radio" name={`${id}-s`} value={x.id} checked={x.id === pick} onChange={() => setPick(x.id)} />
            <span>{x.label}</span>
          </label>
        ))}
      </fieldset>
      <ol className="rv-scen-steps" aria-live="polite" key={s.id}>
        {s.steps.map((st, i) => (
          <li key={st.who + i}>
            <span className="rv-scen-n rv-num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <strong>{st.who}</strong>
              <p>{st.what}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
