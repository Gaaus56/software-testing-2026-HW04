import { Locator, Page } from '@playwright/test';
import { ACCOUNTS } from '../helpers/backend';
import { ADMIN_URL } from '../helpers/env';

/** Web Admin → Sản phẩm → khu vực "Import sản phẩm từ CSV" */
export class AdminImportPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly productsMenu: Locator;
  readonly importHeading: Locator;
  readonly importSection: Locator;
  readonly fileInput: Locator;
  readonly importButton: Locator;
  readonly resultBox: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.productsMenu = page.getByRole('listitem').filter({ hasText: /^Sản phẩm$/ });
    this.importHeading = page.getByRole('heading', { name: /Import sản phẩm từ CSV/ });
    // Khối div nhỏ nhất chứa cả tiêu đề Import lẫn ô chọn file
    // (phần tử cuối trong danh sách các div thỏa điều kiện, vì div bao ngoài đứng trước div bên trong)
    this.importSection = page
      .locator('div')
      .filter({ has: this.importHeading })
      .filter({ has: page.locator('input[type="file"]') })
      .last();
    // Ô chọn file không có nhãn hay vai trò truy cập → định vị theo thuộc tính type trong khối Import
    this.fileInput = this.importSection.locator('input[type="file"]');
    this.importButton = this.importSection.getByRole('button', { name: /^Import \d+ sản phẩm$/ });
    // Hộp kết quả: chứa "Import hoàn tất" (thành công) hoặc "❌" (lỗi)
    this.resultBox = this.importSection.getByText(/Import hoàn tất|❌/).locator('..');
  }

  async open() {
    await this.page.goto(ADMIN_URL);
    // Chờ trang hiện ra một trong hai: form đăng nhập hoặc menu (đã đăng nhập sẵn).
    // Không dùng isVisible() ngay sau goto vì có thể kiểm tra trước khi React kịp vẽ form (lỗi trên WebKit).
    await this.emailInput.or(this.productsMenu).first().waitFor();
    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(ACCOUNTS.admin.email);
      await this.passwordInput.fill(ACCOUNTS.admin.password);
      await this.loginButton.click();
    }
    await this.productsMenu.click();
    await this.importHeading.waitFor();
  }

  /** Chọn file; trả về số dòng hiển thị trên nút "Import N sản phẩm" */
  async chooseFile(filePath: string): Promise<number> {
    await this.fileInput.setInputFiles(filePath);
    await this.importButton.waitFor();
    const label = await this.importButton.innerText();
    return Number(label.match(/\d+/)?.[0] ?? 0);
  }

  async submit() {
    const resp = this.page.waitForResponse((r) => r.url().includes('/api/admin/import-products'));
    await this.importButton.click();
    await resp;
    await this.resultBox.waitFor();
  }

  async resultText(): Promise<string> {
    return (await this.resultBox.innerText()).replace(/\s+/g, ' ').trim();
  }
}
