import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, validateSettings } from '@/utils/settings';

describe('settings', () => {
  it('has no extraction options', () => {
    expect(DEFAULT_SETTINGS).toEqual({});
  });

  it('returns a valid empty error set', () => {
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({ valid: true, errors: {} });
  });
});
