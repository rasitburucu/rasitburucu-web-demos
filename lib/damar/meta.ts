import type { Metadata } from "next";
import { href, type Locale, type PageKey } from "@/content/damar/routes";
import type { StoneId } from "@/content/damar/stones";

const BASE = "/web";

/** Title, description, canonical and the language pair for one page. */
export function pageMeta(locale: Locale, key: PageKey, o: { title: string; description: string; id?: StoneId; absolute?: boolean }): Metadata {
  const other: Locale = locale === "en" ? "tr" : "en";
  const self = `${BASE}${href(locale, key, o.id)}`;
  const alt = `${BASE}${href(other, key, o.id)}`;
  return {
    title: o.absolute ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: { canonical: self, languages: { [locale]: self, [other]: alt } },
    openGraph: {
      title: o.title,
      description: o.description,
      url: self,
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_GB",
      alternateLocale: other === "tr" ? "tr_TR" : "en_GB",
    },
  };
}
