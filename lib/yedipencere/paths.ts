// Every page exists in Turkish (default) and English. English paths sit under
// /en/ with English words, so a shared link reads naturally in either language.
// Paths here are without the /web basePath (Next adds it to <Link>).

import type { Lang } from "./dates";
import { isRoomId, type RoomId } from "./house";

export const BASE = "/yedipencere";

export type PageKey = "home" | "rooms" | "room" | "arrival" | "house" | "faq" | "booking" | "notFound";

const SEG: Record<Exclude<PageKey, "home" | "room">, Record<Lang, string>> = {
  rooms: { tr: "odalar", en: "rooms" },
  arrival: { tr: "varis", en: "getting-here" },
  house: { tr: "konak", en: "the-house" },
  faq: { tr: "sik-sorulanlar", en: "faq" },
  booking: { tr: "rezervasyon", en: "booking" },
  notFound: { tr: "404", en: "404" },
};

const root = (lang: Lang) => (lang === "tr" ? `${BASE}/` : `${BASE}/en/`);

export function href(lang: Lang, page: PageKey, room?: RoomId): string {
  if (page === "home") return root(lang);
  if (page === "room") return `${root(lang)}${SEG.rooms[lang]}/${room ?? "korfez"}/`;
  return `${root(lang)}${SEG[page][lang]}/`;
}

/** Which page a pathname is, in either language (basePath already removed). */
export function parsePath(pathname: string): { lang: Lang; page: PageKey; room?: RoomId } {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (parts[0] === "web") parts.shift();
  if (parts[0] === BASE.slice(1)) parts.shift();
  let lang: Lang = "tr";
  if (parts[0] === "en") {
    lang = "en";
    parts.shift();
  }
  const [a, b] = parts;
  if (!a) return { lang, page: "home" };
  const found = (Object.keys(SEG) as (keyof typeof SEG)[]).find((k) => SEG[k][lang] === a || SEG[k].tr === a || SEG[k].en === a);
  if (found === "rooms" && b && isRoomId(b)) return { lang, page: "room", room: b };
  if (found) return { lang, page: found };
  return { lang, page: "notFound" };
}

/** The same page in the other language. */
export function counterpart(pathname: string, to: Lang): string {
  const p = parsePath(pathname);
  return href(to, p.page, p.room);
}
