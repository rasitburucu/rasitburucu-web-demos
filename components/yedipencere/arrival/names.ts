// Display names for the pieces of a walk.

import type { Lang } from "@/lib/yedipencere/dates";
import type { Leg } from "@/lib/yedipencere/route";
import { KIND_NAMES, PLACE_NAMES } from "@/content/yedipencere/arrival";

export function legName(leg: Pick<Leg, "name" | "kind">, lang: Lang): string {
  if (leg.name) return PLACE_NAMES[leg.name]?.[lang] ?? leg.name;
  return KIND_NAMES[leg.kind]?.[lang] ?? KIND_NAMES.footway[lang];
}

/** Shorter street names for the strip: "Uzunçarşı Sk.", "Cumhuriyet Cd.". */
export function shortName(leg: Pick<Leg, "name" | "kind">, lang: Lang): string {
  let n = legName(leg, lang);
  if (!leg.name) return n;
  n = n.replace(/ Sokak$/, " Sk.").replace(/ Sokağı$/, " Sk.").replace(/ Caddesi$/, " Cd.").replace(/ Geçidi$/, " Geç.").replace(/ Geçiti Sokak$/, " Geç. Sk.");
  if (n.length > 20) n = n.replace("Şehit Binbaşı Cengiz Toytunç", "Ş. Bnb. C. Toytunç");
  return n;
}
