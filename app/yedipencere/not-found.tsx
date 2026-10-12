import type { Metadata } from "next";
import { Shell } from "@/components/yedipencere/shell/Shell";
import { NotFoundPage } from "@/components/yedipencere/pages/NotFoundPage";
import { meta } from "@/lib/yedipencere/meta";

// Static export does not emit nested not-found pages; the designed 404 also
// lives at /web/yedipencere/404/ and /web/yedipencere/en/404/ for the host.
export const metadata: Metadata = meta("tr", "notFound");

export default function YediPencereNotFound() {
  return (
    <Shell lang="tr">
      <NotFoundPage lang="tr" />
    </Shell>
  );
}
