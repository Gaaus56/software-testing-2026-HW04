import { Locator, Page, Response } from '@playwright/test';
import { WEB_URL } from '../helpers/env';

/**
 * Trang đăng nhập Web (/login).
 * Nhãn <label> không gắn với ô nhập (không có htmlFor) và ô nhập không có placeholder,
 * nên ô nhập được tìm qua chữ của nhãn rồi lấy <input> trong cùng khối.
 */
export class LoginPage {
  readonly form: Locator;
  readonly emailLabel: Locator;
  readonly passwordLabel: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.form = page.locator('form');
    // Nhãn hiện tại là "Username"; chấp nhận cả "Email" nếu giao diện được sửa đúng đặc tả
    this.emailLabel = this.form.getByText(/^(Username|Email)\s*\*?$/);
    this.passwordLabel = this.form.getByText(/^Mật khẩu\s*\*?$/);
    this.emailInput = this.emailLabel.locator('..').locator('input');
    this.passwordInput = this.passwordLabel.locator('..').locator('input');
    this.submitButton = this.form.getByRole('button', { name: /Sign In|Đăng nhập/i });
    this.heading = page.getByRole('heading').first();
  }

  async goto() {
    await this.page.goto(`${WEB_URL}/login`);
    await this.emailInput.waitFor();
  }

  /** Thông báo lỗi hiển thị sau khi đăng nhập thất bại */
  errorMessage(): Locator {
    return this.page.getByText(/thất bại|không đúng|khóa|lỗi/i);
  }

  /** Điền form và bấm nút; trả về response của POST /api/login (null nếu không có request nào được gửi) */
  async login(email: string, password: string, timeoutMs = 3000): Promise<Response | null> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const responsePromise = this.page
      .waitForResponse((r) => r.url().includes('/api/login') && r.request().method() === 'POST', { timeout: timeoutMs })
      .catch(() => null);
    await this.submitButton.click();
    return responsePromise;
  }

  /** Xóa phiên đăng nhập phía client (token trong localStorage) rồi quay lại trang đăng nhập */
  async logoutAndReturn() {
    await this.page.evaluate(() => localStorage.clear());
    await this.goto();
  }

  async storedToken(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem('token'));
  }
}
