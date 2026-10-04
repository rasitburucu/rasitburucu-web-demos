import type { Metadata } from "next";
import { tr } from "@/content/kalemkar/tr";
import { NotFound } from "@/components/kalemkar/shell/NotFound";

// Static export does not emit nested not-found pages, so the designed 404 also
// lives at /web/kalemkar/404/ for the host to serve on unknown /web/kalemkar/* paths.
export const metadata: Metadata = { title: tr.meta.notFoundTitle, robots: { index: false, follow: false } };

export default function Kalemkar404() {
  return <NotFound />;
}
