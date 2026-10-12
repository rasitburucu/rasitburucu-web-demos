import type { Locale } from "@/content/damar/routes";
import { dict } from "@/lib/damar/dict";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HtmlLang } from "./HtmlLang";
import { MobileBar } from "./MobileBar";
import { Toast } from "./Toast";

export function Strip({ locale }: { locale: Locale }) {
  const s = dict(locale).strip;
  return (
    <div className="dm-strip" role="note">
      <p>
        {s.text} <a href={s.href}>{s.link}</a>
      </p>
    </div>
  );
}

/** Page frame for one language: strip, header, main, footer, phone bar. */
export function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const d = dict(locale);
  return (
    <div className="dm-shell" lang={d.htmlLang}>
      <HtmlLang lang={d.htmlLang} />
      <a className="dm-skip" href="#icerik">
        {d.skip}
      </a>
      <Strip locale={locale} />
      <Header locale={locale} />
      <main id="icerik" tabIndex={-1}>
        {children}
      </main>
      <Footer locale={locale} />
      <MobileBar locale={locale} />
      <Toast locale={locale} />
    </div>
  );
}
