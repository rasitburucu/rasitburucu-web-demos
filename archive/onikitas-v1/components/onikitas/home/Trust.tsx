import { tr } from "@/content/onikitas/tr";

export function Trust() {
  const t = tr.trust;
  return (
    <section aria-labelledby="onk-trust-h" className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8 lg:px-12 lg:py-36">
      <h2 id="onk-trust-h" className="text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
        {t.heading}
      </h2>

      <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-8">
        <dl className="lg:col-span-7">
          {t.people.map((p) => (
            <div key={p.role} className="grid gap-1 border-t border-olive/20 py-6 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-sm text-olive-soft sm:pt-2">{p.role}</dt>
              <dd>
                <span className="block font-display text-[1.9rem] leading-tight">{p.name}</span>
                <span className="mt-1 block text-olive-soft">{p.detail}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="lg:col-span-4 lg:col-start-9">
          <h3 className="text-[1.6rem]">{t.permitsHeading}</h3>
          <dl className="mt-4 border-t border-olive/20">
            {t.permits.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-4 border-b border-olive/12 py-3">
                <dt className="text-olive-soft">{p.label}</dt>
                <dd className="label-mono !text-[0.9rem] text-right">{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="text-[1.6rem]">{t.timelineHeading}</h3>
        <ol className="relative mt-8 grid gap-6 border-l border-olive/30 pl-6 lg:grid-cols-6 lg:gap-4 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-8">
          {t.timeline.map((s) => (
            <li key={s.label} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[31px] top-1.5 block h-3 w-3 lg:-top-[39px] lg:left-0 ${
                  s.current ? "bg-lime ring-2 ring-tile ring-offset-2 ring-offset-lime" : s.done ? "bg-olive" : "bg-lime ring-1 ring-olive/50"
                }`}
              />
              <p className="label-mono text-olive-soft">
                {s.date}
                {s.current ? <span className="ml-2 text-tile-ink">{t.today}</span> : null}
              </p>
              <p className={`mt-1 ${s.current ? "font-medium" : ""}`}>{s.label}</p>
            </li>
          ))}
        </ol>
        <p className="label-mono mt-10 text-olive-soft">{t.note}</p>
      </div>
    </section>
  );
}
