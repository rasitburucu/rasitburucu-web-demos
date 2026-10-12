import { meta } from "@/lib/yedipencere/meta";
import { HomePage } from "@/components/yedipencere/pages/HomePage";

export const metadata = meta("tr", "home");

export default function Page() {
  return <HomePage lang="tr" />;
}
