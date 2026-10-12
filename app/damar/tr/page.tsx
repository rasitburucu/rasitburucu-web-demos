import type { Metadata } from "next";
import { tr } from "@/content/damar/tr";
import { HomePage } from "@/components/damar/pages/HomePage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("tr", "home", { title: tr.meta.homeTitle, description: tr.meta.homeDescription, absolute: true });

export default function DamarAnaSayfa() {
  return <HomePage locale="tr" />;
}
