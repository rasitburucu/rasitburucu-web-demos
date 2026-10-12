import { meta } from "@/lib/yedipencere/meta";
import { RoomsPage } from "@/components/yedipencere/pages/RoomsPage";

export const metadata = meta("en", "rooms");

export default function Page() {
  return <RoomsPage lang="en" />;
}
