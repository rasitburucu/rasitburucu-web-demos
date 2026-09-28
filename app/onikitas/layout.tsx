import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Instrument_Sans, Pinyon_Script } from "next/font/google";
import "./onikitas.css";
import { tr } from "@/content/onikitas/tr";

// DM Serif Display keeps the Didone elegance but with sturdier hairlines, so
// headlines and the clock stay legible over the busy 3D hillside.
// Instrument Sans carries the quiet interface.
const display = DM_Serif_Display({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// The wordmark: an engraver's copperplate script, like a name cut into a
// limestone lintel. Used only for "Onikitaş" (header, loader, footer).
const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-pinyon",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: tr.meta.title,
  description: tr.meta.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f2eee6",
  colorScheme: "light",
};

// Marks the document as scripted before first paint, so the loader and the
// scroll-driven copy only take over when JavaScript can run them.
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function OnikitasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="onikitas" lang="tr" className={`${display.variable} ${instrument.variable} ${pinyon.variable} oki-root`}>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      {children}
    </div>
  );
}
