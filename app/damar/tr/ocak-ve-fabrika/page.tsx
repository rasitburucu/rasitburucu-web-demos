import type { Metadata } from "next";
import { tr } from "@/content/damar/tr";
import { QuarryPage } from "@/components/damar/pages/QuarryPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("tr", "quarry", { title: tr.meta.quarryTitle, description: tr.meta.quarryDescription });

export default function OcakVeFabrika() {
  return <QuarryPage locale="tr" />;
}
