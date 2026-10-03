import type { Metadata } from "next";
import { tr } from "@/content/revak/tr";
import { UcretFlow } from "@/components/revak/flow/Ucret";

export const metadata: Metadata = { title: tr.flows.ucret.metaTitle, robots: { index: false, follow: false } };

export default function Page() {
  return <UcretFlow />;
}
