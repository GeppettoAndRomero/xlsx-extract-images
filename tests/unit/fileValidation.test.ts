import { describe, expect, it } from 'vitest';
import {
  MAX_FILE_SIZE,
  sanitizeFileName,
  validateFile,
  validateFileExtension,
  validateFileMimeType,
  validateTotalSize,
} from '@/utils/fileValidation';

const file = (name: string, type = '', size = 1): File =>
  ({ name, type, size }) as unknown as File;

describe('validateFileExtension', () => {
  it('accepts .xlsx and .xlsm regardless of case', () => {
    expect(validateFileExtension('book.XLSX').valid).toBe(true);
    expect(validateFileExtension('macro.XLSM').valid).toBe(true);
  });

  it('reports the legacy .xls format separately', () => {
    expect(validateFileExtension('legacy.xls')).toEqual({
      valid: false,
      error: 'errLegacyXls',
    });
  });

  it('rejects unsupported extensions and names without an extension', () => {
    expect(validateFileExtension('book.csv').error).toBe('errUnsupported');
    expect(validateFileExtension('book').error).toBe('errUnsupported');
  });
});

describe('validateFileMimeType', () => {
  it('accepts workbook, ZIP fallback, binary fallback, and empty MIME types', () => {
    expect(
      validateFileMimeType(
        file(
          'book.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ).valid
    ).toBe(true);
    expect(
      validateFileMimeType(
        file('macro.xlsm', 'application/vnd.ms-excel.sheet.macroEnabled.12')
      ).valid
    ).toBe(true);
    expect(validateFileMimeType(file('book.xlsx', 'application/zip')).valid).toBe(true);
    expect(validateFileMimeType(file('book.xlsx', 'application/octet-stream')).valid).toBe(true);
    expect(validateFileMimeType(file('book.xlsx', '')).valid).toBe(true);
  });

  it('rejects a conflicting MIME type', () => {
    expect(validateFileMimeType(file('book.xlsx', 'text/plain')).error).toBe(
      'errUnsupportedMime'
    );
  });
});

describe('validateFile', () => {
  it('accepts a workbook below the 100 MB cap', () => {
    expect(
      validateFile(
        file(
          'book.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          MAX_FILE_SIZE
        )
      ).valid
    ).toBe(true);
  });

  it('rejects a workbook over the cap', () => {
    expect(validateFile(file('book.xlsx', '', MAX_FILE_SIZE + 1)).error).toBe(
      'errFileTooLarge'
    );
  });

  it('checks the extension before MIME and size', () => {
    expect(validateFile(file('book.xls', 'application/vnd.ms-excel', MAX_FILE_SIZE + 1)).error).toBe(
      'errLegacyXls'
    );
  });
});

describe('validateTotalSize', () => {
  it('uses the same 100 MB cap for the compatibility helper', () => {
    expect(validateTotalSize([file('book.xlsx', '', MAX_FILE_SIZE)]).valid).toBe(true);
    expect(
      validateTotalSize([
        file('a.xlsx', '', MAX_FILE_SIZE),
        file('b.xlsx', '', 1),
      ]).error
    ).toBe('errFileTooLarge');
  });
});

describe('sanitizeFileName', () => {
  it('replaces path and reserved characters with underscores', () => {
    expect(sanitizeFileName('a/b\\c:d*e?.xlsx')).toBe('a_b_c_d_e_.xlsx');
  });
});
