import Link from "next/link";
import { navPages, tr } from "@/content/gelidonya/tr";

/** A 45-cell tray drawn in SVG: every cell filled but one. */
function EmptyCellTray() {
  const cells = [];
  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 9; i++) {
      const x = 14 + i * 44;
      const y = 14 + j * 44;
      const empty = i === 6 && j === 2;
      cells.push(
        <g key={`${i}-${j}`}>
          <rect x={x} y={y} width="40" height="40" fill={empty ? "#050606" : "#4A3826"} />
          {empty ? (
            <circle cx={x + 20} cy={y + 20} r="3" fill="#2a2e2e" />
          ) : (
            <>
              <ellipse cx={x + 20} cy={y + 20} rx="15" ry="6" fill="#4E8F2A" transform={`rotate(${(i * 37 + j * 61) % 180} ${x + 20} ${y + 20})`} />
              <ellipse cx={x + 20} cy={y + 20} rx="5" ry="13" fill="#3F8F1F" transform={`rotate(${(i * 37 + j * 61) % 180} ${x + 20} ${y + 20})`} />
            </>
          )}
        </g>,
      );
    }
  }
  return (
    <svg viewBox="0 0 424 248" className="gd-404-art" aria-hidden="true">
      <rect width="424" height="248" rx="6" fill="#17191A" />
      {cells}
      <rect x="276" y="102" width="40" height="40" fill="none" stroke="#B3261E" strokeWidth="4" />
    </svg>
  );
}

export function NotFound() {
  const n = tr.notFound;
  return (
    <section className="gd-404" aria-labelledby="gd-404-title">
      <div className="gd-wrap">
        <EmptyCellTray />
        <h1 id="gd-404-title" className="gd-h1">
          {n.title}
        </h1>
        <p className="gd-lead">{n.text}</p>
        <ul>
          {navPages.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="gd-btn gd-btn--line">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
