"use client";

import { useRouter } from "next/navigation";
import { tr } from "@/content/sazbahce/tr";
import { asset } from "@/lib/asset";
import { usePlan, type Plan } from "@/lib/sazbahce/store";

/** Writes a choice into the shared plan, then opens the given page. */
export function PlanWith({ patch, href, label, className }: { patch: Partial<Plan>; href: string; label: string; className?: string }) {
  const { set } = usePlan();
  const router = useRouter();
  return (
    <a
      href={asset(href)}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        set(patch);
        router.push(href);
      }}
    >
      {label}
    </a>
  );
}

export const homePlan = `${tr.base}/#planla`;
export const requestPage = `${tr.base}/teklif/`;
