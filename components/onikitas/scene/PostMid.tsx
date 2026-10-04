"use client";

import { useRef } from "react";
import { Bloom, EffectComposer, Noise, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode, type BloomEffect, type EffectComposer as Composer, type NoiseEffect, type VignetteEffect } from "postprocessing";
import { useFadeIn, useWarmComposer } from "./warm";

const BLOOM = 0.7;
const VIGNETTE = 0.46;
const GRAIN = 0.22;

export default function PostMid({ onReady }: { onReady?: () => void }) {
  const ref = useRef<Composer>(null);
  const bloom = useRef<BloomEffect>(null);
  const vignette = useRef<VignetteEffect>(null);
  const noise = useRef<NoiseEffect>(null);
  const warm = useWarmComposer(ref);
  useFadeIn(
    warm,
    (k) => {
      if (bloom.current) bloom.current.intensity = BLOOM * k;
      if (vignette.current) vignette.current.darkness = VIGNETTE * k;
      if (noise.current) noise.current.blendMode.opacity.value = GRAIN * k;
    },
    onReady,
  );
  return (
    <EffectComposer ref={ref} enabled={warm} multisampling={0} enableNormalPass={false}>
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={1.05} luminanceSmoothing={0.2} intensity={BLOOM} radius={0.35} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette ref={vignette} offset={0.26} darkness={VIGNETTE} />
      <Noise ref={noise} premultiply blendFunction={BlendFunction.SCREEN} opacity={GRAIN} />
      <SMAA />
    </EffectComposer>
  );
}
