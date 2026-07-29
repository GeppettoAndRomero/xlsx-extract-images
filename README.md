# xlsx-extract-images

Extract images stored in `.xlsx` and `.xlsm` workbooks and download them in a ZIP
file. Processing runs in the browser; workbook data is not uploaded.

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

An Excel workbook in the OOXML format is a ZIP package. The tool opens the package
with [zip.js](https://gildas-lormeau.github.io/zip.js/), reads files below
`xl/media/`, and writes their original bytes to a new ZIP. It does not decode,
resize, or recompress the images.

## Scope

- Accepts one `.xlsx` or `.xlsm` file at a time, up to 100 MB
- Downloads `<workbook-name>-images.zip` when packaged images are present
- Reports a normal no-images result when `xl/media/` is empty
- Does not support `.xls` files or password-protected workbooks
- Does not extract cell values, edit sheets, or execute macros

## Develop

```bash
npm run dev
npm run type-check
npm run lint
npm run test:unit
npm run build
```

Stack: Astro, Preact, TypeScript, and zip.js.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.
