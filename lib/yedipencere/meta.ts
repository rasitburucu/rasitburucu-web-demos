// Page metadata in both languages (every page is noindex: a concept demo).

import type { Metadata } from "next";
import { COPY } from "@/content/yedipencere/copy";
import type { Lang } from "./dates";
import { fill } from "./format";
import { ROOM, type RoomId } from "./house";
import { href, type PageKey } from "./paths";

type MetaPage = Exclude<PageKey, "room">;

const KEYS: Record<MetaPage, ["homeTitle" | "roomsTitle" | "arrivalTitle" | "houseTitle" | "faqTitle" | "bookingTitle" | "notFoundTitle", string | null]> = {
  home: ["homeTitle", "homeDescription"],
  rooms: ["roomsTitle", "roomsDescription"],
  arrival: ["arrivalTitle", "arrivalDescription"],
  house: ["houseTitle", "houseDescription"],
  faq: ["faqTitle", "faqDescription"],
  booking: ["bookingTitle", "bookingDescription"],
  notFound: ["notFoundTitle", null],
};

export function meta(lang: Lang, page: MetaPage): Metadata {
  const m = COPY[lang].meta as Record<string, string>;
  const [tk, dk] = KEYS[page];
  const title = m[tk];
  const description = dk ? m[dk] : undefined;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { languages: { tr: `/web${href("tr", page)}`, en: `/web${href("en", page)}` } },
    openGraph: { title, description, locale: lang === "tr" ? "tr_TR" : "en_GB", type: "website" },
  };
}

export function roomMeta(lang: Lang, room: RoomId, lead: string): Metadata {
  const title = fill(COPY[lang].meta.roomTitle, { oda: ROOM[room].name });
  return {
    title,
    description: lead,
    robots: { index: false, follow: false },
    alternates: { languages: { tr: `/web${href("tr", "room", room)}`, en: `/web${href("en", "room", room)}` } },
    openGraph: { title, description: lead, locale: lang === "tr" ? "tr_TR" : "en_GB", type: "website" },
  };
}
