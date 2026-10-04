// Proportions and inverse kinematics of the arm, without three.js: the 3D arm
// (robot.ts) builds its housings from these numbers, and the plan drawing in the
// safety section (PlanCell.tsx) draws the same arm from above with them.

export type ArmLink = { d1: number; a2: number; a3: number; wrist: number; r: number };

export function armLayout(l: ArmLink) {
  const { d1, wrist, r } = l;
  const R1 = r * 1.28; // shoulder module
  const R2 = r * 1.02; // elbow module
  const R3 = r * 0.62; // wrist modules
  const Rb = R1 * 0.86; // base column and J1 rotor
  const gap = Math.max(0.004, r * 0.05); // parting line width
  const ru = r * 0.95; // upper arm at the shoulder
  const rue = r * 0.8; // upper arm at the elbow
  const rf = r * 0.78; // forearm at the elbow
  const rfe = R3 * 0.8; // forearm at the wrist
  // shoulder: J2 module [shA, shB] on the J1 rotor; the upper arm's cast end [rA, rB] beyond the seam
  const shA = -R1;
  const shB = R1 * 0.9;
  const rA = shB + gap;
  const o1 = rA + ru + R1 * 0.12;
  const rB = o1 + ru + R1 * 0.12;
  // elbow: J3 module around the upper arm end [-eA, eA]; the forearm's cast end steps back by o2
  const eA = rue + R2 * 0.14;
  const fr = rf + R2 * 0.12;
  const o2 = eA + gap + fr;
  // wrist 1: socket on the forearm end [-wA, wA]; the J4 module beyond the seam carries the neck at o3
  const wA = rfe + R3 * 0.16;
  const neckR = R3 * 0.7;
  const o3 = wA + gap + neckR + R3 * 0.18;
  const wB = o3 + neckR + R3 * 0.18;
  // wrist 2 hangs one housing below wrist 1 (no overlap), wrist 3 hangs from wrist 2
  const h1 = 2 * R3 + Math.max(0.01, R3 * 0.2);
  const j6y = h1 + R3 * 0.55;
  const flT = 0.014;
  const w3h = wrist - j6y - flT;
  const yS = d1 - R1 * 0.62;
  /** Lateral offset of the tool centre from the J1 plane. */
  const zt = o1 - o2 + o3;
  return { R1, R2, R3, Rb, gap, ru, rue, rf, rfe, shA, shB, rA, o1, rB, eA, fr, o2, wA, neckR, o3, wB, h1, j6y, flT, w3h, yS, zt };
}

export type ArmLayout = ReturnType<typeof armLayout>;
export type ArmPose = { t1: number; t2: number; t3: number; t6: number };

/**
 * Joint angles that put the tool flange at (px, py, pz), relative to the robot
 * base, with the tool turned to `yaw`. `reach` is false when the point was clamped.
 */
export function solveArm(l: ArmLink, zt: number, px: number, py: number, pz: number, yaw: number, out: ArmPose) {
  const d = Math.max(Math.hypot(px, pz), Math.abs(zt) + 0.02);
  const rho = Math.sqrt(d * d - zt * zt);
  const t1 = Math.atan2(-pz, px) - Math.atan2(-zt, rho);
  const dx = rho;
  const dy = py + l.wrist - l.d1;
  const { a2, a3 } = l;
  let D = Math.hypot(dx, dy);
  const maxD = a2 + a3 - 1e-4;
  const minD = Math.abs(a2 - a3) + 1e-3;
  const reach = D <= maxD && D >= minD;
  D = Math.min(maxD, Math.max(minD, D));
  const base2 = Math.atan2(dy, dx);
  const cosA = (a2 * a2 + D * D - a3 * a3) / (2 * a2 * D);
  const cosB = (a2 * a2 + a3 * a3 - D * D) / (2 * a2 * a3);
  out.t1 = t1;
  out.t2 = base2 + Math.acos(Math.min(1, Math.max(-1, cosA)));
  out.t3 = -(Math.PI - Math.acos(Math.min(1, Math.max(-1, cosB))));
  out.t6 = yaw;
  return reach;
}
