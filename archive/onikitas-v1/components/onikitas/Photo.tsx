import { getImageProps } from "next/image";
import { imageMeta, imgSrc, imgSrcSet, largest, type ImageKey } from "@/content/onikitas/images";
import { tr } from "@/content/onikitas/tr";

type Props = {
  k: ImageKey;
  sizes: string;
  className?: string;
  priority?: boolean;
  alt?: string;
  /** decorative images get empty alt */
  decorative?: boolean;
  style?: React.CSSProperties;
};

/**
 * next/image in static-export mode (unoptimized) does not emit a srcset, so we
 * take its props (dimensions, loading, decoding, fetchPriority) and add our
 * own pre-generated WebP widths. Intrinsic width/height prevent layout shift.
 */
export function Photo({ k, sizes, className, priority, alt, decorative, style }: Props) {
  const meta = imageMeta[k];
  const { props } = getImageProps({
    src: imgSrc(k, largest(k)),
    alt: decorative ? "" : (alt ?? tr.images[k]),
    width: meta.w,
    height: meta.h,
    sizes,
    priority,
    unoptimized: true,
  });
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} srcSet={imgSrcSet(k)} sizes={sizes} className={className} style={style} />;
}
