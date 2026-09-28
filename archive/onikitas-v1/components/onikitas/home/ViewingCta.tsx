"use client";

import { useEffect, useId, useState } from "react";
import { tr } from "@/content/onikitas/tr";
import { nextDays, type DayOption } from "@/lib/onikitas/dates";
import { useBooking, type ViewingType } from "../shell/Shell";
import { Photo } from "../Photo";

export function ViewingCta({ villa, heading }: { villa?: string; heading?: string }) {
  const c = tr.cta;
  const opts = tr.booking.type.options;
  const { open } = useBooking();
  const [type, setType] = useState<ViewingType>("onsite");
  const [days, setDays] = useState<DayOption[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const id = useId();

  useEffect(() => {
    setDays(nextDays(6));
  }, []);

  return (
    <section aria-labelledby={`${id}-h`} className="relative overflow-hidden bg-lime-deep">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-32">
        <div className="lg:col-span-7">
          <h2 id={`${id}-h`} className="max-w-[16ch] text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98]">
            {heading ?? c.heading}
          </h2>
          <p className="measure mt-5 text-[1.1rem] text-olive-soft">{c.body}</p>

          <fieldset className="mt-10">
            <legend className="text-sm text-olive-soft">{c.typeLabel}</legend>
            <div className="mt-3 flex flex-wrap gap-2" role="group">
              {(Object.keys(opts) as ViewingType[]).map((k) => (
                <button key={k} type="button" aria-pressed={type === k} className="chip" onClick={() => setType(k)}>
                  {opts[k].label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-sm text-olive-soft">{c.dateLabel}</legend>
            <div className="mt-3 flex min-h-[4.25rem] flex-wrap gap-2" role="group">
              {days.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  aria-pressed={date === d.iso}
                  className="chip !flex-col !items-start !gap-0.5 !px-3.5 !py-2"
                  onClick={() => setDate(d.iso)}
                >
                  <span className="text-[0.75rem] opacity-75">{d.weekday}</span>
                  <span className="label-mono !text-[0.9rem]">
                    {d.day} {d.month}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            className="btn-tile mt-8"
            onClick={() => open({ type, date: date ?? undefined, villas: villa ? [villa] : undefined, step: 1 })}
          >
            {c.continue}
          </button>
        </div>
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="arch aspect-[3/4] overflow-hidden bg-travertine">
            <Photo k="hill-sea" sizes="30vw" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
