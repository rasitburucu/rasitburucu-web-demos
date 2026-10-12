"use client";

// "Basamak istemiyorsanız": the two ground-floor rooms, one tap away.

import type { Lang } from "@/lib/yedipencere/dates";
import { steps as stepsText } from "@/lib/yedipencere/format";
import { ROOM, type RoomId } from "@/lib/yedipencere/house";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { PICK_EVENT } from "../draw/WindowLayer";

const GROUND: RoomId[] = ["taslik", "avlu"];

export function NoSteps({ lang }: { lang: Lang }) {
  const { stay, setStay } = useStay();
  const t = COPY[lang].ruler;
  return (
    <p className="yp-nosteps">
      <span>{t.noSteps}</span>
      {GROUND.map((id) => (
        <button
          key={id}
          type="button"
          className="yp-btn yp-btn--sm"
          aria-pressed={stay.room === id}
          onClick={() => {
            setStay({ room: id });
            window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: id }));
          }}
        >
          {ROOM[id].name} · {stepsText(ROOM[id].steps, lang)}
        </button>
      ))}
    </p>
  );
}
