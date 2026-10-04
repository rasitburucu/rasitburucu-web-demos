import Link from "next/link";
import { tr } from "@/content/kalemkar/tr";
import { Sini } from "../sini/Sini";

/** The empty sini: "Bu tabak menüde yok." */
export function NotFound() {
  const n = tr.notFound;
  return (
    <section className="kk-wrap kk-404">
      <div className="kk-404-text">
        <h1 className="kk-h1">{n.title}</h1>
        <p className="kk-lede">{n.body}</p>
        <div className="kk-404-act">
          <Link href={`${tr.base}/`} className="kk-btn kk-btn--accent">
            {n.home}
          </Link>
          <Link href={`${tr.base}/sofra/`} className="kk-btn kk-btn--line">
            {n.menu}
          </Link>
        </div>
      </div>
      <div className="kk-404-sini">
        <Sini variant="serve" sizes="(max-width: 767px) 80vw, 40vw" />
      </div>
    </section>
  );
}
