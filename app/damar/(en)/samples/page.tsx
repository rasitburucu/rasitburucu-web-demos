import type { Metadata } from "next";
import { en } from "@/content/damar/en";
import { SamplesPage } from "@/components/damar/pages/SamplesPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("en", "samples", { title: en.meta.samplesTitle, description: en.meta.samplesDescription });

export default function Samples() {
  return <SamplesPage locale="en" />;
}
