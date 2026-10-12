// The plot check travels in the address, so the quote page and the printable
// site-plan sheet open with the visitor's own numbers (and the link can be
// sent to a spouse or an architect). Short keys; every value is checked.
import { MODEL_IDLER, type ModelId } from "@/content/vaziyet/modeller";
import { ILLER, SINIR, VARSAYILAN, YONLER, type Donus, type Durum, type Nitelik, type Yon } from "./hesap";

const N: Record<string, Nitelik> = { a: "arsa", t: "tarla", b: "bilmiyorum" };
const NK: Record<Nitelik, string> = { arsa: "a", tarla: "t", bilmiyorum: "b" };
const KEYS = ["a", "n", "t", "k", "c", "h", "y", "m", "r", "p", "il"];

const yuvarla = (n: number) => Math.round(n * 100) / 100;

export function kodla(d: Durum): string {
  const p = new URLSearchParams();
  p.set("a", `${d.W}x${d.D}`);
  p.set("n", NK[d.nitelik]);
  p.set("t", String(d.taks));
  p.set("k", String(d.kaks));
  p.set("c", `${d.on}-${d.yan}-${d.arka}`);
  p.set("h", String(d.hmax));
  p.set("y", d.yol);
  p.set("m", d.model);
  p.set("r", String(d.rot));
  if (d.x !== null && d.y !== null) p.set("p", `${yuvarla(d.x)}_${yuvarla(d.y)}`);
  p.set("il", String(d.il));
  return p.toString();
}

function sayi(v: string | null, k: keyof typeof SINIR): number | undefined {
  if (v === null) return undefined;
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return undefined;
  const [a, b] = SINIR[k];
  return n >= a && n <= b ? n : undefined;
}

/** null when the address carries no plot at all */
export function coz(search: string, temel: Durum = VARSAYILAN): Durum | null {
  const p = new URLSearchParams(search);
  if (!KEYS.some((k) => p.has(k))) return null;
  const d: Durum = { ...temel };
  const a = p.get("a")?.split("x");
  if (a && a.length === 2) {
    d.W = sayi(a[0], "W") ?? d.W;
    d.D = sayi(a[1], "D") ?? d.D;
  }
  d.nitelik = N[p.get("n") ?? ""] ?? d.nitelik;
  d.taks = sayi(p.get("t"), "taks") ?? d.taks;
  d.kaks = sayi(p.get("k"), "kaks") ?? d.kaks;
  const c = p.get("c")?.split("-");
  if (c && c.length === 3) {
    d.on = sayi(c[0], "on") ?? d.on;
    d.yan = sayi(c[1], "yan") ?? d.yan;
    d.arka = sayi(c[2], "arka") ?? d.arka;
  }
  d.hmax = sayi(p.get("h"), "hmax") ?? d.hmax;
  const y = p.get("y") as Yon | null;
  if (y && YONLER.includes(y)) d.yol = y;
  const m = p.get("m") as ModelId | null;
  if (m && MODEL_IDLER.includes(m)) {
    if (m !== d.model) {
      d.x = null;
      d.y = null;
    }
    d.model = m;
  }
  const r = Number(p.get("r"));
  if ([0, 90, 180, 270].includes(r) && p.has("r")) d.rot = r as Donus;
  const pos = p.get("p")?.split("_");
  if (pos && pos.length === 2) {
    const x = parseFloat(pos[0]);
    const yy = parseFloat(pos[1]);
    if (Number.isFinite(x) && Number.isFinite(yy) && Math.abs(x) < 400 && Math.abs(yy) < 400) {
      d.x = x;
      d.y = yy;
    }
  } else if (p.has("m") || p.has("a") || p.has("r")) {
    d.x = null;
    d.y = null;
  }
  const il = Number(p.get("il"));
  if (ILLER.some((i) => i.plaka === il)) d.il = il;
  return d;
}
