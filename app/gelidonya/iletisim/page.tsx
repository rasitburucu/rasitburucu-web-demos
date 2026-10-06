import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { Harita } from "@/components/gelidonya/pages/Harita";
import { PhoneIcon, WaButton } from "@/components/gelidonya/shell/Wa";

export const metadata: Metadata = {
  title: "İletişim ve ziyaret",
  description:
    "Gelidonya fideliği: kimi hangi iş için arayacağınız, adres, teslim noktası ve saatleri, harita ve yol tarifi, ziyaret randevusu. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/iletisim/" },
};

export default function IletisimPage() {
  const p = tr.iletisim;
  const b = tr.brand;
  const c = tr.contact;
  const z = tr.ziyaret;
  return (
    <>
      <header className="gd-page-head">
        <div className="gd-wrap">
          <h1 className="gd-h1">{p.title}</h1>
          <p className="gd-lead">{p.lead}</p>
        </div>
      </header>

      <section className="gd-sec gd-sec--tight" aria-labelledby="gd-roles">
        <div className="gd-wrap">
          <h2 id="gd-roles" className="gd-sr">
            {p.rolesTitle}
          </h2>
          <ul className="gd-roles">
            <li className="gd-role gd-role--main">
              <p className="gd-role-name">{p.central}</p>
              <a href={b.phoneHref} className="gd-role-phone gd-tnum">
                {b.phone}
              </a>
              <p className="gd-muted">{c.hours[0]}</p>
              <WaButton
                message={tr.wa.general}
                className="gd-btn gd-btn--light"
              />
            </li>
            {p.roles.map((r) => (
              <li key={r.role} className="gd-role">
                <p className="gd-role-name">{r.role}</p>
                <p className="gd-role-who">{r.who}</p>
                <a href={r.href} className="gd-role-phone gd-tnum">
                  <PhoneIcon /> {r.phone}
                </a>
                <p className="gd-muted">{r.for}</p>
              </li>
            ))}
          </ul>
          <p className="gd-note">
            {p.roleNote} {b.email}{" "}
            <span className="gd-muted">[{b.emailNote}]</span>
          </p>
        </div>
      </section>

      <section
        className="gd-sec gd-sec--white"
        id="harita"
        aria-labelledby="gd-map-title"
      >
        <div className="gd-wrap gd-visit">
          <div className="gd-visit-map">
            <h2 id="gd-map-title" className="gd-h2">
              {p.mapTitle}
            </h2>
            <Harita />
          </div>
          <dl className="gd-facts gd-facts--light">
            <div>
              <dt>{p.addressTitle}</dt>
              <dd>
                <address>
                  {c.address.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </address>
                <p className="gd-muted">{p.mapLead}</p>
              </dd>
            </div>
            <div>
              <dt>{p.teslimTitle}</dt>
              <dd>
                <span>
                  {z.teslimText}{" "}
                  <span className="gd-muted">[{z.teslimNote}]</span>
                </span>
              </dd>
            </div>
            <div>
              <dt>{p.visitTitle}</dt>
              <dd>
                <span>{p.visitText}</span>
                <a href={p.roles[0].href} className="gd-link gd-tnum">
                  {p.roles[0].phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>{p.hoursTitle}</dt>
              <dd>
                {c.hours.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
