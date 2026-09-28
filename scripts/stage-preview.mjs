// Mirrors how rasitburucu.com serves the export: out/ is copied under
// .preview/web/ so `wrangler dev` answers /web/onikitas/ like production.
import { cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = `${root}out`;
const stage = `${root}.preview`;

rmSync(stage, { recursive: true, force: true });
cpSync(out, `${stage}/web`, { recursive: true });
cpSync(`${out}/404.html`, `${stage}/404.html`);
console.log("Staged out/ -> .preview/web (open http://localhost:3301/web/onikitas/)");
