import { asset } from "@/lib/asset";
import { img, type ImageKey } from "@/content/sazbahce/images";

const src = (key: string, w: number, ext: string) => asset(`/sazbahce/img/${key}-${w}.${ext}`);

type Props = {
  k: ImageKey;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Override the registry alt (e.g. "" when a caption already says it). */
  alt?: string;
  /** Marks the visible photo in a cross-fading stack. */
  on?: boolean;
  /** A different crop for phones (art direction), same alt. */
  mobile?: ImageKey;
};

/** AVIF + WebP <picture> with the widths written by the image script. */
export function Photo({ k, sizes, className, priority, alt, on, mobile }: Props) {
  const m = img(k);
  const set = (ext: string) => m.widths.map((w) => `${src(k, w, ext)} ${Math.min(w, m.w)}w`).join(", ");
  const mid = m.widths[Math.min(1, m.widths.length - 1)];
  return (
    <picture className={className} data-on={on || undefined}>
      {mobile && (
        <>
          <source type="image/avif" media="(max-width: 759px)" srcSet={img(mobile).widths.map((w) => `${src(mobile, w, "avif")} ${Math.min(w, img(mobile).w)}w`).join(", ")} sizes="100vw" />
          <source type="image/webp" media="(max-width: 759px)" srcSet={img(mobile).widths.map((w) => `${src(mobile, w, "webp")} ${Math.min(w, img(mobile).w)}w`).join(", ")} sizes="100vw" />
        </>
      )}
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img
        src={src(k, mid, "webp")}
        srcSet={set("webp")}
        sizes={sizes}
        alt={alt ?? m.alt}
        width={m.w}
        height={m.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        style={{ objectPosition: m.pos }}
      />
    </picture>
  );
}
