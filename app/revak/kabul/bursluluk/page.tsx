import type { Metadata } from "next";
import { tr } from "@/content/revak/tr";
import { BurslulukFlow } from "@/components/revak/flow/Bursluluk";

export const metadata: Metadata = { title: tr.flows.burs.metaTitle, robots: { index: false, follow: false } };

export default function Page() {
  return <BurslulukFlow />;
}
