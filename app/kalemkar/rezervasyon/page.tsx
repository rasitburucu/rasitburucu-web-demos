import type { Metadata } from "next";
import { tr } from "@/content/kalemkar/tr";
import { Flow } from "@/components/kalemkar/flow/Flow";

export const metadata: Metadata = {
  title: tr.meta.bookTitle,
  description: tr.meta.bookDescription,
  robots: { index: false, follow: false },
};

export default function Rezervasyon() {
  return (
    <div className="kk-wrap kk-flow-page">
      <Flow />
    </div>
  );
}
