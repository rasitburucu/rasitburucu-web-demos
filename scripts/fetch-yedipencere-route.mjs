// Yedi Pencere "kapıdan kapıya" strips: real walking routes from OpenStreetMap.
//
// Downloads (Overpass API) every walkable way in and around Kaleiçi plus the
// historic landmarks, builds a walking graph, and finds, from five real start
// points (tram stops, Hadrian's Gate, the underground car park, the old harbour)
// to the fictional hotel's door:
//   - the shortest walk, and
//   - a "luggage" walk that counts every metre of steps 25 times (so it takes
//     a longer step-free way when one exists).
// Elevation (SRTM 30 m, OpenTopoData) is sampled at the segment ends: only the
// total difference is trustworthy at street scale, the site uses it that way.
// Writes content/yedipencere/route-geo.json. The site reads that file and makes
// no request of its own (the parent site's CSP allows none).
//
// Data © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright).
// Shown on the strip as "Yol verisi: © OpenStreetMap katkıda bulunanlar".
//
//   node scripts/fetch-yedipencere-route.mjs           (uses the cache in scripts/.raw/yedipencere/ when present)
//   node scripts/fetch-yedipencere-route.mjs --fetch   (downloads again)
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const RAW = "scripts/.raw/yedipencere";
const OUT = "content/yedipencere/route-geo.json";
const UA = "rasitburucu-web-demos route build (https://rasitburucu.com)";
// overpass-api.de is tried first; the French instance answered when the main one was overloaded.
const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.openstreetmap.fr/api/interpreter", "https://maps.mail.ru/osm/tools/overpass/api/interpreter"];
const TOPO = "https://api.opentopodata.org/v1/srtm30m";

// The concept hotel is fictional. Its door sits on Hıdırlık Sokak, on the cliff
// edge about 65 m north of Hıdırlık Kulesi; no door number is shown anywhere.
const DOOR = { lat: 36.88184, lon: 30.70364, street: "Hıdırlık Sokak" };

// Real start points (OSM ids checked 2026-10-09).
const STARTS = {
  kalekapisi: { name: "Kale Kapısı", osm: "node/1740310345", lat: 36.887045, lon: 30.705551, note: "nostaljik tramvay durağı; taksi ve transfer burada bırakır" },
  ismetpasa: { name: "İsmetpaşa", osm: "node/2307526731", lat: 36.88833, lon: 30.707021, note: "AntRay durağı (havalimanı ve otogar hattı)" },
  // Street level outside the gate (the gate itself lies lower): a driver walks from here.
  hadrian: { name: "Üç Kapılar", osm: "node/1656005397", lat: 36.88531, lon: 30.708919, note: "Hadrian Kapısı'nın dışındaki tramvay durağı; çevresinde otoparklar var" },
  cumhuriyet: { name: "Cumhuriyet Meydanı otoparkı", osm: "node/2752820741", lat: 36.887285, lon: 30.703068, note: "yeraltı otoparkı" },
  marina: { name: "Yat Limanı", osm: "node/1420290795", lat: 36.884363, lon: 30.70215, note: "eski liman" },
};

const BOX = { s: 36.8785, w: 30.699, n: 36.89, e: 30.712 };
const bbox = `${BOX.s},${BOX.w},${BOX.n},${BOX.e}`;
const QUERIES = {
  ways: `[out:json][timeout:120];way["highway"](${bbox});(._;>;);out body;`,
  pois: `[out:json][timeout:60];(nwr["historic"]["name"](${bbox});nwr["man_made"="tower"]["name"](${bbox});node["highway"="elevator"](${bbox}););out center tags;`,
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fresh = process.argv.includes("--fetch");

async function overpass(name) {
  const file = `${RAW}/osm-${name}.json`;
  if (!fresh && existsSync(file)) {
    const text = readFileSync(file, "utf8");
    if (text.trimStart().startsWith("{")) return JSON.parse(text);
  }
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = OVERPASS[attempt % OVERPASS.length];
    try {
      const res = await fetch(url, {
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
      console.warn(`overpass ${name} @ ${url}: ${res.status}, retrying`);
    } catch (e) {
      console.warn(`overpass ${name} @ ${url}: ${e.message}, retrying`);
    }
    await wait(8000 * (attempt + 1));
  }
  throw new Error(`overpass ${name} failed`);
}

async function elevations(points) {
  const file = `${RAW}/srtm.json`;
  const cache = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
  const key = (p) => `${p.lat.toFixed(5)},${p.lon.toFixed(5)}`;
  const missing = [...new Set(points.map(key))].filter((k) => !(k in cache) || fresh);
  for (let i = 0; i < missing.length; i += 90) {
    const chunk = missing.slice(i, i + 90);
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await fetch(`${TOPO}?locations=${chunk.join("|")}`, { headers: { "User-Agent": UA } });
        const j = await res.json();
        if (j.status !== "OK") throw new Error(j.error || res.status);
        j.results.forEach((r, k) => (cache[chunk[k]] = r.elevation));
        break;
      } catch (e) {
        console.warn(`opentopodata: ${e.message}, retrying`);
        await wait(2500 * (attempt + 1));
      }
    }
    await wait(1200); // public API: one call per second
  }
  mkdirSync(RAW, { recursive: true });
  writeFileSync(file, JSON.stringify(cache));
  return (p) => cache[key(p)] ?? null;
}

// --- geometry -------------------------------------------------------------
const R = 6371008.8;
const rad = (d) => (d * Math.PI) / 180;
function dist(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function bearing(a, b) {
  const y = Math.sin(rad(b.lon - a.lon)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon - a.lon));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
// local metric plane around Kaleiçi (good to centimetres at this size)
const KX = Math.cos(rad(36.884)) * 111320;
const KY = 110574;
const xy = (p) => [(p.lon - 30.705) * KX, (p.lat - 36.884) * KY];

// --- graph ------------------------------------------------------------------
const WALK = new Set(["footway", "pedestrian", "path", "steps", "living_street", "residential", "service", "unclassified", "tertiary", "secondary", "primary", "track", "cycleway", "platform", "road"]);
function walkable(t) {
  if (!WALK.has(t.highway)) return false;
  if (t.area === "yes" && t.highway !== "pedestrian") return false;
  const foot = t.foot;
  if (foot === "no") return false;
  if ((t.access === "no" || t.access === "private") && !["yes", "designated", "permissive"].includes(foot)) return false;
  return true;
}

function buildGraph(osm) {
  const nodes = new Map();
  const ways = [];
  for (const e of osm.elements) {
    if (e.type === "node") nodes.set(e.id, { lat: e.lat, lon: e.lon });
    else if (e.type === "way" && e.tags && walkable(e.tags)) ways.push(e);
  }
  const adj = new Map();
  const add = (a, b, edge) => {
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a).push({ to: b, ...edge });
  };
  for (const w of ways) {
    const t = w.tags;
    for (let i = 0; i < w.nodes.length - 1; i++) {
      const a = w.nodes[i];
      const b = w.nodes[i + 1];
      const pa = nodes.get(a);
      const pb = nodes.get(b);
      if (!pa || !pb) continue;
      const m = dist(pa, pb);
      const base = { way: w.id, m, tags: t, total: w.nodes.length };
      // "incline=up" is drawn in the way's direction: walking it backwards goes down.
      add(a, b, { ...base, dir: 1 });
      add(b, a, { ...base, dir: -1 });
    }
  }
  return { nodes, adj, ways };
}

function nearestNode(g, p, filter) {
  let best = null;
  let bd = Infinity;
  for (const w of g.ways) {
    if (filter && !filter(w.tags)) continue;
    for (const id of w.nodes) {
      const q = g.nodes.get(id);
      if (!q) continue;
      const d = dist(p, q);
      if (d < bd) {
        bd = d;
        best = id;
      }
    }
  }
  return { id: best, d: bd };
}

function dijkstra(g, from, to, cost) {
  const D = new Map([[from, 0]]);
  const prev = new Map();
  const done = new Set();
  // small graph: a plain array as the queue is fast enough
  const open = [[0, from]];
  while (open.length) {
    let k = 0;
    for (let i = 1; i < open.length; i++) if (open[i][0] < open[k][0]) k = i;
    const [d, u] = open.splice(k, 1)[0];
    if (done.has(u)) continue;
    done.add(u);
    if (u === to) break;
    for (const e of g.adj.get(u) || []) {
      const nd = d + cost(e);
      if (nd < (D.get(e.to) ?? Infinity)) {
        D.set(e.to, nd);
        prev.set(e.to, { from: u, edge: e });
        open.push([nd, e.to]);
      }
    }
  }
  if (!prev.has(to)) return null;
  const path = [];
  for (let v = to; v !== from; v = prev.get(v).from) path.unshift({ ...prev.get(v).edge, a: prev.get(v).from, b: v });
  return path;
}

// --- route description ------------------------------------------------------
function inclineOf(t, dir) {
  const v = t.incline;
  if (!v) return null;
  if (v === "up" || /^\d/.test(v)) return dir === 1 ? "up" : "down";
  if (v === "down" || /^-\d/.test(v)) return dir === 1 ? "down" : "up";
  return null;
}

function turnOf(b1, b2) {
  const d = ((b2 - b1 + 540) % 360) - 180; // + = right
  const a = Math.abs(d);
  if (a < 28) return "straight";
  const side = d > 0 ? "right" : "left";
  if (a < 62) return `slight-${side}`;
  if (a < 140) return side;
  return `sharp-${side}`;
}

function describe(g, path) {
  const segs = [];
  let at = 0;
  for (const e of path) {
    const t = e.tags;
    const key = [t.name || "", t.highway, t.surface || "", t.step_count || "", inclineOf(t, e.dir) || ""].join("|");
    const last = segs[segs.length - 1];
    const pa = g.nodes.get(e.a);
    const pb = g.nodes.get(e.b);
    if (last && last.key === key) {
      last.m += e.m;
      last.pts.push(pb);
      if (!last.ways.includes(e.way)) last.ways.push(e.way);
    } else {
      segs.push({
        key,
        name: t.name || null,
        nameEn: t["name:en"] || null,
        kind: t.highway,
        surface: t.surface || null,
        steps: t.highway === "steps" && t.step_count ? Number(t.step_count) : null,
        incline: inclineOf(t, e.dir),
        handrail: t.handrail || null,
        at,
        m: e.m,
        pts: [pa, pb],
        ways: [e.way],
      });
    }
    at += e.m;
  }
  // turns between segments, from the last metres of one to the first metres of the next
  const head = (pts) => {
    let i = 1;
    while (i < pts.length - 1 && dist(pts[0], pts[i]) < 8) i++;
    return bearing(pts[0], pts[i]);
  };
  const tail = (pts) => {
    let i = pts.length - 2;
    while (i > 0 && dist(pts[i], pts[pts.length - 1]) < 8) i--;
    return bearing(pts[i], pts[pts.length - 1]);
  };
  segs.forEach((s, i) => {
    s.turn = i === 0 ? null : turnOf(tail(segs[i - 1].pts), head(s.pts));
  });
  return segs;
}

function landmarksOn(segs, pois) {
  const line = [];
  segs.forEach((s) => {
    let at = s.at;
    for (let i = 0; i < s.pts.length - 1; i++) {
      const a = s.pts[i];
      const b = s.pts[i + 1];
      const m = dist(a, b);
      line.push({ a, b, at, m });
      at += m;
    }
  });
  const found = [];
  for (const p of pois) {
    let best = null;
    for (const l of line) {
      const [ax, ay] = xy(l.a);
      const [bx, by] = xy(l.b);
      const [px, py] = xy(p);
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy || 1e-9;
      const u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
      const qx = ax + u * dx;
      const qy = ay + u * dy;
      const d = Math.hypot(px - qx, py - qy);
      if (!best || d < best.d) best = { d, at: l.at + u * l.m, side: dx * (py - ay) - dy * (px - ax) > 0 ? "left" : "right" };
    }
    if (best && best.d <= 45) found.push({ name: p.name, nameEn: p.nameEn, at: Math.round(best.at), side: best.side, off: Math.round(best.d) });
  }
  found.sort((a, b) => a.at - b.at);
  // keep the clearest: one per 120 m of route
  const kept = [];
  for (const f of found) {
    const near = kept.find((k) => Math.abs(k.at - f.at) < 120);
    if (!near) kept.push(f);
    else if (f.off < near.off) kept.splice(kept.indexOf(near), 1, f);
  }
  return kept;
}

function summarise(segs, getEle) {
  const m = segs.reduce((s, x) => s + x.m, 0);
  const flights = segs.filter((s) => s.kind === "steps");
  const pts = [segs[0].pts[0], ...segs.map((s) => s.pts[s.pts.length - 1])];
  const ats = [0, ...segs.map((s) => s.at + s.m)];
  const ele = pts.map((p, i) => [Math.round(ats[i]), getEle(p)]);
  return {
    m: Math.round(m),
    flights: flights.length,
    stepsOsm: flights.reduce((s, f) => s + (f.steps || 0), 0),
    stepsUnknown: flights.filter((f) => !f.steps).length,
    ele,
    segments: segs.map((s) => ({
      name: s.name,
      nameEn: s.nameEn,
      kind: s.kind,
      surface: s.surface,
      steps: s.steps,
      incline: s.incline,
      handrail: s.handrail,
      turn: s.turn,
      at: Math.round(s.at),
      m: Math.max(1, Math.round(s.m)),
      ways: s.ways,
    })),
  };
}

// --- run ----------------------------------------------------------------------
const osmWays = await overpass("ways");
const osmPois = await overpass("pois");
const g = buildGraph(osmWays);
console.log(`graph: ${g.ways.length} walkable ways, ${g.adj.size} nodes`);

const POI_KEEP = /Kule|Minare|Kapı|Kapısı|Han|Hamam|Medrese|Saat|Burcu|Cami/i;
const pois = osmPois.elements
  .map((e) => ({ name: e.tags?.name, nameEn: e.tags?.["name:en"] || null, lat: e.lat ?? e.center?.lat, lon: e.lon ?? e.center?.lon, kind: e.tags?.historic || e.tags?.man_made || e.tags?.highway }))
  .filter((p) => p.name && p.lat && POI_KEEP.test(p.name));
const elevator = osmPois.elements.find((e) => e.tags?.highway === "elevator");

const doorNode = nearestNode(g, DOOR, (t) => (t.name || "").startsWith("Hıdırlık"));
console.log(`door → node ${doorNode.id} (${doorNode.d.toFixed(1)} m)`);

const plain = (e) => e.m;
const luggage = (e) => e.m * (e.tags.highway === "steps" ? 25 : 1);

const raw = {};
const allPts = [DOOR];
for (const [key, s] of Object.entries(STARTS)) {
  const from = nearestNode(g, s);
  if (from.d > 60) console.warn(`${key}: start snapped ${from.d.toFixed(0)} m away`);
  const p1 = dijkstra(g, from.id, doorNode.id, plain);
  const p2 = dijkstra(g, from.id, doorNode.id, luggage);
  if (!p1) throw new Error(`no route from ${key}`);
  const d1 = describe(g, p1);
  const d2 = p2 ? describe(g, p2) : null;
  const same = d2 && d2.map((x) => x.key).join() === d1.map((x) => x.key).join();
  raw[key] = { short: d1, luggage: same ? null : d2, snap: Math.round(from.d) };
  for (const d of [d1, d2]) if (d) d.forEach((x) => allPts.push(x.pts[0], x.pts[x.pts.length - 1]));
  allPts.push(s);
}
const getEle = await elevations(allPts);

const routes = {};
for (const [key, r] of Object.entries(raw)) {
  routes[key] = {
    snap: r.snap,
    short: { ...summarise(r.short, getEle), landmarks: landmarksOn(r.short, pois) },
    luggage: r.luggage ? { ...summarise(r.luggage, getEle), landmarks: landmarksOn(r.luggage, pois) } : null,
  };
  const s = routes[key].short;
  const l = routes[key].luggage;
  console.log(
    `${key}: ${s.m} m, ${s.flights} flights (${s.stepsOsm} counted, ${s.stepsUnknown} uncounted), ele ${s.ele[0][1]} → ${s.ele[s.ele.length - 1][1]}` +
      (l ? ` | luggage ${l.m} m, ${l.flights} flights` : " | luggage: same way"),
  );
}

const out = {
  source: "© OpenStreetMap contributors (ODbL 1.0), read through the Overpass API; elevation SRTM 30 m through OpenTopoData",
  fetched: new Date().toISOString().slice(0, 10),
  door: { ...DOOR, ele: getEle(DOOR) },
  starts: Object.fromEntries(Object.entries(STARTS).map(([k, s]) => [k, { ...s, ele: getEle(s) }])),
  elevator: elevator ? { osm: `node/${elevator.id}`, lat: elevator.lat, lon: elevator.lon } : null,
  routes,
};
mkdirSync("content/yedipencere", { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`wrote ${OUT}`);
