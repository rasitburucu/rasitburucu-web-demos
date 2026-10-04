"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { tr } from "@/content/revak/tr";
import { daysUntil, nextExam, parseIso } from "@/lib/revak/schedule";
import { dayMonth, WEEKDAYS } from "@/lib/revak/format";
import { Icon } from "../ui/Icon";

const KEY = "revak:announce-closed";
const t = tr.announce;

/** Scholarship-exam notice. Dates are resolved after mount from the visitor's clock. */
export function Announce() {
  const [text, setText] = useState<string | null>(null);
  const [short, setShort] = useState("");
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) setClosed(true);
    } catch {}
    const tick = () => {
      const now = new Date();
      const s = nextExam(now);
      if (!s) return setText("");
      setText(t.text(dayMonth(s.iso), WEEKDAYS[parseIso(s.iso).getDay()], dayMonth(s.deadline), daysUntil(s.deadline, now)));
      setShort(t.short(dayMonth(s.iso)));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (closed || text === "") return null;

  return (
    <div className="rv-announce" role="region" aria-label={t.lead}>
      <div className="rv-wrap rv-announce-in">
        <p>
          <strong>{t.lead}</strong> <span className="rv-announce-text">{text ?? " "}</span>
          <span className="rv-announce-short">{short}</span>
        </p>
        <Link href="/revak/kabul/bursluluk/" className="rv-announce-cta">
          <span className="rv-hide-sm">{t.cta}</span>
          <span className="rv-show-sm">{t.ctaShort}</span>
        </Link>
        <button
          type="button"
          className="rv-announce-x"
          aria-label={t.close}
          onClick={() => {
            setClosed(true);
            try {
              sessionStorage.setItem(KEY, "1");
            } catch {}
          }}
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}
