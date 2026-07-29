import {
  BlobReader,
  BlobWriter,
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
  ZipWriter,
  type FileEntry,
} from '@zip.js/zip.js';
import { AppError } from './appError';

const MEDIA_PREFIX = 'xl/media/';

export interface ExtractionProgress {
  completed: number;
  total: number;
}

export interface ImageExtractionResult {
  blob: Blob | null;
  imageCount: number;
  totalSize: number;
}

export type ExtractionProgressCallback = (progress: ExtractionProgress) => void;

function isMediaFile(entry: { directory: boolean; filename: string }): entry is FileEntry {
  return !entry.directory && entry.filename.startsWith(MEDIA_PREFIX);
}

function outputName(filename: string): string {
  const name = filename.slice(MEDIA_PREFIX.length);
  const segments = name.split('/');

  if (!name || name.startsWith('/') || segments.includes('..')) {
    throw new AppError('errCannotOpenWorkbook');
  }

  return name;
}

/**
 * Extracts packaged media from an OOXML workbook without decoding or re-encoding it.
 *
 * A null blob is a successful "no images found" result. This keeps the engine usable
 * without browser UI and makes that case distinct from an unreadable workbook.
 */
export async function extractWorkbookImages(
  workbook: Blob,
  onProgress?: ExtractionProgressCallback
): Promise<ImageExtractionResult> {
  const reader = new ZipReader(new BlobReader(workbook));
  let entries;

  try {
    entries = await reader.getEntries();
  } catch {
    try {
      await reader.close();
    } catch {
      // The original read error is the useful signal.
    }
    throw new AppError('errCannotOpenWorkbook');
  }

  const mediaEntries = entries.filter(isMediaFile);
  if (mediaEntries.length === 0) {
    await reader.close();
    onProgress?.({ completed: 0, total: 0 });
    return { blob: null, imageCount: 0, totalSize: 0 };
  }

  const writer = new ZipWriter(new BlobWriter('application/zip'));
  let completed = 0;
  let totalSize = 0;

  try {
    onProgress?.({ completed, total: mediaEntries.length });

    for (const entry of mediaEntries) {
      if (entry.encrypted) {
        throw new AppError('errCannotOpenWorkbook');
      }

      const data = await entry.getData(new Uint8ArrayWriter());
      await writer.add(outputName(entry.filename), new Uint8ArrayReader(data));
      totalSize += data.byteLength;
      completed += 1;
      onProgress?.({ completed, total: mediaEntries.length });
    }

    const blob = await writer.close();
    return { blob, imageCount: mediaEntries.length, totalSize };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('errCannotOpenWorkbook');
  } finally {
    try {
      await reader.close();
    } catch {
      // Extraction has already produced a result or a localized error.
    }
  }
}
