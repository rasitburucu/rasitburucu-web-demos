import Link from "next/link";
import { tr } from "@/content/gelidonya/tr";
import { HAZIR, LISTE_TARIHI } from "@/content/gelidonya/urunler";
import { DAY, tarih } from "@/lib/gelidonya/hesap";
import { gorsel, Resim } from "../ui/Resim";
import { Ornek } from "../ui/Ornek";
import { PhoneIcon, WaButton, WaIcon } from "../shell/Wa";

/** First screen: the grower's two questions (who do I call, what is on the
 *  bench) on a flat panel; the nursery render fills the rest to the right edge
 *  with nothing laid over it. */
export function Hero() {
  const h = tr.hero;
  const b = tr.brand;
  const now = HAZIR.filter((r) => r.durum === "hazir").length;
  const boylu = HAZIR.filter((r) => r.durum === "boylu").length;
  const soon = HAZIR.filter((r) => r.durum === "olacak" && r.hazir <= LISTE_TARIHI + 14 * DAY).length;
  return (
    <section className="gd-hero" aria-labelledby="gd-hero-title">
      <Resim k={gorsel("fidelik-gunes", "fidelik")} className="gd-hero-media" alt={h.imageAlt} sizes="(min-width: 1100px) 64vw, 100vw" priority />
      <div className="gd-hero-panel">
        <div className="gd-hero-copy">
          <h1 id="gd-hero-title" className="gd-h1">
            {h.title}
          </h1>
          <p className="gd-hero-lead">{h.lead}</p>
          <div className="gd-hero-act" data-gd-bar-hide>
            <a href={b.phoneHref} className="gd-btn gd-btn--dark gd-btn--big gd-call">
              <PhoneIcon />
              <span>
                {h.call}
                <span className="gd-hide-sm gd-tnum"> {b.phone}</span>
              </span>
            </a>
            <WaButton message={tr.wa.general} className="gd-btn gd-btn--line gd-btn--big">
              <WaIcon />
              <span>
                WhatsApp<span className="gd-hide-sm">{tr.wa.buttonTail}</span>
              </span>
            </WaButton>
          </div>
          <p className="gd-hero-note">{h.hours}</p>
        </div>
        <Link href={`${tr.base}/hazir-fide/`} className="gd-gate">
          <span className="gd-gate-title">{h.gateTitle}</span>
          <span className="gd-gate-big">
            <span className="gd-gate-n gd-tnum">{now}</span>
            <span className="gd-gate-what">{h.gateToday}</span>
          </span>
          <span className="gd-gate-more">{h.gateMore(boylu, soon)}</span>
          <span className="gd-gate-foot">
            <span className="gd-gate-date">
              {h.gateDate(tarih(LISTE_TARIHI))}
              <Ornek />
            </span>
            <span className="gd-gate-go" aria-hidden="true">
              {h.gateLink}
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
