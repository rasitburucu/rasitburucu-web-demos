import type { Metadata } from "next";
import "./reset.css";

export const metadata: Metadata = {
  title: "rasitburucu.com web demoları",
  description: "rasitburucu.com için hazırlanmış konsept web siteleri.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
