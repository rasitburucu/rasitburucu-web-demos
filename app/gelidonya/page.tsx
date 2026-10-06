import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { Hero } from "@/components/gelidonya/home/Hero";
import { HesapProvider } from "@/lib/gelidonya/hesap-ctx";
import {
  HazirOnizleme,
  Kendi,
  SurecSection,
  UrunKapisi,
  Ziyaret,
} from "@/components/gelidonya/home/Sections";

export const metadata: Metadata = {
  title: { absolute: tr.meta.title },
  alternates: { canonical: "/web/gelidonya/" },
};

export default function GelidonyaHome() {
  return (
    <HesapProvider>
      <div className="gd-home">
        <Hero />
        <HazirOnizleme />
        <SurecSection />
        <Kendi />
        <UrunKapisi />
        <Ziyaret />
      </div>
    </HesapProvider>
  );
}
