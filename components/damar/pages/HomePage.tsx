import type { Locale } from "@/content/damar/routes";
import { HomeTool } from "../home/HomeTool";
import { BoxTeaser, Intro, ShipStrip } from "../home/Sections";

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <HomeTool locale={locale} intro={<Intro locale={locale} />} />
      <BoxTeaser locale={locale} />
      <ShipStrip locale={locale} />
    </>
  );
}
