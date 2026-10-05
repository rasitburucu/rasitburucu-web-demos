import { asset } from "@/lib/asset";
import dims from "@/content/gelidonya/image-dims.json";

export type ResimKey = keyof typeof dims;

const src = (k: string, w: number, ext: string) => asset(`/gelidonya/${k}-${w}.${ext}`);
const set = (k: ResimKey, ext: string) => dims[k].widths.map((w) => `${src(k, w, ext)} ${w}w`).join(", ");

type Props = {
  k: ResimKey;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** a narrower crop for small screens (art direction) */
  narrow?: { k: ResimKey; media: string; sizes: string };
};

/** AVIF + WebP <picture> with the widths written by scripts/process-gelidonya-images.mjs. */
export function Resim({ k, alt, sizes, className, priority, narrow }: Props) {
  const m = dims[k];
  const mid = m.widths[Math.min(1, m.widths.length - 1)];
  return (
    <picture className={className}>
      {narrow && <source type="image/avif" media={narrow.media} srcSet={set(narrow.k, "avif")} sizes={narrow.sizes} />}
      {narrow && <source type="image/webp" media={narrow.media} srcSet={set(narrow.k, "webp")} sizes={narrow.sizes} />}
      <source type="image/avif" srcSet={set(k, "avif")} sizes={sizes} />
      <img
        src={src(k, mid, "webp")}
        srcSet={set(k, "webp")}
        sizes={sizes}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
      />
    </picture>
  );
}
