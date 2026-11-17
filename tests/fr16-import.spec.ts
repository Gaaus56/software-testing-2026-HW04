// FR-16 — Import sản phẩm từ CSV (Web Admin). Data-driven: mỗi phần tử trong data/fr16.json là một test.
import { test, expect } from '@playwright/test';
import { AdminImportPage } from '../pages/AdminImportPage';
import { dataPath, loadCases } from '../helpers/data';
import { listProducts, resetBackend } from '../helpers/backend';
import { WEB_URL } from '../helpers/env';

interface Input { file: string }
interface Expected {
  added: number;
  reasonPattern?: string;
  names?: string[];
  price?: number;
  importDisabled?: boolean;
  renderedAsTextOnWeb?: boolean;
}

const cases = loadCases<Input, Expected>('fr16.json');

// Các test đếm sản phẩm trong cùng một DB → chạy tuần tự
test.describe.configure({ mode: 'serial' });

for (const tc of cases) {
  test(`${tc.id}: ${tc.note}`, async ({ page }) => {
    const { input, expected } = tc;

    await resetBackend();
    const before = await listProducts();

    const ap = new AdminImportPage(page);
    await ap.open();
    await ap.chooseFile(dataPath(input.file));

    if (expected.importDisabled) {
      await expect(ap.importButton).toBeDisabled();
    } else {
      await ap.submit();
    }

    const after = await listProducts();
    const added = after.filter((p) => !before.some((b) => b.id === p.id));
    expect(added, `Số sản phẩm được thêm vào DB`).toHaveLength(expected.added);

    if (expected.reasonPattern) {
      await expect(ap.resultBox).toContainText(new RegExp(expected.reasonPattern, 'i'));
    }
    if (expected.names) {
      expect(added.map((p) => p.name)).toEqual(expect.arrayContaining(expected.names));
    }
    if (expected.price !== undefined) {
      expect(Number(added[0]?.price)).toBe(expected.price);
    }
    if (expected.renderedAsTextOnWeb) {
      const name = expected.names![0];
      await page.goto(WEB_URL);
      await expect(page.getByText(name, { exact: true })).toBeVisible();
      await expect(page.locator('b', { hasText: name.replace(/<\/?b>/g, '') })).toHaveCount(0);
    }
  });
}
