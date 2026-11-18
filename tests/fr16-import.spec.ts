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

// Không dùng mode 'serial': ở chế độ đó một test Fail (kể cả Fail do bug thật của SUT)
// làm mọi test sau bị bỏ qua. Mỗi test tự reset backend nên độc lập; chạy với 1 worker
// (workers: 1 trong playwright.config.ts) vì các test dùng chung một backend.
test.describe.configure({ mode: 'default' });

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
    // soft: một ca import có thể sai nhiều mặt cùng lúc (không rollback + báo cáo không nêu lý do)
    // → kiểm hết rồi mới báo, thay vì dừng ở lỗi đầu tiên
    expect.soft(added.map((p) => p.name), `Số sản phẩm được thêm vào DB phải là ${expected.added} (0 = từ chối / rollback toàn bộ)`)
      .toHaveLength(expected.added);

    if (expected.reasonPattern) {
      await expect.soft(ap.resultBox, `Báo cáo import phải nêu lý do khớp /${expected.reasonPattern}/`)
        .toContainText(new RegExp(expected.reasonPattern, 'i'));
    }
    if (expected.names) {
      expect.soft(added.map((p) => p.name), 'Tên sản phẩm phải được lưu đúng nguyên văn').toEqual(expect.arrayContaining(expected.names));
    }
    if (expected.price !== undefined) {
      expect.soft(Number(added[0]?.price), 'Giá sản phẩm phải được lưu đúng').toBe(expected.price);
    }
    if (expected.renderedAsTextOnWeb) {
      const name = expected.names![0];
      await page.goto(WEB_URL);
      await expect(page.getByText(name, { exact: true })).toBeVisible();
      await expect(page.locator('b', { hasText: name.replace(/<\/?b>/g, '') })).toHaveCount(0);
    }
  });
}
