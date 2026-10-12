import type { Metadata } from "next";
import { tr } from "@/content/damar/tr";
import { SamplesPage } from "@/components/damar/pages/SamplesPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("tr", "samples", { title: tr.meta.samplesTitle, description: tr.meta.samplesDescription });

export default function Numune() {
  return <SamplesPage locale="tr" />;
}
