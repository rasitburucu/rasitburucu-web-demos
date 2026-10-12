import { meta } from "@/lib/yedipencere/meta";
import { HousePage } from "@/components/yedipencere/pages/HousePage";

export const metadata = meta("tr", "house");

export default function Page() {
  return <HousePage lang="tr" />;
}
