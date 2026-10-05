import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./sazbahce.css";
import "./pages.css";
import { tr } from "@/content/sazbahce/tr";
import { PlanProvider } from "@/lib/sazbahce/store";
import { Header, Strip } from "@/components/sazbahce/shell/Header";
import { Footer } from "@/components/sazbahce/shell/Footer";

// Anybody: a width-axis grotesk; set wide (112–135%) it has the broad, even
// letters of a survey drawing's title block. Headlines, logo, plan labels.
// Onest: a plain, open grotesk with clear figures for dates, counts and forms.
// Both SIL OFL, subset to Latin + Turkish (ğ Ğ ı İ ş Ş) and served from this
// repo (app/sazbahce/fonts).
const display = localFont({
  src: "./fonts/anybody-tr.woff2",
  weight: "500 850",
  style: "normal",
  variable: "--sb-display",
  display: "swap",
  fallback: ["Arial", "Helvetica Neue", "sans-serif"],
  declarations: [{ prop: "font-stretch", value: "100% 150%" }],
});

const sans = localFont({
  src: "./fonts/onest-tr.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--sb-sans",
  display: "swap",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rasitburucu.com"),
  title: tr.meta.title,
  description: tr.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: tr.meta.title, description: tr.meta.description, locale: "tr_TR", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#E9EDE6",
  colorScheme: "light",
};

const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function SazbahceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="sazbahce" lang="tr" className={`${display.variable} ${sans.variable} sb-root`}>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <PlanProvider>
        <a className="sb-skip" href="#icerik">
          {tr.skip}
        </a>
        <Strip />
        <Header />
        <main id="icerik" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </PlanProvider>
    </div>
  );
}
