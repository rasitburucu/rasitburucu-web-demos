import type { Metadata } from "next";
import { en } from "@/content/damar/en";
import { QuarryPage } from "@/components/damar/pages/QuarryPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("en", "quarry", { title: en.meta.quarryTitle, description: en.meta.quarryDescription });

export default function QuarryAndFactory() {
  return <QuarryPage locale="en" />;
}
