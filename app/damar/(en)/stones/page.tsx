import type { Metadata } from "next";
import { en } from "@/content/damar/en";
import { StonesPage } from "@/components/damar/pages/StonesPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("en", "stones", { title: en.meta.stonesTitle, description: en.meta.stonesDescription });

export default function Stones() {
  return <StonesPage locale="en" />;
}
