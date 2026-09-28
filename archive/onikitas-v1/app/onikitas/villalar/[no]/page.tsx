import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { villas, getVilla, typologies, compass, similarVillas } from "@/content/onikitas/villas";
import { tr } from "@/content/onikitas/tr";
import { VillaGallery } from "@/components/onikitas/villa/VillaGallery";
import { SideCard } from "@/components/onikitas/villa/SideCard";
import { FloorPlanViewer } from "@/components/onikitas/villa/FloorPlanViewer";
import { SpecSheet } from "@/components/onikitas/villa/SpecSheet";
import { TerraceView } from "@/components/onikitas/villa/TerraceView";
import { SimilarVillas } from "@/components/onikitas/villa/SimilarVillas";
import { Locator } from "@/components/onikitas/villa/Locator";
import { StatusMark } from "@/components/onikitas/plan/StatusMark";
import { ViewingCta } from "@/components/onikitas/home/ViewingCta";

export const dynamicParams = false;

export function generateStaticParams() {
  return villas.map((v) => ({ no: v.id }));
}

type Params = { params: Promise<{ no: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { no } = await params;
  const v = getVilla(no);
  if (!v) return {};
  const t = typologies[v.type];
  return {
    title: `N°${v.id} ${v.name}`,
    description: `${t.name} ${t.layout}, ${v.interior} m² iç alan, ${v.plot.toLocaleString("tr-TR")} m² arsa. ${tr.villa.notes[v.id]}`,
  };
}

export default async function VillaPage({ params }: Params) {
  const { no } = await params;
  const v = getVilla(no);
  if (!v) notFound();
  const t = typologies[v.type];
  const f = tr.villa.facts;
  const fmt = (n: number) => n.toLocaleString("tr-TR");

  const facts = [
    { k: f.rooms, v: `${t.bedrooms} / ${t.bathrooms}` },
    { k: f.interior, v: `${v.interior} m²` },
    { k: f.plot, v: `${fmt(v.plot)} m²` },
    { k: f.pool, v: `${t.poolLength} m` },
    { k: f.bearing, v: `${v.bearing}° ${compass(v.bearing)}` },
    { k: f.handover, v: v.handover },
  ];

  return (
    <main>
      <div className="mx-auto max-w-[1600px] px-4 pt-6 sm:px-8 lg:px-12">
        <nav aria-label="Sayfa yolu" className="text-sm text-olive-soft">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/onikitas" className="hover:text-olive hover:underline">
                Onikitaş
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/onikitas?v=${v.id}#plan`} className="hover:text-olive hover:underline">
                {tr.villa.breadcrumb}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="label-mono">
              N°{v.id}
            </li>
          </ol>
        </nav>

        <header className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-mono text-olive-soft">
              N°{v.id} · {t.name} {t.layout}
            </p>
            <h1 className="mt-2 text-[clamp(3.4rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.03em]">{v.name}</h1>
          </div>
          <StatusMark status={v.status} className="!text-base lg:pb-4" />
        </header>
      </div>

      <VillaGallery images={v.images} />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <dl className="grid grid-cols-2 gap-x-6 border-y border-olive/25 sm:grid-cols-3 xl:grid-cols-6">
              {facts.map((x) => (
                <div key={x.k} className="flex flex-col py-5">
                  <dt className="text-[0.82rem] text-olive-soft">{x.k}</dt>
                  <dd className="label-mono mt-1 !text-[1rem]">{x.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 max-w-[52ch] font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.2]">{tr.villa.notes[v.id]}</p>

            <Locator villa={v} />
            <FloorPlanViewer villa={v} />
            <SpecSheet />
            <TerraceView />
          </div>

          <aside className="lg:col-span-4">
            <SideCard villa={v} />
          </aside>
        </div>
      </div>

      <SimilarVillas villas={similarVillas(v)} />
      <ViewingCta villa={v.status === "sold" ? undefined : v.id} heading={tr.villa.ctaHeading(v.id)} />
    </main>
  );
}
