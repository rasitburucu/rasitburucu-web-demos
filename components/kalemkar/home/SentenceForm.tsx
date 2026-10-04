"use client";

// "[2 kişi] için [Cuma, 9 Ekim] akşamı  Masalara bak": the booking starts on the
// first screen, in a sentence. Dates are computed after mount (no hydration
// mismatch); before that the day select shows a neutral word.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { calendar, nearestOpen, antep, iso as isoOf } from "@/lib/kalemkar/availability";
import { dayLong } from "@/lib/kalemkar/format";
import { useBooking, useNow } from "@/lib/kalemkar/store";

const h = tr.hero;

export function SentenceForm() {
  const router = useRouter();
  const now = useNow();
  const { booking, update } = useBooking();
  const [kisi, setKisi] = useState(booking.kisi <= 6 ? booking.kisi : 2);
  const [day, setDay] = useState<string>("");

  const days = useMemo(() => {
    if (!now) return [];
    const out: string[] = [];
    for (const m of calendar(now, "salon", kisi, "sofra")) {
      if (m.locked) continue;
      for (const d of m.days) if (d.status === "bos" || d.status === "az") out.push(d.iso);
    }
    return out.slice(0, 21);
  }, [now, kisi]);

  const free = useMemo(() => {
    if (!now) return [];
    const a = antep(now);
    const e = new Date(Date.UTC(a.y, a.m, a.d + 7));
    const weekEnd = isoOf(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
    return nearestOpen(now, "salon", kisi, "sofra", 4).filter((x) => x.iso <= weekEnd).slice(0, 2);
  }, [now, kisi]);

  const chosen = day && days.includes(day) ? day : days[0] ?? "";

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    update({ deneyim: "salon", kisi, tarih: chosen || undefined, saat: undefined });
    router.push(`${tr.base}/rezervasyon/`);
  };

  return (
    <div className="kk-sentence-wrap">
      <form className="kk-sentence" onSubmit={go} aria-label={h.sentenceLabel}>
        <span className="kk-sentence-line">
          <label className="kk-inline">
            <span className="kk-sr">{h.peopleLabel}</span>
            <select value={kisi} onChange={(e) => setKisi(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} kişi
                </option>
              ))}
            </select>
          </label>{" "}
          {h.forWord}{" "}
          <label className="kk-inline kk-inline--day">
            <span className="kk-sr">{h.dayLabel}</span>
            <select value={chosen} onChange={(e) => setDay(e.target.value)} disabled={!days.length}>
              {!days.length && <option value="">{h.dayLoading}</option>}
              {days.map((d) => (
                <option key={d} value={d}>
                  {dayLong(d)}
                </option>
              ))}
            </select>
          </label>{" "}
          {h.eveningWord}
        </span>
        <button type="submit" className="kk-btn kk-btn--accent kk-sentence-go">
          {h.submit}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
      <p className="kk-free" aria-live="polite">
        {now && (free.length ? <span>{h.free}</span> : <span>{h.freeNone}</span>)}
        {free.map((f) => (
          <Link
            key={f.iso + f.time}
            className="kk-chip"
            href={`${tr.base}/rezervasyon/`}
            onClick={() => update({ deneyim: "salon", kisi, tarih: f.iso, saat: f.time, menu: "sofra" })}
          >
            {/* "Bu hafta boş:" already says which week: weekday and time read cleanly. */}
            <span aria-hidden="true">{dayLong(f.iso).split(",")[0]}, {f.time}</span>
            <span className="kk-sr">{dayLong(f.iso)}, {f.time}</span>
          </Link>
        ))}
      </p>
    </div>
  );
}
