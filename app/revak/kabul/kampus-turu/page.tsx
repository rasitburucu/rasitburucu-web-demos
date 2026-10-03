import type { Metadata } from "next";
import { tr } from "@/content/revak/tr";
import { TurFlow } from "@/components/revak/flow/Tur";

export const metadata: Metadata = { title: tr.flows.tur.metaTitle, robots: { index: false, follow: false } };

export default function Page() {
  return <TurFlow />;
}
