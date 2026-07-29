import { describe, expect, it } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';

const en = {
  errCannotOpenWorkbook: 'The workbook could not be opened.',
  errConversionFailed: 'The images could not be extracted.',
  errWithName: 'Could not open {name}.',
};

describe('resolveErrorMessage', () => {
  it('maps AppError and forwarded string codes to localized strings', () => {
    expect(resolveErrorMessage('errCannotOpenWorkbook', en)).toBe(
      'The workbook could not be opened.'
    );
    expect(resolveErrorMessage(new AppError('errCannotOpenWorkbook'), en)).toBe(
      'The workbook could not be opened.'
    );
  });

  it('interpolates AppError parameters', () => {
    expect(resolveErrorMessage(new AppError('errWithName', { name: 'book.xlsx' }), en)).toBe(
      'Could not open book.xlsx.'
    );
  });

  it('falls back to the localized generic message for unmapped errors', () => {
    expect(resolveErrorMessage(new Error('internal zip error'), en)).toBe(
      'The images could not be extracted.'
    );
    expect(resolveErrorMessage(undefined, en)).toBe('The images could not be extracted.');
  });
});
