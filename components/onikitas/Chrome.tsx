import { tr } from "@/content/onikitas/tr";
import { chapters, formatHour } from "@/lib/onikitas/chapters";
import { SoundToggle } from "./SoundToggle";

/** Honesty strip, header, the day clock and the hour navigation. */
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
        <a href="#safak" className="oki-brand" aria-label={`${tr.brand}, başa dön`}>
          {tr.brand}
        </a>
        <nav className="oki-header__nav" aria-label="Ana">
          <SoundToggle />
          <a href="#ziyaret" className="oki-visit">
            {tr.nav.visit}
          </a>
        </nav>
      </header>
      {/* flat limewash rails behind the copy, the clock and the hour list */}
      <div className="oki-rail" data-s="l" aria-hidden="true" />
      <div className="oki-rail" data-s="r" aria-hidden="true" />
      <div className="oki-rail" data-s="b" aria-hidden="true" />
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
