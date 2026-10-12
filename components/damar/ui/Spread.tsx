import type { StoneId } from "@/content/damar/stones";
import { STONES, type Finish } from "@/content/damar/stones";
import { Slab } from "./Slab";

/** A still bookmatched pair on the grey table: two pages, the right one
 *  turned over. Used outside the home book (stone pages, index, sheet). */
export function Spread({
  stone,
  pair,
  sizes,
  finish = "polished",
  folios = true,
  label,
  priority,
  className,
}: {
  stone: StoneId;
  pair: [number, number];
  sizes: string;
  finish?: Finish;
  folios?: boolean;
  label?: string;
  priority?: boolean;
  className?: string;
}) {
  const s = STONES[stone];
  return (
    <div className={`dm-spreadimg${className ? ` ${className}` : ""}`} data-finish={finish} data-ground={s.ground} role={label ? "img" : undefined} aria-label={label}>
      <div className="dm-page dm-page--l">
        <Slab stone={stone} n={pair[0]} sizes={sizes} className="dm-slab" priority={priority} />
        <span className="dm-sheen" />
        <span className="dm-tex" />
        {folios && <span className="dm-folio">{pair[0]}</span>}
      </div>
      <div className="dm-page dm-page--r">
        <Slab stone={stone} n={pair[1]} sizes={sizes} className="dm-slab dm-mirror" priority={priority} />
        <span className="dm-sheen" />
        <span className="dm-tex" />
        {folios && <span className="dm-folio">{pair[1]}</span>}
      </div>
      <span className="dm-gutter" />
    </div>
  );
}
