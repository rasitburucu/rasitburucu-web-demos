/**
 * kaliteKademesi() ve UyarlamaliKare (lodos-web-atolyesi teknik modülü: kalite-kademesi)
 *
 * Ne yapar:
 *   1) kaliteKademesi(): cihazı ölçer ve { kademe, dpr, neden } döner.
 *      kademe: "yok" (WebGL kurma) | "dusuk" | "orta" | "yuksek".
 *      - WebGL bağlamı yoksa → yok
 *      - WEBGL_debug_renderer_info ile çizici adı: SwiftShader, llvmpipe, softpipe, "Software",
 *        "Microsoft Basic Render" → yok (yazılım çizici; Lighthouse PAGE_HUNG verir)
 *      - failIfMajorPerformanceCaveat ile bağlam açılmıyorsa → yok (tarayıcı GPU'yu kara listeye
 *        almış ya da yazılım çiziciye düşmüş; çizici adı gizli olsa da yakalar)
 *      - kaba işaretçi (dokunmatik), deviceMemory, hardwareConcurrency, viewport genişliği ve
 *        Save-Data ile üst sınır düşer
 *      - ?kalite=yok|dusuk|orta|yuksek URL parametresi her şeyi geçersiz kılar (test için)
 *      GPU yoklaması pahalıdır (geçici bir WebGL bağlamı açar); sonuç modülde önbelleklenir,
 *      genişlik/işaretçi sınırları her çağrıda yeniden uygulanır.
 *   2) UyarlamaliKare: kare süresine göre kademeyi çalışırken düşürür/yükseltir.
 *      Pencere ortalaması 22 ms/kare üstünde → bir kademe düşür; 12 ms altında → bir kademe
 *      yükselt (başlangıç tavanını aşmadan); her değişimden sonra bekleme süresi.
 *
 * Kullanım:
 *   const k = kaliteKademesi();                 // yalnız istemcide (useEffect içinde) çağırın
 *   if (k.kademe === "yok") gosterStatikYedek();
 *   const yonetici = new UyarlamaliKare({ baslangic: k.kademe, onDegisim: (y) => setDpr(dprFor(y)) });
 *   gsap.ticker.add((_, deltaMs) => yonetici.kare(deltaMs));
 *   React için: ./useKaliteKademesi.ts
 *
 * Azaltılmış hareket: bu modül hareket üretmez; kademeyi değiştirmez (hareketi tüketen modül yönetir).
 * Mobil: kaba işaretçide en fazla "orta" ve DPR ≤ 1,5; 4 GB ve altı bellekte ya da ≤ 4 çekirdekte
 *   "orta", 2 GB / 2 çekirdekte "dusuk".
 * Erişilebilirlik: yok (ölçüm). "yok" kademesinde gösterilecek statik yedek içeriğin tamamını
 *   taşımalı.
 * Sınırlamalar (dürüst not):
 *   - 60 Hz ekranda requestAnimationFrame aralığı ~16,7 ms'dir; 12 ms eşiğine yalnız 90/120 Hz
 *     ekranlarda inilir. Yani 60 Hz'de yönetici pratikte yalnız düşürür. Gerçek iş süresini
 *     (CPU zamanı) besleyerek yükseltmeyi de açabilirsiniz.
 *   - Safari çizici adını "Apple GPU" diye maskeler; orada yalnız caveat ve donanım sinyalleri çalışır.
 *   - deviceMemory ve hardwareConcurrency kaba ve yuvarlanmış değerlerdir (gizlilik).
 * Bağımlılıklar: yok (tarayıcı API'leri).
 */

export type Kademe = "yok" | "dusuk" | "orta" | "yuksek";

export const KADEMELER: readonly Kademe[] = ["yok", "dusuk", "orta", "yuksek"] as const;

export type KaliteSonucu = {
  kademe: Kademe;
  /** Önerilen devicePixelRatio üst sınırı (tuval için). */
  dpr: number;
  /** Türkçe gerekçe; hata ayıklama ve test için. */
  neden: string;
  /** Okunabildiyse çizici adı. */
  cizici?: string;
};

const sira = (k: Kademe) => KADEMELER.indexOf(k);
export const enAzKademe = (a: Kademe, b: Kademe): Kademe => (sira(a) <= sira(b) ? a : b);
export const enCokKademe = (a: Kademe, b: Kademe): Kademe => (sira(a) >= sira(b) ? a : b);
export const kademeEnAz = (k: Kademe, esik: Kademe) => sira(k) >= sira(esik);

const YAZILIM_CIZICI = /swiftshader|llvmpipe|softpipe|software|microsoft basic render|basic render driver|mesa offscreen/i;

type GpuYoklama = { webgl: boolean; cizici?: string; yazilim: boolean; caveat: boolean };
let yoklamaOnbellegi: GpuYoklama | null = null;

function gpuYokla(): GpuYoklama {
  if (yoklamaOnbellegi) return yoklamaOnbellegi;
  const sonuc: GpuYoklama = { webgl: false, yazilim: false, caveat: false };
  try {
    const tuval = document.createElement("canvas");
    const gl = (tuval.getContext("webgl2") || tuval.getContext("webgl")) as WebGLRenderingContext | null;
    if (gl) {
      sonuc.webgl = true;
      const bilgi = gl.getExtension("WEBGL_debug_renderer_info");
      // Firefox uzantıyı kullanımdan kaldırdı ama RENDERER'da temizlenmiş adı verir.
      const ad = bilgi ? gl.getParameter(bilgi.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      if (typeof ad === "string") sonuc.cizici = ad;
      sonuc.yazilim = !!sonuc.cizici && YAZILIM_CIZICI.test(sonuc.cizici);
      gl.getExtension("WEBGL_lose_context")?.loseContext();

      const tuval2 = document.createElement("canvas");
      const gl2 = (tuval2.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
        tuval2.getContext("webgl", { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
      sonuc.caveat = !gl2;
      gl2?.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    sonuc.webgl = false;
  }
  yoklamaOnbellegi = sonuc;
  return sonuc;
}

function urlZorlamasi(): Kademe | null {
  try {
    const v = new URLSearchParams(window.location.search).get("kalite");
    return v && (KADEMELER as readonly string[]).includes(v) ? (v as Kademe) : null;
  } catch {
    return null;
  }
}

/** Kademe için önerilen DPR (cihazın kendi oranını aşmaz). */
export function kademeDpr(kademe: Kademe, cihazDpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, kaba = false): number {
  const tavan = kademe === "yuksek" ? 2 : kademe === "orta" ? 1.5 : 1;
  const dokunmatikTavan = kaba ? 1.5 : 2;
  return Math.max(1, Math.min(cihazDpr, tavan, dokunmatikTavan));
}

type Gezgin = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** Yalnız istemcide çağırın. SSR'da { kademe: "yok" } döner. */
export function kaliteKademesi(): KaliteSonucu {
  if (typeof window === "undefined") return { kademe: "yok", dpr: 1, neden: "sunucu tarafı" };

  const kaba = window.matchMedia("(pointer: coarse)").matches;
  const zorla = urlZorlamasi();
  if (zorla) return { kademe: zorla, dpr: kademeDpr(zorla, undefined, kaba), neden: `URL zorlaması (?kalite=${zorla})` };

  const gpu = gpuYokla();
  if (!gpu.webgl) return { kademe: "yok", dpr: 1, neden: "WebGL bağlamı açılamadı" };
  if (gpu.yazilim) return { kademe: "yok", dpr: 1, neden: `yazılım çizici: ${gpu.cizici}`, cizici: gpu.cizici };
  if (gpu.caveat)
    return { kademe: "yok", dpr: 1, neden: "tarayıcı büyük performans uyarısı veriyor (failIfMajorPerformanceCaveat)", cizici: gpu.cizici };

  const n = navigator as Gezgin;
  let kademe: Kademe = "yuksek";
  const nedenler: string[] = [];
  const sinirla = (k: Kademe, neden: string) => {
    if (sira(k) < sira(kademe)) {
      kademe = k;
      nedenler.push(neden);
    }
  };

  if (kaba) sinirla("orta", "dokunmatik (kaba işaretçi)");
  if (typeof n.deviceMemory === "number") {
    if (n.deviceMemory <= 2) sinirla("dusuk", `bellek ${n.deviceMemory} GB`);
    else if (n.deviceMemory <= 4) sinirla("orta", `bellek ${n.deviceMemory} GB`);
  }
  if (typeof n.hardwareConcurrency === "number") {
    if (n.hardwareConcurrency <= 2) sinirla("dusuk", `${n.hardwareConcurrency} çekirdek`);
    else if (n.hardwareConcurrency <= 4) sinirla("orta", `${n.hardwareConcurrency} çekirdek`);
  }
  if (window.innerWidth < 768) sinirla("orta", `dar viewport (${window.innerWidth} px)`);
  if (n.connection?.saveData) sinirla("dusuk", "Save-Data açık");

  return {
    kademe,
    dpr: kademeDpr(kademe, undefined, kaba),
    neden: nedenler.length ? nedenler.join(", ") : "donanım GPU, sınırlayıcı yok",
    cizici: gpu.cizici,
  };
}

/* ------------------------------------------------------------------------------------------ */

export type UyarlamaliKareSecenekleri = {
  baslangic: Kademe;
  /** Yükseltme tavanı; varsayılan başlangıç kademesi (ölçülenden yukarı çıkılmaz). */
  enCok?: Kademe;
  /** Düşürme tabanı; varsayılan "dusuk" (çalışırken WebGL kapatılmaz). */
  enAz?: Kademe;
  /** ms/kare; üstünde düşür. */
  dusurEsigi?: number;
  /** ms/kare; altında yükselt. */
  yukseltEsigi?: number;
  /** Değişimden sonra bekleme (ms). */
  bekleme?: number;
  /** Ortalama penceresi (kare). */
  pencere?: number;
  onDegisim?: (yeni: Kademe, eski: Kademe, ortalamaMs: number) => void;
};

export class UyarlamaliKare {
  private kademeDegeri: Kademe;
  private readonly enCok: Kademe;
  private readonly enAz: Kademe;
  private readonly dusurEsigi: number;
  private readonly yukseltEsigi: number;
  private readonly bekleme: number;
  private readonly pencere: number;
  private readonly onDegisim?: UyarlamaliKareSecenekleri["onDegisim"];
  private toplam = 0;
  private sayi = 0;
  private sonDegisim = -Infinity;
  private gecen = 0;

  constructor(s: UyarlamaliKareSecenekleri) {
    this.kademeDegeri = s.baslangic;
    this.enCok = s.enCok ?? s.baslangic;
    this.enAz = s.enAz ?? "dusuk";
    this.dusurEsigi = s.dusurEsigi ?? 22;
    this.yukseltEsigi = s.yukseltEsigi ?? 12;
    this.bekleme = s.bekleme ?? 2500;
    this.pencere = s.pencere ?? 45;
    this.onDegisim = s.onDegisim;
  }

  get kademe(): Kademe {
    return this.kademeDegeri;
  }

  /** Her çizilen karede çağırın (ms). Sekme dönüşü gibi > 250 ms sıçramalar yok sayılır. */
  kare(ms: number): Kademe {
    if (!(ms > 0) || ms > 250) return this.kademeDegeri;
    this.gecen += ms;
    this.toplam += ms;
    this.sayi++;
    if (this.sayi < this.pencere) return this.kademeDegeri;

    const ort = this.toplam / this.sayi;
    this.toplam = 0;
    this.sayi = 0;
    if (this.gecen - this.sonDegisim < this.bekleme) return this.kademeDegeri;

    const i = sira(this.kademeDegeri);
    let yeni = this.kademeDegeri;
    if (ort > this.dusurEsigi && i > sira(this.enAz)) yeni = KADEMELER[i - 1];
    else if (ort < this.yukseltEsigi && i < sira(this.enCok)) yeni = KADEMELER[i + 1];

    if (yeni !== this.kademeDegeri) {
      const eski = this.kademeDegeri;
      this.kademeDegeri = yeni;
      this.sonDegisim = this.gecen;
      this.onDegisim?.(yeni, eski, ort);
    }
    return this.kademeDegeri;
  }

  /** Ölçümü sıfırla (ör. sahne değişti). */
  sifirla() {
    this.toplam = 0;
    this.sayi = 0;
  }
}
