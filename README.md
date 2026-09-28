# rasitburucu-web-demos

Concept websites for fictional brands, shown on rasitburucu.com. Next.js 15 static export.

## Where it lives

The export is served by the main site, not its own worker: `https://rasitburucu.com/web/onikitas/`.
`next.config.ts` sets `basePath: "/web"`, so pages are `/web/<demo>/` and assets `/web/_next/...`.
Files in `public/` are not prefixed by Next; reference them through `asset()` from `lib/asset.ts`.

## Commands

```bash
npm run dev        # http://localhost:3300/web/onikitas
npm run lint
npm run build      # static export to out/
npm run preview    # build, stage out/ under .preview/web/, wrangler dev -> http://localhost:3301/web/onikitas/
npm run sync:site  # build, then copy out/ into ../rasitburucu.com/public/web/
```

## Publishing a change

1. `npm run lint` and `npm run sync:site` here. The sync wipes `../rasitburucu.com/public/web/` first and skips the
   demo index and 404 pages (`index.html`, `index.txt`, `404.html`, `404/`), so `/web` itself stays with the main site.
2. In `rasitburucu.com`, follow its release steps (lint, build, preview, owner approval, deploy).

Nothing here deploys on its own; `wrangler.jsonc` is for local preview only.
