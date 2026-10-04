import type { Metadata } from "next";
import "./biz-kimiz.css";
import { tr } from "@/content/pazi/tr";
import { asset } from "@/lib/asset";
import { Teardown, TeardownList } from "@/components/pazi/about/Teardown";
import { Principles, WorkshopNote } from "@/components/pazi/about/Sections";

const m = tr.about.meta;

export const metadata: Metadata = {
  title: m.title,
  description: m.description,
  openGraph: {
    title: `${m.title} | ${tr.brand.name}`,
    description: m.description,
    images: [{ url: asset("/pazi/og-biz-kimiz.jpg"), width: 1200, height: 630, alt: m.ogAlt }],
    locale: "tr_TR",
    type: "website",
  },
};

export default function BizKimizPage() {
  return (
    <>
      <Teardown />
      <TeardownList />
      <Principles />
      <WorkshopNote />
    </>
  );
}
