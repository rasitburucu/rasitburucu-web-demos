// Slab image paths. Files come from scripts/process-damar-images.mjs:
// public/damar/slabs/<stone>-<slab>-<width>.<avif|webp>, portrait 1.9 : 3.2.
import { asset } from "@/lib/asset";
import { SLAB_IMAGES, type StoneId } from "@/content/damar/stones";

export const SLAB_WIDTHS = SLAB_IMAGES.widths; // [880, 480]
export const SLAB_W = 880;
export const SLAB_H = SLAB_IMAGES.heights["880"];

export const slabSrc = (id: StoneId, n: number, w: number, ext: "avif" | "webp") => asset(`/damar/slabs/${id}-${n}-${w}.${ext}`);
export const slabSet = (id: StoneId, n: number, ext: "avif" | "webp") =>
  SLAB_WIDTHS.map((w) => `${slabSrc(id, n, w, ext)} ${w}w`).join(", ");
export const sampleSrc = (id: StoneId, ext: "avif" | "webp") => asset(`/damar/sample-${id}.${ext}`);
export const ANTIQUED_TEXTURE = asset("/damar/finish-antiqued.webp");

let avif: Promise<boolean> | null = null;
/** Does this browser decode AVIF? Asked once, used for warming the cache. */
export function supportsAvif(): Promise<boolean> {
  if (avif) return avif;
  avif = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width > 0);
    img.onerror = () => resolve(false);
    img.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });
  return avif;
}

/** Warm the cache for slabs the visitor is likely to open next. */
export function preloadSlabs(id: StoneId, slabs: number[], sizes: string) {
  if (typeof window === "undefined") return;
  void supportsAvif().then((ok) => {
    const ext = ok ? "avif" : "webp";
    for (const n of slabs) {
      const img = new Image();
      img.decoding = "async";
      img.sizes = sizes;
      img.srcset = slabSet(id, n, ext);
    }
  });
}
