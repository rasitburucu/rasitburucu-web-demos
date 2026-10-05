"use client";

import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { isoWeek, nf, telYaz, weekRange } from "@/lib/gelidonya/hesap";
import { useOrder } from "@/lib/gelidonya/siparis";
import { loadSet, rng, trayBitmap, trayImgRatio, type TraySet } from "@/lib/gelidonya/viyol-kare";

const MAX_DRAWN = 900;

/** Every tray of the order on the delivery bench (signature moment 2). */
function Bench() {
  const { result, grow } = useOrder();
  const ref = useRef<HTMLCanvasElement>(null);
  const prev = useRef({ n: 0, id: "", grow: -1 });
  const { f, viyol, last } = result;
  const shown = Math.min(viyol, MAX_DRAWN);
  const [set, setSet] = useState<TraySet | null>(null);

  useEffect(() => {
    let on = true;
    loadSet(f).then(
      (s) => on && setSet(s),
      () => undefined,
    );
    return () => {
      on = false;
    };
  }, [f]);

  useEffect(() => {
    const cv = ref.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx || !set || set.leaf !== f.leaf || set.cells !== f.cells) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = prev.current;
    const from = reduce ? shown : p.id !== f.id ? 0 : p.grow !== grow ? Math.min(p.n, shown) : shown;
    prev.current = { n: shown, id: f.id, grow };
    let raf = 0;
    let t0 = performance.now();
    let box = { width: 0, height: 0 };
    let started = false;
    let dpr = 1;
    // one bitmap for a full tray and one for the partly filled last tray,
    // made at the drawn size; every tray on the bench is a copy
    let bm: { w: number; full: HTMLCanvasElement; last: HTMLCanvasElement } | null = null;
    const bitmaps = (w: number) => {
      const px = Math.round(w * dpr);
      if (!bm || bm.w !== px) bm = { w: px, full: trayBitmap(set, px, f.cells, 7), last: trayBitmap(set, px, last, 7) };
      return bm;
    };

    const size = () => {
      const want = Math.ceil(layout(cv.getBoundingClientRect().width).need);
      if (Math.abs(cv.getBoundingClientRect().height - want) > 1) cv.style.height = `${want}px`;
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      box = { width: r.width, height: r.height };
    };

    // the tray pictures carry a shadow margin: overlap the margins
    const ratio = trayImgRatio(f.cells);
    const lap = 0.1;
    /** Largest tray width (≤ 170 px) whose rows fit the height cap; the canvas
     *  then takes exactly the height of its rows, no empty bench below. */
    const layout = (W: number) => {
      const cap = W < 600 ? 320 : 560;
      for (let w = Math.min(170, W); w > 8; w -= 1) {
        const c = Math.max(1, Math.floor((W - w * lap) / (w * (1 - lap))));
        const rows = Math.ceil(shown / c);
        const need = rows * w * ratio * (1 - lap * 1.6) + w * ratio * lap * 1.6;
        if (need <= cap) return { w, c, need };
      }
      return { w: 8, c: Math.floor(W / 7), need: cap };
    };

    const frame = (now: number) => {
      const { width: W, height: H } = box;
      cx.clearRect(0, 0, W, H);
      const { w, c } = layout(W);
      const h = w * ratio;
      const stepX = w * (1 - lap);
      const stepY = h * (1 - lap * 1.6);
      const { full, last: lastBm } = bitmaps(w);
      const el = now - t0;
      // the far rows recede a little: smaller and drawn towards the middle,
      // computed per tray so the bitmaps stay sharp (no CSS 3D resampling)
      const rowsN = Math.ceil(shown / c);
      const gridW = (c - 1) * stepX + w;
      const x0 = (W - gridW) / 2;
      for (let i = 0; i < shown; i++) {
        const row = Math.floor(i / c);
        const depth = rowsN > 1 ? 1 - row / (rowsN - 1) : 0;
        const sc = 1 - 0.1 * depth;
        const bx = x0 + (i % c) * stepX;
        const x = W / 2 + (bx + w / 2 - W / 2) * sc - (w * sc) / 2;
        const y = row * stepY + (h * (1 - sc)) / 2;
        const k = i < from ? 1 : Math.min(1, Math.max(0, (el - (i - from) * 6) / 260));
        if (k <= 0) continue;
        cx.save();
        cx.globalAlpha = k;
        cx.translate(0, (1 - k) * -12);
        const R = rng(i + 3);
        cx.translate(x + w / 2, y + h / 2);
        cx.rotate((R() - 0.5) * 0.02);
        cx.translate(-(x + w / 2), -(y + h / 2));
        cx.drawImage(i === viyol - 1 ? lastBm : full, x, y, w * sc, h * sc);
        cx.restore();
      }
      if (el < (shown - from) * 6 + 280) raf = requestAnimationFrame(frame);
    };

    const go = () => {
      if (started) return;
      started = true;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    };
    size();
    // animate when the bench is actually seen
    const io = new IntersectionObserver(([e]) => e.isIntersecting && go(), { threshold: 0.2 });
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      size();
      frame(performance.now() + 1e9);
    });
    ro.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [f, shown, viyol, last, grow, set]);

  const t = tr.tezgah;
  return (
    <div className="gd-bench">
      <canvas ref={ref} className="gd-bench-canvas" role="img" aria-label={t.canvasAlt(nf(viyol), last, f.cells)} />
      <p className="gd-bench-cap" aria-hidden="true">
        {t.benchCap(nf(viyol), last, f.cells)}
      </p>
      {viyol > MAX_DRAWN && <p className="gd-bench-more">{t.more(nf(viyol - MAX_DRAWN))}</p>}
    </div>
  );
}

type Form = { ad: string; tel: string; yer: string; tohum: string; anac: string };

export function Tezgah() {
  const t = tr.tezgah;
  const { order, result, setSpare } = useOrder();
  const [form, setForm] = useState<Form>({ ad: "", tel: "", yer: "", tohum: t.seedOurs, anac: t.rootstockOptions[0] });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [slip, setSlip] = useState(false);
  const slipRef = useRef<HTMLDivElement>(null);
  const f = result.f;
  const grafted = f.kind === "aşılı";

  useEffect(() => {
    // scrollIntoView honours scroll-margin (the sticky header); focus alone does not
    if (slip) {
      slipRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
      slipRef.current?.focus({ preventScroll: true });
    }
  }, [slip]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<Record<keyof Form, string>> = {};
    if (!form.ad.trim()) err.ad = t.required;
    const digits = form.tel.replace(/\D/g, "");
    if (!digits) err.tel = t.required;
    else if (digits.length < 10 || digits.length > 11) err.tel = t.phoneInvalid;
    if (!form.yer.trim()) err.yer = t.required;
    setErrors(err);
    const first = (Object.keys(err) as (keyof Form)[])[0];
    if (first) {
      document.getElementById(`gd-${first}`)?.focus();
      return;
    }
    setSlip(true);
  };

  const tw = isoWeek(order.delivery);
  const sw = isoWeek(result.sowing);
  const r = t.slipRows;

  return (
    <section className="gd-tezgah" id="tezgah" aria-labelledby="gd-tezgah-title">
      <div className="gd-wrap gd-tezgah-grid">
        <div className="gd-tezgah-head">
          <h2 id="gd-tezgah-title" className="gd-h2">
            {t.title}
          </h2>
          <p className="gd-lead">{t.lead}</p>
        </div>
        <Bench />
        <div className="gd-tezgah-side" data-gd-bar-hide>
          {!slip ? (
            <form className="gd-card gd-form" onSubmit={submit} noValidate>
              <h3 className="gd-h3">{t.formTitle}</h3>
              <p className="gd-form-sum">
                {f.name} ({f.kind}) · {nf(result.fide)} fide · {nf(result.viyol)} viyol · {tw.w}. hafta
              </p>
              <div className="gd-input">
                <label htmlFor="gd-ad">{t.name}</label>
                <input id="gd-ad" name="ad" autoComplete="name" value={form.ad} onChange={set("ad")} aria-invalid={!!errors.ad} aria-describedby={errors.ad ? "gd-ad-e" : undefined} />
                {errors.ad && <p id="gd-ad-e" className="gd-err">{errors.ad}</p>}
              </div>
              <div className="gd-input">
                <label htmlFor="gd-tel">{t.phone}</label>
                <input id="gd-tel" name="tel" type="tel" inputMode="tel" autoComplete="tel" value={form.tel} onChange={set("tel")} aria-invalid={!!errors.tel} aria-describedby={errors.tel ? "gd-tel-e" : undefined} />
                {errors.tel && <p id="gd-tel-e" className="gd-err">{errors.tel}</p>}
              </div>
              <div className="gd-input">
                <label htmlFor="gd-yer">{t.place}</label>
                <input id="gd-yer" name="yer" autoComplete="address-level3" placeholder={t.placeHint} value={form.yer} onChange={set("yer")} aria-invalid={!!errors.yer} aria-describedby={errors.yer ? "gd-yer-e" : undefined} />
                {errors.yer && <p id="gd-yer-e" className="gd-err">{errors.yer}</p>}
              </div>
              <fieldset className="gd-field gd-field--tight">
                <legend>{t.seed}</legend>
                <div className="gd-chips">
                  {[t.seedOurs, t.seedMine].map((s) => (
                    <label key={s} className="gd-chip gd-chip--sm">
                      <input type="radio" name="tohum" value={s} checked={form.tohum === s} onChange={set("tohum")} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="gd-input">
                <label htmlFor="gd-anac">{t.rootstock}</label>
                {grafted ? (
                  <select id="gd-anac" value={form.anac} onChange={set("anac")}>
                    {t.rootstockOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <p id="gd-anac" className="gd-muted">
                    {t.rootstockNone}
                  </p>
                )}
              </div>
              <label className="gd-check">
                <input type="checkbox" checked={order.spare} onChange={(e) => setSpare(e.target.checked)} />
                <span>
                  <b>{t.spare}</b> {t.spareHint}
                </span>
              </label>
              <button type="submit" className="gd-btn gd-btn--dark gd-btn--big">
                {t.submit}
              </button>
              <p className="gd-demo">{t.demo}</p>
            </form>
          ) : (
            <div className="gd-card gd-slip" ref={slipRef} tabIndex={-1} role="status" aria-labelledby="gd-slip-title">
              <p className="gd-slip-stamp" aria-hidden="true">
                {t.slipStamp}
              </p>
              <h3 id="gd-slip-title" className="gd-h3">
                {t.slipTitle}
              </h3>
              <dl className="gd-slip-rows">
                <div><dt>{r.product}</dt><dd>{f.name} ({f.kind})</dd></div>
                <div><dt>{r.fide}</dt><dd>{nf(result.fide)}</dd></div>
                <div><dt>{r.viyol}</dt><dd>{tr.label.viyolValue(nf(result.viyol), f.cells)}</dd></div>
                <div><dt>{r.sowing}</dt><dd>{tr.label.weekValue(sw.w, weekRange(result.sowing))}</dd></div>
                <div><dt>{r.delivery}</dt><dd>{tr.label.weekValue(tw.w, weekRange(order.delivery))}</dd></div>
                <div><dt>{r.place}</dt><dd>{form.yer}</dd></div>
                <div><dt>{r.seed}</dt><dd>{form.tohum === t.seedOurs ? t.seedSlip.ours : t.seedSlip.mine}</dd></div>
                {grafted && <div><dt>{r.rootstock}</dt><dd>{form.anac}</dd></div>}
                <div><dt>{r.name}</dt><dd>{form.ad}</dd></div>
                <div><dt>{r.phone}</dt><dd>{telYaz(form.tel)}</dd></div>
              </dl>
              <p>{t.slipNext}</p>
              <p className="gd-demo">{t.slipDemo}</p>
              <div className="gd-slip-act">
                <button type="button" className="gd-btn gd-btn--line" onClick={() => setSlip(false)}>
                  {t.slipEdit}
                </button>
                <button type="button" className="gd-btn gd-btn--line" onClick={() => window.print()}>
                  {t.slipPrint}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
