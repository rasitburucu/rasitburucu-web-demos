"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tr } from "@/content/revak/tr";
import { KADEMELER, useShared, type Kademe } from "@/lib/revak/store";
import { Icon } from "../ui/Icon";

const t = tr.sentence;
const ROUTES: Record<string, string> = {
  "on-kayit": "/revak/kabul/on-kayit/",
  tur: "/revak/kabul/kampus-turu/",
  ucret: "/revak/kabul/ucret-bilgisi/",
  burs: "/revak/kabul/bursluluk/",
};

/** "Çocuğum [kademe] için [niyet] istiyorum." — routes into the right flow with the level set. */
export function SentenceForm({ season }: { season?: string }) {
  const router = useRouter();
  const { shared, update } = useShared();
  const [kademe, setKademe] = useState<Kademe>("ilkokul");
  const [intent, setIntent] = useState("on-kayit");

  useEffect(() => {
    if (shared.kademe) setKademe(shared.kademe);
  }, [shared.kademe]);

  return (
    <div className="rv-sentence">
      <p className="rv-sentence-head">
        <span className="rv-sentence-label" id="rv-sentence-label">
          {t.label}
        </span>
        {season && <span className="rv-sentence-season">{season}</span>}
      </p>
      <form
        aria-labelledby="rv-sentence-label"
        onSubmit={(e) => {
          e.preventDefault();
          update({ kademe });
          router.push(`${ROUTES[intent]}?kademe=${kademe}`);
        }}
      >
        <span>{t.before}</span>
        <label className="rv-inline-select">
          <span className="rv-sr">{t.kademeLabel}</span>
          <select value={kademe} onChange={(e) => setKademe(e.target.value as Kademe)}>
            {KADEMELER.map((k) => (
              <option key={k} value={k}>
                {t.kademe[k]}
              </option>
            ))}
          </select>
          <Icon name="chevron" size={18} />
        </label>
        <span>{t.middle}</span>
        <label className="rv-inline-select">
          <span className="rv-sr">{t.intentLabel}</span>
          <select value={intent} onChange={(e) => setIntent(e.target.value)}>
            {t.intents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
          <Icon name="chevron" size={18} />
        </label>
        <span>{t.after}</span>
        <button type="submit" className="rv-sentence-go">
          <span>{t.go}</span>
          <Icon name="arrow" size={20} />
        </button>
      </form>
    </div>
  );
}
