import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import "./onikitas.css";
import { tr } from "@/content/onikitas/tr";

// Bodoni's hairline-to-heavy contrast mirrors a cube in low sun: one face lit,
// one in shadow. Instrument Sans carries the quiet interface.
const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
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
    <div data-demo="onikitas" lang="tr" className={`${bodoni.variable} ${instrument.variable} oki-root`}>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      {children}
    </div>
  );
}
