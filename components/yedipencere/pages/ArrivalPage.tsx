import type { Lang } from "@/lib/yedipencere/dates";
import { COPY } from "@/content/yedipencere/copy";
import { ArrivalTool } from "../arrival/ArrivalTool";

export function ArrivalPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="yp-page yp-page--arrival">
      <header className="yp-page-head">
        <h1 className="yp-h1">{t.arrivalPage.title}</h1>
        <p className="yp-lead">{t.arrivalPage.lead}</p>
      </header>
      <ArrivalTool lang={lang} variant="full" />
    </div>
  );
}
