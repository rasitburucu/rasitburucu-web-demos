import { MobileBar, Planner } from "@/components/sazbahce/home/Planner";
import { AreasBand, KnowBand, SplitBand } from "@/components/sazbahce/home/Sections";
import { SummaryDialog } from "@/components/sazbahce/home/SummaryDialog";

export default function SazbahceHome() {
  return (
    <div className="sb-home">
      <Planner />
      <AreasBand />
      <KnowBand />
      <SplitBand />
      <MobileBar />
      <SummaryDialog />
    </div>
  );
}
