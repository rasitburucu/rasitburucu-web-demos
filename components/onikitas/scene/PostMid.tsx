"use client";

import { useEffect, useRef } from "react";
import { Bloom, EffectComposer, Noise, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode, type EffectComposer as Composer } from "postprocessing";
import { useWarmComposer } from "./warm";

export default function PostMid({ onReady }: { onReady?: () => void }) {
  const ref = useRef<Composer>(null);
  const warm = useWarmComposer(ref);
  useEffect(() => {
    if (warm) onReady?.();
  }, [warm, onReady]);
  return (
    <EffectComposer ref={ref} enabled={warm} multisampling={0} enableNormalPass={false}>
      <Bloom mipmapBlur luminanceThreshold={1.05} luminanceSmoothing={0.2} intensity={0.7} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.26} darkness={0.46} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.22} />
      <SMAA />
    </EffectComposer>
  );
}
