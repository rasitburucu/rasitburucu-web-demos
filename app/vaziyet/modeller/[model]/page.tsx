import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODELLER, modelBul } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";
import { ModelSayfa } from "@/components/vaziyet/pages/ModelSayfa";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELLER.map((m) => ({ model: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const m = modelBul(model);
  if (!m) return {};
  return { title: tr.meta.model(`${m.ad} ${m.m2}`), description: tr.meta.modelAciklama(`${m.ad} ${m.m2}`, m.oda) };
}

export default async function ModelPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const m = modelBul(model);
  if (!m) notFound();
  return <ModelSayfa m={m} />;
}
