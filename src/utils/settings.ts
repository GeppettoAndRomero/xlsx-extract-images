/**
 * Image extraction has no user-configurable options.
 *
 * The index signature and two aliases keep the scaffold's frozen SettingsPanel
 * type-checkable even though ConversionManager does not render that panel.
 */
export type OutputFormat = string;
export type ResizeMode = string;
export type ConversionSettings = Record<string, any>;

export const DEFAULT_SETTINGS: ConversionSettings = {};

export function validateSettings(_settings: ConversionSettings): {
  valid: boolean;
  errors: Record<string, string>;
} {
  return { valid: true, errors: {} };
}
