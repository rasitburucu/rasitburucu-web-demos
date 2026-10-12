import type { Metadata } from "next";
import { tr } from "@/content/damar/tr";
import { ShippingPage } from "@/components/damar/pages/ShippingPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("tr", "shipping", { title: tr.meta.shippingTitle, description: tr.meta.shippingDescription });

export default function Sevkiyat() {
  return <ShippingPage locale="tr" />;
}
