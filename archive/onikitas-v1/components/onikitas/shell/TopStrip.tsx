import { tr } from "@/content/onikitas/tr";

/** Honesty strip: the brand is fictional. Present on every Onikitaş page. */
export function TopStrip() {
  return (
    <div className="relative z-[45] bg-olive text-lime no-print">
      <p className="mx-auto flex h-8 max-w-[1600px] items-center justify-center px-4 text-[0.8rem] leading-none">
        <a href={tr.strip.href} className="underline decoration-lime/40 hover:decoration-lime">
          {tr.strip.text}
        </a>
      </p>
    </div>
  );
}
