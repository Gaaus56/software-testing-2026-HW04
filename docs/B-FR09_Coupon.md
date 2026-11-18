# B-FR09 — Mã giảm giá (Web, trang Checkout) — Automation (HW04)

> Trần Thanh An — 23120017 — HW04 Automation Testing
> Giao diện được tự động hóa: Web `localhost:5173/checkout`

## S1. Chọn test case để tự động hóa

**Nguồn:** danh mục test case HW02 `software-testing-2026-HW02/testcases/FR09.json` (37 TC) và kết quả thực thi HW02 `scripts/results/FR09.json`.

**Tiêu chí chọn:**
1. Chạy được **qua giao diện Web**: hành động và assertion chính thực hiện trên trình duyệt. Bước chuẩn bị dữ liệu (reset backend, tạo sản phẩm/coupon) được phép gọi API.
2. Phủ đủ **positive / negative / biên** (BVA).
3. Thời gian chạy chấp nhận được khi nhân 3 trình duyệt.
4. Loại TC chỉ kiểm được ở tầng API, TC trùng mục đích, và ca khám phá không có kết quả mong đợi.

**Kết quả:** chọn **24 TC** (Positive 6, Negative 6, Biên 12); không tự động hóa 13 TC.

### S1.1 Test case được chọn

| # | ID (HW02) | Kỹ thuật | Loại | Dữ liệu | Kết quả mong đợi (theo đặc tả) | Cách tự động hóa trên UI | HW02 → HW04 |
|---|---|---|---|---|---|---|---|
| 1 | FR09-EP-01 | EP | Positive | SAVE10, total 1.000.000 | Thành công; discount = 1.000.000 × 10 / 100 = 100.000; final = 900.000 | SP giá 1.000.000 (tạo bằng API ở bước setup) → giỏ → Checkout → áp SAVE10 → kiểm "Tiết kiệm" và "Thành tiền" | Fail → dự kiến Fail (bug đã biết) |
| 2 | FR09-EP-02 | EP | Positive | BIGBUY, total 600.000 | discount = 50.000; final = 550.000 | SP 600.000 → áp BIGBUY → kiểm số tiền | Pass → dự kiến Pass |
| 3 | FR09-EP-03 | EP | Positive | VIP100, total 400.000 | discount = 100.000; final = 300.000 | SP 400.000 → áp VIP100 → kiểm số tiền | Pass → dự kiến Pass |
| 4 | FR09-EP-04 | EP | Negative | ABC123, total 400.000 | Từ chối: mã không tồn tại | Nhập ABC123 → kiểm thông báo "không tồn tại" | Pass → dự kiến Pass |
| 5 | FR09-EP-06 | EP | Negative | Ô mã để trống | Không áp dụng được (nút vô hiệu hoặc báo nhập mã) | Ô mã trống → kiểm nút Áp dụng bị vô hiệu | Pass → dự kiến Pass |
| 6 | FR09-EP-07 | EP | Positive | save10 | Được xử lý như SAVE10 (giả định A6: mã không phân biệt hoa/thường) | Nhập `save10` → kiểm được áp như SAVE10 | Pass → dự kiến Pass |
| 7 | FR09-EP-08 | EP | Positive | "  SAVE10  " | Khoảng trắng đầu/cuối bị bỏ, áp dụng như SAVE10 | Nhập `  SAVE10  ` → kiểm được áp như SAVE10 | Pass → dự kiến Pass |
| 8 | FR09-EP-09 | EP | Negative | x' OR 1=1 -- | Từ chối như mã không tồn tại; không lỗi server, không áp được mã nào | Nhập chuỗi SQL → kiểm bị từ chối, không lỗi trang | Pass → dự kiến Pass |
| 9 | FR09-EP-10 | EP | Negative | EXPIRED (hạn 2020-01-01), total 200.000 | Từ chối: mã hết hạn | SP 200.000 → áp EXPIRED → kiểm thông báo hết hạn | Pass → dự kiến Pass |
| 10 | FR09-EP-11 | EP | Negative | SAVE10, total 200.000 | Từ chối: chưa đủ ngưỡng 300.000 | SP 200.000 → áp SAVE10 → kiểm thông báo chưa đủ ngưỡng | Pass → dự kiến Pass |
| 11 | FR09-EP-15 | EP | Positive (GUI) | SAVE10 | Hiện Tiết kiệm 40.000 ₫, Thành tiền 360.000 ₫ (có ₫ và phân cách hàng nghìn) | SP 400.000 → áp SAVE10 → kiểm định dạng `40,000 ₫` / `360,000 ₫` | Fail → dự kiến Fail (bug đã biết) |
| 12 | FR09-EP-20 | EP | Negative (E2E) | SAVE10 | Đặt hàng thành công; lần áp sau bị từ chối vì hết lượt | Áp SAVE10 → Xác nhận thanh toán → mua lại → áp SAVE10 → kiểm bị từ chối vì hết lượt | Pass → dự kiến Pass |
| 13 | FR09-BVA-01 | BVA | Biên (min − 1) | SAVE10, total 299.999 | Từ chối: chưa đủ ngưỡng | SP 299.999 → SAVE10 → kiểm từ chối | Pass → dự kiến Pass |
| 14 | FR09-BVA-02 | BVA | Biên (= min) | SAVE10, total 300.000 | Thành công; discount 30.000; final 270.000 | SP 300.000 → SAVE10 → kiểm giảm 30.000 | Fail → dự kiến Fail (bug đã biết) |
| 15 | FR09-BVA-03 | BVA | Biên (min + 1) | SAVE10, total 300.001 | Thành công; discount 30.000,1; final 270.000,9 (sai số làm tròn ≤ 0,5) | SP 300.001 → SAVE10 → kiểm giảm ≈ 30.000 | Fail → dự kiến Fail (bug đã biết) |
| 16 | FR09-BVA-04 | BVA | Biên (min − 1) | BIGBUY, total 499.999 | Từ chối | SP 499.999 → BIGBUY → kiểm từ chối | Pass → dự kiến Pass |
| 17 | FR09-BVA-05 | BVA | Biên (= min) | BIGBUY, total 500.000 | Thành công; discount 50.000; final 450.000 | SP 500.000 → BIGBUY → kiểm giảm 50.000 | Fail → dự kiến Fail (bug đã biết) |
| 18 | FR09-BVA-06 | BVA | Biên (min + 1) | BIGBUY, total 500.001 | Thành công; final 450.001 | SP 500.001 → BIGBUY → kiểm thành tiền 450.001 | Pass → dự kiến Pass |
| 19 | FR09-BVA-07 | BVA | Biên (min − 1) | VIP100, total 299.999 | Từ chối | SP 299.999 → VIP100 → kiểm từ chối | Pass → dự kiến Pass |
| 20 | FR09-BVA-08 | BVA | Biên (= min) | VIP100, total 300.000 | Thành công; discount 100.000; final 200.000 | SP 300.000 → VIP100 → kiểm giảm 100.000 | Fail → dự kiến Fail (bug đã biết) |
| 21 | FR09-BVA-09 | BVA | Biên (min + 1) | VIP100, total 300.001 | Thành công; final 200.001 | SP 300.001 → VIP100 → kiểm thành tiền 200.001 | Pass → dự kiến Pass |
| 22 | FR09-BVA-11 | BVA | Biên (hôm qua) | DAYM1, total 100.000 | Từ chối: hết hạn | Coupon hạn hôm qua (tạo bằng API) → áp trên UI → kiểm hết hạn | Pass → dự kiến Pass |
| 23 | FR09-BVA-12 | BVA | Biên (hôm nay) | DAY0, total 100.000 | Từ chối (giả định A1: "trước" là so sánh nghiêm ngặt) | Coupon hạn hôm nay → kiểm hết hạn (giả định A1) | Pass → dự kiến Pass |
| 24 | FR09-BVA-13 | BVA | Biên (ngày mai) | DAYP1, total 100.000 | Thành công; discount 10.000; final 90.000 | Coupon hạn ngày mai → kiểm áp được | Pass → dự kiến Pass |

Cột cuối: kết quả HW02 và kết quả dự kiến khi tự động hóa. TC đã Fail ở HW02 do bug thật thì script vẫn giữ assertion theo đặc tả, nên dự kiến **Fail**; mỗi Fail phải đối chiếu với bug đã báo (#90–#109) ở bước S7.

### S1.2 Test case không tự động hóa trên UI và lý do

| ID (HW02) | Tầng ở HW02 | Lý do |
|---|---|---|
| FR09-EP-05 | API | Cần đặt `is_active = 0` trực tiếp trong DB (không có UI/API) → phụ thuộc file SQLite của backend, không phải thao tác giao diện |
| FR09-EP-12 | API | Khách chưa đăng nhập không vào được Checkout trên UI; ca "không gửi token" chỉ tạo được bằng request API |
| FR09-EP-13 | API | Token giả không thể tạo qua giao diện; chỉ kiểm được ở tầng API |
| FR09-EP-14 | API | Cần ghi lượt dùng bằng `POST /api/coupon-usage`; phiên bản UI của ý này là EP-20 (đã chọn) |
| FR09-EP-16 | API | Giả `user_id` trong body request: giao diện không cho sửa → chỉ kiểm được bằng API |
| FR09-EP-17 | API | Giỏ hàng phía server khác tổng client gửi: giao diện Web dùng giỏ trong bộ nhớ, không tạo được tình huống này |
| FR09-EP-19 | API | Trùng ý với EP-20 ở mức UI; giá trị thấp, bỏ để giảm thời gian chạy 3 trình duyệt |
| FR09-BVA-10 | API | Trùng mục đích với EP-10 (EXPIRED) khi chạy qua UI |
| FR09-BVA-14 | API | Cần ghi lượt dùng bằng API `coupon-usage` trước khi kiểm; giữ ở mức API (HW02) |
| FR09-BVA-15 | API | Như BVA-14 |
| FR09-BVA-16 | API | Coupon fixed 100.000 với đơn < 100.000: SP giá 99.999 qua UI làm được, nhưng đây là ca biên output dựa trên giả định A7; để mở rộng nếu còn thời gian |
| FR09-BVA-17 | API | Như BVA-16 |
| FR09-BVA-18 | API | Như BVA-16 |

## S2. File dữ liệu

File: [`data/fr09.json`](../data/fr09.json) — 24 phần tử (`id`, `input`, `expected`, `note`). Script chỉ đọc file này.

| Trường | Ý nghĩa |
|---|---|
| `input.code` | Mã nhập vào ô "Mã Giảm Giá" (giữ nguyên chữ thường / khoảng trắng của TC) |
| `input.productPrice` | Giá sản phẩm được tạo bằng API ở bước chuẩn bị; giỏ hàng có đúng 1 sản phẩm này, nên tổng đơn = giá này |
| `input.coupon` | Coupon cần tạo trước bằng API (biên ngày); `expiredOffsetDays` tính từ ngày chạy test |
| `input.placeOrderFirst` | `true`: đặt hàng với mã này trước, rồi mua lại và áp mã lần nữa (EP-20) |
| `expected.outcome` | `applied` / `rejected` / `applyDisabled` |
| `expected.discount`, `final`, `tolerance` | Số tiền giảm và thành tiền theo công thức đặc tả, sai số cho phép 0,5 ₫ |
| `expected.reasonPattern` | Regex (không phân biệt hoa thường) mà thông báo từ chối phải khớp. Đặc tả không quy định câu chữ, nên chỉ kiểm từ khóa của lý do |
| `expected.displayFormat` | `thousands-separator-dong`: số tiền hiển thị có phân cách hàng nghìn và ký hiệu ₫ (FR-21) |
| `note` | Căn cứ đặc tả / giả định, bug HW02 liên quan |

Lưu ý: EP-07 và EP-08 ở HW02 chỉ kiểm "áp dụng thành công", nên được Pass. Ở HW04, `expected` kiểm thêm số tiền theo công thức, nên dự kiến sẽ Fail do bug #96.

## S3. Page Object

File: [`pages/CheckoutPage.ts`](../pages/CheckoutPage.ts) (chi tiết sản phẩm → giỏ hàng → Checkout). Helper: [`helpers/backend.ts`](../helpers/backend.ts) (`createProduct`, `createCoupon` để chuẩn bị tổng đơn và coupon biên ngày).

| Phần tử | Selector |
|---|---|
| Nút thêm vào giỏ | `getByRole('button', { name: /Thêm vào giỏ\|Đã thêm/ })` |
| Link giỏ hàng | `getByRole('link', { name: 'Giỏ hàng', exact: true })` |
| Nút thanh toán | `getByRole('button', { name: /Tiến hành thanh toán/ })` |
| Ô mã giảm giá | `getByPlaceholder('Nhập mã giảm giá...')` |
| Nút áp dụng | `getByRole('button', { name: 'Áp dụng' })` |
| Khối mã giảm giá | `getByText('Mã Giảm Giá', { exact: true })` → khối cha |
| Tiền giảm / thành tiền | Trong khối trên: `getByText(/^Tiết kiệm:/)` / `getByText(/^Thành tiền:/)` → `getByRole('strong')` |
| Nút xác nhận đặt hàng | `getByRole('button', { name: /Xác Nhận Thanh Toán/ })` |

Ghi chú khi viết:
- Giỏ hàng Web chỉ lưu trong bộ nhớ trang, nên từ trang chi tiết sang Checkout phải đi bằng click, không `page.goto`.
- Trang chi tiết Web cần bấm "Thêm vào giỏ" 2 lần mới thêm (hành vi của FR-06 Web, ngoài phạm vi). `addProductToCart` bấm lần 2 nếu nút chưa đổi sang "Đã thêm", rồi chờ "Đã thêm".
- `parseMoney` đổi chuỗi hiển thị (định dạng `toLocaleString` en-US: `30,000.1 ₫`) thành số để so với `expected` trong file dữ liệu.

Đã chạy thử trên Chromium, Firefox, WebKit (áp VIP100 cho đơn 400.000 → 100,000 ₫ / 300,000 ₫).

## S4. Script do AI sinh (bản đầu)

File: [`tests/fr09-coupon.spec.ts`](../tests/fr09-coupon.spec.ts) — commit `[B-FR09][S4]` là **bản gốc AI sinh**, chưa chạy, chưa review.

- **Data-driven:** đọc `data/fr09.json`, 24 test. Mỗi test: reset backend → tạo sản phẩm đúng giá `productPrice` (và coupon nếu có) bằng API → đăng nhập qua UI → thêm vào giỏ → Checkout → áp mã.
- **Kiểu assertion:**

| Kiểu | Ví dụ trong script | Dùng cho |
|---|---|---|
| Trạng thái phần tử | `expect(cp.applyButton).toBeDisabled()` | Ô mã trống |
| Số lượng phần tử | `expect(cp.savingAmount).toHaveCount(0)` | Mã bị từ chối thì không có dòng "Tiết kiệm" |
| Nội dung | `expect(cp.couponSection).toContainText(/hết hạn/i)` | Lý do từ chối |
| So số tiền có sai số | `expect(Math.abs(discount - expected)).toBeLessThanOrEqual(0.5)` | Công thức percent / fixed |
| Định dạng hiển thị (regex) | `expect(cp.finalAmount).toHaveText(/^\d{1,3}([.,]\d{3})+ ₫$/)` | FR-21 |
| URL | `expect(page).toHaveURL(...)` | Đăng nhập xong |

## S5. Chạy thử, review và sửa script AI

Chạy trên Chromium: `npx playwright test tests/fr09-coupon.spec.ts --browser=chromium --workers=1`.

### S5.1 Lỗi của script AI và cách sửa

| # | Vấn đề trong bản AI (S4) | Loại | Vì sao AI sai | Sửa | Commit |
|---|---|---|---|---|---|
| R1 | `mode: 'serial'`: một Fail làm các test sau bị bỏ qua | Cấu hình chạy sai | Như FR-02 R1 | Bỏ serial | `[B-FR09][S5] Run data-driven cases independently…` |
| R2 | Ca bị từ chối: `expect(savingAmount).toHaveCount(0)` kiểm **ngay sau response**, lúc React có thể chưa vẽ kết quả → có thể Pass sai (kể cả khi sau đó mã được áp dụng) | Chờ không ổn định / Pass giả | AI coi "đã có response" là "giao diện đã cập nhật"; `toHaveCount(0)` đúng ngay ở trạng thái ban đầu nên auto-wait không giúp được | Kiểm lý do từ chối trước (assertion tự chờ thông báo hiện ra), rồi mới kiểm không có tiền giảm | `[B-FR09][S5] Wait for coupon result before asserting…` |
| R3 | Ca áp dụng ở biên (BVA-02/05/08) Fail với thông báo "không thấy dòng Tiết kiệm sau 5 s", **không cho biết lý do** | Thông báo Fail khó hiểu | AI chỉ kiểm phần tử mong đợi, không kiểm trạng thái kết quả | Kiểm `toContainText(/thành công/)` trước; khi Fail báo cáo hiện nguyên văn "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫…" | Cùng commit trên |
| R4 | Tiền giảm sai làm test dừng → thành tiền và định dạng ₫ (EP-15) không được kiểm | Assertion thiếu | Như FR-02 R2 | `expect.soft` cho tiền giảm, thành tiền, định dạng | Cùng commit trên |

### S5.2 Kết quả trên Chromium và phân loại Fail

**16 Pass / 8 Fail.** Cả 8 Fail đều do **lỗi thật của SUT**:

| TC | Thông báo Fail | Bug HW02 |
|---|---|---|
| FR09-EP-01 | Tiền giảm -9.000.000 (mong đợi 100.000) | #96 |
| FR09-EP-07, EP-08 | Tiền giảm -3.600.000 (mong đợi 40.000) | #96 |
| FR09-EP-15 | Tiền giảm, thành tiền sai; hiển thị "-3,600,000 ₫" | #96 |
| FR09-BVA-03 | Tiền giảm -2.700.009 (mong đợi 30.000,1) | #96 |
| FR09-BVA-02, 05, 08 | "Đơn hàng chưa đủ giá trị tối thiểu…" khi tổng đúng bằng ngưỡng | #97 |

EP-07 và EP-08 Pass ở HW02 (chỉ kiểm "thành công") nhưng Fail ở HW04 vì giờ kiểm cả số tiền. Đây là cùng bug #96, không phải bug mới.

## S6. Chạy trên 3 trình duyệt

Lệnh (sinh viên tự chạy): `npm run test:reports` → [`scripts/run-reports.ps1`](../scripts/run-reports.ps1). Mỗi lần chạy có một báo cáo HTML Playwright, tiêu đề `EShop HW04 — Run by: 23120017 — <thời điểm ISO>`, metadata `Run by` / `Run at (ISO)`, ảnh chụp ở các test Fail.

| Trình duyệt | Báo cáo HTML | Bắt đầu (ISO, UTC) | Run by | Pass | Fail | Flaky | Skipped | Giây |
|---|---|---|---|---|---|---|---|---|
| chromium | [`reports/FR09-chromium/`](../reports/FR09-chromium/index.html) | 2026-11-18T02:56:19.805Z | 23120017 | 16 | 8 | 0 | 0 | 81 |
| firefox | [`reports/FR09-firefox/`](../reports/FR09-firefox/index.html) | 2026-11-18T02:57:42.312Z | 23120017 | 16 | 8 | 0 | 0 | 151 |
| webkit | [`reports/FR09-webkit/`](../reports/FR09-webkit/index.html) | 2026-11-18T03:00:14.353Z | 23120017 | 16 | 8 | 0 | 0 | 83 |

- **Kết quả giống nhau trên cả 3 trình duyệt:** có. Cùng 8 ca Fail: FR09-BVA-02, FR09-BVA-03, FR09-BVA-05, FR09-BVA-08, FR09-EP-01, FR09-EP-07, FR09-EP-08, FR09-EP-15.
- **Không có ca flaky**, không có ca bị bỏ qua. Không có lỗi nào chỉ xuất hiện trên một trình duyệt.
- Mọi ca Fail đều do lỗi thật của SUT đã phân loại ở S5.2, trùng các bug HW02: #96, #97.
- Ảnh bảng tổng hợp của lần chạy: [`docs/images/S6_run_summary.png`](images/S6_run_summary.png).

## S7. Bug

8 TC Fail → 2 issue HW02, Fail trên cả 3 trình duyệt. Không có bug mới, nên **không tạo issue mới** (tránh trùng, theo quy ước nhóm). Bằng chứng tái hiện tự động được ghi vào [`docs/Bug_Report.md`](Bug_Report.md), kèm ảnh trang GitHub Issue trong `bugs/issue-screenshots/`.

| Issue | Bug HW02 | Lỗi | TC HW04 Fail |
|---|---|---|---|
| [#96](https://github.com/angquoc/software-testing-2026-HW02-group/issues/96) | BUG-FR09-01 | Mã percent tính sai (tiền giảm âm, thành tiền ×10) | EP-01, EP-07, EP-08, EP-15, BVA-03 |
| [#97](https://github.com/angquoc/software-testing-2026-HW02-group/issues/97) | BUG-FR09-02 | Từ chối khi tổng đúng bằng ngưỡng | BVA-02, BVA-05, BVA-08 |

## S8. Phân tích phần AI làm sai / bỏ sót

| # | AI sai / bỏ sót | Phát hiện ở | Loại | Nguyên nhân | Đã xử lý |
|---|---|---|---|---|---|
| G1 | `mode: 'serial'` | S5 (R1) | Cấu hình chạy | Như FR-02 G1 | Sửa |
| G2 | `toHaveCount(0)` ngay sau response → có thể **Pass giả** khi giao diện chưa cập nhật | S5 (R2) | Chờ không ổn định / Pass giả | **Model:** coi "đã có response API" là "giao diện đã cập nhật"; không nhận ra assertion "phần tử không tồn tại" đúng ngay ở trạng thái ban đầu nên auto-wait không có tác dụng | Sửa: kiểm lý do trước |
| G3 | Thông báo Fail "không thấy dòng Tiết kiệm" không nói lý do | S5 (R3) | Khả năng chẩn đoán | **Prompt:** không yêu cầu thông báo Fail phải đủ để phân loại lỗi | Sửa |
| G4 | Assertion cứng: tiền giảm sai làm thành tiền và định dạng ₫ không được kiểm | S5 (R4) | Assertion thiếu | Như FR-02 G2 | Sửa (`expect.soft`) |
| G5 | Bộ test UI **không bắt được 4 bug nặng nhất** của FR-09 (#98 Critical, #99 Critical, #100 High, #101 Medium): chúng nằm ở tầng API (không token, sửa `user_id`, sửa `total_amount`) | S1 | Bỏ sót do phạm vi | **Đặc điểm feature:** giao diện không cho tạo các request đó. Nếu chỉ dựa vào automation UI, sẽ có cảm giác an toàn sai | Ghi trong S1.2 và Bug Report; đề xuất bổ sung bộ test API (Playwright `request`) |
| G6 | EP-07, EP-08 Pass ở HW02 nhưng Fail ở HW04 | S2 → S5 | Thay đổi oracle (có chủ đích) | Ở HW04 `expected` kiểm cả số tiền, nên cùng bug #96 lộ ra thêm ở 2 ca | Giữ, ghi rõ để không bị hiểu là bug mới |
