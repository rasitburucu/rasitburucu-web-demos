import { meta } from "@/lib/yedipencere/meta";
import { FaqPage } from "@/components/yedipencere/pages/FaqPage";

export const metadata = meta("en", "faq");

export default function Page() {
  return <FaqPage lang="en" />;
}
