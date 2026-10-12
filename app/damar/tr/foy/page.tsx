import type { Metadata } from "next";
import { tr } from "@/content/damar/tr";
import { SheetPage } from "@/components/damar/pages/SheetPage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("tr", "sheet", { title: tr.meta.sheetTitle, description: tr.meta.sheetDescription });

export default function Foy() {
  return <SheetPage locale="tr" />;
}
