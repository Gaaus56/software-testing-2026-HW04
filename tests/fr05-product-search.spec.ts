// FR-05 — Xem danh sách & Tìm kiếm sản phẩm (Web, trang chủ). Data-driven: mỗi phần tử trong data/fr05.json là một test.
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { loadCases } from '../helpers/data';
import { resetBackend } from '../helpers/backend';

interface Input {
  keyword?: string;
  keywordChar?: string;
  keywordLength?: number;
  apiDelayMs?: number;
}
interface Expected {
  cardCount?: number;
  cardCountAfter?: number;
  names?: string[];
  allCardsHaveImgSrc?: boolean;
  allImgAltNonEmpty?: boolean;
  altEqualsName?: boolean;
  priceFormat?: string;
  priceByName?: Record<string, number>;
  emptyStateVisible?: boolean;
  keywordDisplayed?: string;
  noInjectedElement?: string;
  noDbErrorText?: string;
  noErrorHtmlBox?: boolean;
  loadingVisibleWhileDelayed?: boolean;
  h1Count?: number;
}

const cases = loadCases<Input, Expected>('fr05.json');

// Không dùng mode 'serial': một test Fail (kể cả do bug thật) không làm bỏ qua các test sau.
// Mỗi test tự reset backend nên độc lập; chạy với 1 worker (workers: 1 trong playwright.config.ts).
test.describe.configure({ mode: 'default' });

/** Chuỗi từ khóa: lấy trực tiếp từ input, hoặc sinh từ keywordChar × keywordLength (ca biên 255 ký tự) */
function keywordOf(input: Input): string {
  if (input.keywordLength !== undefined) return (input.keywordChar ?? 'x').repeat(input.keywordLength);
  return input.keyword ?? '';
}

/** Chặn API sản phẩm thêm `ms` mili-giây để kiểm trạng thái loading */
async function delayProductsApi(page: Page, ms: number) {
  await page.route('**/api/products**', async (route) => {
    await new Promise((r) => setTimeout(r, ms));
    await route.continue();
  });
}

for (const tc of cases) {
  test(`${tc.id}: ${tc.note}`, async ({ page }) => {
    const { input, expected } = tc;
    const keyword = keywordOf(input);
    const home = new HomePage(page);

    // DB sạch trước mỗi test: nếu không, số sản phẩm có thể lệch (dữ liệu HW04 còn sót lại)
    await resetBackend();
    if (input.apiDelayMs) await delayProductsApi(page, input.apiDelayMs);

    await home.goto();

    // Trạng thái loading: kiểm khi API còn đang bị trì hoãn, trước khi danh sách xuất hiện
    if (expected.loadingVisibleWhileDelayed !== undefined) {
      await expect
        .soft(home.loadingIndicator.first(), 'Thiếu trạng thái loading khi đang tải dữ liệu (FR-05)')
        .toBeVisible();
    }

    // Chờ trang ở trạng thái kết thúc trước khi kiểm (tránh đếm khi danh sách chưa tải xong)
    if (keyword !== '') {
      await page.getByPlaceholder('Tìm kiếm...').fill(keyword);
      await page.getByRole('button', { name: 'Tìm', exact: true }).click();
      await home.settled(keyword);
    } else {
      await home.settled('');
    }

    const cards = home.cards();

    if (expected.cardCount !== undefined) {
      await expect.soft(cards, `Số thẻ sản phẩm khác kỳ vọng với từ khóa "${keyword}"`).toHaveCount(expected.cardCount);
    }
    if (expected.cardCountAfter !== undefined) {
      await expect.soft(cards, 'Số thẻ sau khi tải xong khác kỳ vọng').toHaveCount(expected.cardCountAfter);
    }

    if (expected.names !== undefined) {
      const actual = (await home.productNamesText()).sort();
      expect.soft(actual, 'Tập tên sản phẩm hiển thị khác kỳ vọng').toEqual([...expected.names].sort());
    }

    if (expected.allCardsHaveImgSrc !== undefined) {
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        const src = await home.cardImage(cards.nth(i)).getAttribute('src');
        expect.soft(!!src && src.trim() !== '', `Thẻ ${i + 1} không có ảnh (src rỗng)`).toBe(true);
      }
    }

    if (expected.allImgAltNonEmpty !== undefined || expected.altEqualsName !== undefined) {
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const alt = (await home.cardImage(card).getAttribute('alt')) ?? '';
        const name = (await home.productNamesText())[i] ?? '';
        if (expected.allImgAltNonEmpty) {
          expect.soft(alt.trim(), `Ảnh thẻ ${i + 1} thiếu alt text (FR-05 yêu cầu alt mô tả)`).not.toBe('');
        }
        if (expected.altEqualsName) {
          expect.soft(alt, `Alt của ảnh thẻ ${i + 1} không khớp tên sản phẩm`).toBe(name);
        }
      }
    }

    if (expected.priceFormat !== undefined) {
      const re = new RegExp(expected.priceFormat, 'u');
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        const priceText = ((await home.cardPrice(cards.nth(i)).textContent()) ?? '').trim();
        expect.soft(re.test(priceText), `Giá thẻ ${i + 1} "${priceText}" không đúng định dạng ₫ có phân cách nghìn`).toBe(true);
      }
    }

    if (expected.priceByName !== undefined) {
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const name = (await home.productNamesText())[i] ?? '';
        const priceText = ((await home.cardPrice(card).textContent()) ?? '');
        const actual = Number(priceText.replace(/[^\d]/g, ''));
        if (name in expected.priceByName) {
          expect.soft(actual, `Giá của "${name}" khác giá trong API`).toBe(expected.priceByName[name]);
        }
      }
    }

    if (expected.emptyStateVisible !== undefined) {
      await expect.soft(home.emptyState, 'Thiếu thông báo empty state khi không có kết quả (FR-05)').toBeVisible();
    }

    if (expected.keywordDisplayed !== undefined) {
      expect
        .soft(await home.displayedKeyword(), 'Từ khóa hiển thị không giống nguyên văn người dùng nhập')
        .toBe(expected.keywordDisplayed);
    }

    if (expected.noInjectedElement !== undefined) {
      expect
        .soft(await page.getByRole('main').locator(expected.noInjectedElement).count(), `Từ khóa được render thành thẻ <${expected.noInjectedElement}> (HTML không an toàn)`)
        .toBe(0);
    }

    if (expected.noDbErrorText !== undefined) {
      await expect
        .soft(page.getByText(expected.noDbErrorText), `Lỗi DB thô hiển thị cho người dùng: "${expected.noDbErrorText}"`)
        .toHaveCount(0);
    }

    if (expected.noErrorHtmlBox !== undefined) {
      await expect.soft(home.errorHeading, 'Có khối lỗi HTML của backend hiển thị trên trang').toHaveCount(0);
    }

    if (expected.h1Count !== undefined) {
      await expect
        .soft(home.headingLevel1, `Số thẻ h1 trên trang chủ khác ${expected.h1Count} (FR-05 yêu cầu đúng một h1)`)
        .toHaveCount(expected.h1Count);
    }
  });
}
