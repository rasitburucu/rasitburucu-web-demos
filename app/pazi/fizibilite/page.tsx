import type { Metadata } from "next";
import { tr } from "@/content/pazi/tr";
import { Flow } from "@/components/pazi/flow/Flow";

export const metadata: Metadata = {
  title: tr.flow.title,
  description: tr.flow.lead,
};

export default function FizibilitePage() {
  return <Flow />;
}
