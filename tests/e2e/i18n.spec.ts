import { test, expect } from '@playwright/test';
import { waitReady, extract } from './_helpers';

// Content routing is engine-independent; one browser is enough.
test.describe('i18n', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'content routing (one engine)');
  });

  for (const loc of [
    { path: '/xlsx-extract-images/', lang: 'en' },
    { path: '/xlsx-extract-images/ja/', lang: 'ja' },
  ]) {
    test(`extracts on the ${loc.lang} route (#5)`, async ({ page }) => {
      await page.goto(loc.path);
      await waitReady(page);
      await extract(page);
    });
  }

  test('serves every locale with the correct <html lang>', async ({ page }) => {
    const expected: Array<[string, string]> = [
      ['/xlsx-extract-images/', 'en'],
      ['/xlsx-extract-images/ja/', 'ja'],
      ['/xlsx-extract-images/zh/', 'zh-Hans'],
      ['/xlsx-extract-images/de/', 'de'],
      ['/xlsx-extract-images/es/', 'es'],
    ];
    for (const [path, lang] of expected) {
      await page.goto(path);
      expect(await page.getAttribute('html', 'lang'), `lang on ${path}`).toBe(lang);
    }
  });
});
