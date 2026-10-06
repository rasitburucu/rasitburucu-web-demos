import Link from "next/link";

const demos = [
  { href: "/onikitas", name: "Onikitaş", note: "Bodrum'da 12 villalık kurgusal konut projesi" },
  { href: "/revak", name: "Revak Okulları", note: "İstanbul'da anaokulundan liseye kurgusal özel okul; ön kayıt, tur ve bursluluk akışlarıyla" },
  { href: "/kalemkar", name: "Kalemkâr", note: "Gaziantep'te tek menülü kurgusal şef restoranı; bakır sini üstünde rezervasyon akışıyla" },
  { href: "/pazi", name: "Pazı Robotik", note: "Gebze'de kurgusal cobot paletleme entegratörü; canlı robot hücresi ve ön fizibilite akışıyla" },
  { href: "/sazbahce", name: "Sazbahçe", note: "Uluabat Gölü kıyısında kurgusal düğün ve davet bahçesi; misafir sayısına göre dizilen kıyı planı ve teklif özetiyle" },
  { href: "/gelidonya", name: "Gelidonya", note: "Kumluca'da kurgusal sera üreticisi ve fidelik; hazır fide listesi, fide hesabı, OpenStreetMap haritası" },
];

export default function Index() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "48px 24px", maxWidth: 640, margin: "0 auto", lineHeight: 1.5 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>rasitburucu.com web demoları</h1>
      <p style={{ color: "#555" }}>Kurgusal markalar için konsept çalışmalar.</p>
      <ul style={{ paddingLeft: 18 }}>
        {demos.map((d) => (
          <li key={d.href}>
            <Link href={d.href}>{d.name}</Link> <span style={{ color: "#555" }}>{d.note}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
