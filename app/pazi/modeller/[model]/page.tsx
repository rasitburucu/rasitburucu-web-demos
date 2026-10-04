import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tr } from "@/content/pazi/tr";
import { MODELS, modelById } from "@/lib/pazi/plan";
import { ModelPage } from "@/components/pazi/model/ModelPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELS.map((m) => ({ model: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const m = modelById(model);
  if (!m) return {};
  return { title: `Pazı ${m.name}`, description: `${tr.models.fit[m.id]}. ${tr.models.note}` };
}

export default async function Page({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const m = modelById(model);
  if (!m) notFound();
  return <ModelPage model={m} />;
}
