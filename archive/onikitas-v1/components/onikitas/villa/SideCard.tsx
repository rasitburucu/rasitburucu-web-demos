"use client";

import Link from "next/link";
import { tr } from "@/content/onikitas/tr";
import { typologies, type Villa } from "@/content/onikitas/villas";
import { useBooking, useSmoothScroll } from "../shell/Shell";
import { StatusMark } from "../plan/StatusMark";

export function SideCard({ villa }: { villa: Villa }) {
  const c = tr.villa.card;
  const t = typologies[villa.type];
  const { open } = useBooking();
  const { scrollTo } = useSmoothScroll();
  const sold = villa.status === "sold";

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-lime-deep p-6 shadow-[inset_0_0_0_1px_#3b3a2e1f] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="font-display text-[1.7rem] leading-tight">
            N°{villa.id} {villa.name}
          </p>
          <StatusMark status={villa.status} className="mt-1.5" />
        </div>
        <p className="label-mono mt-1 text-olive-soft">
          {t.name} {t.layout} · {villa.interior} m²
        </p>
        <div className="mt-6 border-t border-olive/20 pt-5">
          <p className="text-[1.15rem]">{c.price}</p>
          <p className="mt-1 text-[0.88rem] text-olive-soft">{sold ? c.soldNote : c.priceNote}</p>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" className="btn-tile justify-center" onClick={() => open({ villas: sold ? [] : [villa.id] })}>
            {c.book}
          </button>
          <a
            href="#kat-plani"
            className="btn-line justify-center"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#kat-plani");
            }}
          >
            {c.download}
          </a>
        </div>
      </div>
      <Link href={`/onikitas?v=${villa.id}#plan`} className="mt-4 inline-flex items-center gap-2 text-sm text-olive-soft hover:text-olive">
        <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
          <path d="M5 1 L1 5 L5 9 M1 5 H15" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        {tr.villa.backToPlan}
      </Link>
    </div>
  );
}
