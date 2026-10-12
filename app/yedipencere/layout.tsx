import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./yedipencere.css";
import { StayProvider } from "@/lib/yedipencere/store";
import { Defs } from "@/components/yedipencere/draw/Defs";

// Spectral (Production Type): a screen serif with a pen's fine hairlines, for
// headlines, room names and prices. Barlow Semi Condensed (Jeremy Tribby): a
// low-contrast grotesk close to drawing-office lettering, for the interface,
// notes and figures. Both SIL OFL, subset to Latin + Turkish, served from this repo.
// next/font names the family after the variable: keep these names clear of the
// CSS generic keywords ("serif", "sans-serif").
const spectral = localFont({
  src: [
    { path: "./fonts/spectral-300-tr.woff2", weight: "300", style: "normal" },
    { path: "./fonts/spectral-400-tr.woff2", weight: "400", style: "normal" },
  ],
  variable: "--yp-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const barlow = localFont({
  src: [
    { path: "./fonts/barlow-semi-condensed-400-tr.woff2", weight: "400", style: "normal" },
    { path: "./fonts/barlow-semi-condensed-500-tr.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlow-semi-condensed-600-tr.woff2", weight: "600", style: "normal" },
  ],
  variable: "--yp-sans",
  display: "swap",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rasitburucu.com"),
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#EEEDE9",
  colorScheme: "light",
};

export default function YediPencereLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="yedipencere" className={`${spectral.variable} ${barlow.variable} yp-root`}>
      <Defs />
      <StayProvider>{children}</StayProvider>
    </div>
  );
}
