// Painter's order for the isometric drawings (IsoCell, Workshop).
//
// The camera looks from +x, +z and from above. A box A has to be drawn before
// box B when A is behind B: it ends before B starts on x or z, or it lies
// below B. A pair only constrains the order when their drawings overlap on
// screen; the constraints are resolved with a topological sort. Pairs whose
// separations contradict each other (one nearer, the other higher, or diagonal
// neighbours) cannot cover one another and are left unconstrained.

export type Aabb = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number };

const C30 = Math.cos(Math.PI / 6);
const EPS = 1e-6;

/** Screen bounding box of a box in the (unit-free) isometric projection. */
function screenBox(b: Aabb) {
  return {
    l: (b.x0 - b.z1) * C30,
    r: (b.x1 - b.z0) * C30,
    t: (b.x0 + b.z0) * 0.5 - b.y1,
    b: (b.x1 + b.z1) * 0.5 - b.y0,
  };
}

const depth = (b: Aabb) => (b.x0 + b.x1) / 2 + (b.z0 + b.z1) / 2 + (b.y0 + b.y1) * 0.02;

/** < 0: a first, > 0: b first, 0: no constraint. */
function order(a: Aabb, b: Aabb): number {
  const sa = screenBox(a);
  const sb = screenBox(b);
  if (sa.r <= sb.l + EPS || sb.r <= sa.l + EPS || sa.b <= sb.t + EPS || sb.b <= sa.t + EPS) return 0;
  const aFirst = a.x1 <= b.x0 + EPS || a.z1 <= b.z0 + EPS || a.y1 <= b.y0 + EPS;
  const bFirst = b.x1 <= a.x0 + EPS || b.z1 <= a.z0 + EPS || b.y1 <= a.y0 + EPS;
  if (aFirst && bFirst) return 0; // one is nearer and the other higher: neither can cover the other
  if (aFirst) return -1;
  if (bFirst) return 1;
  return depth(a) - depth(b); // bounds intersect (touching joints): nearer centre last
}

/** Items back to front. Stable for items that do not constrain each other. */
export function depthSort<T extends { box: Aabb }>(items: T[]): T[] {
  const n = items.length;
  const out: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const o = order(items[i].box, items[j].box);
      if (o < 0) {
        out[i].push(j);
        indeg[j]++;
      } else if (o > 0) {
        out[j].push(i);
        indeg[i]++;
      }
    }
  }
  const key = items.map((it) => depth(it.box));
  const done = new Array<boolean>(n).fill(false);
  const result: T[] = [];
  for (let k = 0; k < n; k++) {
    let pick = -1;
    for (let i = 0; i < n; i++) if (!done[i] && indeg[i] === 0 && (pick < 0 || key[i] < key[pick])) pick = i;
    // a cycle (contradictory constraints): break it at the farthest remaining item
    if (pick < 0) for (let i = 0; i < n; i++) if (!done[i] && (pick < 0 || key[i] < key[pick])) pick = i;
    done[pick] = true;
    result.push(items[pick]);
    for (const j of out[pick]) indeg[j]--;
  }
  return result;
}
