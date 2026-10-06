// Gelidonya visit map: real geometry from OpenStreetMap, drawn by us as SVG.
//
// Same method as scripts/fetch-sazbahce-map.mjs. Downloads (Overpass API) the
// coastline between Antalya and Demre, the D400 and the other main roads,
// rivers and towns; around Kumluca the minor roads, streams, villages and the
// greenhouse / orchard areas that are mapped in OSM. Projects to a local plane
// (1 unit = 10 m, origin 36.40 N / 30.30 E, x east, y south), simplifies, and
// writes content/gelidonya/map-geo.json. The site draws it with no external
// request (the parent site's CSP allows no outside tiles, frames or scripts).
//
// Data © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright).
// The attribution is shown on the map itself; licence notes in THIRD_PARTY.md.
//
//   node scripts/fetch-gelidonya-map.mjs           (uses the cache in scripts/.raw/gelidonya/ when present)
//   node scripts/fetch-gelidonya-map.mjs --fetch   (downloads again)
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const RAW = "scripts/.raw/gelidonya";
const OUT = "content/gelidonya/map-geo.json";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const UA = "rasitburucu-web-demos map build (https://rasitburucu.com)";

// The concept nursery is fictional. Its pin sits on open farmland south-east of
// Kumluca, ~70 m south of an unnamed farm road (OSM way 128672229), 2.5 km east
// of the D400: no business, landuse, building or named feature within ~700 m
// in OSM (checked 2026-10-06). The page says "konum örnektir" beside the pin.
const VENUE = { lat: 36.3372, lon: 30.3058 };

const LAT0 = 36.4;
const LON0 = 30.3;
const KX = Math.cos((LAT0 * Math.PI) / 180) * 111320; // m per degree of longitude at LAT0
const KY = 110574; // m per degree of latitude
const UNIT = 10; // metres per SVG unit

// region data box (larger than any view) and the box around Kumluca
const BOX = { s: 36.05, w: 29.75, n: 37.0, e: 30.85 };
const CLOSE = { s: 36.27, w: 30.17, n: 36.45, e: 30.42 };
// minor roads and land use are kept only inside this tighter box (the close view and a margin)
const MINOR = { s: 36.295, w: 30.225, n: 36.395, e: 30.375 };

const QUERIES = {
  region: `[out:json][timeout:170];(way["natural"="coastline"](${BOX.s},${BOX.w},${BOX.n},${BOX.e});way["highway"~"^(motorway|trunk|primary|secondary)$"](${BOX.s},${BOX.w},${BOX.n},${BOX.e});node["place"~"^(city|town)$"](${BOX.s},${BOX.w},${BOX.n},${BOX.e});way["waterway"="river"](${BOX.s},${BOX.w},${BOX.n},${BOX.e}););out geom;`,
  close: `[out:json][timeout:170];(way["highway"~"^(tertiary|unclassified|residential)$"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e});node["place"~"^(village|hamlet|neighbourhood|suburb|quarter)$"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e});way["landuse"~"^(greenhouse_horticulture|orchard|farmland|residential)$"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e});way["waterway"~"^(river|stream|canal)$"](${CLOSE.s},${CLOSE.w},${CLOSE.n},${CLOSE.e}););out geom;`,
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

/** Joins ways that share end nodes into longer chains, keeping each way's direction. */
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
        else if (cs === we) chain = w.concat(chain.slice(1));
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

function pathD(s, dp, close) {
  if (s.length < (close ? 3 : 2)) return "";
  let out = `M${fmt(s[0][0], dp)} ${fmt(s[0][1], dp)}`;
  for (let i = 1; i < s.length; i++) out += `L${fmt(s[i][0], dp)} ${fmt(s[i][1], dp)}`;
  return close ? out + "Z" : out;
}
function d(pts, tol, dp, close = false) {
  const s = close ? simplifyRing(pts.map(proj), tol) : simplify(pts.map(proj), tol);
  return pathD(s, dp, close);
}

const regionRes = await overpass("region");
await wait(1500);
const closeRes = await overpass("close");
const region = regionRes.elements;
const close = closeRes.elements;

// --- sea: the mainland coastline run through the data box, closed round the
// box's south-east (OSM coastlines keep the land on the left, sea on the right).
const coastChains = join(region.filter((e) => e.tags?.natural === "coastline").map((e) => e.geometry));
const key = (p) => `${p.lat.toFixed(7)},${p.lon.toFixed(7)}`;
const rings = coastChains.filter((c) => c.length > 3 && key(c[0]) === key(c[c.length - 1]));
const open = coastChains.filter((c) => !(c.length > 3 && key(c[0]) === key(c[c.length - 1])));
const mainRun = open.flatMap((c) => clipLine(c, BOX)).sort((a, b) => b.length - a.length)[0];
const coast = simplify(mainRun.map(proj), 2.5);
// box corners in projected units, walked clockwise from where the coast leaves the box
const bx = (lon) => ((lon - LON0) * KX) / UNIT;
const by = (lat) => ((LAT0 - lat) * KY) / UNIT;
const pad = 6000; // the region view reaches past the data box: keep the sea going
const X0 = bx(BOX.w) - pad;
const X1 = bx(BOX.e) + pad;

const Y1 = by(BOX.s) + pad;
// the coast runs from the west (Demre, Kaş) to the north-east (Antalya); the sea is
// to its right, i.e. south and east: close through the east edge, SE and SW corners
const first = coast[0];
const last = coast[coast.length - 1];
const seaPts = [...coast, [X1, last[1]], [X1, Y1], [X0, Y1], [X0, first[1]]];
const seaD = pathD(seaPts, 0, true);
// islands: closed coastline rings inside the box, drawn as land over the sea
const islands = rings
  .filter((r) => r.some((p) => inBox(p, BOX)))
  .map((r) => d(r, 1.2, 0, true))
  .filter(Boolean)
  .join("");

// --- roads and rivers
function lines(source, filter, tol, dp, box = BOX) {
  const seen = new Set();
  const out = [];
  for (const w of source.filter(filter)) {
    if (seen.has(w.id)) continue;
    seen.add(w.id);
    for (const r of clipLine(w.geometry, box)) {
      const s = d(r, tol, dp);
      if (s) out.push(s);
    }
  }
  return out.join("");
}
const all = region.concat(close);
const isD400 = (e) => /^D-?\s?400$/.test(e.tags?.ref ?? "");
const hw = (re) => (e) => e.type === "way" && re.test(e.tags?.highway ?? "");
const roads = {
  d400: lines(all, (e) => e.type === "way" && isD400(e), 2, 0),
  trunk: lines(all, (e) => hw(/^(motorway|trunk)$/)(e) && !isD400(e), 3, 0),
  primary: lines(all, (e) => hw(/^primary$/)(e) && !isD400(e), 8, 0),
  secondary: lines(all, (e) => hw(/^secondary$/)(e) && !isD400(e), 2, 0, MINOR),
  // close view only
  tertiary: lines(all, hw(/^tertiary$/), 0.8, 0, MINOR),
  minor: lines(all, hw(/^(unclassified|residential)$/), 0.8, 0, MINOR),
};
const rivers = lines(region, (e) => e.type === "way" && e.tags?.waterway === "river", 3, 0);
const streams = lines(close, (e) => e.type === "way" && /^(river|stream|canal)$/.test(e.tags?.waterway ?? ""), 1, 0, MINOR);

// --- land use around Kumluca (as mapped in OSM; most greenhouses are not mapped)
const area = (filter) =>
  close
    .filter((e) => e.type === "way" && filter(e) && e.geometry.some((p) => inBox(p, MINOR)))
    .map((e) => d(e.geometry, 0.8, 0, true))
    .filter(Boolean)
    .join("");
const land = {
  greenhouse: area((e) => e.tags?.landuse === "greenhouse_horticulture"),
  orchard: area((e) => /^(orchard|farmland)$/.test(e.tags?.landuse ?? "")),
  town: area((e) => e.tags?.landuse === "residential"),
};

// --- places (names as in OSM; only towns, villages and quarters, no businesses)
const places = {};
for (const e of all) {
  if (e.type !== "node" || !e.tags?.place || !e.tags?.name) continue;
  const [x, y] = proj(e);
  places[e.tags.name] = [Math.round(x), Math.round(y)];
}

const [vx, vy] = proj(VENUE);
const geo = {
  source: "© OpenStreetMap contributors, ODbL 1.0 — Overpass API, fetched by scripts/fetch-gelidonya-map.mjs",
  osmBase: (regionRes.osm3s?.timestamp_osm_base ?? "").slice(0, 10),
  unitMetres: UNIT,
  origin: { lat: LAT0, lon: LON0 },
  venue: { lat: VENUE.lat, lon: VENUE.lon, x: Math.round(vx), y: Math.round(vy) },
  sea: seaD,
  islands,
  rivers,
  streams,
  roads,
  land,
  places,
};
writeFileSync(OUT, JSON.stringify(geo));
const kb = (s) => (s.length / 1024).toFixed(1) + " KB";
console.log(`wrote ${OUT}: ${kb(JSON.stringify(geo))}`);
console.log(` sea ${kb(seaD)} · islands ${kb(islands)} (${rings.length} rings) · rivers ${kb(rivers)} · streams ${kb(streams)}`);
for (const [k, v] of Object.entries(roads)) console.log(` road ${k} ${kb(v)}`);
for (const [k, v] of Object.entries(land)) console.log(` land ${k} ${kb(v)}`);
console.log(` coast from ${first.map(Math.round)} to ${last.map(Math.round)}`);
console.log(` places: ${Object.keys(places).join(", ")}`);
console.log(` venue ${VENUE.lat}, ${VENUE.lon} -> ${Math.round(vx)}, ${Math.round(vy)}`);
