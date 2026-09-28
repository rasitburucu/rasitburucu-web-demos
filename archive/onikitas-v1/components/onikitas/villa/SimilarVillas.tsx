import Link from "next/link";
import { tr } from "@/content/onikitas/tr";
import { typologies, type Villa } from "@/content/onikitas/villas";
import { Photo } from "../Photo";
import { StatusMark } from "../plan/StatusMark";

export function SimilarVillas({ villas }: { villas: Villa[] }) {
  const s = tr.villa.similar;
  return (
    <section aria-labelledby="onk-sim-h" className="mx-auto mt-28 max-w-[1600px] px-4 pb-24 sm:px-8 lg:px-12">
      <div className="flex items-end justify-between gap-4 border-b border-olive/25 pb-4">
        <h2 id="onk-sim-h" className="text-[clamp(2rem,3.4vw,3rem)] leading-none">
          {s.heading}
        </h2>
        <Link href="/onikitas#plan" className="text-sm underline underline-offset-4 hover:text-tile-ink">
          {tr.villa.backToPlan}
        </Link>
      </div>
      <ul>
        {villas.map((v) => {
          const t = typologies[v.type];
          return (
            <li key={v.id} className="border-b border-olive/15">
              <Link href={`/onikitas/villalar/${v.id}`} className="group grid grid-cols-[88px_1fr] items-center gap-5 py-5 sm:grid-cols-[120px_1fr_auto] sm:gap-8">
                <span className="arch block aspect-[3/4] overflow-hidden bg-travertine">
                  <Photo k={v.images[0]} sizes="120px" decorative className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
                <span>
                  <span className="label-mono text-olive-soft">N°{v.id}</span>
                  <span className="mt-1 block font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none group-hover:text-tile-ink">{v.name}</span>
                  <span className="mt-2 block text-[0.92rem] text-olive-soft">
                    {t.name} {t.layout} · {v.interior} m² · {tr.view[v.view]} {v.bearing}°
                  </span>
                </span>
                <span className="col-start-2 flex items-center gap-6 sm:col-start-auto">
                  <StatusMark status={v.status} />
                  <span className="hidden text-sm underline underline-offset-4 sm:inline">{s.see}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
