import { asset } from "@/lib/asset";
import dims from "@/content/vaziyet/image-dims.json";

type Ad = keyof typeof dims;

/** AVIF + WebP set from public/vaziyet (made by scripts/process-vaziyet-images.mjs).
 *  Width and height come from the source, so the box is reserved before load. */
export function Resim({
  ad,
  alt,
  sizes = "100vw",
  oncelik = false,
  className,
}: {
  ad: Ad;
  alt: string;
  sizes?: string;
  oncelik?: boolean;
  className?: string;
}) {
  const d = dims[ad];
  const set = (ext: string) => d.widths.map((w) => `${asset(`/vaziyet/${ad}-${w}.${ext}`)} ${w}w`).join(", ");
  const enKucuk = Math.min(...d.widths);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={asset(`/vaziyet/${ad}-${enKucuk}.webp`)}
        alt={alt}
        width={d.w}
        height={d.h}
        loading={oncelik ? "eager" : "lazy"}
        fetchPriority={oncelik ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
