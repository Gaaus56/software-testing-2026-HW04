import { Locator, Page } from '@playwright/test';
import { WEB_URL } from '../helpers/env';

/**
 * Trang chủ Web (/) — FR-05: danh sách & tìm kiếm sản phẩm.
 * Đã đọc DOM thật (Chromium): tên sản phẩm là <h2>, giá là <p> dạng "30,000,000 VND",
 * ảnh có alt="" (sai đặc tả, script vẫn tìm ảnh qua role img), ô tìm kiếm không có nhãn.
 * Thông báo "Kết quả tìm kiếm cho: …" hiển thị cả khi không có kết quả.
 * Trạng thái empty state và loading hiện chưa có trên giao diện: các locator dưới đây
 * trả về phần tử kỳ vọng theo đặc tả để assertion Fail đúng nghĩa khi thiếu.
 */
export class HomePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productNames: Locator;
  readonly headingLevel1: Locator;
  readonly errorHeading: Locator;
  readonly firstProductName: Locator;
  readonly keywordLabel: Locator;
  readonly emptyState: Locator;
  readonly loadingIndicator: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByPlaceholder('Tìm kiếm...');
    this.searchButton = page.getByRole('button', { name: 'Tìm', exact: true });
    this.productNames = page.getByRole('heading', { level: 2 });
    this.headingLevel1 = page.getByRole('heading', { level: 1 });
    // Lỗi DB được backend trả về dưới dạng HTML có <h1>Database Error</h1>
    this.errorHeading = page.getByRole('heading', { level: 1, name: 'Database Error' });
    this.firstProductName = this.productNames.first();
    this.keywordLabel = page.getByText('Kết quả tìm kiếm cho:');
    // Đặc tả: "thông báo empty state phù hợp" — chưa có text cố định, dùng nhóm từ thông dụng
    this.emptyState = page.getByText(/không (tìm thấy|có)|chưa có|no (results|products)/i);
    // Đặc tả: trạng thái loading — chấp nhận role=status hoặc chữ "đang tải"/"loading"
    this.loadingIndicator = page
      .getByRole('status')
      .or(page.getByText(/đang tải|loading/i));
  }

  async goto() {
    await this.page.goto(`${WEB_URL}/`);
    await this.headingLevel1.first().waitFor();
  }

  /** Thẻ sản phẩm có tên `name`: khối cha trực tiếp của tiêu đề h2 */
  productCard(name: string): Locator {
    return this.page.getByRole('heading', { level: 2, name, exact: true }).locator('..');
  }

  /** Mọi thẻ sản phẩm: khối cha của từng tiêu đề h2 */
  cards(): Locator {
    return this.productNames.locator('..');
  }

  /**
   * Ảnh trong một thẻ sản phẩm. Dùng thẻ <img> vì ảnh đang có alt="" nên role không còn là "img";
   * khi alt được sửa đúng đặc tả, locator này vẫn tìm được ảnh.
   */
  cardImage(card: Locator): Locator {
    return card.locator('img');
  }

  /** Dòng giá trong một thẻ sản phẩm (đoạn văn chứa "VND" hoặc "₫") */
  cardPrice(card: Locator): Locator {
    return card.getByText(/VND|₫/);
  }

  async productNamesText(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  /**
   * Gửi từ khóa qua nút "Tìm" (từ khóa rỗng = tải lại toàn bộ danh sách).
   * Không gọi isVisible/count ngay sau khi gửi; chờ trạng thái kết thúc tương ứng.
   */
  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.settled(keyword);
  }

  /** Chờ một trong các trạng thái kết thúc: có nhãn kết quả, có lỗi, hoặc có thẻ (từ khóa rỗng) */
  async settled(keyword: string) {
    if (keyword.trim() === '') {
      await this.firstProductName.or(this.errorHeading).first().waitFor();
    } else {
      await this.keywordLabel.or(this.errorHeading).first().waitFor();
    }
  }

  /** Văn bản hiển thị sau nhãn "Kết quả tìm kiếm cho:" (null nếu không có nhãn) */
  async displayedKeyword(): Promise<string | null> {
    // Tìm khối nhỏ nhất có nhãn ở đầu (không dùng getByText vì nó trả về khối cha lớn hơn)
    return this.page.evaluate((label) => {
      const candidates = [...document.querySelectorAll('main div')].filter((d) =>
        (d.textContent ?? '').trim().startsWith(label),
      );
      if (candidates.length === 0) return null;
      const smallest = candidates.reduce((a, b) =>
        (a.textContent ?? '').length <= (b.textContent ?? '').length ? a : b,
      );
      return (smallest.textContent ?? '').trim().replace(label, '').trim();
    }, 'Kết quả tìm kiếm cho:');
  }

  /** Số phần tử <b> bị tạo ra trong vùng nội dung (0 nếu từ khóa không được render thành HTML) */
  injectedBoldCount(): Promise<number> {
    return this.page.getByRole('main').locator('b').count();
  }
}
