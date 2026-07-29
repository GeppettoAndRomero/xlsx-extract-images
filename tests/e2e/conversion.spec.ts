import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
} from '@zip.js/zip.js';
import {
  XLSX_WITHOUT_IMAGES_B64,
  dispatchWorkbook,
  extract,
  waitReady,
} from './_helpers';

test.describe('Excel image extraction', () => {
  test('extracts the packaged image into a valid ZIP without an upload', async ({ page }) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (
        !url.startsWith('http://localhost:4321') &&
        !url.startsWith('data:') &&
        !url.startsWith('blob:')
      ) {
        externalRequests.push(url);
      }
    });

    await page.goto('/xlsx-extract-images/');
    await waitReady(page);
    const download = await extract(page);

    expect(download.suggestedFilename()).toBe('sample-with-image-images.zip');
    const downloadedPath = await download.path();
    expect(downloadedPath).toBeTruthy();
    const archive = readFileSync(downloadedPath as string);
    expect(Array.from(archive.subarray(0, 2))).toEqual([0x50, 0x4b]);

    const reader = new ZipReader(new Uint8ArrayReader(archive));
    const entries = await reader.getEntries();
    expect(entries.map((entry) => entry.filename)).toEqual(['image1.png']);
    const image = entries[0];
    expect(image.directory).toBe(false);
    if (image.directory) throw new Error('Expected an image file entry');
    const imageBytes = await image.getData(new Uint8ArrayWriter());
    expect(Array.from(imageBytes.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    await reader.close();

    await expect(page.locator('[data-testid="extract-result"]')).toHaveAttribute(
      'data-image-count',
      '1'
    );
    expect(externalRequests, `unexpected cross-origin requests: ${externalRequests.join(', ')}`)
      .toHaveLength(0);
  });

  test('reports a workbook with no packaged images without downloading', async ({ page }) => {
    let downloadCount = 0;
    page.on('download', () => {
      downloadCount += 1;
    });

    await page.goto('/xlsx-extract-images/');
    await waitReady(page);
    await dispatchWorkbook(page, XLSX_WITHOUT_IMAGES_B64, 'sample-no-images.xlsx');

    const result = page.locator('[data-testid="extract-result"]');
    await expect(result).toHaveAttribute('data-image-count', '0');
    await expect(result).toContainText('No embedded images were found');
    expect(downloadCount).toBe(0);
  });

  test('explains that the legacy .xls format is outside the supported scope', async ({ page }) => {
    await page.goto('/xlsx-extract-images/');
    await waitReady(page);
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('filesDropped', {
          detail: [new File(['legacy'], 'legacy.xls', { type: 'application/vnd.ms-excel' })],
        })
      );
    });

    await expect(page.getByRole('alert')).toContainText('older .xls format is not supported');
  });
});
