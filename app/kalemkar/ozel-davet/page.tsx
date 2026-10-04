import type { Metadata } from "next";
import { tr } from "@/content/kalemkar/tr";
import { Invite } from "@/components/kalemkar/flow/Invite";
import { Photo } from "@/components/kalemkar/ui/Photo";

export const metadata: Metadata = {
  title: tr.meta.inviteTitle,
  description: tr.meta.inviteDescription,
  robots: { index: false, follow: false },
};

export default function OzelDavet() {
  const t = tr.invite;
  return (
    <div className="kk-wrap kk-invite-page">
      <div className="kk-invite-grid">
        <div>
          <h1 className="kk-flow-title">{t.title}</h1>
          <p className="kk-lede">{t.sub}</p>
          <Invite />
        </div>
        <div className="kk-invite-side" aria-hidden="false">
          <figure>
            <Photo k="kubbe" sizes="(max-width: 899px) 92vw, 34vw" />
            <figcaption>{t.capRoom}</figcaption>
          </figure>
          <figure className="kk-invite-side-2">
            <Photo k="servis" sizes="(max-width: 899px) 60vw, 20vw" />
            <figcaption>{t.capServe}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
