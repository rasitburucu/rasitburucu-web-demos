"use client";

import { useRef } from "react";
import { Bloom, EffectComposer, N8AO, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode, type BloomEffect, type EffectComposer as Composer, type NoiseEffect, type VignetteEffect } from "postprocessing";
import { useFadeIn, useWarmComposer } from "./warm";

/** The part of n8ao's pass we drive (the package ships no types). */
type AOPass = { configuration: { intensity: number } };

// Final strengths; the effects fade in from zero (see useFadeIn in ./warm).
const AO = 2.4;
const BLOOM = 0.7;
const VIGNETTE = 0.46;
const GRAIN = 0.22;

// Highest tier only: ambient occlusion makes the white cubes read as plaster.
export default function PostHigh({ onReady }: { onReady?: () => void }) {
  const ref = useRef<Composer>(null);
  const ao = useRef<AOPass>(null);
  const bloom = useRef<BloomEffect>(null);
  const vignette = useRef<VignetteEffect>(null);
  const noise = useRef<NoiseEffect>(null);
  const warm = useWarmComposer(ref);
  useFadeIn(
    warm,
    (k) => {
      if (ao.current) ao.current.configuration.intensity = AO * k;
      if (bloom.current) bloom.current.intensity = BLOOM * k;
      if (vignette.current) vignette.current.darkness = VIGNETTE * k;
      if (noise.current) noise.current.blendMode.opacity.value = GRAIN * k;
    },
    onReady,
  );
  return (
    <EffectComposer ref={ref} enabled={warm} multisampling={4} enableNormalPass={false}>
      <N8AO ref={ao} halfRes aoRadius={2.4} distanceFalloff={1.1} intensity={AO} quality="medium" color="#2a2620" />
      {/* radius halved (0.7 -> 0.35): the glow stays on lamps and sun, the hillside stays sharp */}
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={1.05} luminanceSmoothing={0.2} intensity={BLOOM} radius={0.35} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette ref={vignette} offset={0.26} darkness={VIGNETTE} />
      <Noise ref={noise} premultiply blendFunction={BlendFunction.SCREEN} opacity={GRAIN} />
    </EffectComposer>
  );
}
