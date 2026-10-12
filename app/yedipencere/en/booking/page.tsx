import { meta } from "@/lib/yedipencere/meta";
import { BookingPage } from "@/components/yedipencere/pages/BookingPage";

export const metadata = meta("en", "booking");

export default function Page() {
  return <BookingPage lang="en" />;
}
