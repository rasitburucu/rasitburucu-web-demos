import type { Metadata } from "next";
import { tr } from "@/content/pazi/tr";
import { FlowSheet } from "@/components/pazi/print/FlowSheet";

export const metadata: Metadata = { title: tr.sheet.configTitle };

export default function FlowSheetPage() {
  return <FlowSheet />;
}
