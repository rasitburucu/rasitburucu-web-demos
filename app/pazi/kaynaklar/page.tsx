import type { Metadata } from "next";
import { tr } from "@/content/pazi/tr";
import { credits } from "@/content/pazi/credits";

export const metadata: Metadata = { title: tr.credits.title };

export default function CreditsPage() {
  return (
    <section className="pz-wrap pz-credits" aria-labelledby="pz-credits-title">
      <h1 id="pz-credits-title" className="pz-h2">
        {tr.credits.title}
      </h1>
      <p className="pz-lead">{tr.credits.lead}</p>
      <table className="pz-model-table">
        <caption className="pz-sr">{tr.credits.title}</caption>
        <tbody>
          {credits.map((c) => (
            <tr key={c.title}>
              <th scope="row">
                <a href={c.url} rel="noopener noreferrer" target="_blank">
                  {c.title}
                </a>
                <br />
                <span className="pz-flow-hint">{c.author}</span>
              </th>
              <td>
                {c.licence}
                <br />
                <span className="pz-flow-hint">{c.use}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="pz-flow-hint" style={{ marginTop: 24 }}>
        {tr.footer.concept}
      </p>
    </section>
  );
}
