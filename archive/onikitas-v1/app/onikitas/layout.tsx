import type { Metadata, Viewport } from "next";
import { Gloock, Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./onikitas.css";
import { tr } from "@/content/onikitas/tr";
import { Shell } from "@/components/onikitas/shell/Shell";
import { TopStrip } from "@/components/onikitas/shell/TopStrip";
import { Header } from "@/components/onikitas/shell/Header";
import { Footer } from "@/components/onikitas/shell/Footer";

const gloock = Gloock({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-gloock",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-schibsted",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: tr.meta.title, template: `%s · Onikitaş` },
  description: tr.meta.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f2eee6",
};

export default function OnikitasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-demo="onikitas"
      lang="tr"
      className={`${gloock.variable} ${schibsted.variable} ${plexMono.variable} min-h-dvh overflow-x-clip`}
    >
      <Shell>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-olive focus:px-4 focus:py-2 focus:text-lime"
        >
          {tr.nav.skip}
        </a>
        <TopStrip />
        <Header />
        <div id="icerik">{children}</div>
        <Footer />
      </Shell>
    </div>
  );
}
