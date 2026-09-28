import { tr } from "@/content/onikitas/tr";
import { chapters } from "@/lib/onikitas/chapters";
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
          <svg viewBox="0 0 24 24" aria-hidden="true" className="oki-brand__mark">
            <path d="M3 20.5h18" />
            <path d="M5.5 20.5v-6.5h5v6.5M10.5 20.5v-9h6v9M16.5 20.5v-4.5h3v4.5" />
          </svg>
          <span>{tr.brand}</span>
        </a>
        <nav className="oki-header__nav" aria-label="Ana">
          <SoundToggle />
          <a href="#ziyaret" className="oki-visit">
            {tr.nav.visit}
          </a>
        </nav>
      </header>
      <div className="oki-hud" aria-hidden="true">
        <p className="oki-hud__name" data-clock-name>
          {tr.chapters.safak.name}
        </p>
        <p className="oki-hud__clock" data-clock>
          {tr.chapters.safak.time}
        </p>
        <p className="oki-hud__coords">{tr.loader.coords}</p>
      </div>
      <nav className="oki-days" aria-label={tr.nav.dayNav}>
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} data-tick data-active={i === 0 ? "true" : "false"}>
                <span className="oki-days__time">{tr.chapters[c.id].time}</span>
                <span className="oki-days__name">{tr.chapters[c.id].name}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
