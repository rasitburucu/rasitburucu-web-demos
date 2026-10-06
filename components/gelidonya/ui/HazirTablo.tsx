import { tr } from "@/content/gelidonya/tr";
import { urunById, type HazirSatir } from "@/content/gelidonya/urunler";
import { gunAy, nf } from "@/lib/gelidonya/hesap";
import { WaButton } from "../shell/Wa";

const H = tr.hazir;

export const satirAdet = (r: HazirSatir) => r.adetViyol * r.viyol;

/** One line in words: used for the WhatsApp message and the CSV. */
export function satirMetni(r: HazirSatir) {
  const u = urunById(r.urun);
  const asi = H.asiNames[r.asi].toLocaleLowerCase("tr");
  const anac = r.asi === "asili" ? ` (${r.anac.toLocaleLowerCase("tr")})` : "";
  const when = r.durum === "olacak" ? `${gunAy(r.hazir)} itibarıyla hazır` : H.durum[r.durum].toLocaleLowerCase("tr");
  return `${u.name}, ${r.tip.toLocaleLowerCase("tr")}, ${asi}${anac}, ${H.govdeValue(r.govde).toLocaleLowerCase("tr")} gövde, ${r.viyol} gözlü viyol, ${nf(satirAdet(r))} adet (${r.adetViyol} viyol), ${when}`;
}

/** The ready-seedling table. A real table on wide screens; each row a card on
 *  a phone (labels from data-label). */
export function HazirTablo({ rows, caption, id }: { rows: HazirSatir[]; caption: string; id?: string }) {
  const c = H.cols;
  return (
    <div className="gd-table-wrap">
      <table className="gd-table gd-hz" id={id}>
        <caption className="gd-sr">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{c.urun}</th>
            <th scope="col">{c.anac}</th>
            <th scope="col">{c.govde}</th>
            <th scope="col">{c.viyol}</th>
            <th scope="col" className="gd-num">
              {c.adet}
            </th>
            <th scope="col">{c.hazir}</th>
            <th scope="col">{c.durum}</th>
            <th scope="col" className="gd-hz-askcol">
              <span className="gd-sr">{c.ask}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const u = urunById(r.urun);
            return (
              <tr key={r.id}>
                <th scope="row">
                  <b>{u.name}</b> <span>{r.tip}</span>
                </th>
                <td data-label={c.anac} className="gd-hz-anac">
                  <span>
                    {H.asiNames[r.asi]}
                    {r.asi === "asili" && <span className="gd-muted"> · {r.anac}</span>}
                  </span>
                </td>
                <td data-label={c.govde}>{H.govdeValue(r.govde)}</td>
                <td data-label={c.viyol}>{H.viyolValue(r.viyol)}</td>
                <td data-label={c.adet} className="gd-num">
                  {H.adetValue(nf(satirAdet(r)), r.adetViyol)}
                </td>
                <td data-label={c.hazir} className="gd-tnum">
                  {gunAy(r.hazir)}
                </td>
                <td data-label={c.durum} className="gd-hz-durum">
                  <span className={`gd-durum gd-durum--${r.durum}`}>{H.durum[r.durum]}</span>
                </td>
                <td className="gd-hz-ask">
                  <WaButton message={H.message(satirMetni(r))} className="gd-btn gd-btn--line gd-btn--sm">
                    {H.ask}
                    <span className="gd-sr">
                      : {u.name} {r.tip}, {H.viyolValue(r.viyol)}
                    </span>
                  </WaButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
