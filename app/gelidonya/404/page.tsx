import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { NotFound } from "@/components/gelidonya/shell/NotFound";

// Static export does not emit nested not-found pages, so the designed 404 also
// lives at /web/gelidonya/404/ for the host to serve on unknown /web/gelidonya/* paths.
export const metadata: Metadata = { title: { absolute: tr.meta.notFoundTitle }, robots: { index: false, follow: false } };

export default function Gelidonya404() {
  return <NotFound />;
}
