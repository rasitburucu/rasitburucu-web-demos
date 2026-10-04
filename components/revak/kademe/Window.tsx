import { asset } from "@/lib/asset";
import { IMAGES, type ImageKey } from "@/content/revak/images";
import { srcSet } from "../ui/Photo";

// One stop of the walk, held still: the rendered limestone arch (morning and evening
// faces cross-faded by --sun) with the level's photograph in the room behind the
// opening. Geometry matches the walk's portal (180 x 192.7 u, opening 21.8% / 13.1%).
// The photo carries view-transition-name rv-arch, so the arch clicked in the walk
// on the home page lands here.

const FACE_SIZES = "(max-width: 860px) 78vw, 36vw";
const faceSet = (name: string, fmt: "avif" | "webp") =>
  [720, 1440].map((w) => `${asset(`/revak/walk/${name}-${w}.${fmt}`)} ${w}w`).join(", ");

function Face({ name, cls, priority }: { name: string; cls: string; priority?: boolean }) {
  return (
    <picture className={cls}>
      <source type="image/avif" srcSet={faceSet(name, "avif")} sizes={FACE_SIZES} />
      <img
        src={asset(`/revak/walk/${name}-720.webp`)}
        srcSet={faceSet(name, "webp")}
        sizes={FACE_SIZES}
        width={1440}
        height={1542}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}

export function KademeWindow({ image, sun, alt }: { image: ImageKey; sun: number; alt: string }) {
  const img = IMAGES[image];
  const sizes = "(max-width: 860px) 44vw, 20vw";
  return (
    <div className="rv-kw" style={{ "--sun": sun } as React.CSSProperties}>
      <span className="rv-kw-sun" aria-hidden="true" />
      <div className="rv-kw-photo">
        <picture>
          <source type="image/avif" srcSet={srcSet(image, "avif")} sizes={sizes} />
          <img
            src={asset(`/revak/img/${img.file}-${img.widths[0]}.webp`)}
            srcSet={srcSet(image, "webp")}
            sizes={sizes}
            width={img.w}
            height={img.h}
            alt={alt}
            fetchPriority="high"
            decoding="async"
            style={img.pos ? { objectPosition: img.pos } : undefined}
          />
        </picture>
      </div>
      {/* only the face that carries the light is fetched eagerly */}
      {sun < 1 && <Face name="tas-sabah" cls="rv-kw-face" priority={sun < 0.5} />}
      {sun > 0 && <Face name="tas-aksam" cls="rv-kw-face rv-kw-face--pm" priority={sun >= 0.5} />}
    </div>
  );
}
