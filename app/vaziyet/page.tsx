import { Arac } from "@/components/vaziyet/arac/Arac";
import { Fiyat } from "@/components/vaziyet/home/Fiyat";
import { Surec } from "@/components/vaziyet/home/Surec";
import { Kapanis, ModellerBand, RuhsatBand, UretimBand } from "@/components/vaziyet/home/Bantlar";

export default function VaziyetHome() {
  return (
    <>
      <Arac />
      <Fiyat />
      <Surec />
      <RuhsatBand />
      <ModellerBand />
      <UretimBand />
      <Kapanis />
    </>
  );
}
