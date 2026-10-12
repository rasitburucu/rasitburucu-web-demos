import type { Metadata } from "next";
import { tr } from "@/content/vaziyet/tr";
import { ModelListe } from "@/components/vaziyet/pages/ModelListe";

export const metadata: Metadata = { title: tr.meta.modeller, description: tr.meta.modellerAciklama };

export default function ModellerPage() {
  return <ModelListe />;
}
