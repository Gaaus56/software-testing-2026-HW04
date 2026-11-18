// Mẫu Page Object. Ưu tiên getByRole → getByLabel → getByPlaceholder → getByText; không XPath, không class CSS.
import { Locator, Page } from '@playwright/test';

export class ExamplePage {
  readonly submitButton: Locator;
  readonly resultBox: Locator;

  constructor(private readonly page: Page) {
    this.submitButton = page.getByRole('button', { name: /Gửi|Submit/ });
    this.resultBox = page.getByRole('alert').or(page.getByText(/thành công|lỗi/i)).first();
  }

  async open(url: string) {
    await this.page.goto(url);
    // Chờ trang sẵn sàng bằng một phần tử chắc chắn có — không rẽ nhánh bằng isVisible() ngay sau goto
    await this.submitButton.waitFor();
  }
}
