import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import "./revak.css";
import "./almanak.css";
import { tr } from "@/content/revak/tr";
import { RevakProvider } from "@/lib/revak/store";
import { FlowGate, Header, MobileBar } from "@/components/revak/shell/Header";
import { Footer, Strip } from "@/components/revak/shell/Footer";
import { Reveal } from "@/components/revak/shell/Reveal";
import { RouteSignal, SmoothScroll } from "@/components/revak/shell/Motion";

// Newsreader: an optical-size serif with bookish numerals, for headlines and
// the few large numbers. Hanken Grotesk: a calm grotesk for forms and body.
// Both with latin-ext for ğ ş ı İ.
const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--rv-serif",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--rv-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: tr.meta.title,
  description: tr.meta.description,
  robots: { index: false, follow: false },
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
