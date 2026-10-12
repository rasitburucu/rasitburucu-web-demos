import type { Metadata } from "next";
import { tr } from "@/content/vaziyet/tr";
import { Pafta } from "@/components/vaziyet/pages/Pafta";

export const metadata: Metadata = { title: tr.meta.pafta };

export default function PaftaPage() {
  return <Pafta />;
}
