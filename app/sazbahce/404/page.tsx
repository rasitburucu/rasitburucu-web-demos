import type { Metadata } from "next";
import { tr } from "@/content/sazbahce/tr";
import { NotFound } from "@/components/sazbahce/shell/NotFound";

// Static export does not emit nested not-found pages, so the designed 404 also
// lives at /web/sazbahce/404/ for the host to serve on unknown /web/sazbahce/* paths.
export const metadata: Metadata = { title: tr.meta.notFoundTitle, robots: { index: false, follow: false } };

export default function Sazbahce404() {
  return <NotFound />;
}
