import type { Metadata } from "next";
import { tr } from "@/content/damar/tr";
import { StonesPage } from "@/components/damar/pages/StonesPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("tr", "stones", { title: tr.meta.stonesTitle, description: tr.meta.stonesDescription });

export default function Taslar() {
  return <StonesPage locale="tr" />;
}
