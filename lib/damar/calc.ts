// Container estimate (research: .tasarim/damar/arastirma/RAPOR.md §3).
// Stone fills a 20 ft container by weight, not volume. Every figure is an
// estimate; the site says "the factory confirms the packing list".
import { slabArea, type Stone, type Thickness } from "@/content/damar/stones";

export type Payload = 27 | 24 | 20;
export const PAYLOADS: Payload[] = [27, 24, 20];

export const WASTE = 0.1; // cutting waste added to the net area
const PACKING = 0.04; // A-frames, strapping: share of the load
const PER_BUNDLE: Record<Thickness, number> = { 2: 10, 3: 7 };
export const M2_MIN = 1;
export const M2_MAX = 20000;

export type Estimate = {
  slabs: number;
  bundles: number;
  /** tonnes including packing */
  tonnes: number;
  containers: number;
  /** more slabs than this block holds */
  over: boolean;
  /** m² that would still fit in the containers already counted */
  roomM2: number;
  /** load of the last container, 0..1 */
  lastFill: number;
};

export function estimate(stone: Stone, m2: number, t: Thickness, limit: Payload): Estimate | null {
  if (!Number.isFinite(m2) || m2 < M2_MIN) return null;
  const area = slabArea(stone.block);
  const slabs = Math.ceil((m2 * (1 + WASTE)) / area);
  const shipped = slabs * area; // whole slabs travel
  const perM2 = (t / 100) * stone.values.density * (1 + PACKING); // t per m², packed
  const tonnes = shipped * perM2;
  const containers = Math.max(1, Math.ceil(tonnes / limit));
  const roomM2 = Math.max(0, (containers * limit - tonnes) / perM2);
  const lastFill = (tonnes - (containers - 1) * limit) / limit;
  return {
    slabs,
    bundles: Math.ceil(slabs / PER_BUNDLE[t]),
    tonnes,
    containers,
    over: slabs > stone.available.length,
    roomM2,
    lastFill,
  };
}

export const clampM2 = (v: number) => Math.min(M2_MAX, Math.max(M2_MIN, Math.round(v)));
