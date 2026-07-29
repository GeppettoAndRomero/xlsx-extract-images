import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
} from '@zip.js/zip.js';
import { AppError } from '@/utils/appError';
import {
  extractWorkbookImages,
  type ExtractionProgress,
} from '@/utils/xlsxImageExtractEngine';

const withImage = readFileSync(
  fileURLToPath(new URL('../fixtures/sample-with-image.xlsx', import.meta.url))
);
const withoutImages = readFileSync(
  fileURLToPath(new URL('../fixtures/sample-no-images.xlsx', import.meta.url))
);

describe('extractWorkbookImages', () => {
  it('copies xl/media image bytes to a flat output ZIP and reports progress', async () => {
    const progress: ExtractionProgress[] = [];
    const result = await extractWorkbookImages(new Blob([withImage]), (update) =>
      progress.push(update)
    );

    expect(result.imageCount).toBe(1);
    expect(result.totalSize).toBeGreaterThan(0);
    expect(result.blob).not.toBeNull();
    expect(progress).toEqual([
      { completed: 0, total: 1 },
      { completed: 1, total: 1 },
    ]);

    const reader = new ZipReader(
      new Uint8ArrayReader(new Uint8Array(await result.blob!.arrayBuffer()))
    );
    const entries = await reader.getEntries();
    expect(entries.map((entry) => entry.filename)).toEqual(['image1.png']);
    const imageEntry = entries[0];
    expect(imageEntry.directory).toBe(false);
    if (imageEntry.directory) throw new Error('Expected an image file entry');
    const image = await imageEntry.getData(new Uint8ArrayWriter());
    expect(image.byteLength).toBe(result.totalSize);
    expect(Array.from(image.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    await reader.close();
  });

  it('returns a successful no-images result without creating a ZIP', async () => {
    await expect(extractWorkbookImages(new Blob([withoutImages]))).resolves.toEqual({
      blob: null,
      imageCount: 0,
      totalSize: 0,
    });
  });

  it('maps an unreadable package to the workbook-open error code', async () => {
    await expect(extractWorkbookImages(new Blob(['not a zip']))).rejects.toMatchObject<
      Partial<AppError>
    >({
      name: 'AppError',
      code: 'errCannotOpenWorkbook',
    });
  });
});
