"use client";

import { useEffect, useRef, useState } from "react";
import { store } from "@/lib/onikitas/store";
import { tr } from "@/content/onikitas/tr";

// Optional ambience, off by default. Generated with Web Audio (no audio files):
// filtered brown noise for the sea swell, band-passed noise for the wind, whose
// strength follows the hour (the afternoon meltem).

type Rig = { ctx: AudioContext; master: GainNode; wind: GainNode; raf: number };

function brownNoise(ctx: AudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    d[i] = last * 3.2;
  }
  return buf;
}

function build(): Rig {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const buf = brownNoise(ctx, 6);
  // sea: low-passed swell with a slow breathing LFO
  const sea = ctx.createBufferSource();
  sea.buffer = buf;
  sea.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  const swell = ctx.createGain();
  swell.gain.value = 0.55;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.09;
  const lfoAmt = ctx.createGain();
  lfoAmt.gain.value = 0.35;
  lfo.connect(lfoAmt).connect(swell.gain);
  sea.connect(lp).connect(swell).connect(master);

  // wind: band-passed, offset loop so it never phases with the sea
  const air = ctx.createBufferSource();
  air.buffer = buf;
  air.loop = true;
  air.playbackRate.value = 1.7;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  bp.Q.value = 0.7;
  const wind = ctx.createGain();
  wind.gain.value = 0.05;
  const gust = ctx.createOscillator();
  gust.frequency.value = 0.05;
  const gustAmt = ctx.createGain();
  gustAmt.gain.value = 260;
  gust.connect(gustAmt).connect(bp.frequency);
  air.connect(bp).connect(wind).connect(master);

  sea.start(0);
  air.start(0, 2.3);
  lfo.start();
  gust.start();
  return { ctx, master, wind, raf: 0 };
}

export function SoundToggle() {
  const [on, setOn] = useState(false);
  const rig = useRef<Rig | null>(null);

  useEffect(() => {
    const r = rig.current;
    if (!r) return;
    const now = r.ctx.currentTime;
    if (on) {
      r.ctx.resume();
      r.master.gain.cancelScheduledValues(now);
      r.master.gain.setTargetAtTime(0.22, now, 0.8);
      const loop = () => {
        const h = store.hour;
        const meltem = Math.max(0, Math.min(1, (h - 13.5) / 2)) * Math.max(0, Math.min(1, (20 - h) / 1.5));
        r.wind.gain.setTargetAtTime(0.04 + meltem * 0.22, r.ctx.currentTime, 1.2);
        r.raf = window.setTimeout(loop, 400) as unknown as number;
      };
      loop();
    } else {
      r.master.gain.cancelScheduledValues(now);
      r.master.gain.setTargetAtTime(0, now, 0.3);
      clearTimeout(r.raf);
      const t = window.setTimeout(() => r.ctx.suspend(), 1200);
      return () => clearTimeout(t);
    }
    return () => clearTimeout(r.raf);
  }, [on]);

  useEffect(() => () => {
    rig.current?.ctx.close();
  }, []);

  const toggle = () => {
    if (!rig.current) rig.current = build();
    setOn((v) => !v);
  };

  return (
    <button type="button" className="oki-sound" aria-pressed={on} onClick={toggle}>
      <span className="oki-sound__bars" aria-hidden="true" data-on={on ? "true" : "false"}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>{on ? tr.nav.soundOn : tr.nav.soundOff}</span>
    </button>
  );
}
