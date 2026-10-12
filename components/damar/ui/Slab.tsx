import type { StoneId } from "@/content/damar/stones";
import { SLAB_H, SLAB_W, sampleSrc, slabSet, slabSrc } from "@/lib/damar/slabs";

type Props = {
  stone: StoneId;
  n: number;
  sizes: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  /** lazy by default; the book loads its pages eagerly */
  eager?: boolean;
};

/** One slab photo: AVIF with WebP fallback, two widths. Mirroring, rotation
 *  and the finish are applied by the parent with CSS. */
export function Slab({ stone, n, sizes, alt = "", className, priority, eager }: Props) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={slabSet(stone, n, "avif")} sizes={sizes} />
      <img
        src={slabSrc(stone, n, SLAB_W, "webp")}
        srcSet={slabSet(stone, n, "webp")}
        sizes={sizes}
        alt={alt}
        width={SLAB_W}
        height={SLAB_H}
        loading={priority || eager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        draggable={false}
      />
    </picture>
  );
}

/** A square close-up of the stone (sample box, finish swatches). */
export function SampleTile({ stone, alt = "", className }: { stone: StoneId; alt?: string; className?: string }) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={sampleSrc(stone, "avif")} />
      <img src={sampleSrc(stone, "webp")} alt={alt} width={360} height={360} loading="lazy" decoding="async" draggable={false} />
    </picture>
  );
}
