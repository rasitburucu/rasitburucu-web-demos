import { meta } from "@/lib/yedipencere/meta";
import { BookingPage } from "@/components/yedipencere/pages/BookingPage";

export const metadata = meta("tr", "booking");

export default function Page() {
  return <BookingPage lang="tr" />;
}
