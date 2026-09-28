"use client";

import { useEffect, useRef } from "react";
import { Bloom, EffectComposer, N8AO, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode, type EffectComposer as Composer } from "postprocessing";
import { useWarmComposer } from "./warm";

// Highest tier only: ambient occlusion makes the white cubes read as plaster.
export default function PostHigh({ onReady }: { onReady?: () => void }) {
  const ref = useRef<Composer>(null);
  const warm = useWarmComposer(ref);
  useEffect(() => {
    if (warm) onReady?.();
  }, [warm, onReady]);
  return (
    <EffectComposer ref={ref} enabled={warm} multisampling={4} enableNormalPass={false}>
      <N8AO halfRes aoRadius={2.4} distanceFalloff={1.1} intensity={2.4} quality="medium" color="#2a2620" />
      <Bloom mipmapBlur luminanceThreshold={1.05} luminanceSmoothing={0.2} intensity={0.7} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.26} darkness={0.46} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.22} />
    </EffectComposer>
  );
}
