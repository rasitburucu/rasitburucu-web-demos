import type { Metadata } from "next";
import { en } from "@/content/damar/en";
import { SheetPage } from "@/components/damar/pages/SheetPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("en", "sheet", { title: en.meta.sheetTitle, description: en.meta.sheetDescription });

export default function Sheet() {
  return <SheetPage locale="en" />;
}
