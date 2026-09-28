import { preload } from "react-dom";
import { tr } from "@/content/onikitas/tr";
import { imgSrc, imgSrcSet } from "@/content/onikitas/images";
import { Photo } from "../Photo";
import { HeroMotion, HeroActions } from "./HeroMotion";

const HERO_SIZES = "(min-width: 1024px) 44vw, 92vw";

export function Hero() {
  // Only the hero image is preloaded (LCP). Everything else lazy-loads.
  preload(imgSrc("hero-house", 2000), {
    as: "image",
    imageSrcSet: imgSrcSet("hero-house"),
    imageSizes: HERO_SIZES,
    fetchPriority: "high",
  });

  const h = tr.hero;
  return (
    <HeroMotion
      image={
        <Photo
          k="hero-house"
          priority
          sizes={HERO_SIZES}
          className="h-full w-full object-cover object-[50%_40%]"
        />
      }
    >
      <h1 id="onk-hero-title" className="onk-rise font-display text-[clamp(4.2rem,12.4vw,12.75rem)] leading-[0.86] tracking-[-0.035em]">
        {h.brand}
      </h1>
      <p className="onk-rise mt-6 max-w-[30ch] text-[1.15rem] leading-snug sm:text-[1.3rem]" style={{ animationDelay: "120ms" }}>
        {h.line}
      </p>
      <p className="onk-rise label-mono mt-3 text-olive-soft" style={{ animationDelay: "180ms" }}>
        {h.meta}
      </p>
      <HeroActions />
    </HeroMotion>
  );
}
