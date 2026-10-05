import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./gelidonya.css";
import { tr } from "@/content/gelidonya/tr";
import { Footer, Strip } from "@/components/gelidonya/shell/Shell";
import { Header } from "@/components/gelidonya/shell/Header";
import { MobileBar } from "@/components/gelidonya/shell/MobileBar";
import { OrderProvider } from "@/lib/gelidonya/siparis";

// Big Shoulders Display: the narrow, stencil-like capitals painted on seedling
// trolleys and produce crates; headlines and the big figures.
// Schibsted Grotesk: a sturdy grotesk with clear figures for forms and labels.
// Both SIL OFL, subset to Latin + Turkish (ğ Ğ ı İ ş Ş) in app/gelidonya/fonts.
const display = localFont({
  src: "./fonts/big-shoulders-display-tr.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--gd-display",
  display: "swap",
  // a metric-matched fallback keeps the headline's line breaks close to the
  // real face, so the order form barely moves when the font arrives
  adjustFontFallback: "Arial",
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif"],
});

const sans = localFont({
  src: "./fonts/schibsted-grotesk-tr.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--gd-sans",
  display: "swap",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rasitburucu.com"),
  title: { default: tr.meta.title, template: `%s | Gelidonya` },
  description: tr.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: tr.meta.title, description: tr.meta.description, locale: "tr_TR", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#F3F4F1",
  colorScheme: "light",
};

// Marks the document as scripted before first paint, so motion-only states
// apply only when JavaScript can undo them.
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function GelidonyaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="gelidonya" lang="tr" className={`${display.variable} ${sans.variable} gd-root`}>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <OrderProvider>
        <a className="gd-skip" href="#icerik">
          {tr.skip}
        </a>
        <Strip />
        <Header />
        <main id="icerik" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileBar />
      </OrderProvider>
    </div>
  );
}
