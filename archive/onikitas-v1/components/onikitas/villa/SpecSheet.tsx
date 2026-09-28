import { tr } from "@/content/onikitas/tr";
import { Photo } from "../Photo";

export function SpecSheet() {
  const s = tr.villa.spec;
  const swatches = tr.materials.items;
  return (
    <section aria-labelledby="onk-spec-h" className="mt-24">
      <h2 id="onk-spec-h" className="text-[clamp(2rem,3.4vw,3rem)] leading-none">
        {s.heading}
      </h2>
      <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
        {s.groups.map((g) => (
          <div key={g.title}>
            <h3 className="border-b border-olive pb-2 font-sans text-[0.95rem] font-medium tracking-normal">{g.title}</h3>
            <dl className="mt-4 space-y-4">
              {g.rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.82rem] text-olive-soft">{k}</dt>
                  <dd className="mt-0.5 text-[0.95rem] leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <p className="text-[0.82rem] text-olive-soft">{s.swatches}</p>
        <ul className="mt-3 flex flex-wrap gap-4">
          {swatches.map((m) => (
            <li key={m.name} className="flex items-center gap-2 text-[0.88rem]">
              <span className="block h-9 w-9 overflow-hidden rounded-full shadow-[inset_0_0_0_1px_#3b3a2e33]">
                {m.image ? (
                  <Photo k={m.image} sizes="36px" decorative className={`h-full w-full object-cover ${m.image === "travertine" ? "object-[6%_100%]" : ""}`} />
                ) : (
                  <span className="block h-full w-full" style={{ background: "#6d5a40" }} />
                )}
              </span>
              {m.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
