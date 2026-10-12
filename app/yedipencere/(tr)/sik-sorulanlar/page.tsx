import { meta } from "@/lib/yedipencere/meta";
import { FaqPage } from "@/components/yedipencere/pages/FaqPage";

export const metadata = meta("tr", "faq");

export default function Page() {
  return <FaqPage lang="tr" />;
}
