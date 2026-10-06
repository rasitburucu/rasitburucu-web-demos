// Sazbahçe visit map: real geometry from OpenStreetMap, drawn by us as SVG.
//
// Downloads (Overpass API) the lake (Uluabat Gölü, relation 1273044), the
// Marmara coastline, rivers, motorways / trunk / primary roads, towns, and
// around Gölyazı the minor roads and villages. Projects to a local plane
// (1 unit = 10 m, origin 40.20 N / 28.75 E, x east, y south), simplifies,
// and writes content/sazbahce/map-geo.json. The site then draws it with no
// external request (the parent site's CSP allows no outside tiles).
//
// Data © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright).
// The attribution is shown on the map itself; licence notes in THIRD_PARTY.md.
//
//   node scripts/fetch-sazbahce-map.mjs           (uses the cache in scripts/.raw/sazbahce/ when present)
//   node scripts/fetch-sazbahce-map.mjs --fetch   (downloads again)
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const RAW = "scripts/.raw/sazbahce";
const OUT = "content/sazbahce/map-geo.json";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const UA = "rasitburucu-web-demos map build (https://rasitburucu.com)";

// The concept venue is fictional. Its pin sits on the east shore of the
// Eskikaraağaç inlet, west of Gölyazı yolu (a right turn when driving south),
// on farmland: no business, monument or named place within ~700 m (checked
// against OSM on 2026-10-06). The page says "konum örnektir" beside the pin.
const VENUE = { lat: 40.1845, lon: 28.6795 };

const LAT0 = 40.2;
const LON0 = 28.75;
const KX = Math.cos((LAT0 * Math.PI) / 180) * 111320; // m per degree of longitude at LAT0
const KY = 110574; // m per degree of latitude
const UNIT = 10; // metres per SVG unit

// region data box (larger than any view) and the close box around Gölyazı
const BOX = { s: 40.03, w: 28.3, n: 40.48, e: 29.2 };
const CLOSE = { s: 40.1, w: 28.55, n: 40.25, e: 28.8 };
// minor roads are kept only inside this tighter box (the close view and a margin)
const MINOR = { s: 40.12, w: 28.6, n: 40.235, e: 28.79 };

const QUERIES = {
  lake: `[out:json][timeout:120];rel(1273044);out geom;`,
  region: `[out:json][timeout:150];(way["natural"="coastline"](${BOX.s},${BOX.w},${BOX.n},${BOX.e});way["highway"~"^(motorway|trunk|primary)$"](${BOX.s},${BOX.w},${BOX.n},${BOX.e});node["place"~"^(city|town)$"](${BOX.s},${BOX.w},${BOX.n},${BOX.e});way["waterway"="river"](${BOX.s},${BOX.w},${BOX.n},${BOX.e}););out geom;`,
  close: `[out:json][timeout:150];(way["highway"~"^(secondary|tertiary|unclassified)$"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e});node["place"~"^(village|hamlet|neighbourhood|suburb|quarter|island|islet)$"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e});way["place"~"^(island|islet)$"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e});way["natural"="wetland"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e}););out geom;`,
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function overpass(name) {
  const file = `${RAW}/osm-${name}.json`;
  if (!process.argv.includes("--fetch") && existsSync(file)) {
    const text = readFileSync(file, "utf8");
    if (text.trimStart().startsWith("{")) return JSON.parse(text);
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(OVERPASS, {
      method: "POST",
      headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(QUERIES[name]),
    });
    const text = await res.text();
    if (res.ok && text.trimStart().startsWith("{")) {
      mkdirSync(RAW, { recursive: true });
      writeFileSync(file, text);
      return JSON.parse(text);
    }
    console.warn(`overpass ${name}: ${res.status}, retrying`);
    await wait(15000 * (attempt + 1)); // Overpass rate limit: be patient
  }
  throw new Error(`overpass ${name} failed`);
}

const proj = (p) => [((p.lon - LON0) * KX) / UNIT, ((LAT0 - p.lat) * KY) / UNIT];

/** Douglas–Peucker on projected points. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-9;
    let max = -1;
    let at = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > max) {
        max = d;
        at = i;
      }
    }
    if (max > tol) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Joins ways that share end nodes into longer chains (rings close themselves). */
function join(ways) {
  const key = (p) => `${p.lat.toFixed(7)},${p.lon.toFixed(7)}`;
  const left = ways.map((w) => w.slice());
  const chains = [];
  while (left.length) {
    let chain = left.shift();
    let grew = true;
    while (grew) {
      grew = false;
      for (let i = 0; i < left.length; i++) {
        const w = left[i];
        const cs = key(chain[0]);
        const ce = key(chain[chain.length - 1]);
        const ws = key(w[0]);
        const we = key(w[w.length - 1]);
        if (ce === ws) chain = chain.concat(w.slice(1));
        else if (ce === we) chain = chain.concat(w.slice(0, -1).reverse());
        else if (cs === we) chain = w.concat(chain.slice(1));
        else if (cs === ws) chain = w.slice(1).reverse().concat(chain);
        else continue;
        left.splice(i, 1);
        grew = true;
        break;
      }
    }
    chains.push(chain);
  }
  return chains;
}

const inBox = (p, b) => p.lat >= b.s && p.lat <= b.n && p.lon >= b.w && p.lon <= b.e;

/** Keeps the runs of a line that fall inside a box (plus one point either side). */
function clipLine(pts, b) {
  const runs = [];
  let run = [];
  pts.forEach((p, i) => {
    const inside = inBox(p, b) || (i > 0 && inBox(pts[i - 1], b)) || (i < pts.length - 1 && inBox(pts[i + 1], b));
    if (inside) run.push(p);
    else if (run.length) {
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1);
}

const fmt = (n, dp) => {
  const s = n.toFixed(dp);
  return s.includes(".") ? s.replace(/\.?0+$/, "").replace(/^-0$/, "0") : s;
};
/** Rings: split at the point farthest from the start so both halves simplify. */
function simplifyRing(pts, tol) {
  const p = pts.slice(0, -1);
  let far = 0;
  let max = -1;
  p.forEach(([x, y], i) => {
    const dd = Math.hypot(x - p[0][0], y - p[0][1]);
    if (dd > max) {
      max = dd;
      far = i;
    }
  });
  const a = simplify(p.slice(0, far + 1), tol);
  const b = simplify(p.slice(far).concat([p[0]]), tol);
  return a.concat(b.slice(1, -1));
}

function d(pts, tol, dp, close = false) {
  const s = close ? simplifyRing(pts.map(proj), tol) : simplify(pts.map(proj), tol);
  if (s.length < (close ? 3 : 2)) return "";
  if (s.length < 2) return "";
  let out = `M${fmt(s[0][0], dp)} ${fmt(s[0][1], dp)}`;
  for (let i = 1; i < s.length; i++) out += `L${fmt(s[i][0], dp)} ${fmt(s[i][1], dp)}`;
  return close ? out + "Z" : out;
}

const lakeRes = await overpass("lake");
const regionRes = await overpass("region");
const closeRes = await overpass("close");
const lake = lakeRes.elements[0];
const region = regionRes.elements;
const close = closeRes.elements;

// --- lake: outer + inner rings, one even-odd path (islands stay land)
const ring = (role) => join(lake.members.filter((m) => m.role === role).map((m) => m.geometry));
const outer = ring("outer");
const inner = ring("inner");
const lakeD = [...outer, ...inner].map((r) => d(r, 0.5, 1, true)).filter(Boolean).join("");

// --- sea: the Marmara coastline closed over the top of the data box
const coastChains = join(region.filter((e) => e.tags?.natural === "coastline").map((e) => e.geometry));
const coastRuns = coastChains.flatMap((c) => clipLine(c, BOX)).sort((a, b) => b.length - a.length);
const coast = simplify(coastRuns[0].map(proj), 3);
const top = ((LAT0 - BOX.n - 0.05) * KY) / UNIT;
const seaPts = [...coast, [coast[coast.length - 1][0], top], [coast[0][0], top]];
const seaD = "M" + seaPts.map(([x, y]) => `${fmt(x, 0)} ${fmt(y, 0)}`).join("L") + "Z";

// --- roads and rivers
function lines(filter, tol, dp, box = BOX) {
  const ways = region.concat(close).filter(filter);
  const seen = new Set();
  const out = [];
  for (const w of ways) {
    if (seen.has(w.id)) continue;
    seen.add(w.id);
    for (const r of clipLine(w.geometry, box)) {
      const s = d(r, tol, dp);
      if (s) out.push(s);
    }
  }
  return out.join("");
}
// Gölyazı yolu from D200 to the village: the named ways plus the short unnamed
// bridge between them and the street into Gölyazı (OSM way ids, 2026-10-06).
const GOLYAZI_YOLU = [1392131942, 1392131941, 519561047, 1561747173, 330909854];
const hw = (k) => (e) => e.type === "way" && e.tags?.highway === k;
const roads = {
  motorway: lines(hw("motorway"), 1.2, 0),
  trunk: lines(hw("trunk"), 1.2, 0),
  primary: lines(hw("primary"), 6, 0),
  // minor roads only around Gölyazı (shown in the close view)
  minor: lines((e) => e.type === "way" && /^(secondary|tertiary|unclassified)$/.test(e.tags?.highway ?? ""), 0.9, 0, MINOR),
  golyaziYolu: lines((e) => e.type === "way" && GOLYAZI_YOLU.includes(e.id), 0.4, 1, CLOSE),
};
const rivers = lines((e) => e.type === "way" && e.tags?.waterway === "river", 3, 0);

// --- places (names as in OSM; only towns and villages, no businesses)
const places = {};
for (const e of [...region, ...close]) {
  if (e.type !== "node" || !e.tags?.place || !e.tags?.name) continue;
  const [x, y] = proj(e);
  places[e.tags.name] = [Math.round(x), Math.round(y)];
}

const [vx, vy] = proj(VENUE);
const geo = {
  source: "© OpenStreetMap contributors, ODbL 1.0 — Overpass API, fetched by scripts/fetch-sazbahce-map.mjs",
  osmBase: (regionRes.osm3s?.timestamp_osm_base ?? "").slice(0, 10),
  unitMetres: UNIT,
  origin: { lat: LAT0, lon: LON0 },
  venue: { lat: VENUE.lat, lon: VENUE.lon, x: Math.round(vx), y: Math.round(vy) },
  sea: seaD,
  lake: lakeD,
  rivers,
  roads,
  places,
};
writeFileSync(OUT, JSON.stringify(geo));
const kb = (s) => (s.length / 1024).toFixed(1) + " KB";
console.log(`wrote ${OUT}: ${kb(JSON.stringify(geo))}`);
console.log(` sea ${kb(seaD)} · lake ${kb(lakeD)} (${outer.length} outer, ${inner.length} inner) · rivers ${kb(rivers)}`);
for (const [k, v] of Object.entries(roads)) console.log(` ${k} ${kb(v)}`);
console.log(` places: ${Object.keys(places).join(", ")}`);
console.log(` venue ${VENUE.lat}, ${VENUE.lon} -> ${Math.round(vx)}, ${Math.round(vy)}`);
