// The teardown timeline, shared by the 3D scene, the vector drawing and the
// labels. One number drives everything: p, the pinned section's scroll
// progress (0..1). Parts come off in the order a technician removes them in
// the field (cable first, tool next, base last) and go back in reverse.

export const PART_IDS = [
  "hose",
  "gripper",
  "toolFlange",
  "wrist",
  "forearm",
  "elbow",
  "upperArm",
  "shoulderCover",
  "brake",
  "motor",
  "gearbox",
  "base",
  "mount",
  "controller",
  "scanner",
] as const;

export type PartId = (typeof PART_IDS)[number];
export const PART_COUNT = PART_IDS.length;

export type Phase = "ready" | "apart" | "open" | "together" | "work";

/** Timeline marks (fractions of the pinned scroll). */
export const T = {
  /** framing slides from the intro composition to the centre */
  frameFrom: 0.015,
  frameTo: 0.085,
  apartFrom: 0.075,
  apartTo: 0.52,
  togetherFrom: 0.62,
  togetherTo: 0.83,
  workFrom: 0.84,
} as const;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** Minimum-jerk ease, the same curve the live cell moves its arm with. */
export const minJerk = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (10 + x * (-15 + 6 * x));
};
export const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const N = PART_COUNT;
const APART_W = ((T.apartTo - T.apartFrom) * 2.4) / N;
const TOGETHER_W = ((T.togetherTo - T.togetherFrom) * 3) / N;

/** When part i starts to come off, and when it starts to go back. */
function windows(i: number) {
  const a = T.apartFrom + (i * (T.apartTo - T.apartFrom - APART_W)) / (N - 1);
  const k = N - 1 - i; // reassembly runs in reverse: base first, cable last
  const b = T.togetherFrom + (k * (T.togetherTo - T.togetherFrom - TOGETHER_W)) / (N - 1);
  return { a, b };
}

/** How far each part is from its seat (0 = seated, 1 = fully out), eased. */
export function amounts(p: number, out: number[] = new Array(N).fill(0)) {
  for (let i = 0; i < N; i++) {
    const { a, b } = windows(i);
    const off = minJerk((p - a) / APART_W);
    const back = minJerk((p - b) / TOGETHER_W);
    out[i] = off * (1 - back);
  }
  return out;
}

export type Readout = {
  phase: Phase;
  /** Part in focus (index), or -1. */
  active: number;
  /** Parts counted for the readout ("07 / 15"). */
  count: number;
};

/** What the status strip says at p. */
export function readout(p: number): Readout {
  if (p < T.apartFrom + APART_W * 0.5) return { phase: "ready", active: -1, count: 0 };
  if (p < T.togetherFrom) {
    let count = 0;
    for (let i = 0; i < N; i++) if (p >= windows(i).a + APART_W * 0.5) count = i + 1;
    return { phase: count >= N && p >= T.apartTo ? "open" : "apart", active: count - 1, count };
  }
  if (p < T.workFrom) {
    let back = 0;
    let active = -1;
    for (let i = N - 1; i >= 0; i--) {
      if (p >= windows(i).b + TOGETHER_W * 0.5) {
        back++;
        active = i;
      }
    }
    return { phase: "together", active, count: back };
  }
  return { phase: "work", active: -1, count: N };
}

/** 0..1 through the closing "back at work" stretch. */
export const workT = (p: number) => span(p, T.workFrom, 1);

/** 0 = intro composition (robot to the side of the headline), 1 = centred. */
export const framing = (p: number) => minJerk(span(p, T.frameFrom, T.frameTo));

/** The working cell around the robot (pallet, conveyor end, floor tape): 1 = present. */
export const cellPresence = (p: number) => 1 - minJerk(span(p, 0.03, 0.075)) + minJerk(span(p, T.workFrom - 0.005, T.workFrom + 0.035));

/** The opening text gives way to the teardown heading. */
export const introOut = (p: number) => minJerk(span(p, 0.02, 0.06));
/** The teardown heading reads while the first parts come off, then leaves the columns to the labels. */
export const headIn = (p: number) => minJerk(span(p, 0.055, 0.095)) * (1 - minJerk(span(p, 0.15, 0.19)));
/** The one-line point of the open state, while everything is out. */
export const holdIn = (p: number) => minJerk(span(p, T.apartTo - 0.01, T.apartTo + 0.02)) * (1 - minJerk(span(p, T.togetherFrom - 0.005, T.togetherFrom + 0.025)));
export const doneIn = (p: number) => minJerk(span(p, T.workFrom + 0.04, T.workFrom + 0.08));

/** Static progress used for still renders and reduced motion: everything out, before reassembly. */
export const P_OPEN = (T.apartTo + T.togetherFrom) / 2;
