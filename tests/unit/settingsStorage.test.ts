// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS } from '@/utils/settings';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';

describe('settingsStorage compatibility', () => {
  beforeEach(() => localStorage.clear());

  it('returns the empty defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips the empty extraction settings', () => {
    saveSettings(DEFAULT_SETTINGS);
    expect(loadSettings()).toEqual({});
  });

  it('still reads an existing plain object without adding defaults', () => {
    localStorage.setItem('xlsx-extract-images-settings', JSON.stringify({ legacy: true }));
    expect(loadSettings()).toEqual({ legacy: true });
  });

  it('falls back to the defaults on malformed JSON', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    localStorage.setItem('xlsx-extract-images-settings', '{not valid json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(consoleError).toHaveBeenCalledOnce();
    consoleError.mockRestore();
  });
});
