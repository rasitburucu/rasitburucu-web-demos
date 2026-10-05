import type { Metadata } from "next";
import { tr } from "@/content/sazbahce/tr";
import { RequestFlow } from "@/components/sazbahce/pages/RequestFlow";

export const metadata: Metadata = {
  title: tr.meta.requestTitle,
  description: tr.meta.requestDescription,
  robots: { index: false, follow: false },
};

export default function RequestPage() {
  const r = tr.requestPage;
  return (
    <div className="sb-page">
      <header className="sb-wrap sb-page-head">
        <h1 className="sb-h1">{r.title}</h1>
        <p className="sb-lede">{r.lead}</p>
      </header>
      <div className="sb-wrap">
        <RequestFlow />
      </div>
    </div>
  );
}
