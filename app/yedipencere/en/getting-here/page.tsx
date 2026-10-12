import { meta } from "@/lib/yedipencere/meta";
import { ArrivalPage } from "@/components/yedipencere/pages/ArrivalPage";

export const metadata = meta("en", "arrival");

export default function Page() {
  return <ArrivalPage lang="en" />;
}
