import { Hero } from "@/components/pazi/home/Hero";
import { Steps } from "@/components/pazi/home/Steps";
import { Models } from "@/components/pazi/home/Models";
import { Safety } from "@/components/pazi/home/Safety";
import { Scenarios } from "@/components/pazi/home/Scenarios";
import { Savings } from "@/components/pazi/home/Savings";
import { Service, Trial } from "@/components/pazi/home/Trial";

export default function PaziHome() {
  return (
    <>
      <Hero />
      <Steps />
      <Models />
      <Safety />
      <Scenarios />
      <Savings />
      <Trial />
      <Service />
    </>
  );
}
