import type { Metadata, Viewport } from "next";
import "./pazi.css";
import "./sections.css";
import "./flow.css";
import { tr } from "@/content/pazi/tr";
import { asset } from "@/lib/asset";
import { ConceptStrip, Footer, Header } from "@/components/pazi/shell/Shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://rasitburucu.com"),
  title: { default: tr.meta.title, template: `%s | ${tr.brand.name}` },
  description: tr.meta.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: tr.meta.title,
    description: tr.meta.description,
    images: [{ url: asset("/pazi/og.jpg"), width: 1200, height: 630, alt: tr.meta.ogAlt }],
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#D6D7D1",
  colorScheme: "light",
};

// Marks the document as scripted before first paint, so motion-only states
// (dropping layers, hidden fallbacks) apply only when JavaScript can undo them.
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function PaziLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="pazi" lang="tr" className="pz-root">
      <link rel="preload" href={asset("/pazi/fonts/archivo-latin-wdth-normal.woff2")} as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href={asset("/pazi/fonts/martian-mono-latin-wdth-normal.woff2")} as="font" type="font/woff2" crossOrigin="anonymous" />
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <a className="pz-skip" href="#icerik">
        {tr.skip}
      </a>
      <ConceptStrip />
      <Header />
      <main id="icerik" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
