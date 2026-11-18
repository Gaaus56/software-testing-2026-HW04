// FR-09 — Mã giảm giá (Web, Checkout). Data-driven: mỗi phần tử trong data/fr09.json là một test.
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckoutPage, parseMoney } from '../pages/CheckoutPage';
import { loadCases } from '../helpers/data';
import { ACCOUNTS, CouponSpec, createCoupon, createProduct, resetBackend } from '../helpers/backend';
import { WEB_URL } from '../helpers/env';

interface Input { code: string; productPrice: number; placeOrderFirst: boolean; coupon?: CouponSpec }
interface Expected {
  outcome: 'applied' | 'rejected' | 'applyDisabled';
  discount?: number;
  final?: number;
  tolerance?: number;
  reasonPattern?: string;
  displayFormat?: 'thousands-separator-dong';
}

const cases = loadCases<Input, Expected>('fr09.json');

// Không dùng mode 'serial': ở chế độ đó một test Fail (kể cả Fail do bug thật của SUT)
// làm mọi test sau bị bỏ qua. Mỗi test tự reset backend nên độc lập; chạy với 1 worker
// (workers: 1 trong playwright.config.ts) vì các test dùng chung một backend.
test.describe.configure({ mode: 'default' });

for (const tc of cases) {
  test(`${tc.id}: ${tc.note}`, async ({ page }) => {
    const { input, expected } = tc;

    // Chuẩn bị: DB sạch, 1 sản phẩm đúng giá cần thử, coupon (nếu có)
    await resetBackend();
    const productId = await createProduct(`HW04 ${tc.id}`, input.productPrice);
    if (input.coupon) await createCoupon(input.coupon);

    const lp = new LoginPage(page);
    await lp.goto();
    await lp.login(ACCOUNTS.user.email, ACCOUNTS.user.password);
    await expect(page).toHaveURL(`${WEB_URL}/`);

    const cp = new CheckoutPage(page);
    if (input.placeOrderFirst) {
      await cp.addProductToCart(productId);
      await cp.openCheckout();
      await cp.applyCoupon(input.code);
      await cp.placeOrder();
    }
    await cp.addProductToCart(productId);
    await cp.openCheckout();
    await cp.applyCoupon(input.code);

    if (expected.outcome === 'applyDisabled') {
      await expect(cp.applyButton).toBeDisabled();
      return;
    }

    if (expected.outcome === 'rejected') {
      // Chờ thông báo kết quả hiện ra TRƯỚC, rồi mới kiểm không có dòng "Tiết kiệm".
      // (Kiểm toHaveCount(0) ngay sau response có thể Pass trước khi React kịp vẽ kết quả.)
      await expect(cp.couponSection, 'Thông báo phải nêu lý do từ chối').toContainText(new RegExp(expected.reasonPattern!, 'i'));
      await expect(cp.savingAmount, 'Mã bị từ chối thì không được hiện tiền giảm').toHaveCount(0);
      return;
    }

    // applied: kiểm thông báo thành công trước để khi Fail, báo cáo hiện nguyên văn lý do bị từ chối
    await expect(cp.couponSection, 'Mã phải được áp dụng').toContainText(/thành công/i);
    await expect(cp.savingAmount).toBeVisible();
    const discount = parseMoney(await cp.savingAmount.innerText());
    const final = parseMoney(await cp.finalAmount.innerText());
    const tol = expected.tolerance ?? 0;
    // soft: báo đủ cả tiền giảm, thành tiền và định dạng thay vì dừng ở lỗi đầu tiên
    expect.soft(Math.abs(discount - expected.discount!), `Tiền giảm ${discount}, mong đợi ${expected.discount}`).toBeLessThanOrEqual(tol);
    expect.soft(Math.abs(final - expected.final!), `Thành tiền ${final}, mong đợi ${expected.final}`).toBeLessThanOrEqual(tol);

    if (expected.displayFormat === 'thousands-separator-dong') {
      await expect.soft(cp.savingAmount, 'Tiền giảm hiển thị dạng 40,000 ₫').toHaveText(/^\d{1,3}([.,]\d{3})+ ₫$/);
      await expect.soft(cp.finalAmount, 'Thành tiền hiển thị dạng 360,000 ₫').toHaveText(/^\d{1,3}([.,]\d{3})+ ₫$/);
    }
  });
}
