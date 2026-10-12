import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./damar.css";
import "./pages.css";
import "./sheet.css";
import { en } from "@/content/damar/en";
import { ANTIQUED_TEXTURE } from "@/lib/damar/slabs";

// Brygada 1918: a 1918 Polish book face redrawn; titles, stone names, folios
// and every changing figure (it has tabular lining numerals).
// Albert Sans: a plain grotesk for the interface and the long text.
// Both SIL OFL, subset to Latin + Turkish in app/damar/fonts (fontTools).
const serif = localFont({
  src: "./fonts/brygada-1918-tr.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--dm-serif-face",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});

const sans = localFont({
  src: "./fonts/albert-sans-tr.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--dm-sans-face",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rasitburucu.com"),
  title: { default: en.meta.homeTitle, template: "%s | Damar" },
  description: en.meta.homeDescription,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#3C1A1E",
  colorScheme: "dark",
};

// Marks the document as scripted before first paint; a visitor who has seen
// the book open in this session (or arrives at a chosen pair) gets it open
// from the first frame. Key shared with components/damar/home/Book.tsx.
const JS_FLAG = `(function(d){d.classList.add('js');try{if(sessionStorage.getItem('damar-book-opened')==='1'||/[?&]stone=/.test(location.search))d.classList.add('dm-opened')}catch(e){}})(document.documentElement)`;

export default function DamarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-demo="damar"
      className={`${serif.variable} ${sans.variable} dm-root`}
      style={{ "--dm-tex-url": `url(${ANTIQUED_TEXTURE})` } as React.CSSProperties}
    >
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      {children}
    </div>
  );
}
