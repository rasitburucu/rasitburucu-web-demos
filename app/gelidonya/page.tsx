import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { Hero } from "@/components/gelidonya/home/Hero";
import { Tezgah } from "@/components/gelidonya/home/Tezgah";
import { Seralar, Urunler, Yol, Ziyaret } from "@/components/gelidonya/home/Sections";

export const metadata: Metadata = {
  title: { absolute: tr.meta.title },
  alternates: { canonical: "/web/gelidonya/" },
};

export default function GelidonyaHome() {
  return (
    <div className="gd-home">
      <Hero />
      <Tezgah />
      <Seralar />
      <Yol />
      <Urunler />
      <Ziyaret />
    </div>
  );
}
