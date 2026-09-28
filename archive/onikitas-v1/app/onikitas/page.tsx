import { Hero } from "@/components/onikitas/home/Hero";
import { Concept } from "@/components/onikitas/home/Concept";
import { StonePlan } from "@/components/onikitas/plan/StonePlan";
import { Typologies } from "@/components/onikitas/home/Typologies";
import { Materials } from "@/components/onikitas/home/Materials";
import { DayTimeline } from "@/components/onikitas/home/DayTimeline";
import { Location } from "@/components/onikitas/home/Location";
import { Gallery } from "@/components/onikitas/home/Gallery";
import { Trust } from "@/components/onikitas/home/Trust";
import { ViewingCta } from "@/components/onikitas/home/ViewingCta";

export default function OnikitasHome() {
  return (
    <main>
      <Hero />
      <Concept />
      <StonePlan />
      <Typologies />
      <Materials />
      <DayTimeline />
      <Location />
      <Gallery />
      <Trust />
      <ViewingCta />
    </main>
  );
}
