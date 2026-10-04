import Link from "next/link";
import { tr } from "@/content/pazi/tr";

// A product that does not fit the pallet: the box overhangs the deck, hatched.
export default function PaziNotFound() {
  const t = tr.notFound;
  return (
    <section className="pz-wrap pz-404" aria-labelledby="pz-404-title">
      <svg viewBox="0 0 420 220" className="pz-404-art" aria-hidden="true">
        <defs>
          <pattern id="pz-404-hz" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="12" height="12" fill="#f5a800" />
            <rect width="6" height="12" fill="#151615" />
          </pattern>
        </defs>
        <rect x="0" y="206" width="420" height="6" fill="#f5a800" />
        <rect x="110" y="176" width="200" height="8" fill="#cdb18a" />
        <rect x="110" y="184" width="30" height="16" fill="#b39672" />
        <rect x="195" y="184" width="30" height="16" fill="#b39672" />
        <rect x="280" y="184" width="30" height="16" fill="#b39672" />
        <rect x="110" y="200" width="200" height="6" fill="#cdb18a" />
        <rect x="60" y="66" width="300" height="110" fill="#c19a6b" stroke="#151615" strokeWidth="1.5" />
        <rect x="196" y="66" width="28" height="110" fill="#a57c4c" opacity="0.8" />
        <rect x="60" y="66" width="50" height="110" fill="url(#pz-404-hz)" opacity="0.92" />
        <rect x="310" y="66" width="50" height="110" fill="url(#pz-404-hz)" opacity="0.92" />
        <g fontFamily="var(--pz-f-mono)" fontSize="12" fill="#151615">
          <line x1="60" y1="46" x2="360" y2="46" stroke="#151615" />
          <line x1="60" y1="40" x2="60" y2="52" stroke="#151615" />
          <line x1="360" y1="40" x2="360" y2="52" stroke="#151615" />
          <text x="210" y="38" textAnchor="middle">404</text>
        </g>
      </svg>
      <h1 id="pz-404-title" className="pz-h2">
        {t.title}
      </h1>
      <p className="pz-lead">{t.text}</p>
      <div className="pz-model-actions">
        <Link href="/pazi/" className="pz-btn pz-btn-primary">
          {t.home}
        </Link>
        <Link href="/pazi/fizibilite/" className="pz-btn">
          {t.flow}
        </Link>
      </div>
    </section>
  );
}
