# xlsx-extract-images — stamped from heic-to-jpg, ENGINE + CONTENT still TODO

Frozen core and the slug surface are done. This tool currently builds as a HEIC clone
at /xlsx-extract-images/. Replace the engine layer before it is real:

- [ ] `src/workers/imageProcessor.ts` — the engine. Replace HEIC/libheif decode with
      this tool's operation. (`src/workers/imagePipeline.ts` resize/encode is generic and
      often reusable; `src/workers/types.ts` is frozen.)
- [ ] `src/widgets/ConversionManager.tsx` — the only non-frozen widget. Adjust the
      accepted input, settings UI, and result handling to this tool.
- [ ] `src/utils/settings.ts` + `src/utils/fileValidation.ts` — accept-lists / output
      formats for this tool (the rest of utils is frozen).
- [ ] `src/i18n/{en,ja,zh,de,es}.ts` — 5 native content sets via the competitor-grounded
      transcreation pipeline (author en first, then the ja/zh/de/es author→QA workflow).
      Also fix the PWA display name in `public/xlsx-extract-images/manifest.json` ("HEIC to JPG").
- [ ] `astro.config.mjs` manualChunks + per-tool deps in `package.json`.
- [ ] `tests/e2e/conversion.spec.ts` + `tests/fixtures/` — real-input e2e for THIS engine
      (covenants/i18n/a11y specs are frozen and already slug-correct).

Then: `npm install` → `npm run build` → `npm run test:unit` → `npm run test:e2e` →
`npm run lint` → `npx lhci autorun` (DoD). Add pagesProject + status=active to tools.json,
regen the router map, redeploy the router. See handbook plan / NAMESPACE-ROUTING §8.

Deploy (push-to-deploy, zero Cloudflare manual ops — handbook/DEPLOY-MODEL.md):
  1. create the GitHub repo + push (gh repo create GeppettoAndRomero/xlsx-extract-images --source=. --push).
  2. handbook/bin/deploy-onboard.sh xlsx-extract-images   # sets CF secrets on the repo (no dashboard).
  3. push to main → Actions builds → `wrangler pages deploy` auto-creates the Pages
     project `xlsx-extract-images` and deploys. The frozen-core .github/workflows/deploy.yml is already
     slug-correct from the stamp.
