import { MobileBar, Planner } from "@/components/sazbahce/home/Planner";
import { AreasBand, KnowBand, SplitBand, SunsetBand } from "@/components/sazbahce/home/Sections";
import { SummaryDialog } from "@/components/sazbahce/home/SummaryDialog";

export default function SazbahceHome() {
  return (
    <div className="sb-home">
      <Planner />
      <AreasBand />
      <SunsetBand />
      <KnowBand />
      <SplitBand />
      <MobileBar />
      <SummaryDialog />
    </div>
  );
}
