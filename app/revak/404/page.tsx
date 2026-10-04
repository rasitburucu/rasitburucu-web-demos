import type { Metadata } from "next";
import { tr } from "@/content/revak/tr";
import { NotFound } from "@/components/revak/shell/NotFound";

// Static export does not emit nested not-found pages, so the designed 404 also
// lives at /web/revak/404/ for the host to serve on unknown /web/revak/* paths.
export const metadata: Metadata = { title: tr.notFound.metaTitle, robots: { index: false, follow: false } };

export default function Revak404() {
  return <NotFound />;
}
