"use client";

import { useEffect } from "react";

/** The shared root layout writes <html lang="tr">; English pages correct it
 *  on the client (the wrapper div carries lang for the server-rendered HTML). */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const before = html.lang;
    html.lang = lang;
    return () => {
      html.lang = before;
    };
  }, [lang]);
  return null;
}
