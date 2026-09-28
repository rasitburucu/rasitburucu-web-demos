import { tr } from "@/content/onikitas/tr";
import { Photo } from "../Photo";

/** Material samples, hung like sample boards on a wall. */
export function Materials() {
  const m = tr.materials;
  return (
    <section id="malzeme" aria-labelledby="onk-mat-h" className="bg-travertine/45">
      <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8 lg:px-12 lg:py-36">
        <h2 id="onk-mat-h" className="text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
          {m.heading}
        </h2>
        <p className="measure mt-4 text-olive-soft">{m.intro}</p>

        <ol className="-mx-4 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible">
          {m.items.map((it, i) => (
            <li key={it.name} className={`w-[64vw] max-w-[300px] shrink-0 snap-start sm:w-[38vw] lg:w-auto lg:max-w-none ${i % 2 ? "lg:mt-16" : ""}`}>
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden bg-olive shadow-[0_18px_30px_-22px_#3b3a2e99]">
                  {it.image ? (
                    <Photo k={it.image} sizes="(min-width:1024px) 18vw, 60vw" className={`h-full w-full object-cover ${it.image === "travertine" ? "object-[6%_100%]" : ""}`} decorative />
                  ) : (
                    <div className="h-full w-full" style={{ background: "#6d5a40" }}>
                      <div className="absolute inset-x-[22%] inset-y-[14%] shadow-[inset_0_0_0_10px_#5a4a34]" />
                    </div>
                  )}
                  <span aria-hidden className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-lime shadow-[inset_0_1px_2px_#3b3a2e66]" />
                </div>
                <figcaption className="mt-4">
                  <span className="block font-display text-[1.5rem] leading-tight">{it.name}</span>
                  <span className="mt-1 block text-[0.92rem] text-olive-soft">{it.origin}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
