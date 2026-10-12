// Vaziyet: road distance from the (fictional) factory town, Eskişehir, to the
// centre of every province, for the transport line of the cost estimate.
//
// One request to the public OSRM demo server (table service, driving profile,
// OpenStreetMap road network). The result is written to
// content/vaziyet/mesafe.json and the site reads it from there: no request is
// made at run time (the parent site's CSP allows none).
//
// Province centres are the city centres, rounded to two decimals; OSRM snaps
// each point to the nearest road, so the figures are centre-to-centre road
// distances, not door to door. The site says "yaklaşık" next to them.
//
// Data © OpenStreetMap contributors, ODbL 1.0; routing by OSRM
// (https://project-osrm.org). Attribution is shown beside the province picker.
//
//   node scripts/fetch-vaziyet-distances.mjs
import { writeFileSync } from "node:fs";

const OUT = "content/vaziyet/mesafe.json";
const UA = "rasitburucu-web-demos build script (https://rasitburucu.com)";

// plate, name, lat, lon
const ILLER = [
  [1, "Adana", 37.0, 35.32], [2, "Adıyaman", 37.76, 38.28], [3, "Afyonkarahisar", 38.76, 30.54], [4, "Ağrı", 39.72, 43.05],
  [5, "Amasya", 40.65, 35.83], [6, "Ankara", 39.93, 32.86], [7, "Antalya", 36.89, 30.7], [8, "Artvin", 41.18, 41.82],
  [9, "Aydın", 37.85, 27.84], [10, "Balıkesir", 39.65, 27.88], [11, "Bilecik", 40.14, 29.98], [12, "Bingöl", 38.88, 40.5],
  [13, "Bitlis", 38.4, 42.11], [14, "Bolu", 40.74, 31.61], [15, "Burdur", 37.72, 30.29], [16, "Bursa", 40.19, 29.06],
  [17, "Çanakkale", 40.15, 26.41], [18, "Çankırı", 40.6, 33.62], [19, "Çorum", 40.55, 34.95], [20, "Denizli", 37.78, 29.09],
  [21, "Diyarbakır", 37.91, 40.24], [22, "Edirne", 41.68, 26.56], [23, "Elazığ", 38.68, 39.22], [24, "Erzincan", 39.75, 39.49],
  [25, "Erzurum", 39.9, 41.27], [26, "Eskişehir", 39.78, 30.52], [27, "Gaziantep", 37.07, 37.38], [28, "Giresun", 40.91, 38.39],
  [29, "Gümüşhane", 40.46, 39.48], [30, "Hakkâri", 37.58, 43.74], [31, "Hatay", 36.2, 36.16], [32, "Isparta", 37.76, 30.55],
  [33, "Mersin", 36.8, 34.63], [34, "İstanbul", 41.01, 28.98], [35, "İzmir", 38.42, 27.14], [36, "Kars", 40.6, 43.1],
  [37, "Kastamonu", 41.38, 33.78], [38, "Kayseri", 38.72, 35.49], [39, "Kırklareli", 41.73, 27.22], [40, "Kırşehir", 39.15, 34.16],
  [41, "Kocaeli", 40.77, 29.92], [42, "Konya", 37.87, 32.48], [43, "Kütahya", 39.42, 29.98], [44, "Malatya", 38.35, 38.31],
  [45, "Manisa", 38.61, 27.43], [46, "Kahramanmaraş", 37.58, 36.94], [47, "Mardin", 37.31, 40.74], [48, "Muğla", 37.22, 28.36],
  [49, "Muş", 38.74, 41.49], [50, "Nevşehir", 38.62, 34.71], [51, "Niğde", 37.97, 34.68], [52, "Ordu", 40.98, 37.88],
  [53, "Rize", 41.02, 40.52], [54, "Sakarya", 40.78, 30.4], [55, "Samsun", 41.29, 36.33], [56, "Siirt", 37.93, 41.94],
  [57, "Sinop", 42.03, 35.15], [58, "Sivas", 39.75, 37.02], [59, "Tekirdağ", 40.98, 27.51], [60, "Tokat", 40.31, 36.55],
  [61, "Trabzon", 41.0, 39.72], [62, "Tunceli", 39.11, 39.55], [63, "Şanlıurfa", 37.16, 38.8], [64, "Uşak", 38.68, 29.41],
  [65, "Van", 38.49, 43.38], [66, "Yozgat", 39.82, 34.81], [67, "Zonguldak", 41.45, 31.79], [68, "Aksaray", 38.37, 34.03],
  [69, "Bayburt", 40.26, 40.23], [70, "Karaman", 37.18, 33.22], [71, "Kırıkkale", 39.85, 33.51], [72, "Batman", 37.89, 41.13],
  [73, "Şırnak", 37.52, 42.46], [74, "Bartın", 41.64, 32.34], [75, "Ardahan", 41.11, 42.7], [76, "Iğdır", 39.92, 44.04],
  [77, "Yalova", 40.66, 29.28], [78, "Karabük", 41.2, 32.62], [79, "Kilis", 36.72, 37.12], [80, "Osmaniye", 37.07, 36.25],
  [81, "Düzce", 40.84, 31.16],
];

const ORIGIN = ILLER.find((i) => i[0] === 26);
const points = [ORIGIN, ...ILLER].map(([, , lat, lon]) => `${lon},${lat}`).join(";");
const url = `https://router.project-osrm.org/table/v1/driving/${points}?sources=0&annotations=distance`;

const res = await fetch(url, { headers: { "User-Agent": UA } });
if (!res.ok) throw new Error(`OSRM ${res.status}`);
const data = await res.json();
if (data.code !== "Ok") throw new Error(`OSRM ${data.code}`);
const row = data.distances[0].slice(1);

const out = {
  kaynak: "OpenStreetMap katkıda bulunanlar (ODbL), OSRM; il merkezleri arası karayolu",
  tarih: new Date().toISOString().slice(0, 10),
  cikis: "Eskişehir",
  iller: ILLER.map(([plaka, ad], i) => ({
    plaka,
    ad,
    // nearest 5 km; the factory town itself gets a nominal local haul
    km: plaka === 26 ? 25 : Math.max(25, Math.round(row[i] / 1000 / 5) * 5),
  })),
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(
  "yazıldı",
  OUT,
  out.iller.filter((x) => [16, 6, 34, 35, 7, 30].includes(x.plaka)).map((x) => `${x.ad} ${x.km}`).join(", "),
);
