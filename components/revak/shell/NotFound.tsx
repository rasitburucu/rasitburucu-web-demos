import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { asset } from "@/lib/asset";

const t = tr.notFound;

/** 404: the arch is walled up. Same rendered face as the walk, the opening filled with coursed stone. */
export function NotFound() {
  return (
    <section className="rv-404" aria-labelledby="rv-404-title">
      <div className="rv-wrap rv-404-grid">
        <div className="rv-404-arch" aria-hidden="true">
          <span className="rv-404-fill" />
          <picture>
            <source type="image/avif" srcSet={`${asset("/revak/walk/kemer-aksam-720.avif")} 720w`} />
            <img src={asset("/revak/walk/kemer-aksam-720.webp")} width={720} height={771} alt="" />
          </picture>
        </div>
        <div className="rv-404-text">
          <p className="rv-404-code">404</p>
          <h1 id="rv-404-title">{t.title}</h1>
          <p className="rv-lede">{t.text}</p>
          <div className="rv-404-actions">
            <Link href="/revak/" className="rv-btn rv-btn--line">
              {t.home}
            </Link>
            <Link href="/revak/kabul/on-kayit/" className="rv-btn rv-btn--seal">
              {t.apply}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
