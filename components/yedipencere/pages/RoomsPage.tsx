import type { Lang } from "@/lib/yedipencere/dates";
import { COPY } from "@/content/yedipencere/copy";
import { DateBar } from "../home/DateBar";
import { TwoWeeks, WindowSheet } from "./RoomsParts";

export function RoomsPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="yp-page">
      <header className="yp-page-head">
        <h1 className="yp-h1">{t.rooms.title}</h1>
        <p className="yp-lead">{t.rooms.lead}</p>
      </header>

      <section aria-labelledby="yp-w-h">
        <div className="yp-block-head">
          <h2 id="yp-w-h" className="yp-h2">
            {t.rooms.windowsTitle}
          </h2>
          <p className="yp-lead">{t.rooms.windowsLead}</p>
        </div>
        <div className="yp-toolbar">
          <DateBar lang={lang} />
        </div>
        <WindowSheet lang={lang} />
      </section>

      <section className="yp-block" aria-labelledby="yp-g-h">
        <div className="yp-block-head">
          <h2 id="yp-g-h" className="yp-h2">
            {t.rooms.gridTitle}
          </h2>
          <p className="yp-lead">{t.rooms.gridLead}</p>
        </div>
        <TwoWeeks lang={lang} />
        <p className="yp-note yp-grid-live">{t.card.live}</p>
      </section>
    </div>
  );
}
