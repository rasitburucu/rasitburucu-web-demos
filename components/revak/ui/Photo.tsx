import { asset } from "@/lib/asset";
import { IMAGES, type ImageKey } from "@/content/revak/images";

type Props = {
  k: ImageKey;
  sizes: string;
  className?: string;
  /** Arch-topped frame (the Revak motif). */
  arch?: boolean;
  priority?: boolean;
  /** Open from the sill when scrolled into view. Opt-in: kept for a few narrative images only. */
  reveal?: boolean;
  alt?: string;
};

export function srcSet(k: ImageKey, fmt: "avif" | "webp") {
  const img = IMAGES[k];
  return img.widths.map((w) => `${asset(`/revak/img/${img.file}-${w}.${fmt}`)} ${w}w`).join(", ");
}

export function Photo({ k, sizes, className, arch = false, priority = false, reveal = false, alt }: Props) {
  const img = IMAGES[k];
  const mid = img.widths[Math.min(1, img.widths.length - 1)];
  const cls = ["rv-photo", arch ? "rv-arch" : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={cls} data-reveal={reveal && !priority ? "" : undefined}>
      <picture>
        <source type="image/avif" srcSet={srcSet(k, "avif")} sizes={sizes} />
        <img
          src={asset(`/revak/img/${img.file}-${mid}.webp`)}
          srcSet={srcSet(k, "webp")}
          sizes={sizes}
          width={img.w}
          height={img.h}
          alt={alt ?? img.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
          style={img.pos ? { objectPosition: img.pos } : undefined}
        />
      </picture>
    </div>
  );
}
