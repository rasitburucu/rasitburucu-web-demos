import type { Metadata } from "next";
import { tr } from "@/content/vaziyet/tr";
import { Rehber } from "@/components/vaziyet/pages/Rehber";

export const metadata: Metadata = { title: tr.meta.rehber, description: tr.meta.rehberAciklama };

export default function RehberPage() {
  return <Rehber />;
}
