import { tr } from "@/content/onikitas/tr";
import { credits } from "@/content/onikitas/credits";

export function Footer() {
  const f = tr.footer;
  return (
    <footer className="on-dark bg-aegean text-lime">
      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.9] tracking-[-0.02em]">Onikitaş</p>
            <p className="mt-6 max-w-[40ch] text-aegean-soft">{f.concept}</p>
          </div>

          <dl className="grid gap-8 text-[0.95rem] sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3 lg:pt-4">
            <div>
              <dt className="text-aegean-soft">{f.office}</dt>
              <dd className="mt-2">
                {f.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
                <span className="mt-2 block text-aegean-soft">{f.hours}</span>
              </dd>
            </div>
            <div>
              <dt className="text-aegean-soft">{f.phoneLabel}</dt>
              <dd className="mt-2 label-mono !text-[0.9rem]">{f.phone}</dd>
              <dt className="mt-5 text-aegean-soft">{f.mailLabel}</dt>
              <dd className="mt-2 label-mono !text-[0.9rem]">{f.mail}</dd>
            </div>
            <div>
              <dt className="text-aegean-soft">{f.languagesLabel}</dt>
              <dd className="mt-2">{f.languages}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-lime/15 pt-6 text-[0.85rem] text-aegean-soft lg:flex-row lg:items-start lg:justify-between">
          <details className="group max-w-3xl">
            <summary className="cursor-pointer list-none hover:text-lime">
              <span className="underline decoration-lime/30 underline-offset-4 group-open:decoration-lime">
                {f.credits}: {f.creditsVia}
              </span>
            </summary>
            <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {credits.map((c) => (
                <li key={c.key}>
                  <a href={c.url} className="hover:text-lime" rel="noopener noreferrer" target="_blank">
                    {c.photographer}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <div className="flex gap-6">
            <a href="https://rasitburucu.com/tr" className="hover:text-lime">
              {f.studio}
            </a>
            <a href="#icerik" className="hover:text-lime">
              {f.top}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
