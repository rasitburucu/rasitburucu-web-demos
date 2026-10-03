import type { Metadata } from "next";
import { tr } from "@/content/revak/tr";
import { OnKayitFlow } from "@/components/revak/flow/OnKayit";

export const metadata: Metadata = { title: tr.flows.onKayit.metaTitle, robots: { index: false, follow: false } };

export default function Page() {
  return <OnKayitFlow />;
}
