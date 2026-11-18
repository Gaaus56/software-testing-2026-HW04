# A — FR-05 Xem danh sách & Tìm kiếm sản phẩm (Web `:5173`)

Tự động hóa bằng Playwright, data-driven. Trạng thái: **S1 đã duyệt; S2 xong** (`data/fr05.json`, 17 TC).

## Nguồn và oracle

- Đặc tả: `eshop-sut/README.md`, mục FR-05 (phiên bản 2.0). Mọi `expected` lấy từ đặc tả, không lấy từ hành vi hiện tại của app.
- Dữ liệu seed (backend, 5 sản phẩm): `iPhone 15 Pro Max`, `Samsung Galaxy S24 Ultra`, `MacBook Pro M3`, `Tai nghe AirPods Pro 2`, `Bàn phím cơ Keychron Q1`.
- Đã đọc mã nguồn `frontend-web/src/pages/Home.jsx` và `backend/server.js` để đề xuất TC. Chưa chạy trên trình duyệt; dự kiến Fail ở S5 chỉ là suy đoán từ mã nguồn, phải xác nhận bằng lần chạy thật.

## S1 — Danh mục test case

### 1. Danh mục đề xuất (từ đặc tả)

| ID | Loại | Mô tả | Expected (theo đặc tả) | Ghi chú |
|---|---|---|---|---|
| FR05-EP-01 | EP+ | Trang chủ hiển thị lưới tất cả sản phẩm | Số thẻ sản phẩm = 5 | |
| FR05-EP-02 | EP+ | Mỗi thẻ có ảnh | Mỗi thẻ có `img` với `src` khác rỗng | |
| FR05-EP-03 | EP+ | Ảnh có alt text mô tả | `alt` không rỗng, khớp tên sản phẩm | Dự kiến Fail: `alt=""` |
| FR05-EP-04 | EP+ | Mỗi thẻ hiển thị tên sản phẩm | Tên trên thẻ khớp tên trong API | |
| FR05-EP-05 | EP+ | Giá dùng đơn vị ₫ và phân cách nghìn | Ví dụ `30.000.000 ₫` | Dự kiến Fail: đang hiển thị `VND` |
| FR05-EP-06 | EP+ | Giá khớp giá trong API | Số trên thẻ = `price` từ API | |
| FR05-EP-07 | — | "Tỷ lệ ảnh chuẩn" | Không xác định được | Loại, xem bảng 2 |
| FR05-EP-08 | EP+ | Tìm từ khóa có kết quả (`Pro`) | 3 thẻ: iPhone 15 Pro Max, MacBook Pro M3, AirPods Pro 2 | Chỉ hiển thị SP chứa từ khóa |
| FR05-EP-09 | EP− | Tìm từ khóa không khớp (`xyzkhongco`) | Không có thẻ nào, có thông báo empty state | Dự kiến Fail: không có thông báo |
| FR05-EP-10 | EP | Từ khóa rỗng → hiển thị lại toàn bộ | 5 thẻ | |
| FR05-EP-11 | EP+ | Tìm không phân biệt hoa/thường (`IPHONE`) | 1 thẻ: iPhone 15 Pro Max | Đặc tả không nói rõ; oracle là "tìm theo tên", cần xác nhận |
| FR05-EP-12 | EP− | Từ khóa là HTML (`<b>iPhone</b>`) được hiển thị nguyên văn | Thẻ `<b>` không được render; text hiển thị đúng chuỗi gốc | Dự kiến Fail: `dangerouslySetInnerHTML` |
| FR05-EP-13 | EP− | Từ khóa có dấu nháy đơn (`'`) | Không hiển thị thông báo lỗi DB thô | Oracle **cần xác nhận**: đặc tả không ghi rõ; suy ra từ "hiển thị an toàn". Dự kiến Fail: backend trả `Database Error` |
| FR05-EP-14 | EP+ | Khi đang tải, có trạng thái loading | Có phần tử loading khi API bị trì hoãn (route delay) | Đặc tả không quy định text/selector; dự kiến Fail: không có loading |
| FR05-EP-15 | EP+ | Trang chủ có đúng một `<h1>` (khi có kết quả) | `h1` count = 1 | Dự kiến Fail: có thêm `h1` "Hiển thị n sản phẩm" |
| FR05-EP-16 | EP+ | Trang chủ có đúng một `<h1>` (khi không có kết quả) | `h1` count = 1 | Dự kiến Pass |
| FR05-BVA-01 | BVA | Từ khóa 1 ký tự (`a`) | Chỉ hiển thị SP có chứa `a` (so với kết quả API) | Biên dưới độ dài từ khóa |
| FR05-BVA-02 | BVA | Từ khóa 255 ký tự | Không có kết quả, có empty state, không lỗi | Đặc tả không có giới hạn độ dài; 255 là biên thử nghiệm, không phải biên đặc tả |

Tổng đề xuất: 18 TC (EP 16, BVA 2). Loại FR05-EP-07 khỏi tự động hóa → còn 17.

### 2. Chọn tự động hóa (S1 chính thức)

**Chọn 17 TC**, đạt yêu cầu ≥ 12: FR05-EP-01 đến EP-06, EP-08 đến EP-16, BVA-01, BVA-02.

Phủ: positive 11 (EP-01, 02, 04, 06, 08, 10, 11, 14, 15, 16, BVA-01), negative 5 (EP-03, 05, 09, 12, 13), biên 1 (BVA-02).

Dự kiến Fail khi chạy (theo mã nguồn, chưa xác nhận): EP-03, EP-05, EP-09, EP-12, EP-13, EP-14, EP-15. Đây là lỗi thật nếu xác nhận, không phải lỗi script.

**Không tự động hóa:**

| TC | Lý do |
|---|---|
| FR05-EP-07 (tỷ lệ ảnh chuẩn) | Đặc tả không định nghĩa "chuẩn" (1:1, 4:3, 16:9?) nên không có oracle. Cần người dùng cho biết tỷ lệ mong muốn |
| Trang tải nhanh, ảnh hiển thị đẹp | Cảm quan / hiệu năng, không có oracle máy kiểm |
| Bố cục lưới đổi số cột theo màn hình | Nằm ngoài các tiêu chí của FR-05; có thể làm sau nếu cần |
| Từ khóa có khoảng trắng đầu/cuối | Đặc tả không nói có cắt khoảng trắng không → không có oracle |

## Việc cần người dùng xác nhận trước khi sang S2

1. **Pool A và FR-05**: repo này (HW04) đang ghi Pool A là FR-02. Tôi đang đặt tài liệu này ở `docs/A-FR05_Product_List_Search.md` theo yêu cầu. Có đúng là đặt ở repo này không, hay tách repo khác?
2. **FR05-EP-13** (SQL/nháy đơn): có đưa vào tự động hóa với oracle "không hiển thị lỗi DB thô" không?
3. **FR05-EP-14** (loading): chấp nhận oracle "có phần tử loading khi API bị trì hoãn", không khóa vào text cụ thể?
4. **FR05-EP-11** (không phân biệt hoa/thường): đưa vào hay bỏ?
5. Duyệt danh sách 17 TC ở mục 2.

Sau khi duyệt, tôi sẽ làm S2 (`data/fr05.json`) và commit `[A-FR05][S1] ...`.

## S5 — Chạy, review, phân loại (Chromium)

Lệnh: `npx playwright test tests/fr05-product-search.spec.ts --project=chromium`. Lần chạy đầu: 9 Fail, 8 Pass. Sau khi sửa dữ liệu: **8 Fail, 9 Pass**.

| TC | Kết quả | Phân loại | Ghi chú |
|---|---|---|---|
| FR05-EP-03 | Fail | Lỗi thật của SUT | `alt=""` ở cả 5 ảnh |
| FR05-EP-05 | Fail | Lỗi thật của SUT | Hiển thị `30,000,000 VND`, không dùng ₫ |
| FR05-EP-09 | Fail | Lỗi thật của SUT | Không có thông báo empty state |
| FR05-EP-12 | Fail | Lỗi thật của SUT | `<b>iPhone</b>` bị render thành thẻ `<b>`; hiển thị `iPhone` |
| FR05-EP-13 | Fail | Lỗi thật của SUT (oracle cần xác nhận) | Backend trả `Database Error` (SQLITE_ERROR) và UI hiển thị |
| FR05-EP-14 | Fail | Lỗi thật của SUT | Không có phần tử loading khi API bị trì hoãn |
| FR05-EP-15 | Fail | Lỗi thật của SUT | 2 thẻ h1 khi có kết quả |
| FR05-BVA-02 | Fail | Lỗi thật của SUT | Không có empty state khi từ khóa 255 ký tự không có kết quả |
| FR05-BVA-01 | Fail → Pass | **Lỗi dữ liệu (script/data)** | Dữ liệu kỳ vọng sai: "Bàn phím cơ Keychron Q1" không chứa `a` ASCII (chỉ có `à`). Đã sửa `data/fr05.json` còn 4 tên |

Các TC Pass: EP-01, 02, 04, 06, 08, 10, 11, 16 và BVA-01 (sau sửa dữ liệu).

**Kiểm review (checklist skill):**
1. Không dùng `serial`; mỗi test tự reset backend. OK.
2. Nhiều kiểm tra độc lập dùng `expect.soft`. OK.
3. Assertion "không tồn tại" đặt sau bước chờ kết quả (`settled`). OK.
4. Mỗi assertion có thông báo nêu rõ lỗi nghiệp vụ. OK.
5. Loại assertion: `toHaveCount` cho đếm h1, `toBeVisible` cho empty state và loading. OK.
6. Không có `waitForTimeout`; độ trễ chỉ nằm trong `page.route` của ca loading (là dữ liệu test). OK.

**Lỗi script đã sửa trong S5:** 1 (BVA-01 dữ liệu kỳ vọng). Không có Fail nào do script khác.

**Việc còn lại cho người dùng:** lần chạy chính thức trên 3 trình duyệt và báo cáo "Run by" (S6) do bạn tự chạy bằng `scripts/run-reports.ps1`. Oracle cần xác nhận: FR05-EP-11, EP-13, EP-14.
