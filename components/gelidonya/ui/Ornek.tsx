import { tr } from "@/content/gelidonya/tr";

/** The one small "örnek" tag, set only after values a real firm would have to
 *  supply: phone, e-mail, address, list date, form and certificate numbers.
 *  The fiction as a whole is stated once, in the top strip and the footer. */
export function Ornek() {
  return (
    <span className="gd-ornek">
      <span className="gd-sr">(</span>
      {tr.ornek}
      <span className="gd-sr">)</span>
    </span>
  );
}
