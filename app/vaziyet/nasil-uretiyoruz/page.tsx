import type { Metadata } from "next";
import { tr } from "@/content/vaziyet/tr";
import { Uretim } from "@/components/vaziyet/pages/Uretim";

export const metadata: Metadata = { title: tr.meta.uretim, description: tr.meta.uretimAciklama };

export default function UretimPage() {
  return <Uretim />;
}
