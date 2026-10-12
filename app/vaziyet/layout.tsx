import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./vaziyet.css";
import "./sayfalar.css";
import { tr } from "@/content/vaziyet/tr";
import { Footer, Strip } from "@/components/vaziyet/shell/Shell";
import { Header } from "@/components/vaziyet/shell/Header";
import { MobileBar } from "@/components/vaziyet/shell/MobileBar";
import { WaProvider } from "@/components/vaziyet/shell/Wa";
import { DurumProvider } from "@/lib/vaziyet/durum";

// Gabarito: a geometric grotesk, heavy and round-shouldered, the lettering on a
// board-game box lid but serious enough for a price. Headlines, logo, figures.
// Host Grotesk: a plain, open grotesk with even figures for the forms and the
// labels on the drawing. Both SIL OFL, subset to Latin + Turkish (ğ Ğ ı İ ş Ş)
// and served from this repo (app/vaziyet/fonts).
const display = localFont({
  src: "./fonts/gabarito-tr.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--vz-display",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

const sans = localFont({
  src: "./fonts/host-grotesk-tr.woff2",
  weight: "300 800",
  style: "normal",
  variable: "--vz-sans",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rasitburucu.com"),
  title: { default: tr.meta.title, template: "%s | Vaziyet" },
  description: tr.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: tr.meta.title, description: tr.meta.description, locale: "tr_TR", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#1D5444",
  colorScheme: "light",
};

// marks the document as scripted before first paint, so motion-only states
// apply only when JavaScript can undo them
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function VaziyetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="vaziyet" lang="tr" className={`${display.variable} ${sans.variable} vz-root`}>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <DurumProvider>
        <WaProvider>
          <a className="vz-skip" href="#icerik">
            {tr.skip}
          </a>
          <Strip />
          <Header />
          <main id="icerik" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <MobileBar />
        </WaProvider>
      </DurumProvider>
    </div>
  );
}
