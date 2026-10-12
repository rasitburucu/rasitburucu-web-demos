import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tr } from "@/content/damar/tr";
import { isStoneId, STONE_IDS, STONES } from "@/content/damar/stones";
import { StonePage } from "@/components/damar/pages/StonePage";
import { pageMeta } from "@/lib/damar/meta";

export const dynamicParams = false;
export const generateStaticParams = () => STONE_IDS.map((stone) => ({ stone }));

type Props = { params: Promise<{ stone: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stone } = await params;
  if (!isStoneId(stone)) return {};
  const s = STONES[stone];
  return pageMeta("tr", "stone", { id: stone, title: tr.meta.stoneTitle(s.name), description: tr.meta.stoneDescription(s.name, tr.stones[stone].line) });
}

export default async function Tas({ params }: Props) {
  const { stone } = await params;
  if (!isStoneId(stone)) notFound();
  return <StonePage locale="tr" id={stone} />;
}
