// Builds the static export and copies it into rasitburucu.com/public/web/,
// where the main site serves it as static assets (/web/onikitas/, /web/_next/…).
// The demo index and 404 pages are left out so /web itself stays with the
// main site's own routing.
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "out");
const site = join(root, "..", "rasitburucu.com");
const target = join(site, "public", "web");
const SKIP = new Set(["index.html", "index.txt", "404.html", "404"]);

if (!existsSync(join(site, "package.json"))) {
  console.error(`Main site not found at ${site}`);
  process.exit(1);
}

if (!process.argv.includes("--no-build")) execSync("npm run build", { cwd: root, stdio: "inherit" });

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
for (const entry of readdirSync(out)) {
  if (SKIP.has(entry)) continue;
  cpSync(join(out, entry), join(target, entry), { recursive: true });
}
console.log(`Synced out/ -> ${target}`);

// Next 15.5 router fallback patch (raw index.txt on failed RSC fetch); see the script header.
execSync("node scripts/patch-web-demos.mjs", { cwd: site, stdio: "inherit" });
