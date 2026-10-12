// Damar: every page in both languages. English is the default (/damar/),
// Turkish sits under /damar/tr/ with Turkish slugs. Paths are Next routes
// (basePath /web is added by Next); public files go through lib/asset.ts.
import type { StoneId } from "./stones";

export type Locale = "en" | "tr";
export const LOCALES: Locale[] = ["en", "tr"];

export type PageKey = "home" | "stones" | "stone" | "quarry" | "shipping" | "samples" | "sheet";

const PATHS: Record<Locale, Record<PageKey, string>> = {
  en: {
    home: "/damar/",
    stones: "/damar/stones/",
    stone: "/damar/stones/:id/",
    quarry: "/damar/quarry-and-factory/",
    shipping: "/damar/shipping/",
    samples: "/damar/samples/",
    sheet: "/damar/sheet/",
  },
  tr: {
    home: "/damar/tr/",
    stones: "/damar/tr/taslar/",
    stone: "/damar/tr/taslar/:id/",
    quarry: "/damar/tr/ocak-ve-fabrika/",
    shipping: "/damar/tr/sevkiyat/",
    samples: "/damar/tr/numune/",
    sheet: "/damar/tr/foy/",
  },
};

export function href(locale: Locale, key: PageKey, id?: StoneId) {
  const p = PATHS[locale][key];
  return id ? p.replace(":id", id) : p.replace(":id/", "");
}

export const localeOf = (pathname: string): Locale => (/^\/damar\/tr(\/|$)/.test(pathname) ? "tr" : "en");

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

/** Which page a path is, and for stone pages which stone. */
export function pageOf(pathname: string): { key: PageKey; id?: StoneId } | null {
  const path = norm(pathname.split(/[?#]/)[0]);
  const locale = localeOf(path);
  for (const key of Object.keys(PATHS[locale]) as PageKey[]) {
    const pattern = PATHS[locale][key];
    if (pattern.includes(":id")) {
      const [head] = pattern.split(":id");
      if (path.startsWith(head)) {
        const id = path.slice(head.length).replace(/\/$/, "");
        if (id && !id.includes("/")) return { key, id: id as StoneId };
      }
    } else if (path === pattern) return { key };
  }
  return null;
}

/** The same page in the other language (home when the page is unknown). */
export function counterpart(pathname: string): string {
  const from = localeOf(pathname);
  const to: Locale = from === "en" ? "tr" : "en";
  const page = pageOf(pathname);
  return page ? href(to, page.key, page.id) : href(to, "home");
}

export const NAV_KEYS: PageKey[] = ["home", "stones", "quarry", "shipping", "sheet"];
