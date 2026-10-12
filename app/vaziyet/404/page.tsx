import type { Metadata } from "next";
import { tr } from "@/content/vaziyet/tr";
import { Bulunamadi } from "@/components/vaziyet/pages/Bulunamadi";

// Static export does not emit nested not-found pages, so the designed 404 also
// lives at /web/vaziyet/404/ for the host to serve on unknown /web/vaziyet/* paths.
export const metadata: Metadata = { title: { absolute: tr.meta.notFoundTitle }, robots: { index: false, follow: false } };

export default function Vaziyet404() {
  return <Bulunamadi />;
}
