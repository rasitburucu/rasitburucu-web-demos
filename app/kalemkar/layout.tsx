import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./kalemkar.css";
import { tr } from "@/content/kalemkar/tr";
import { BookingProvider } from "@/lib/kalemkar/store";
import { Header, MobileBar } from "@/components/kalemkar/shell/Header";
import { Footer, Strip } from "@/components/kalemkar/shell/Footer";

// Young Serif: a sturdy, warm serif with the weight of hand-cut lettering; it
// carries headlines, plate names and the words engraved round the sini.
// Geologica: a variable grotesk with clear figures for times, prices and forms.
// Both are SIL OFL fonts, subset to Latin + Turkish (ğ Ğ ı İ ş Ş) and served
// from this repo (app/kalemkar/fonts). Young Serif has no ₺: prices read "TL".
const serif = localFont({
  src: "./fonts/young-serif-tr.woff2",
  weight: "400",
  style: "normal",
  variable: "--kk-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: "./fonts/geologica-tr.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--kk-sans",
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
  themeColor: "#17130F",
  colorScheme: "dark",
};

const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function KalemkarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="kalemkar" lang="tr" className={`${serif.variable} ${sans.variable} kk-root`}>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <BookingProvider>
        <a className="kk-skip" href="#icerik">
          {tr.skip}
        </a>
        <Strip />
        <Header />
        <main id="icerik" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileBar />
      </BookingProvider>
    </div>
  );
}
