"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { tr } from "@/content/revak/tr";
import { IMAGES } from "@/content/revak/images";
import { KADEMELER, useShared } from "@/lib/revak/store";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/revak/motion";
import { getLenis, scrollToY } from "@/lib/revak/lenis";
import { archNavigate } from "../shell/Motion";
import { Photo, srcSet } from "../ui/Photo";

const t = tr.levels;
const ROMAN = ["I", "II", "III", "IV"];

/* ------------------------------------------------------------------------ *
 * "Revak boyunca": a walk through the arcade.
 *
 * A static stone wall with one monumental arch window. Inside the window a
 * colonnade recedes to a vanishing point; scrolling walks the camera forward.
 * Every third arch frames one level (Anaokulu → Lise) and holds while its
 * name is set letter by letter on the wall beside it. The sun turns from
 * morning to evening across the walk (tint + floor light + jamb shade).
 *
 * Geometry lives in CSS container-query units (see .rv-walk-window in
 * almanak.css); JS only writes transform/opacity per frame.
 * Without JS or with reduced motion the same DOM reads as four yearbook
 * spreads; the scene is aria-hidden decoration.
 * ------------------------------------------------------------------------ */

/* ---- tunables ---- */
const K = 0.34; // perspective falloff: scale = 1 / (1 + z*K)
const SPACING = 3; // plain arches between two levels + 1
const FIRST = 3; // world position of the first level arch
const EXIT = FIRST + SPACING * 4; // the last, open arch
const COUNT = EXIT; // arches 1..EXIT
const Z_FAR = 10.5; // hidden beyond this depth
const Z_NEAR = -1.35; // hidden once this far behind the camera
const JOINTS = 14; // floor joints (one every 0.75 unit)
const HOLD = 0.8; // timeline length of a stop at a level
const MOVE = 1.8; // timeline length of the walk between two levels

// Arch geometry in "u" (u = 0.88% of the window width): hole 100 × 166.7,
// piers 40, lintel 26. Portal box 180 × 192.7; eye height 0.34 of the hole.
const HOLE = "M40 192.7 V76 A50 50 0 0 1 140 76 V192.7 Z";
const shifted = (dx: number) => `M${40 + dx} 192.7 V76 A50 50 0 0 1 ${140 + dx} 76 V192.7 Z`;
const BOX = "M0 0 H180 V192.7 H0 Z";

// Age at each stop: the first day of each level, then graduation at the open arch.
const AGES = [3, 6, 10, 14, 18];
const ageAt = (c: number) => {
  const x = (c - FIRST) / SPACING; // 0..4 between the stops
  if (x <= 0) return AGES[0];
  const i = Math.min(3, Math.floor(x));
  return Math.round(AGES[i] + (AGES[i + 1] - AGES[i]) * Math.min(1, x - i));
};

const levelAt = (p: number) => ((p - FIRST) % SPACING === 0 && p < EXIT ? KADEMELER[(p - FIRST) / SPACING] : null);

function Portal({ p }: { p: number }) {
  const k = levelAt(p);
  const exit = p === EXIT;
  const img = k ? IMAGES[t.items[k].image] : null;
  return (
    <div className={exit ? "rv-portal is-exit" : "rv-portal"} data-p={p} style={{ zIndex: 200 - p }}>
      <span className="rv-portal-sun" />
      {img && k && (
        <div className="rv-portal-photo" data-k={k}>
          <picture>
            <source type="image/avif" srcSet={srcSet(t.items[k].image, "avif")} sizes="(max-width: 860px) 70vw, 34vw" />
            <img
              src={srcSet(t.items[k].image, "webp").split(" ")[0]}
              srcSet={srcSet(t.items[k].image, "webp")}
              sizes="(max-width: 860px) 70vw, 34vw"
              width={img.w}
              height={img.h}
              alt=""
              loading="lazy"
              decoding="async"
              style={img.pos ? { objectPosition: img.pos } : undefined}
            />
          </picture>
        </div>
      )}
      <svg viewBox="0 0 180 192.7" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={`rv-hole-${p}`}>
            <path d={HOLE} />
          </clipPath>
        </defs>
        <path className="rv-portal-face" fillRule="evenodd" d={`${BOX} ${HOLE}`} />
        <path className="rv-portal-line" d="M0 76 H40 M140 76 H180 M0 184 H40 M140 184 H180" />
        <g clipPath={`url(#rv-hole-${p})`}>
          <path className="rv-sh rv-sh--am" fillRule="evenodd" d={`${BOX} ${shifted(-8)}`} />
          <path className="rv-sh rv-sh--pm" fillRule="evenodd" d={`${BOX} ${shifted(8)}`} />
        </g>
        <path className="rv-portal-edge" d={HOLE} />
        <path className="rv-portal-haze" fillRule="evenodd" d={`${BOX} ${HOLE}`} />
      </svg>
    </div>
  );
}

export function Walk() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const { update } = useShared();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ live: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 860px)" }, (ctx) => {
        const { live, mobile } = ctx.conditions as { live: boolean; mobile: boolean };
        if (!live) return;
        return build(el, mobile);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="rv-walk" id="kademeler" aria-labelledby="rv-walk-title">
      <div className="rv-walk-stage">
        {/* Decorative scene: the arcade seen through the wall's arch window. */}
        <div className="rv-walk-window" aria-hidden="true">
          <div className="rv-walk-sky" />
          <div className="rv-walk-floor">
            {Array.from({ length: JOINTS }, (_, i) => (
              <span key={i} className="rv-joint" />
            ))}
          </div>
          {Array.from({ length: COUNT }, (_, i) => (
            <Portal key={i + 1} p={i + 1} />
          ))}
          <div className="rv-walk-tint rv-walk-tint--am" />
          <div className="rv-walk-tint rv-walk-tint--pm" />
        </div>

        <div className="rv-walk-copy">
          <header className="rv-walk-head">
            <p className="rv-folio">
              <span>{t.folio}</span> {tr.brand.full}
            </p>
            <h2 id="rv-walk-title" className="rv-walk-title">
              {t.title}
            </h2>
            <p className="rv-walk-intro">{t.intro}</p>
          </header>

          {/* The child's age, counting up while we walk between the levels. */}
          <p className="rv-walk-age" aria-hidden="true">
            <span className="rv-walk-age-n">3</span>
            <span className="rv-walk-age-l">{t.ageLabel}</span>
          </p>

          <ol className="rv-chapters">
            {KADEMELER.map((k, i) => {
              const l = t.items[k];
              const href = `/revak/kabul/on-kayit/?kademe=${k}`;
              return (
                <li key={k} className="rv-chapter" data-k={k}>
                  <figure className="rv-chapter-plate">
                    <Photo k={l.image} arch reveal={false} sizes="(max-width: 860px) 80vw, 36vw" />
                    <figcaption aria-hidden="true">
                      {t.plate} {i + 1} — {IMAGES[l.image].alt}
                    </figcaption>
                  </figure>
                  <div className="rv-chapter-text">
                    <p className="rv-chapter-folio">
                      <span className="rv-num">
                        {ROMAN[i]} / {ROMAN[3]}
                      </span>
                      <span>{l.range}</span>
                    </p>
                    <h3 className="rv-chapter-name">{l.name}</h3>
                    <p className="rv-chapter-line">{l.line}</p>
                    <dl className="rv-chapter-facts">
                      <div>
                        <dt>{t.classSize}</dt>
                        <dd>{l.size}</dd>
                      </div>
                      <div>
                        <dt>{t.languages}</dt>
                        <dd>{l.lang}</dd>
                      </div>
                    </dl>
                    <blockquote className="rv-chapter-quote">
                      <p>{l.quote}</p>
                      <footer>{l.who}</footer>
                    </blockquote>
                    <Link
                      href={href}
                      className="rv-btn rv-btn--seal rv-chapter-cta"
                      onClick={(e) => {
                        update({ kademe: k });
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                        e.preventDefault();
                        const live = root.current?.classList.contains("is-live");
                        const photo = live
                          ? root.current?.querySelector<HTMLElement>(`.rv-portal-photo[data-k="${k}"]`)
                          : e.currentTarget.closest(".rv-chapter")?.querySelector<HTMLElement>(".rv-chapter-plate .rv-photo");
                        archNavigate((h) => router.push(h), href, photo ?? null);
                      }}
                    >
                      {t.cta}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="rv-walk-exit">
            <p className="rv-walk-exit-title">{t.exit.title}</p>
            <p>{t.exit.text}</p>
            <a href="#mezunlar" className="rv-textlink">
              {t.exit.link}
            </a>
          </div>

          <nav className="rv-walk-toc" aria-label={t.rulerLabel}>
            <ol>
              {KADEMELER.map((k, i) => (
                <li key={k}>
                  <button type="button" data-i={i}>
                    <span className="rv-num">{ROMAN[i]}</span> {t.items[k].name}
                  </button>
                </li>
              ))}
            </ol>
            <span className="rv-walk-toc-bar" aria-hidden="true">
              <span />
            </span>
          </nav>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */

function build(section: HTMLElement, mobile: boolean) {
  const stage = section.querySelector<HTMLElement>(".rv-walk-stage")!;
  const win = section.querySelector<HTMLElement>(".rv-walk-window")!;
  const portals = Array.from(section.querySelectorAll<HTMLElement>(".rv-portal"));
  const haze = portals.map((p) => p.querySelector<SVGPathElement>(".rv-portal-haze"));
  const photos = portals.map((p) => p.querySelector<HTMLElement>(".rv-portal-photo"));
  const joints = Array.from(section.querySelectorAll<HTMLElement>(".rv-joint"));
  const head = section.querySelector<HTMLElement>(".rv-walk-head")!;
  const chapters = Array.from(section.querySelectorAll<HTMLElement>(".rv-chapter"));
  const exit = section.querySelector<HTMLElement>(".rv-walk-exit")!;
  const tocBtns = Array.from(section.querySelectorAll<HTMLButtonElement>(".rv-walk-toc button"));
  const tocFill = section.querySelector<HTMLElement>(".rv-walk-toc-bar > span")!;
  const age = section.querySelector<HTMLElement>(".rv-walk-age")!;
  const ageN = section.querySelector<HTMLElement>(".rv-walk-age-n")!;
  let shownAge = -1;

  section.classList.add("is-live");

  // Eye height above the floor, in px: 0.34 × hole height (166.7u), u = 0.88% of window width.
  let eye = 0;
  const measure = () => {
    eye = 0.34 * 166.7 * (0.0088 * win.clientWidth);
  };
  measure();

  const cam = { c: 0.6 };
  const sun = { v: 0 };
  let current = -2;
  let lastSun = "";
  let lastEnd = "";

  const render = () => {
    const c = cam.c;
    for (let i = 0; i < portals.length; i++) {
      const z = i + 1 - c;
      const el = portals[i];
      if (z > Z_FAR || z < Z_NEAR) {
        if (el.style.visibility !== "hidden") el.style.visibility = "hidden";
        continue;
      }
      if (el.style.visibility) el.style.visibility = "";
      const s = 1 / (1 + z * K);
      el.style.transform = `scale(${s.toFixed(4)})`;
      // behind the camera: fade out; far away: fade in from the haze
      const o = z < -0.55 ? Math.max(0, 1 - (-0.55 - z) / 0.8) : z > Z_FAR - 1.5 ? Math.max(0, (Z_FAR - z) / 1.5) : 1;
      el.style.opacity = o.toFixed(3);
      const hz = haze[i];
      if (hz) hz.style.opacity = Math.min(0.78, Math.max(0, z) * 0.085).toFixed(3);
      const ph = photos[i];
      if (ph) ph.style.opacity = (z >= 0 ? 1 : Math.max(0, 1 + z / 0.4)).toFixed(3);
    }
    const beyond = EXIT - c; // no floor joints past the open arch: the world starts there
    for (let j = 0; j < joints.length; j++) {
      // joints every 0.75 unit, wrapping so a fixed set covers the whole walk
      const period = JOINTS * 0.75;
      const z = (((j * 0.75 - c) % period) + period) % period - 0.4;
      const s = 1 / (1 + z * K);
      joints[j].style.opacity = z > beyond ? "0" : "";
      joints[j].style.transform = `translate3d(0, ${(-eye * (1 - s)).toFixed(2)}px, 0)`;
    }
    // CSS variables restyle the whole stage: write them only when they change
    const sunV = sun.v.toFixed(3);
    const endV = gsap.utils.clamp(0, 1, (c - (EXIT - 3)) / 2.75).toFixed(3);
    if (sunV !== lastSun) stage.style.setProperty("--sun", (lastSun = sunV));
    if (endV !== lastEnd) stage.style.setProperty("--end", (lastEnd = endV));

    // which level is in front of us (for pointer events, focus and the TOC)
    let near = -1;
    for (let i = 0; i < 4; i++) if (Math.abs(c - (FIRST + i * SPACING)) < SPACING * 0.42) near = i;
    if (near !== current) {
      current = near;
      chapters.forEach((ch, i) => ch.toggleAttribute("data-on", i === near));
      tocBtns.forEach((b, i) => (i === near ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current")));
    }
    // the age shows only while walking: fades in away from a stop, out near one
    let dist = Infinity;
    for (let i = 0; i < 4; i++) dist = Math.min(dist, Math.abs(c - (FIRST + i * SPACING)));
    const walking = c > FIRST - 0.2 && c < EXIT - 0.6;
    age.style.opacity = walking ? gsap.utils.clamp(0, 1, (dist - 0.45) / 0.5).toFixed(3) : "0";
    const a = ageAt(c);
    if (a !== shownAge) {
      shownAge = a;
      ageN.textContent = String(a);
    }
    tocFill.style.transform = `scaleX(${gsap.utils.clamp(0, 1, (c - 0.6) / (EXIT - 0.6)).toFixed(4)})`;
  };

  // Chapter names: letter by letter, out of a mask sized for İ, ş, ğ.
  const splits = chapters.map((ch) =>
    SplitText.create(ch.querySelector(".rv-chapter-name")!, { type: "chars", mask: "chars", charsClass: "rv-ch", aria: "auto" }),
  );

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onUpdate: render });
  tl.addLabel("intro", 0);
  tl.to({}, { duration: 0.55 });
  chapters.forEach((ch) => gsap.set(ch.querySelectorAll(".rv-chapter-text > :not(h3)"), { opacity: 0, y: 14 }));
  gsap.set(exit, { opacity: 0, y: 14 });
  splits.forEach((s) => gsap.set(s.chars, { yPercent: 160 }));

  // head leaves as the walk starts
  tl.to(head, { opacity: 0, y: -18, duration: 0.5, ease: "power1.in" }, "intro+=0.55");

  for (let i = 0; i < 4; i++) {
    const at = FIRST + i * SPACING;
    const ch = chapters[i];
    const rest = ch.querySelectorAll(".rv-chapter-text > :not(h3)");
    const moveStart = tl.duration();
    tl.to(cam, { c: at, duration: MOVE, ease: "sine.inOut" }, moveStart);
    tl.to(sun, { v: (i + 0.5) / 4.4, duration: MOVE, ease: "none" }, moveStart);
    // arrive: letters rise, then the rest settles
    tl.to(splits[i].chars, { yPercent: 0, duration: 0.55, ease: "power3.out", stagger: { amount: 0.28 } }, moveStart + MOVE - 0.5);
    tl.to(rest, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.06 }, moveStart + MOVE - 0.2);
    tl.addLabel(`k${i}`, moveStart + MOVE + 0.1);
    tl.to({}, { duration: HOLD });
    // leave
    const leave = tl.duration();
    tl.to(splits[i].chars, { yPercent: -160, duration: 0.4, ease: "power2.in", stagger: { amount: 0.12 } }, leave);
    tl.to(rest, { opacity: 0, y: -10, duration: 0.3, ease: "power1.in" }, leave);
  }
  const outStart = tl.duration();
  tl.to(cam, { c: EXIT - 0.25, duration: MOVE }, outStart);
  tl.to(sun, { v: 1, duration: MOVE, ease: "none" }, outStart);
  tl.to(exit, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, outStart + MOVE - 0.35);
  tl.addLabel("exit");
  tl.to({}, { duration: 0.5 });

  const unit = mobile ? 0.42 : 0.5; // viewport heights of scroll per timeline second
  const st = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${Math.round(tl.duration() * unit * window.innerHeight)}`,
    pin: stage,
    scrub: 0.6,
    animation: tl,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefresh: measure,
    onToggle: (self) => section.classList.toggle("is-active", self.isActive),
  });

  // The wall's arch window opens from its sill as the section arrives.
  const open = gsap.fromTo(
    win,
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: section, start: "top 85%", end: "top 15%", scrub: 0.4 } },
  );

  const lenis = getLenis();
  const onLenis = () => ScrollTrigger.update();
  lenis?.on("scroll", onLenis);

  const yOf = (label: string) => st.labelToScroll(label);
  const onToc = (e: Event) => {
    const i = Number((e.currentTarget as HTMLElement).dataset.i);
    scrollToY(yOf(`k${i}`));
  };
  tocBtns.forEach((b) => b.addEventListener("click", onToc));
  // Keyboard: focusing a level's link walks to that level.
  const onFocus = (e: FocusEvent) => {
    const i = chapters.findIndex((ch) => ch.contains(e.target as Node));
    if (i >= 0 && i !== current) scrollToY(yOf(`k${i}`), true);
  };
  section.addEventListener("focusin", onFocus);

  render();

  return () => {
    lenis?.off("scroll", onLenis);
    tocBtns.forEach((b) => b.removeEventListener("click", onToc));
    section.removeEventListener("focusin", onFocus);
    open.scrollTrigger?.kill();
    splits.forEach((s) => s.revert());
    section.classList.remove("is-live", "is-active");
    stage.style.removeProperty("--sun");
    stage.style.removeProperty("--end");
    portals.forEach((p) => {
      p.style.cssText = `z-index:${p.style.zIndex}`;
    });
    photos.forEach((p) => p && (p.style.opacity = ""));
    joints.forEach((j) => (j.style.transform = ""));
    chapters.forEach((c) => c.removeAttribute("data-on"));
    age.style.opacity = "";
    ageN.textContent = "3";
  };
}
