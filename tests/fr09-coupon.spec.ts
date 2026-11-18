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
      await expect(cp.savingAmount).toHaveCount(0);
      await expect(cp.couponSection).toContainText(new RegExp(expected.reasonPattern!, 'i'));
      return;
    }

    // applied
    await expect(cp.savingAmount).toBeVisible();
    const discount = parseMoney(await cp.savingAmount.innerText());
    const final = parseMoney(await cp.finalAmount.innerText());
    const tol = expected.tolerance ?? 0;
    expect(Math.abs(discount - expected.discount!), `Tiền giảm ${discount}, mong đợi ${expected.discount}`).toBeLessThanOrEqual(tol);
    expect(Math.abs(final - expected.final!), `Thành tiền ${final}, mong đợi ${expected.final}`).toBeLessThanOrEqual(tol);

    if (expected.displayFormat === 'thousands-separator-dong') {
      await expect(cp.savingAmount).toHaveText(/^\d{1,3}([.,]\d{3})+ ₫$/);
      await expect(cp.finalAmount).toHaveText(/^\d{1,3}([.,]\d{3})+ ₫$/);
    }
  });
}
