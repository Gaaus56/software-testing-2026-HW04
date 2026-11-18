// FR-02 — Đăng nhập & khóa tài khoản (Web). Data-driven: mỗi phần tử trong data/fr02.json là một test.
import { test, expect, Response } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loadCases } from '../helpers/data';
import { resetBackend } from '../helpers/backend';
import { WEB_URL } from '../helpers/env';

interface Account { email: string; password: string }
interface Input { preAttempts: Account[]; waitSeconds: number; login: Account | null; afterLogin?: 'openProfile' }
interface Expected {
  outcome?: 'success' | 'rejected' | 'locked';
  urlPath?: string;
  tokenStored?: boolean;
  apiStatusClass?: '4xx';
  uiErrorVisible?: boolean;
  sameResponseAs?: string;
  loginRequestSent?: boolean;
  authHeaderPrefix?: string;
  emailInputType?: string;
  passwordInputType?: string;
  requiredMarkOnLabels?: boolean;
  uiMessagePattern?: string;
  errorAboveSubmit?: boolean;
}

const cases = loadCases<Input, Expected>('fr02.json');

// Không dùng mode 'serial': ở chế độ đó một test Fail (kể cả Fail do bug thật của SUT)
// làm mọi test sau bị bỏ qua. Mỗi test tự reset backend nên độc lập; chạy với 1 worker
// (workers: 1 trong playwright.config.ts) vì các test dùng chung một backend.
test.describe.configure({ mode: 'default' });

/** Đăng nhập một lần qua form rồi đưa trang về trạng thái chưa đăng nhập */
async function attempt(lp: LoginPage, acc: Account): Promise<Response | null> {
  const resp = await lp.login(acc.email, acc.password);
  if (resp?.ok()) await lp.logoutAndReturn();
  return resp;
}

for (const tc of cases) {
  test(`${tc.id}: ${tc.note}`, async ({ page }) => {
    const { input, expected } = tc;
    if (input.waitSeconds > 0) test.slow();

    await resetBackend();
    const lp = new LoginPage(page);
    await lp.goto();

    // --- TC chỉ kiểm giao diện form (không đăng nhập) ---
    if (input.login === null) {
      if (expected.emailInputType) await expect(lp.emailInput).toHaveAttribute('type', expected.emailInputType);
      if (expected.passwordInputType) await expect(lp.passwordInput).toHaveAttribute('type', expected.passwordInputType);
      if (expected.requiredMarkOnLabels) {
        await expect(lp.emailLabel).toContainText('*');
        await expect(lp.passwordLabel).toContainText('*');
      }
      return;
    }

    // --- Các lần đăng nhập trước (để tạo trạng thái bộ đếm / khóa) ---
    let lastPre = Date.now();
    for (const acc of input.preAttempts) {
      await attempt(lp, acc);
      lastPre = Date.now();
    }
    if (input.waitSeconds > 0) {
      const remaining = input.waitSeconds * 1000 - (Date.now() - lastPre);
      if (remaining > 0) await page.waitForTimeout(remaining);
    }

    // --- Lần đăng nhập chính ---
    let reference: { body: unknown; ui: string } | undefined;
    if (expected.sameResponseAs) {
      const ref = cases.find((c) => c.id === expected.sameResponseAs)!;
      const refResp = await lp.login(ref.input.login!.email, ref.input.login!.password);
      reference = { body: await refResp?.json(), ui: await lp.errorMessage().innerText() };
      await lp.goto();
    }

    const resp = await lp.login(input.login.email, input.login.password);

    if (expected.loginRequestSent === false) {
      expect(resp, 'Trình duyệt phải chặn submit, không gửi POST /api/login').toBeNull();
      return;
    }
    expect(resp, 'Phải có response của POST /api/login').not.toBeNull();
    const status = resp!.status();
    const body = await resp!.json();

    if (expected.outcome === 'success') {
      expect(status).toBe(200);
      await expect(page).toHaveURL(`${WEB_URL}${expected.urlPath ?? '/'}`);
    }
    if (expected.outcome === 'rejected') {
      expect(status).toBeGreaterThanOrEqual(400);
      expect(status).toBeLessThan(500);
      await expect(page).toHaveURL(/\/login$/);
    }
    if (expected.outcome === 'locked') {
      expect(status).toBeGreaterThanOrEqual(400);
      expect(status).toBeLessThan(500);
      expect(String(body.error ?? '')).toMatch(/khóa|lock/i);
    }
    if (expected.apiStatusClass === '4xx') {
      expect(status).toBeGreaterThanOrEqual(400);
      expect(status).toBeLessThan(500);
    }
    if (expected.tokenStored !== undefined) {
      const token = await lp.storedToken();
      if (expected.tokenStored) expect(token).toBeTruthy();
      else expect(token).toBeNull();
    }
    if (expected.uiErrorVisible) await expect(lp.errorMessage()).toBeVisible();
    if (reference) {
      expect(body, `Response phải giống ${expected.sameResponseAs}`).toEqual(reference.body);
      await expect(lp.errorMessage()).toHaveText(reference.ui);
    }
    if (expected.uiMessagePattern) {
      await expect(lp.errorMessage()).toContainText(new RegExp(expected.uiMessagePattern, 'i'));
    }
    if (expected.errorAboveSubmit) {
      const err = await lp.errorMessage().boundingBox();
      const btn = await lp.submitButton.boundingBox();
      expect(err!.y, 'Thông báo lỗi phải nằm trên nút submit (FR-22)').toBeLessThan(btn!.y);
    }
    if (expected.authHeaderPrefix) {
      const req = page.waitForRequest((r) => r.url().includes('/api/orders/my-orders'));
      await page.getByRole('link', { name: /Chào/ }).click();
      const auth = (await req).headers()['authorization'] ?? '';
      expect(auth.startsWith(expected.authHeaderPrefix)).toBe(true);
    }
  });
}
