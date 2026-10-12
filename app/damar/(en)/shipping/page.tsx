import type { Metadata } from "next";
import { en } from "@/content/damar/en";
import { ShippingPage } from "@/components/damar/pages/ShippingPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("en", "shipping", { title: en.meta.shippingTitle, description: en.meta.shippingDescription });

export default function Shipping() {
  return <ShippingPage locale="en" />;
}
