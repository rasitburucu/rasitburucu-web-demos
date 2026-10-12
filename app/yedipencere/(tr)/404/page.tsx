import { meta } from "@/lib/yedipencere/meta";
import { NotFoundPage } from "@/components/yedipencere/pages/NotFoundPage";

export const metadata = meta("tr", "notFound");

export default function Page() {
  return <NotFoundPage lang="tr" />;
}
