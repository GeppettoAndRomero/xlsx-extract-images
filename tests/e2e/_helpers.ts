import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type Download, type Page } from '@playwright/test';

export const XLSX_WITH_IMAGE_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/sample-with-image.xlsx', import.meta.url))
).toString('base64');

export const XLSX_WITHOUT_IMAGES_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/sample-no-images.xlsx', import.meta.url))
).toString('base64');

export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

export async function dispatchWorkbook(
  page: Page,
  base64: string,
  name: string
): Promise<void> {
  await page.evaluate(
    ({ bytesBase64, fileName }) => {
      const binary = atob(bytesBase64);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      window.dispatchEvent(
        new CustomEvent('filesDropped', {
          detail: [
            new File([bytes], fileName, {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
          ],
        })
      );
    },
    { bytesBase64: base64, fileName: name }
  );
}

export async function extract(page: Page): Promise<Download> {
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await dispatchWorkbook(page, XLSX_WITH_IMAGE_B64, 'sample-with-image.xlsx');
  return downloadPromise;
}
