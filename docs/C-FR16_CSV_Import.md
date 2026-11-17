# C-FR16 — Import sản phẩm từ CSV (Web Admin) — Automation (HW04)

> Trần Thanh An — 23120017 — HW04 Automation Testing
> Giao diện được tự động hóa: Web Admin `localhost:5174` → Sản phẩm → Import CSV

## S1. Chọn test case để tự động hóa

**Nguồn:** danh mục test case HW02 `software-testing-2026-HW02/testcases/FR16.json` (38 TC) và kết quả thực thi HW02 `scripts/results/FR16.json`.

**Tiêu chí chọn:**
1. Chạy được **qua giao diện Web**: hành động và assertion chính thực hiện trên trình duyệt. Bước chuẩn bị dữ liệu (reset backend, tạo sản phẩm/coupon) được phép gọi API.
2. Phủ đủ **positive / negative / biên** (BVA).
3. Thời gian chạy chấp nhận được khi nhân 3 trình duyệt.
4. Loại TC chỉ kiểm được ở tầng API, TC trùng mục đích, và ca khám phá không có kết quả mong đợi.

**Kết quả:** chọn **26 TC** (Positive 6, Negative 10, Biên 10); không tự động hóa 12 TC.

### S1.1 Test case được chọn

| # | ID (HW02) | Kỹ thuật | Loại | Dữ liệu | Kết quả mong đợi (theo đặc tả) | Cách tự động hóa trên UI | HW02 → HW04 |
|---|---|---|---|---|---|---|---|
| 1 | FR16-EP-01 | EP | Positive | FR16-EP-01_valid_2rows.csv (2 dòng hợp lệ) | Thêm đúng 2 SP; báo cáo 2 thành công, 0 lỗi | Import file 2 dòng hợp lệ → kiểm báo cáo trên UI + số SP tăng đúng 2 | Pass → dự kiến Pass |
| 2 | FR16-EP-02 | EP | Negative | FR16-EP-02_valid_content.txt (nội dung CSV hợp lệ, đuôi .txt) | Từ chối file vì đuôi không phải .csv; không thêm SP | Import `.txt` → kiểm bị từ chối, số SP không đổi | Fail → dự kiến Fail (bug đã biết) |
| 3 | FR16-EP-03 | EP | Negative | FR16-EP-03_fake_excel.xlsx (nhị phân) | Từ chối, báo sai định dạng file; không thêm SP | Import `.xlsx` → kiểm báo sai định dạng, số SP không đổi | Fail → dự kiến Fail (bug đã biết) |
| 4 | FR16-EP-04 | EP | Negative | Header ten,gia,mo_ta,image,danh_muc | Từ chối, báo header sai; không thêm SP | Header sai tên cột → kiểm báo lỗi header | Fail → dự kiến Fail (bug đã biết) |
| 5 | FR16-EP-05 | EP | Negative | File không có header (2 dòng dữ liệu) | Từ chối, báo thiếu/sai header; không thêm SP | Không có header → kiểm báo lỗi header | Fail → dự kiến Fail (bug đã biết) |
| 6 | FR16-EP-06 | EP | Positive | "CSV-EP06 Laptop, Pro",25000000,"Mo ta, co dau phay",…,2 | Thêm 1 SP tên "CSV-EP06 Laptop, Pro", giá 25.000.000 | Trường có dấu phẩy bọc nháy → kiểm tên SP đúng nguyên văn | Fail → dự kiến Fail (bug đã biết) |
| 7 | FR16-EP-07 | EP | Negative | 3 dòng, dòng 2 name rỗng | Rollback: không thêm SP nào; báo cáo nêu dòng lỗi và lý do (thiếu tên) | Dòng giữa thiếu tên → kiểm rollback (0 SP) + báo lý do | Fail → dự kiến Fail (bug đã biết) |
| 8 | FR16-EP-08 | EP | Negative | 1 dòng hợp lệ + 1 dòng price = 0 | Rollback: không thêm SP nào; báo lỗi giá | Dòng có price = 0 → kiểm rollback | Fail → dự kiến Fail (bug đã biết) |
| 9 | FR16-EP-09 | EP | Negative | 1 dòng hợp lệ + 1 dòng price = -5000 | Rollback; báo lỗi giá | Dòng có price âm → kiểm rollback | Fail → dự kiến Fail (bug đã biết) |
| 10 | FR16-EP-10 | EP | Negative | 1 dòng hợp lệ + 1 dòng price = abc | Rollback; báo lỗi giá | Dòng có price là chữ → kiểm rollback | Fail → dự kiến Fail (bug đã biết) |
| 11 | FR16-EP-11 | EP | Negative | Chỉ có header | Không import; báo không có dữ liệu (hoặc không cho bấm Import) | Chỉ có header → kiểm nút Import bị vô hiệu | Pass → dự kiến Pass |
| 12 | FR16-EP-16 | EP | Positive | "CSV-EP16 Tai nghe ""Pro"""",500000,… | Thêm 1 SP tên CSV-EP16 Tai nghe "Pro" | Nháy kép escape `""` → kiểm tên SP chứa dấu nháy | Fail → dự kiến Fail (bug đã biết) |
| 13 | FR16-EP-17 | EP | Positive | File UTF-8 có BOM (Excel hay tạo) | Nhận header đúng, thêm 1 SP | File có BOM UTF-8 → kiểm import được | Pass → dự kiến Pass |
| 14 | FR16-EP-18 | EP | Negative | category_id = 99 (không tồn tại) | Từ chối (giả định A6: danh mục phải tồn tại như FR-15) | category_id không tồn tại → kiểm bị từ chối | Fail → dự kiến Fail (bug đã biết) |
| 15 | FR16-EP-20 | EP | Positive | File xuống dòng CRLF (Windows) | Thêm 2 SP, tên không dính ký tự \r | File CRLF → kiểm 2 SP, tên không dính `\r` | Pass → dự kiến Pass |
| 16 | FR16-EP-21 | EP | Positive (bảo mật) | name = <b>CSV-EP21 Bold</b> | Tên hiện nguyên văn dạng chữ, không render HTML | Tên chứa HTML → mở trang chủ Web, kiểm hiện nguyên văn | Pass → dự kiến Pass |
| 17 | FR16-BVA-01 | BVA | Biên (price −0,01) | price = -0.01 | Từ chối; không thêm SP | Kiểm bị từ chối | Fail → dự kiến Fail (bug đã biết) |
| 18 | FR16-BVA-02 | BVA | Biên (price = 0) | price = 0 | Từ chối; không thêm SP | Kiểm bị từ chối | Fail → dự kiến Fail (bug đã biết) |
| 19 | FR16-BVA-03 | BVA | Biên (price 0,01) | price = 0.01 | Thêm 1 SP | Kiểm thêm 1 SP | Pass → dự kiến Pass |
| 20 | FR16-BVA-04 | BVA | Biên (tên 0 ký tự) | name = "" | Từ chối; báo thiếu tên | Kiểm bị từ chối, báo thiếu tên | Pass → dự kiến Pass |
| 21 | FR16-BVA-05 | BVA | Biên (tên 1 ký tự) | name = "A" | Thêm 1 SP tên "A" | Kiểm thêm 1 SP | Pass → dự kiến Pass |
| 22 | FR16-BVA-08 | BVA | Biên (tên 255) | name 255 ký tự | Thêm 1 SP | Kiểm thêm 1 SP | Pass → dự kiến Pass |
| 23 | FR16-BVA-09 | BVA | Biên (tên 256) | name 256 ký tự | Từ chối (giả định A5: áp dụng giới hạn 255 của FR-15) | Kiểm bị từ chối (giả định A5) | Fail → dự kiến Fail (bug đã biết) |
| 24 | FR16-BVA-13 | BVA | Biên (lỗi dòng đầu) | 3 dòng, dòng 1 name rỗng | Rollback: 0 SP | Kiểm rollback | Fail → dự kiến Fail (bug đã biết) |
| 25 | FR16-BVA-14 | BVA | Biên (lỗi dòng cuối) | 3 dòng, dòng 3 price = 0 | Rollback: 0 SP | Kiểm rollback | Fail → dự kiến Fail (bug đã biết) |
| 26 | FR16-BVA-15 | BVA | Biên (4 cột) | Header 4 cột (thiếu category_id) | Từ chối, báo header sai | Kiểm báo lỗi header | Fail → dự kiến Fail (bug đã biết) |

Cột cuối: kết quả HW02 và kết quả dự kiến khi tự động hóa. TC đã Fail ở HW02 do bug thật thì script vẫn giữ assertion theo đặc tả, nên dự kiến **Fail**; mỗi Fail phải đối chiếu với bug đã báo (#90–#109) ở bước S7.

### S1.2 Test case không tự động hóa trên UI và lý do

| ID (HW02) | Tầng ở HW02 | Lý do |
|---|---|---|
| FR16-EP-12 | API | Gọi API import không có token: không làm được qua UI (UI luôn gửi token admin) |
| FR16-EP-13 | API | Gọi API import bằng token user thường: UI Admin chặn user thường đăng nhập → chỉ kiểm được bằng API |
| FR16-EP-14 | API | Gửi thẳng JSON bỏ qua frontend để kiểm validate phía server → tầng API |
| FR16-BVA-10 | UI | Trùng EP-11 (0 dòng dữ liệu) |
| FR16-EP-15 | UI | Trùng ý EP-07 (dòng thiếu tên, chỉ khác là khoảng trắng); để mở rộng |
| FR16-EP-19 | UI | Đổi thứ tự header: dựa trên giả định A4, ưu tiên thấp hơn EP-04/BVA-15 |
| FR16-EP-22 | UI | Đuôi `.CSV`: ưu tiên thấp (hành vi đã Pass ở HW02) |
| FR16-BVA-06 | UI | Tên 2 ký tự: giá trị trong của lớp, không thêm thông tin so với BVA-05 |
| FR16-BVA-07 | UI | Tên 254 ký tự: giá trị trong của lớp, BVA-08/09 đã phủ biên 255 |
| FR16-BVA-11 | UI | 1 dòng hợp lệ: đã phủ bởi EP-17/EP-21 |
| FR16-BVA-12 | UI | 2 dòng hợp lệ: trùng EP-01 |
| FR16-BVA-16 | UI | 6 cột: cùng lớp lỗi header với BVA-15; để mở rộng |

## S2. File dữ liệu

- [`data/fr16.json`](../data/fr16.json) — 26 phần tử (`id`, `input`, `expected`, `note`).
- [`data/fr16-csv/`](../data/fr16-csv/) — 26 file CSV để import, chép từ `test-data/FR16/` của HW02 (giữ nguyên từng byte: BOM, CRLF, file nhị phân).

| Trường | Ý nghĩa |
|---|---|
| `input.file` | File sẽ import, đường dẫn tính từ `data/` |
| `expected.added` | Số sản phẩm phải được thêm vào DB, đếm bằng `GET /api/products` trước/sau. `0` = từ chối hoặc rollback toàn bộ |
| `expected.reasonPattern` | Regex lý do phải có trong báo cáo import (tên / giá / header / định dạng file) |
| `expected.names`, `price` | Tên (và giá) của sản phẩm phải được lưu đúng nguyên văn |
| `expected.importDisabled` | Nút "Import" phải bị vô hiệu (file không có dòng dữ liệu) |
| `expected.renderedAsTextOnWeb` | Tên chứa HTML phải hiện nguyên văn trên trang chủ Web |
| `note` | Căn cứ đặc tả / giả định, bug HW02 liên quan |

## S3. Page Object

File: [`pages/AdminImportPage.ts`](../pages/AdminImportPage.ts). Helper: [`helpers/backend.ts`](../helpers/backend.ts) (`listProducts` để đếm sản phẩm trước/sau import).

| Phần tử | Selector |
|---|---|
| Đăng nhập Admin | `getByPlaceholder('Email')`, `getByPlaceholder('Password')`, `getByRole('button', { name: 'Login' })` |
| Menu Sản phẩm | `getByRole('listitem').filter({ hasText: /^Sản phẩm$/ })` |
| Khối Import | `div` nhỏ nhất chứa cả `getByRole('heading', { name: /Import sản phẩm từ CSV/ })` và ô chọn file |
| Ô chọn file | `input[type="file"]` trong khối Import (ô không có nhãn hay vai trò truy cập, nên định vị theo thuộc tính) |
| Nút Import | `getByRole('button', { name: /^Import \d+ sản phẩm$/ })` |
| Hộp kết quả | `getByText(/Import hoàn tất\|❌/)` → khối cha |

Lỗi tự phát hiện khi chạy thử Page Object (ghi lại cho phần gap analysis):
1. **Khối Import chọn sai:** bản đầu lấy `div` nhỏ nhất chỉ chứa tiêu đề, nên không tìm thấy ô chọn file. Sửa thành `div` nhỏ nhất chứa **cả** tiêu đề và ô chọn file.
2. **Chờ không ổn định trên WebKit:** bản đầu dùng `isVisible()` ngay sau `goto` để quyết định có cần đăng nhập không. WebKit kiểm tra trước khi React vẽ form, nên bỏ qua bước đăng nhập rồi timeout. Sửa: chờ `emailInput.or(productsMenu)` xuất hiện rồi mới quyết định.

Sau khi sửa, chạy thử Pass trên Chromium, Firefox, WebKit.

## S4. Script do AI sinh (bản đầu)

File: [`tests/fr16-import.spec.ts`](../tests/fr16-import.spec.ts) — commit `[C-FR16][S4]` là **bản gốc AI sinh**, chưa chạy, chưa review.

- **Data-driven:** đọc `data/fr16.json`, 26 test. Mỗi test: reset backend → đếm sản phẩm (API) → Admin chọn file trong `data/fr16-csv/` → Import → đếm lại.
- **Kiểu assertion:**

| Kiểu | Ví dụ trong script | Dùng cho |
|---|---|---|
| Độ dài tập dữ liệu | `expect(added).toHaveLength(expected.added)` | Số sản phẩm thêm vào DB (rollback) |
| Nội dung | `expect(ap.resultBox).toContainText(/giá\|price/i)` | Lý do lỗi trong báo cáo import |
| So tập hợp | `expect(names).toEqual(expect.arrayContaining([...]))` | Tên sản phẩm lưu đúng nguyên văn |
| Trạng thái phần tử | `expect(ap.importButton).toBeDisabled()` | File không có dòng dữ liệu |
| Hiển thị / số lượng | `toBeVisible()`, `toHaveCount(0)` | Tên có HTML hiện dạng chữ trên Web |
