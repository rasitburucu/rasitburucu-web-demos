"use client";

import { useEffect, useState } from "react";
import { tr } from "@/content/revak/tr";
import { countdown, EXAM_SESSIONS, istanbul, nextExam, isoDate } from "@/lib/revak/schedule";
import { dayMonth, longDate } from "@/lib/revak/format";

const b = tr.kabul.burs;
const fb = tr.flows.burs.s1;

/** Live countdown to the next open scholarship-exam session. */
export function ExamCountdown() {
  const [state, setState] = useState<{ label: string; c: ReturnType<typeof countdown> } | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const s = nextExam(now);
      if (!s) return setState(null);
      setState({ label: b.countdownLabel(dayMonth(s.iso)), c: countdown(istanbul(s.iso, s.time), now) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const u = b.units;
  const parts = state
    ? [
        [state.c.days, u.days],
        [state.c.hours, u.hours],
        [state.c.minutes, u.minutes],
        [state.c.seconds, u.seconds],
      ]
    : [];
  return (
    <div className="rv-countdown">
      <p className="rv-countdown-label">{state?.label ?? " "}</p>
      <div className="rv-countdown-nums" role="timer" aria-live="off" aria-atomic="true">
        {parts.map(([n, label]) => (
          <div key={label as string}>
            <strong>{String(n).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Session list; seats and closed deadlines are resolved in the browser. */
export function SessionList() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(isoDate(new Date())), []);
  return (
    <ul className="rv-sessions">
      {EXAM_SESSIONS.map((s) => {
        const closed = today !== null && s.deadline < today;
        const full = s.left === 0 || closed;
        return (
          <li key={s.id} className={full ? "is-full" : undefined}>
            <strong>{longDate(s.iso)}</strong>
            <span>{closed ? fb.closed : full ? fb.full : fb.left(s.left)}</span>
            <span>
              {s.time}, {fb.place}. {fb.deadline(dayMonth(s.deadline))}
            </span>
            <span>
              {s.grades[0]}-{fb.sinifLabel(s.grades[s.grades.length - 1])}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Three sample questions answered on the page. */
export function SampleQuestions() {
  const [picked, setPicked] = useState<(number | null)[]>(b.samples.map(() => null));
  return (
    <div className="rv-samples">
      {b.samples.map((q, qi) => {
        const p = picked[qi];
        const right = p === q.answer;
        return (
          <fieldset key={q.q} className="rv-sample">
            <legend>
              <span className="rv-sample-tag">{q.tag}</span>
              <br />
              {q.q}
            </legend>
            <div className="rv-sample-opts">
              {q.options.map((o, oi) => (
                <label key={o} data-state={p === null ? undefined : oi === q.answer ? "right" : p === oi ? "wrong" : undefined}>
                  <input
                    type="radio"
                    name={`rv-sample-${qi}`}
                    checked={p === oi}
                    onChange={() => setPicked((arr) => arr.map((v, i) => (i === qi ? oi : v)))}
                  />
                  {o}
                </label>
              ))}
            </div>
            <p className="rv-sample-fb" aria-live="polite">
              {p !== null && (
                <>
                  <strong>{right ? b.correct : b.wrong}</strong> {q.why}
                </>
              )}
            </p>
          </fieldset>
        );
      })}
    </div>
  );
}
