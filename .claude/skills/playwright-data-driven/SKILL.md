---
name: playwright-data-driven
description: Tự động hóa test case của một feature Web bằng Playwright theo kiểu data-driven, chạy trên Chromium/Firefox/WebKit, báo cáo HTML có "Run by: <MSSV>"; gồm cả bảo trì script khi giao diện đổi hoặc test Fail. Đi từng bước (chọn TC → file data → Page Object → spec → chạy & review → 3 trình duyệt) và dừng cho người dùng duyệt sau mỗi bước. Dùng khi được yêu cầu "tự động hóa feature", "viết script Playwright", "data-driven test", "chạy nhiều trình duyệt", hoặc sửa test Playwright đang Fail.
---

# Playwright data-driven automation (từng bước, có duyệt)

Bạn là trợ lý kiểm thử tự động. **Không** sinh toàn bộ script trong một lượt. Đi đúng các bước dưới đây; sau mỗi bước trình bày kết quả, hỏi "Đồng ý / sửa gì?" và **chỉ sang bước sau khi người dùng duyệt**. Mỗi bước được duyệt là một commit `[<Pool>-<FR>][S<n>] <Verb> …` (không thêm trailer AI vào commit).

## Đầu vào (hỏi nếu thiếu)
1. Mã feature (ví dụ `FR05`), Pool, URL trang cần test.
2. Danh mục test case: file JSON (id, data, expected — ví dụ `testcases/FR05.json` của HW02, sinh bởi skill `domain-testing` / `boundary-value-analysis`) hoặc bảng do người dùng đưa.
3. Đặc tả của feature (để làm oracle) và cách đưa hệ thống về trạng thái sạch (repo này: `helpers/backend.ts` → `resetBackend()`).
4. MSSV để in "Run by".

Nếu repo chưa có khung (`playwright.config.ts`, `helpers/`, `scripts/run-reports.ps1`) thì tạo từ `templates/` trước, rồi dừng cho người dùng duyệt.

## S1 — Chọn test case
- Chọn **≥ 12 TC** tự động hóa được **trên giao diện** (thao tác + assertion chính trên trình duyệt; chuẩn bị dữ liệu bằng API được phép). Phủ positive / negative / biên.
- Bảng "không tự động hóa" kèm lý do: chỉ làm được ở tầng API, chạy quá lâu, trùng mục đích, ca khám phá không có oracle.
- Ghi vào `docs/<Pool>-<FR>_*.md` mục S1. Đối chiếu kết quả lần test thủ công trước (nếu có): ca đã Fail vì bug thật → dự kiến Fail.

## S2 — File dữ liệu
- `data/<fr>.json`: mảng phần tử `{ id, input, expected, note }`. `expected` là **giá trị kiểm được bằng máy** (status, số tiền + sai số, số bản ghi, regex lý do), không phải câu mô tả.
- Script **không được** chứa mảng/đối tượng dữ liệu viết cứng.
- File fixture (CSV, file upload): đặt trong `data/<fr>-*/` và thêm `.gitattributes` `-text` để Git không đổi CRLF/BOM.
- Tự kiểm: danh sách id trong file data khớp đúng danh sách S1.

## S3 — Page Object
- Thứ tự ưu tiên selector: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByText` → thuộc tính ngữ nghĩa (`input[type="file"]`). **Không** XPath dài, **không** class CSS/Tailwind, **không** `nth()` nếu tránh được.
- **Đọc DOM thật trước khi viết selector** (mở trang, xem nhãn có gắn `for` không, có placeholder không). Nhãn không gắn với ô nhập → tìm theo chữ của nhãn rồi lấy `input` trong khối cha.
- Khối chứa nhiều phần tử: lọc `div` theo **tất cả** phần tử cần có (`filter({ has: A }).filter({ has: B }).last()`).
- **Không** dùng `isVisible()` / `count()` ngay sau `goto` để rẽ nhánh. Chờ một trong các trạng thái: `a.or(b).first().waitFor()`.
- Chạy thử Page Object trên **cả 3 trình duyệt** bằng một spec tạm (xóa sau khi chạy, không commit).

## S4 — Spec (bản gốc AI)
- `tests/<fr>-<tên>.spec.ts`: `for (const tc of loadCases('<fr>.json')) test(\`${tc.id}: ${tc.note}\`, …)`. Assertion chọn theo các trường có trong `expected`.
- ≥ 3 kiểu assertion (URL, thuộc tính, nội dung, trạng thái, số lượng, giá trị response, so tập hợp…).
- Mỗi test tự đưa hệ thống về trạng thái sạch ở đầu test.
- Commit nguyên bản này (để bước review so sánh), chưa sửa.

## S5 — Chạy, review, sửa
Chạy trên Chromium: `npx playwright test tests/<spec> --project=chromium`. Với **mỗi** ca Fail, đọc thông báo lỗi và phân loại:
- **Fail do script** → sửa, mỗi nhóm lỗi một commit `[S5]`.
- **Fail do lỗi thật của SUT** → giữ assertion theo đặc tả, ghi bug.

Checklist review bắt buộc (các lỗi đã gặp thật ở HW04):
1. **Không dùng `mode: 'serial'`** cho bộ data-driven: một ca Fail (kể cả do bug thật) sẽ làm mọi ca sau bị bỏ qua. Dùng `workers: 1` nếu các test dùng chung trạng thái.
2. Nhiều yêu cầu độc lập trong một ca → `expect.soft`, để báo **đủ** lỗi thay vì dừng ở lỗi đầu tiên.
3. Assertion "không tồn tại" (`toHaveCount(0)`, `not.toBeVisible`) phải đặt **sau** một assertion chờ kết quả hiện ra; nếu không sẽ Pass giả trước khi giao diện cập nhật.
4. Mỗi assertion có thông báo đủ để phân loại Fail (ví dụ kiểm "thành công" trước khi đọc số tiền, để báo cáo hiện nguyên văn lý do bị từ chối).
5. Loại assertion luôn đúng (ví dụ `toHaveURL(/login$/)` khi trang không bao giờ chuyển hướng).
6. Không `waitForTimeout` trừ khi chính thời gian là dữ liệu test (biên thời gian khóa…).

Ghi bảng review (vấn đề, loại, vì sao AI sai: prompt / giới hạn model / đặc điểm feature, cách sửa, commit) vào mục S5 của doc.

## S6 — 3 trình duyệt, báo cáo "Run by"
- `playwright.config.ts` (xem `templates/playwright.config.ts`): 3 project, HTML reporter `title: 'Run by: <MSSV> — <ISO>'`, `metadata`, `json` reporter cho số liệu, `screenshot: 'only-on-failure'`.
- Chạy: `.\scripts\run-reports.ps1 -Features <FR>` → `reports/<FR>-chromium|firefox|webkit/`.
- **Lần chạy chính thức để nộp do người dùng tự gõ lệnh** (báo cáo phải là bằng chứng chạy thật). Không tạo hay sửa báo cáo HTML bằng AI.
- Đọc 3 `results.json`: so tập ca Fail giữa các trình duyệt; ca chỉ Fail ở một trình duyệt → kiểm flaky (chạy lại riêng) trước khi kết luận là lỗi riêng của trình duyệt.

## Bảo trì (khi giao diện đổi hoặc test bắt đầu Fail)
1. Chạy riêng test Fail với `--project=chromium --reporter=list`, đọc `error-context.md` (ảnh chụp cây truy cập của trang).
2. Selector không còn khớp → sửa **Page Object**, không sửa spec. Dữ liệu/kết quả mong đợi đổi theo đặc tả → sửa **file data**, không sửa spec.
3. Chạy lại trên 3 trình duyệt; commit `[<Pool>-<FR>][S5] Fix …` với lý do trong message.

## Kết thúc
Nhắc người dùng: xuất prompt log (skill `ai-audit-log`), cập nhật mục S7 (bug) / S8 (gap analysis) trong doc feature.
