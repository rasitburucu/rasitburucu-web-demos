"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/sazbahce/tr";
import { usePlan } from "@/lib/sazbahce/store";
import { shareSummary, summaryRows } from "../ui/summary";

const s = tr.summary;

/** The request summary: a drawer on wide screens, a bottom sheet on phones. Native <dialog>. */
export function SummaryDialog() {
  const { plan, set, sheet, setSheet } = usePlan();
  const ref = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState<string>(s.notSent);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (sheet && !d.open) {
      setNote(s.notSent);
      d.showModal();
    } else if (!sheet && d.open) d.close();
  }, [sheet]);

  return (
    <dialog
      ref={ref}
      className="sb-dialog"
      aria-labelledby="sb-sum-title"
      onClose={() => setSheet(false)}
      onClick={(e) => {
        if (e.target === ref.current) setSheet(false);
      }}
    >
      <div className="sb-dialog-in">
        <div className="sb-dialog-head">
          <h2 id="sb-sum-title" className="sb-h3">
            {s.title}
          </h2>
          <button type="button" className="sb-iconbtn" aria-label={s.close} onClick={() => setSheet(false)}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
        <p className="sb-muted">{s.lead}</p>
        <dl className="sb-sum">
          {summaryRows(plan).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <form
          className="sb-sum-form"
          onSubmit={(e) => {
            e.preventDefault();
            setNote(s.sentNote);
          }}
        >
          <label className="sb-field">
            <span>{s.name}</span>
            <input autoComplete="name" value={plan.name} onChange={(e) => set({ name: e.target.value })} />
          </label>
          <label className="sb-field">
            <span>{s.phone}</span>
            <input type="tel" autoComplete="tel" inputMode="tel" value={plan.phone} onChange={(e) => set({ phone: e.target.value })} />
          </label>
          <div className="sb-sum-act">
            <button type="submit" className="sb-btn sb-btn--accent">
              {s.send}
            </button>
            <button
              type="button"
              className="sb-btn sb-btn--line"
              onClick={async () => {
                const r = await shareSummary(plan);
                if (r === "copied") setNote(s.copied);
              }}
            >
              {s.share}
            </button>
            <Link href={`${tr.base}/teklif/`} className="sb-link" onClick={() => setSheet(false)}>
              {s.more}
            </Link>
          </div>
          <p className="sb-note" role="status">
            {note}
          </p>
        </form>
      </div>
    </dialog>
  );
}
