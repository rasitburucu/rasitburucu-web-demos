import { asset } from "@/lib/asset";
import { img, type ImageKey } from "@/content/kalemkar/images";

const src = (key: string, w: number, ext: string) => asset(`/kalemkar/img/${key}-${w}.${ext}`);

type Props = {
  k: ImageKey;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Override the registry alt (e.g. "" when a caption already says it). */
  alt?: string;
  imgRef?: React.Ref<HTMLImageElement>;
};

/** AVIF + WebP <picture> with the widths written by the image script. */
export function Photo({ k, sizes, className, priority, alt, imgRef }: Props) {
  const m = img(k);
  const set = (ext: string) => m.widths.map((w) => `${src(k, w, ext)} ${Math.min(w, m.w)}w`).join(", ");
  const mid = m.widths[Math.min(1, m.widths.length - 1)];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img
        ref={imgRef}
        src={src(k, mid, "webp")}
        srcSet={set("webp")}
        sizes={sizes}
        alt={alt ?? m.alt}
        width={m.w}
        height={m.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={{ objectPosition: m.pos }}
      />
    </picture>
  );
}
