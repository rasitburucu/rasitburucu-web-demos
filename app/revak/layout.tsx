import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Marcellus } from "next/font/google";
import "./revak.css";
import "./almanak.css";
import { tr } from "@/content/revak/tr";
import { RevakProvider } from "@/lib/revak/store";
import { FlowGate, Header, MobileBar } from "@/components/revak/shell/Header";
import { Footer, Strip } from "@/components/revak/shell/Footer";
import { Reveal } from "@/components/revak/shell/Reveal";
import { RouteSignal, SmoothScroll } from "@/components/revak/shell/Motion";

// Marcellus: a flared, glyphic face drawn from Roman inscriptions; the school's
// names read as if cut into the arcade's lintel. One weight, no italic.
// Hanken Grotesk: a calm grotesk for forms and body. Both with latin-ext for ğ ş ı İ.
const serif = Marcellus({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--rv-serif",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--rv-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rasitburucu.com"),
  title: tr.meta.title,
  description: tr.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: tr.meta.title, description: tr.meta.description, locale: "tr_TR", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#E7E5E0",
  colorScheme: "light",
};

const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function RevakLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="revak" lang="tr" className={`${serif.variable} ${sans.variable} rv-root`}>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <RevakProvider>
        <a className="rv-skip" href="#icerik">
          {tr.skip}
        </a>
        <Strip />
        <Header />
        <main id="icerik" tabIndex={-1}>
          {children}
        </main>
        <FlowGate>
          <Footer />
        </FlowGate>
        <MobileBar />
        <Reveal />
        <SmoothScroll />
        <RouteSignal />
      </RevakProvider>
    </div>
  );
}
