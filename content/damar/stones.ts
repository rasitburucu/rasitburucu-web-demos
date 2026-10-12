// Damar: the four stones and their blocks. Numbers live here once; every page,
// the calculator and the technical sheet read them from this file.
// Fictional company, example stock and example values (the site says so once
// per view). Block lists: stock.json (shared with scripts/process-damar-images.mjs).
import stock from "./stock.json";
import slabImages from "./slab-images.json";

export type StoneId = "karakalem" | "duman" | "sirma" | "kiragi";
export const STONE_IDS: StoneId[] = ["karakalem", "duman", "sirma", "kiragi"];

export type Finish = "polished" | "honed" | "antiqued";
export const FINISHES: Finish[] = ["polished", "honed", "antiqued"];

export type Thickness = 2 | 3;
export type SlabStatus = "sold" | "reserved" | "stock";

export type Block = {
  id: string;
  /** the next block from the same face, quoted when this one runs short */
  next: string;
  slabs: number;
  sold: [number, number][];
  reserved: [number, number][];
  thickness: Thickness;
  /** slab face, metres: length × height */
  size: [number, number];
  /** month the block was sawn, YYYY-MM */
  cut: string;
  /** block, metres: length × height × depth */
  blockSize: [number, number, number];
};

/** Example values, EN test standards. */
export type Values = {
  density: number; // EN 1936, g/cm³ (= t/m³)
  porosity: number; // EN 1936, %
  absorption: number; // EN 13755, % by weight
  flexural: number; // EN 12372, MPa
  compressive: number; // EN 1926, MPa
  abrasion: number; // EN 14157, wide wheel, mm
};

export type UseKey = "wall" | "floor" | "kitchen" | "bath" | "exterior";
export const USE_KEYS: UseKey[] = ["wall", "floor", "kitchen", "bath", "exterior"];
export type Use = "good" | "care" | "no";

export type Stone = {
  id: StoneId;
  name: string;
  block: Block;
  values: Values;
  uses: Record<UseKey, Use>;
  /** light ground or dark ground: decides folio and caption colours on the slab */
  ground: "light" | "dark";
  /** slab numbers with a photo (in stock) */
  available: number[];
  /** consecutive pairs in stock, in cut order */
  pairs: [number, number][];
};

type StockRow = Omit<Block, "id"> & { block: string };
const BLOCKS = Object.fromEntries(
  Object.entries(stock as unknown as Record<StoneId, StockRow>).map(([k, { block, ...rest }]) => [k, { id: block, ...rest }]),
) as Record<StoneId, Block>;
const IMAGES = slabImages.stones as Record<StoneId, number[]>;

const VALUES: Record<StoneId, Values> = {
  karakalem: { density: 2.71, porosity: 0.31, absorption: 0.11, flexural: 14.2, compressive: 112, abrasion: 20.5 },
  duman: { density: 2.7, porosity: 0.42, absorption: 0.15, flexural: 12.8, compressive: 98, abrasion: 21.5 },
  sirma: { density: 2.71, porosity: 0.27, absorption: 0.1, flexural: 15.6, compressive: 118, abrasion: 19.5 },
  kiragi: { density: 2.7, porosity: 0.35, absorption: 0.12, flexural: 13.4, compressive: 104, abrasion: 20.8 },
};

const USES: Record<StoneId, Record<UseKey, Use>> = {
  karakalem: { wall: "good", floor: "good", kitchen: "care", bath: "good", exterior: "care" },
  duman: { wall: "good", floor: "good", kitchen: "care", bath: "good", exterior: "care" },
  sirma: { wall: "good", floor: "good", kitchen: "good", bath: "good", exterior: "no" },
  kiragi: { wall: "good", floor: "care", kitchen: "care", bath: "good", exterior: "no" },
};

const NAMES: Record<StoneId, string> = { karakalem: "Karakalem", duman: "Duman", sirma: "Sırma", kiragi: "Kırağı" };

const inRanges = (n: number, ranges: [number, number][]) => ranges.some(([a, b]) => n >= a && n <= b);

export function slabStatus(b: Block, n: number): SlabStatus {
  if (inRanges(n, b.sold)) return "sold";
  if (inRanges(n, b.reserved)) return "reserved";
  return "stock";
}

function pairsOf(available: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < available.length - 1; ) {
    if (available[i + 1] === available[i] + 1) {
      out.push([available[i], available[i + 1]]);
      i += 2;
    } else i += 1;
  }
  return out;
}

export const STONES: Record<StoneId, Stone> = Object.fromEntries(
  STONE_IDS.map((id) => {
    const block = BLOCKS[id];
    const available = IMAGES[id];
    return [
      id,
      {
        id,
        name: NAMES[id],
        block,
        values: VALUES[id],
        uses: USES[id],
        ground: id === "duman" ? "dark" : "light",
        available,
        pairs: pairsOf(available),
      } satisfies Stone,
    ];
  }),
) as Record<StoneId, Stone>;

export const isStoneId = (v: unknown): v is StoneId => typeof v === "string" && (STONE_IDS as string[]).includes(v);
export const isFinish = (v: unknown): v is Finish => typeof v === "string" && (FINISHES as string[]).includes(v);

export const slabArea = (b: Block) => b.size[0] * b.size[1];
export const leftInBlock = (s: Stone) => s.available.length;

/** Index of the pair that holds slab n (or the first pair). */
export function pairIndexOf(s: Stone, n: number | undefined) {
  if (!n) return 0;
  const i = s.pairs.findIndex(([a, b]) => a === n || b === n);
  return i < 0 ? 0 : i;
}

/** Four consecutive slabs for the four-way match: this pair and the next,
 *  else the one before, else the nearest run of four in the block. */
export function quadOf(s: Stone, pairIndex: number): [number, number, number, number] {
  const p = s.pairs;
  const joined = (j: number) => j >= 0 && j + 1 < p.length && p[j][1] + 1 === p[j + 1][0];
  const order = [pairIndex, pairIndex - 1];
  for (let d = 1; d < p.length; d++) order.push(pairIndex + d, pairIndex - 1 - d);
  const j = order.find(joined) ?? Math.max(0, Math.min(pairIndex, p.length - 2));
  const a = p[j];
  const b = p[j + 1] ?? p[j];
  return [a[0], a[1], b[0], b[1]];
}

export const SLAB_IMAGES = slabImages as { aspect: string; widths: number[]; heights: Record<string, number>; stones: Record<StoneId, number[]> };
