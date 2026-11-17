import { Locator, Page } from '@playwright/test';
import { WEB_URL } from '../helpers/env';

/**
 * Luồng mua hàng trên Web: Chi tiết sản phẩm → Giỏ hàng → Checkout (áp mã giảm giá).
 * Giỏ hàng chỉ lưu trong bộ nhớ của trang, nên phải đi bằng thao tác click (không dùng page.goto giữa chừng).
 */
export class CheckoutPage {
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;
  readonly proceedButton: Locator;
  readonly couponInput: Locator;
  readonly applyButton: Locator;
  readonly couponSection: Locator;
  readonly savingAmount: Locator;
  readonly finalAmount: Locator;
  readonly confirmButton: Locator;
  readonly successHeading: Locator;

  constructor(private readonly page: Page) {
    this.addToCartButton = page.getByRole('button', { name: /Thêm vào giỏ|Đã thêm/ });
    this.cartLink = page.getByRole('link', { name: 'Giỏ hàng', exact: true });
    this.proceedButton = page.getByRole('button', { name: /Tiến hành thanh toán/ });
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
    this.applyButton = page.getByRole('button', { name: 'Áp dụng' });
    // Khối "Mã Giảm Giá": nhãn → khối cha chứa ô nhập, nút và thông báo kết quả
    this.couponSection = page.getByText('Mã Giảm Giá', { exact: true }).locator('..');
    this.savingAmount = this.couponSection.getByText(/^Tiết kiệm:/).getByRole('strong');
    this.finalAmount = this.couponSection.getByText(/^Thành tiền:/).getByRole('strong');
    this.confirmButton = page.getByRole('button', { name: /Xác Nhận Thanh Toán/ });
    this.successHeading = page.getByRole('heading', { name: /Thanh toán thành công/ });
  }

  /** Mở chi tiết sản phẩm và thêm 1 sản phẩm vào giỏ. */
  async addProductToCart(productId: number) {
    await this.page.goto(`${WEB_URL}/product/${productId}`);
    await this.addToCartButton.click();
    // Trang Web cần bấm 2 lần mới thêm vào giỏ (hành vi của FR-06 Web, ngoài phạm vi FR-09):
    // nếu nút chưa đổi sang "Đã thêm" thì bấm thêm một lần.
    const added = this.page.getByRole('button', { name: 'Đã thêm' });
    if (!(await added.isVisible())) await this.addToCartButton.click();
    await added.waitFor();
  }

  /** Từ trang bất kỳ (đã có hàng trong giỏ): mở Giỏ hàng → Tiến hành thanh toán */
  async openCheckout() {
    await this.cartLink.click();
    await this.proceedButton.click();
    await this.couponInput.waitFor();
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    if (await this.applyButton.isDisabled()) return;
    const resp = this.page.waitForResponse((r) => r.url().includes('/api/apply-coupon'));
    await this.applyButton.click();
    await resp;
  }

  /** Nội dung chữ của khối mã giảm giá (thông báo thành công / lỗi) */
  async couponMessage(): Promise<string> {
    return (await this.couponSection.innerText()).replace(/\s+/g, ' ').trim();
  }

  async placeOrder() {
    this.page.once('dialog', (d) => d.dismiss());
    await this.confirmButton.click();
    await this.successHeading.waitFor();
  }
}

/** Đổi chuỗi tiền hiển thị ("-3,600,000 ₫", "30,000.1 ₫") thành số */
export function parseMoney(text: string): number {
  const cleaned = text.replace(/[^\d.,-]/g, '');
  // Định dạng en-US (toLocaleString): dấu phẩy phân cách hàng nghìn, dấu chấm thập phân
  return Number(cleaned.replace(/,/g, ''));
}
