# XLSX fixtures

Run `node tests/fixtures/generate-xlsx.mjs` from the tool directory to regenerate:

- `sample-with-image.xlsx`: a minimal OOXML workbook with a drawing that references
  `xl/media/image1.png` (a 1 × 1 PNG).
- `sample-no-images.xlsx`: the same minimal workbook structure without drawing or
  media parts.

The generator uses the existing `@zip.js/zip.js` dependency and does not require
Excel or another office application.
