// Photo registry: alt text (Turkish, part of the copy) and focal point, merged
// with the sizes written by scripts/process-revak-images.mjs.
import dims from "./image-dims.json";

const meta = {
  revak: { alt: "Taş revağın içinden, çocuk göz hizasından bakış; sabah güneşi kemerlerin gölgesini zemine düşürüyor", pos: "50% 50%" },
  revakWide: { alt: "Avluya açılan taş revak, sabah güneşinde", pos: "50% 55%" },
  avlu: { alt: "Bahçeden bakınca taş revak, servi ağaçları ve arkada orman", pos: "50% 60%" },
  bahceYolu: { alt: "Servi sırası ile taş revak arasındaki bahçe yolu, sonunda orman", pos: "50% 55%" },
  aksamBahce: { alt: "Akşam ışığında revağın sonundaki bahçe ve serviler", pos: "50% 60%" },
  hero: { alt: "Taş kemerlerin altından geçen gölgeli bir revak", pos: "50% 60%" },
  anaokulu: { alt: "Ahşap bloklarla kule kuran bir çocuğun elleri", pos: "50% 55%" },
  ilkokul: { alt: "Kareli deftere kalemle yazan bir öğrencinin elleri", pos: "40% 50%" },
  ortaokul: { alt: "Mikroskop tablasına örnek yerleştiren eldivenli eller", pos: "45% 50%" },
  lise: { alt: "Sırt çantalarıyla okul merdivenini çıkan iki öğrenci", pos: "62% 50%" },
  writing: { alt: "Kâğıda kalemle not alan bir el", pos: "50% 40%" },
  music: { alt: "Çello çalan bir müzisyenin elleri ve yayı", pos: "50% 40%" },
  robotics: { alt: "Devre kartına kablo bağlayan eller", pos: "50% 50%" },
  debate: { alt: "Sahnede bir mikrofon", pos: "30% 50%" },
  ceramics: { alt: "Çömlek tezgâhında kili biçimlendiren eller", pos: "50% 50%" },
  stage: { alt: "Sahneye bakan kırmızı koltuk sıraları", pos: "50% 40%" },
  library: { alt: "Kütüphanede uzanan kitap rafları", pos: "50% 50%" },
  pool: { alt: "Kulvar ipleriyle ayrılmış kapalı yüzme havuzu", pos: "50% 50%" },
  court: { alt: "Akşam ışığında basketbol sahası", pos: "50% 60%" },
  chess: { alt: "Satranç tahtasında hamle düşünen bir oyuncu", pos: "55% 70%" },
  campus: { alt: "Kampüsün kemerli pencereli tuğla binası", pos: "50% 45%" },
  kampusHero: { alt: "Kemerli pencereleriyle tuğla okul binası", pos: "50% 50%" },
  kabul: { alt: "Uzaklaşan taş kemerler", pos: "50% 50%" },
  lab: { alt: "Laboratuvarda cam deney kapları", pos: "50% 60%" },
  dining: { alt: "Gün ışığı alan yemekhanede ahşap masalar", pos: "50% 60%" },
  garden: { alt: "Çalılar arasında kıvrılan bahçe yolu", pos: "50% 60%" },
  classroom: { alt: "Pencereden süzülen ışıkla boş bir sınıf", pos: "50% 70%" },
  corridor: { alt: "Güneş vuran okul koridoru", pos: "50% 50%" },
} as const;

export type ImageKey = keyof typeof meta;

type Dim = { file: string; w: number; h: number; widths: number[] };

export const IMAGES = Object.fromEntries(
  (Object.keys(meta) as ImageKey[]).map((k) => [k, { ...(dims as Record<string, Dim>)[k], ...meta[k] }]),
) as Record<ImageKey, Dim & { alt: string; pos?: string }>;
