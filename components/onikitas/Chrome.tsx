import { tr } from "@/content/onikitas/tr";
import { chapters, formatHour } from "@/lib/onikitas/chapters";
import { SoundToggle } from "./SoundToggle";

/** Honesty strip, header with the section menu, the day clock and the hour navigation. */
export function Chrome() {
  return (
    <>
      <a href="#safak" className="oki-skip">
        {tr.skip}
      </a>
      <div className="oki-strip">
        <a href={tr.strip.href}>{tr.strip.text}</a>
      </div>
      <header className="oki-header">
        <a href="#safak" className="oki-brand oki-bed" aria-label={`${tr.brand}, başa dön`}>
          {tr.brand}
        </a>
        <nav className="oki-header__nav" aria-label="Ana">
          <SoundToggle />
          {/* wide screens: the sections in a row, the last one the tile button */}
          <ul className="oki-menu">
            {tr.nav.pages.map((p) => (
              <li key={p.href}>
                <a href={p.href} className={p.cta ? "oki-visit" : "oki-menu__link"}>
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
          {/* phones: the visit button stays in sight, every section is in the menu panel */}
          <a href="#ziyaret" className="oki-visit oki-visit--m">
            {tr.nav.visit}
          </a>
          <details className="oki-menu-m">
            <summary>{tr.nav.menu}</summary>
            <ul>
              {tr.nav.pages.map((p) => (
                <li key={p.href}>
                  <a href={p.href}>{p.label}</a>
                </li>
              ))}
            </ul>
          </details>
        </nav>
      </header>
      <div className="oki-hud" aria-hidden="true">
        <p className="oki-hud__name" data-clock-name>
          {tr.chapters.safak.name}
        </p>
        <p className="oki-hud__clock" data-clock>
          {formatHour(chapters[0].from)}
        </p>
      </div>
      <nav className="oki-days" aria-label={tr.nav.dayNav}>
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} data-tick data-active={i === 0 ? "true" : "false"}>
                <span className="oki-days__time">{formatHour(c.from)}</span>
                <span className="oki-days__name">{tr.chapters[c.id].name}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
