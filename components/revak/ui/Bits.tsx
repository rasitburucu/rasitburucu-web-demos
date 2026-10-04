import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { numerals } from "@/lib/revak/format";

/**
 * The "örnek" seal. Every block that reads like real data (menu, calendar, hours,
 * timetable, policy) carries one, so honesty is part of the print, not a footnote.
 * Same component everywhere: a small double-ruled stamp in seal red with the arch mark.
 */
export function Sample({ children = tr.sample.content, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={["rv-seal-tag", className].filter(Boolean).join(" ")}>
      <svg width="9" height="11" viewBox="0 0 23 28" aria-hidden="true" focusable="false">
        <path d="M0 28V11.5a11.5 11.5 0 0 1 23 0V28h-5.5V12a6 6 0 0 0-12 0v16Z" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}

/** "Revak Okulları / Eğitim / Lise" */
export function Crumb({ trail = [], current }: { trail?: { href: string; label: string }[]; current: string }) {
  return (
    <nav className="rv-crumb" aria-label={tr.crumb}>
      <Link href="/revak/">{tr.brand.full}</Link>
      {trail.map((t) => (
        <span key={t.href}>
          {" / "}
          <Link href={t.href}>{t.label}</Link>
        </span>
      ))}
      {" / "}
      <span aria-current="page">{current}</span>
    </nav>
  );
}

/**
 * A printed almanac table. On phones every row becomes a short stacked entry
 * whose cells carry their column name (data-label), so nothing scrolls sideways.
 */
export function Ledger({
  head,
  rows,
  caption,
  className,
  firstIsHeader = true,
}: {
  head: string[];
  rows: React.ReactNode[][];
  caption?: string;
  className?: string;
  firstIsHeader?: boolean;
}) {
  return (
    <div className={["rv-ledger", className].filter(Boolean).join(" ")}>
      <table>
        {caption && <caption className="rv-sr">{caption}</caption>}
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) =>
                j === 0 && firstIsHeader ? (
                  <th key={j} scope="row" data-label={head[j]}>
                    {typeof c === "string" ? numerals(c) : c}
                  </th>
                ) : (
                  <td key={j} data-label={head[j]}>
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The ink band that closes every inner page: one primary, one secondary action. */
export function CtaBand({
  title,
  text,
  primary,
  secondary,
  id,
}: {
  title: string;
  text: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  id: string;
}) {
  return (
    <section className="rv-section rv-ink rv-on-ink" aria-labelledby={id}>
      <div className="rv-wrap rv-cta-band">
        <div>
          <h2 className="rv-h2" id={id}>
            {title}
          </h2>
          <p>{text}</p>
        </div>
        <div className="rv-actions">
          <Link href={primary.href} className="rv-btn rv-btn--seal">
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="rv-btn rv-btn--line">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
