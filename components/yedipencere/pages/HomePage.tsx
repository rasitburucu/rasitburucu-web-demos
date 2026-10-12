// Home: choose the room by its window (first screen), then the climb, the walk
// to the door, the house in section, house notes and the stay as a booking band.
// Each band is a different kind of drawing, not a row of cards.

import Link from "next/link";
import { preload } from "react-dom";
import type { Lang } from "@/lib/yedipencere/dates";
import { href } from "@/lib/yedipencere/paths";
import { COPY } from "@/content/yedipencere/copy";
import { photoSrc } from "@/content/yedipencere/photos";
import { ArrivalTool } from "../arrival/ArrivalTool";
import { Section } from "../draw/Section";
import { LiveCaption } from "../draw/LiveRoute";
import { StepProfile } from "../draw/StepProfile";
import { BookingBand } from "../home/BookingBand";
import { DateBar } from "../home/DateBar";
import { NoSteps } from "../home/NoSteps";
import { Pafta } from "../home/Pafta";
import { RoomCard } from "../home/RoomCard";
import { Arrow } from "../ui/icons";

export function HomePage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  // the card's window opens on Körfez: its view is the largest image of the first screen
  preload(photoSrc("korfez", 300), { as: "image", fetchPriority: "high" });
  return (
    <>
      <section className="yp-first" aria-labelledby="yp-h1">
        <div className="yp-first-main">
          <div className="yp-first-head">
            <h1 id="yp-h1" className="yp-h1">
              {t.home.title}
            </h1>
            <div className="yp-first-sub">
              <p className="yp-lead">{t.home.lead}</p>
              <DateBar lang={lang} />
            </div>
          </div>
          <Pafta lang={lang} />
          <div className="yp-climb">
            <div className="yp-climb-text">
              <h2 className="yp-h3">{t.ruler.title}</h2>
              <p>{t.ruler.lead}</p>
              <NoSteps lang={lang} />
            </div>
            <StepProfile lang={lang} />
          </div>
        </div>
        <RoomCard lang={lang} />
      </section>

      <section className="yp-sec yp-sec--arrival" id="kapidan-kapiya" aria-labelledby="yp-arr-h">
        <div className="yp-wrap">
          <div className="yp-sec-head">
            <h2 id="yp-arr-h" className="yp-h2">
              {t.arrival.title}
            </h2>
            <p className="yp-lead">{t.arrival.lead}</p>
          </div>
          <ArrivalTool lang={lang} variant="compact" />
        </div>
      </section>

      <section className="yp-sec yp-sec--house" aria-labelledby="yp-house-h">
        <div className="yp-wrap">
          <div className="yp-sec-head">
            <h2 id="yp-house-h" className="yp-h2">
              {t.house.title}
            </h2>
            <p className="yp-lead">{t.house.lead}</p>
            <Link href={href(lang, "house")} className="yp-more">
              {t.house.more} <Arrow />
            </Link>
          </div>
          <figure className="yp-sec-fig">
            <div className="yp-sheet-frame">
              <Section lang={lang} live label={t.home.sectionLabel} />
            </div>
            <LiveCaption lang={lang} />
          </figure>
        </div>
      </section>

      <section className="yp-sec yp-sec--notes" aria-labelledby="yp-notes-h">
        <div className="yp-wrap yp-notes">
          <h2 id="yp-notes-h" className="yp-h2">
            {t.notes.title}
          </h2>
          <ol>
            {t.notes.items.map((n, i) => (
              <li key={i}>
                <span className="yp-notes-n" aria-hidden="true">
                  {i + 1}
                </span>
                <p>{n}</p>
              </li>
            ))}
          </ol>
          <Link href={href(lang, "faq")} className="yp-more">
            {t.notes.more} <Arrow />
          </Link>
        </div>
      </section>

      <BookingBand lang={lang} />
    </>
  );
}
