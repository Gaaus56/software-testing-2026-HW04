// Mẫu spec data-driven. Thay <fr>, <Page>, các trường Input/Expected theo feature.
import { test, expect } from '@playwright/test';
import { loadCases } from '../helpers/data';
import { resetBackend } from '../helpers/backend';
// import { <Page> } from '../pages/<Page>';

interface Input { /* các trường input trong data/<fr>.json */ }
interface Expected { outcome?: string; reasonPattern?: string /* … */ }

const cases = loadCases<Input, Expected>('<fr>.json');

// Không dùng mode 'serial' (một Fail sẽ bỏ qua mọi ca sau). Chạy 1 worker nếu dùng chung trạng thái.
test.describe.configure({ mode: 'default' });

for (const tc of cases) {
  test(`${tc.id}: ${tc.note}`, async ({ page }) => {
    const { input, expected } = tc;
    await resetBackend();                       // trạng thái sạch cho mỗi ca

    // 1. Chuẩn bị dữ liệu (API) — 2. Thao tác trên giao diện qua Page Object

    // 3. Assertion theo các trường có trong `expected`:
    //    - chờ kết quả hiện ra TRƯỚC (toContainText / toBeVisible), rồi mới kiểm "không tồn tại"
    //    - nhiều yêu cầu độc lập → expect.soft(…, 'thông báo rõ ràng')
  });
}
