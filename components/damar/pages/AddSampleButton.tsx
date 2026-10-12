"use client";

import type { Locale } from "@/content/damar/routes";
import { STONES, type StoneId } from "@/content/damar/stones";
import { dict, range } from "@/lib/damar/dict";
import { addSample, showToast } from "@/lib/damar/store";
import { Box } from "../ui/Icons";

export function AddSampleButton({ locale, stone, pair }: { locale: Locale; stone: StoneId; pair: number }) {
  const d = dict(locale);
  const s = STONES[stone];
  const p = s.pairs.find(([a]) => a === pair) ?? s.pairs[0];
  return (
    <button
      type="button"
      className="dm-btn dm-btn--line"
      onClick={() => {
        const { result, count } = addSample(stone, p[0], "polished");
        const what = `${s.name} ${range(p[0], p[1])}, ${d.finishes.polished.name.toLocaleLowerCase(d.htmlLang)}`;
        showToast(result === "added" ? d.toast.added(what, count) : result === "already" ? d.toast.already : d.toast.full, true);
      }}
    >
      <Box />
      {d.stonePage.sample}
    </button>
  );
}
