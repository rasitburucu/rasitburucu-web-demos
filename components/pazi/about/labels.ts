// Label columns for the teardown: which side each part's label goes to, in
// what order, and at what height, so the leader lines stay short and do not
// cross. Pure geometry in stage pixels; Teardown.tsx measures and applies it.
//
// 1. Side: the column nearer to the part on screen, then balanced so neither
//    column overflows (the parts nearest the middle move across first).
// 2. Height: each label wants its first line level with its part; a column is
//    packed with isotonic regression (pool adjacent violators), the smallest
//    total movement that keeps the order and the gaps.
// 3. Order: starts sorted by the parts' heights, then swaps are kept while
//    they remove a crossing, lift a line off another part's dot or shorten
//    the lines.

export type LabelSlot = { side: -1 | 1; x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number };
type Frame = { left: number; right: number; colW: number; topL: number; topR: number; bottom: number };

/**
 * A leader as drawn: level out of the label's first line, then a 45° leg to
 * the part (a drawing-office callout). When the part is too far above or
 * below for a 45° leg, the level run shrinks to a short shoulder and the leg
 * steepens.
 */
function leader(s: LabelSlot, an: Pt): [Pt, Pt, Pt] {
  const dir = s.side < 0 ? 1 : -1;
  const ex = s.side < 0 ? s.x + s.w + 6 : s.x - 6;
  const ey = s.y + 11;
  const leg = Math.abs(an.y - ey);
  const kx = dir > 0 ? Math.max(ex + 18, an.x - leg) : Math.min(ex - 18, an.x + leg);
  return [{ x: ex, y: ey }, { x: kx, y: ey }, an];
}

/** SVG path for a label's leader to its part. */
export function leaderD(s: LabelSlot, an: Pt) {
  const [a, k, b] = leader(s, an);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} H ${k.x.toFixed(1)} L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

const GAP = 10;

/** Stack heights in this order as close to their ideal tops as the gaps and the column allow. */
function pack(ideal: number[], hs: number[], top: number, bottom: number) {
  const n = ideal.length;
  // a full column closes its gaps a little before anything spills past the bottom
  const sumH = hs.reduce((s, h) => s + h, 0);
  const gap = n > 1 ? Math.min(GAP, Math.max(4, (bottom - top - sumH) / (n - 1))) : GAP;
  const off: number[] = [];
  let acc = 0;
  for (let k = 0; k < n; k++) {
    off.push(acc);
    acc += hs[k] + gap;
  }
  const total = acc - gap;
  // with the gaps taken out, the tops only have to be non-decreasing
  const blocks: { sum: number; n: number }[] = [];
  for (let k = 0; k < n; k++) {
    blocks.push({ sum: ideal[k] - off[k], n: 1 });
    while (blocks.length > 1) {
      const b = blocks[blocks.length - 1];
      const a = blocks[blocks.length - 2];
      if (a.sum / a.n <= b.sum / b.n) break;
      a.sum += b.sum;
      a.n += b.n;
      blocks.pop();
    }
  }
  const lo = top;
  const hi = Math.max(top, bottom - total);
  const out: number[] = [];
  for (const b of blocks) {
    const v = Math.min(hi, Math.max(lo, b.sum / b.n));
    for (let i = 0; i < b.n; i++) out.push(v + off[out.length]);
  }
  return out;
}

function segCross(a: Pt, b: Pt, c: Pt, d: Pt) {
  const o = (p: Pt, q: Pt, r: Pt) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const d1 = o(c, d, a);
  const d2 = o(c, d, b);
  const d3 = o(a, b, c);
  const d4 = o(a, b, d);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/** Distance from p to the segment ab. */
function segDist(p: Pt, a: Pt, b: Pt) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** Leaders that run over another part's dot read as pointing at it. */
function grazes(lines: [Pt, Pt, Pt][], ends: Pt[]) {
  let n = 0;
  lines.forEach((l, i) => {
    ends.forEach((p, j) => {
      if (i !== j && (segDist(p, l[1], l[2]) < 12 || segDist(p, l[0], l[1]) < 12)) n++;
    });
  });
  return n;
}

function crossings(lines: [Pt, Pt, Pt][]) {
  let n = 0;
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const a = lines[i];
      const b = lines[j];
      if (segCross(a[0], a[1], b[0], b[1]) || segCross(a[0], a[1], b[1], b[2]) || segCross(a[1], a[2], b[0], b[1]) || segCross(a[1], a[2], b[1], b[2])) n++;
    }
  return n;
}

export function arrangeLabels(anchors: Pt[], hs: number[], f: Frame): (LabelSlot | null)[] {
  const n = anchors.length;
  const out: (LabelSlot | null)[] = new Array(n).fill(null);
  if (!n) return out;
  const xs = anchors.map((a) => a.x);
  const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
  const colX = (side: -1 | 1) => (side < 0 ? f.left : f.right);
  const top = (side: -1 | 1) => (side < 0 ? f.topL : f.topR);
  const room = (side: -1 | 1) => f.bottom - top(side);
  const need = (ids: number[]) => ids.reduce((s, i) => s + hs[i] + 4, -4);

  // 1. side: nearer column, then balance
  let left: number[] = [];
  let right: number[] = [];
  anchors.forEach((a, i) => (a.x < mid ? left : right).push(i));
  const central = (ids: number[]) => [...ids].sort((p, q) => Math.abs(anchors[p].x - mid) - Math.abs(anchors[q].x - mid))[0];
  // move the label nearest the middle across while its column overflows (and the other has room for it),
  // or while one column holds three or more labels than the other
  const fits = (ids: number[], extra: number, side: -1 | 1) => need([...ids, extra]) <= room(side);
  for (let guard = 0; guard < n; guard++) {
    const ml = left.length ? central(left) : -1;
    const mr = right.length ? central(right) : -1;
    if (ml >= 0 && ((need(left) > room(-1) && fits(right, ml, 1)) || left.length - right.length > 2)) {
      left = left.filter((i) => i !== ml);
      right.push(ml);
    } else if (mr >= 0 && ((need(right) > room(1) && fits(left, mr, -1)) || right.length - left.length > 2)) {
      right = right.filter((i) => i !== mr);
      left.push(mr);
    } else break;
  }

  // 2 + 3. order and height per column
  const place = (ids: number[], side: -1 | 1) => {
    const slotsFor = (order: number[]) => {
      const ys = pack(
        order.map((i) => anchors[i].y - 11),
        order.map((i) => hs[i]),
        top(side),
        f.bottom,
      );
      return order.map((i, k) => ({ i, s: { side, x: colX(side), y: ys[k], w: f.colW, h: hs[i] } as LabelSlot }));
    };
    const cost = (order: number[]) => {
      const placed = slotsFor(order);
      const lines = placed.map(({ i, s }) => leader(s, anchors[i]));
      const len = lines.reduce((sum, l) => sum + Math.hypot(l[2].x - l[1].x, l[2].y - l[1].y), 0);
      const ends = placed.map(({ i }) => anchors[i]);
      // a crossing is worst, a leader over another dot next, then total length
      return crossings(lines) * 10_000 + grazes(lines, ends) * 1_200 + len;
    };
    let order = [...ids].sort((p, q) => anchors[p].y - anchors[q].y);
    let best = cost(order);
    for (let pass = 0; pass < 40; pass++) {
      let improved = false;
      for (let a = 0; a + 1 < order.length; a++)
        for (let b = a + 1; b < order.length; b++) {
          const t = [...order];
          [t[a], t[b]] = [t[b], t[a]];
          const c = cost(t);
          if (c < best - 0.5) {
            best = c;
            order = t;
            improved = true;
          }
        }
      if (!improved) break;
    }
    for (const { i, s } of slotsFor(order)) out[i] = s;
  };
  place(left, -1);
  place(right, 1);
  return out;
}

/** Leader crossings for a finished layout (both columns), for checks. */
export function countCrossings(slots: (LabelSlot | null)[], anchors: Pt[]) {
  const lines: [Pt, Pt, Pt][] = [];
  slots.forEach((s, i) => {
    if (s && anchors[i]) lines.push(leader(s, anchors[i]));
  });
  return crossings(lines);
}
