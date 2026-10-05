import Link from "next/link";
import { tr } from "@/content/sazbahce/tr";
import { PlanView } from "../plan/PlanView";

/** "Bu yol göle çıkmıyor": the empty shore, nothing set up, two ways back. */
export function NotFound() {
  const n = tr.notFound;
  return (
    <section className="sb-wrap sb-404">
      <div className="sb-404-text">
        <h1 className="sb-h1">{n.title}</h1>
        <p className="sb-lede">{n.body}</p>
        <div className="sb-row">
          <Link href={`${tr.base}/`} className="sb-btn sb-btn--accent">
            {n.home}
          </Link>
          <Link href={`${tr.base}/alanlar/`} className="sb-btn sb-btn--line">
            {n.areas}
          </Link>
        </div>
      </div>
      <div className="sb-404-plan">
        <PlanView area="iskele" frame="iskele" layout={null} />
      </div>
    </section>
  );
}
