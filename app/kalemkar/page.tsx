import { tr } from "@/content/kalemkar/tr";
import { Sini } from "@/components/kalemkar/sini/Sini";
import { SentenceForm } from "@/components/kalemkar/home/SentenceForm";
import { Servis } from "@/components/kalemkar/home/Servis";
import { FloorPlan } from "@/components/kalemkar/home/FloorPlan";
import { Chef, Know, OpeningSection } from "@/components/kalemkar/home/Sections";

export default function KalemkarHome() {
  const h = tr.hero;
  return (
    <>
      <section className="kk-hero" aria-labelledby="kk-hero-title">
        <div className="kk-wrap kk-hero-grid">
          <div className="kk-hero-text">
            <h1 id="kk-hero-title" className="kk-h1">
              {h.title}
            </h1>
            <p className="kk-hero-sub">{h.sub}</p>
            <SentenceForm />
          </div>
        </div>
        <div className="kk-hero-object">
          <Sini variant="hero" priority sizes="(max-width: 767px) 92vw, 72vw" />
        </div>
      </section>
      <Servis />
      <Chef />
      <FloorPlan />
      <Know />
      <OpeningSection />
    </>
  );
}
