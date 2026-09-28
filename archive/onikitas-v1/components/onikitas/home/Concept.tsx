import { tr } from "@/content/onikitas/tr";
import { averagePlot } from "@/content/onikitas/villas";
import { Photo } from "../Photo";
import { ArchReveal } from "../ArchReveal";

const fmt = (n: number) => n.toLocaleString("tr-TR");

export function Concept() {
  const c = tr.concept;
  return (
    <section aria-labelledby="onk-concept" className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8 lg:px-12 lg:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <h2 id="onk-concept" className="max-w-[24ch] text-[clamp(2rem,4.2vw,3.9rem)] leading-[1.08]">
            {c.statement}
          </h2>
          <dl className="mt-16 grid grid-cols-1 border-t border-olive/25 sm:grid-cols-3">
            {c.figures.map((f, i) => (
              <div
                key={f.label}
                className={`relative flex flex-col pt-6 pb-2 sm:pr-6 ${i > 0 ? "border-t border-olive/15 sm:border-t-0 sm:border-l sm:pl-6" : ""}`}
              >
                <span aria-hidden className="absolute -top-[5px] left-0 h-[9px] w-px bg-olive sm:left-auto" />
                <dt className="order-2 mt-1 text-olive-soft">{f.label}</dt>
                <dd className="order-1 font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none tracking-tight">
                  {f.value === "avgPlot" ? (
                    <>
                      {fmt(averagePlot)}
                      <span className="ml-1 font-sans text-[0.4em] tracking-normal">m²</span>
                    </>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="label-mono mt-6 text-olive-soft">{c.note}</p>
        </div>
        <div className="lg:col-span-3 lg:col-start-10">
          <ArchReveal className="aspect-[3/4] w-full max-w-[420px] lg:mt-2">
            <Photo k="olive" sizes="(min-width:1024px) 22vw, 90vw" className="h-full w-full object-cover" />
          </ArchReveal>
        </div>
      </div>
    </section>
  );
}
