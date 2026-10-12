import type { Metadata } from "next";
import { en } from "@/content/damar/en";
import { Shell } from "@/components/damar/shell/Shell";
import { NotFound } from "@/components/damar/shell/NotFound";

// Static export does not emit nested not-found pages, so the designed 404 also
// lives at /web/damar/404/ for the host to serve on unknown /web/damar/* paths.
export const metadata: Metadata = { title: { absolute: `${en.meta.notFoundTitle} | Damar` }, robots: { index: false, follow: false } };

export default function Damar404() {
  return (
    <Shell locale="en">
      <NotFound />
    </Shell>
  );
}
