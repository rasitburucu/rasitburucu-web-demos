// Page frame for one language: concept strip, header, main, footer, the date
// sheet and the phone bar. The language root sets lang on its own subtree and,
// in the browser, on <html> (the root layout is shared by every demo).

import type { Lang } from "@/lib/yedipencere/dates";
import { COPY } from "@/content/yedipencere/copy";
import { DateSheet } from "../home/DateSheet";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileBar } from "./MobileBar";

export function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = COPY[lang];
  return (
    <div lang={lang} className="yp-shell">
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />
      <a className="yp-skip" href="#icerik">
        {t.skip}
      </a>
      <div className="yp-strip-top" role="note">
        <p>
          {t.strip.text}{" "}
          <a href={t.strip.href} target="_blank" rel="noopener">
            {t.strip.link}
          </a>
        </p>
      </div>
      <Header lang={lang} />
      <main id="icerik" tabIndex={-1}>
        {children}
      </main>
      <Footer lang={lang} />
      <DateSheet lang={lang} />
      <MobileBar lang={lang} />
    </div>
  );
}
