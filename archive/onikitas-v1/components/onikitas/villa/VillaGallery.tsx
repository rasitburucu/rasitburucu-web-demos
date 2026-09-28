"use client";

import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/onikitas/tr";
import type { ImageKey } from "@/content/onikitas/images";
import { Photo } from "../Photo";
import { useSmoothScroll } from "../shell/Shell";

/** 1 large + 4 small, with a native <dialog> lightbox (built-in focus trap + Esc). */
export function VillaGallery({ images }: { images: ImageKey[] }) {
  const g = tr.villa.gallery;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const { scrollTo, stop, start } = useSmoothScroll();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      stop();
    }
  }, [index, stop]);

  const close = () => {
    dialogRef.current?.close();
  };

  const step = (dir: number) => setIndex((i) => (i === null ? 0 : (i + dir + images.length) % images.length));

  return (
    <section className="mx-auto mt-10 max-w-[1600px] px-4 pb-12 sm:px-8 lg:px-12" aria-label={g.dialog}>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:grid-rows-2">
        {images.map((k, i) => (
          <button
            key={k + i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={g.open(i + 1, images.length)}
            className={`group relative overflow-hidden bg-travertine ${
              i === 0 ? "col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto" : "aspect-[4/3]"
            }`}
          >
            <Photo
              k={k}
              priority={i === 0}
              sizes={i === 0 ? "(min-width:1024px) 48vw, 92vw" : "(min-width:1024px) 23vw, 46vw"}
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="chip" onClick={() => setIndex(0)}>
          {g.all} <span className="label-mono text-olive-soft">{images.length}</span>
        </button>
        <a href="#kat-plani" className="chip" onClick={(e) => { e.preventDefault(); scrollTo("#kat-plani"); }}>
          {g.plan}
        </a>
        <a href="#manzara" className="chip" onClick={(e) => { e.preventDefault(); scrollTo("#manzara"); }}>
          {g.views}
        </a>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={g.dialog}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-olive/95 p-0 text-lime backdrop:bg-olive/60"
        onClose={() => {
          setIndex(null);
          start();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {index !== null ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-8">
              <span className="label-mono">{g.counter(index + 1, images.length)}</span>
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center" aria-label={g.close} autoFocus>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                  <path d="M2 2 L16 16 M16 2 L2 16" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
              <Photo k={images[index]} sizes="90vw" className="max-h-full w-auto max-w-full object-contain" />
              <button type="button" onClick={() => step(-1)} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-olive/60 sm:left-6" aria-label={g.prev}>
                <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
                  <path d="M6 1 L1 6 L6 11 M1 6 H17" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              <button type="button" onClick={() => step(1)} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-olive/60 sm:right-6" aria-label={g.next}>
                <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
                  <path d="M12 1 L17 6 L12 11 M17 6 H1" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <p className="px-4 pb-4 text-center text-sm text-lime/80 sm:px-8">{tr.images[images[index]]}</p>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
