# A-FR02 — Đăng nhập & khóa tài khoản (Web) — Automation (HW04)

> Trần Thanh An — 23120017 — HW04 Automation Testing
> Giao diện được tự động hóa: Web `localhost:5173/login`

## S1. Chọn test case để tự động hóa

**Nguồn:** danh mục test case HW02 `software-testing-2026-HW02/testcases/FR02.json` (23 TC) và kết quả thực thi HW02 `scripts/results/FR02.json`.

**Tiêu chí chọn:**
1. Chạy được **qua giao diện Web**: hành động và assertion chính thực hiện trên trình duyệt. Bước chuẩn bị dữ liệu (reset backend, tạo sản phẩm/coupon) được phép gọi API.
2. Phủ đủ **positive / negative / biên** (BVA).
3. Thời gian chạy chấp nhận được khi nhân 3 trình duyệt.
4. Loại TC chỉ kiểm được ở tầng API, TC trùng mục đích, và ca khám phá không có kết quả mong đợi.

**Kết quả:** chọn **18 TC** (Positive 3, Negative 9, Biên 6); không tự động hóa 5 TC.

### S1.1 Test case được chọn

| # | ID (HW02) | Kỹ thuật | Loại | Dữ liệu | Kết quả mong đợi (theo đặc tả) | Cách tự động hóa trên UI | HW02 → HW04 |
|---|---|---|---|---|---|---|---|
| 1 | FR02-EP-01 | EP | Positive | test@eshop.com / Test1234! | Đăng nhập thành công, chuyển về trang chủ; JWT được lưu phía client | Điền form đăng nhập → kiểm URL về trang chủ + token trong localStorage | Pass → dự kiến Pass |
| 2 | FR02-EP-02 | EP | Negative | test@eshop.com / Wrong123! | Từ chối (4xx), thông báo chung không nêu trường nào sai, không có token | Đăng nhập sai mật khẩu qua form → kiểm thông báo lỗi trên UI + bắt response `POST /api/login` (401) | Pass → dự kiến Pass |
| 3 | FR02-EP-03 | EP | Negative | khongtontai@eshop.com / Test1234! | Từ chối; status và thông báo giống hệt EP-02 (không lộ email có tồn tại hay không) | Email chưa đăng ký qua form → so thông báo UI và body response với EP-02 | Pass → dự kiến Pass |
| 4 | FR02-EP-04 | EP | Negative | Email: abc; Mật khẩu: Test1234! | Trình duyệt chặn submit do ô email type="email" (không gửi POST /api/login) | Nhập `abc` vào ô email → kiểm không có request `/api/login` nào được gửi | Fail → dự kiến Fail (bug đã biết) |
| 5 | FR02-EP-05 | EP | Negative | Để trống cả hai ô | Không gửi request; hiển thị yêu cầu nhập trường bắt buộc | Bấm đăng nhập khi để trống → kiểm không gửi request + `validationMessage` | Pass → dự kiến Pass |
| 6 | FR02-EP-06 | EP | Negative | test@eshop.com / test1234! (sai hoa/thường) | Từ chối (mật khẩu phân biệt hoa/thường) | Mật khẩu sai hoa/thường qua form → kiểm bị từ chối (401) | Pass → dự kiến Pass |
| 7 | FR02-EP-07 | EP | Negative | 3 lần mật khẩu sai, rồi mật khẩu đúng ngay lập tức | Lần đăng nhập đúng bị từ chối vì tài khoản đang bị khóa | 3 lần sai qua form → mật khẩu đúng → kiểm vẫn bị chặn (403) | Pass → dự kiến Pass |
| 8 | FR02-EP-08 | EP | Positive | — | Request mang header Authorization: Bearer <JWT> | Sau đăng nhập mở trang Profile → bắt request `my-orders`, kiểm header `Authorization: Bearer` | Pass → dự kiến Pass |
| 9 | FR02-EP-09 | EP | Negative (GUI) | — | Ô email type="email", ô mật khẩu type="password", nhãn trường bắt buộc có *, nhãn/tiêu đề tiếng Việt đúng ngữ cảnh đăng nhập | Kiểm thuộc tính DOM: `type` 2 ô nhập, nhãn có `*`, tiêu đề form | Fail → dự kiến Fail (bug đã biết) |
| 10 | FR02-EP-10 | EP | Negative (GUI) | test@eshop.com / Test1234! | UI hiện thông báo phù hợp cho biết tài khoản tạm khóa (tiếng Việt); thông báo lỗi nằm trên nút submit | Đăng nhập lúc đang khóa → kiểm nội dung thông báo và vị trí (trên nút submit) | Fail → dự kiến Fail (bug đã biết) |
| 11 | FR02-EP-11 | EP | Negative | 2 sai → đúng → 2 sai → đúng | Cả 2 lần đăng nhập đúng đều thành công (bộ đếm về 0 sau khi thành công) | 2 sai → đúng → 2 sai → đúng, tất cả qua form → kiểm lần cuối thành công | Fail → dự kiến Fail (bug đã biết) |
| 12 | FR02-EP-12 | EP | Positive | admin@eshop.com / Admin123! | Tài khoản khác đăng nhập bình thường (khóa theo tài khoản) | Khóa `test@` qua form → đăng nhập `admin@` qua form → kiểm thành công | Pass → dự kiến Pass |
| 13 | FR02-BVA-01 | BVA | Biên (n = 2) | n = 2 lần sai | Đăng nhập thành công (chưa khóa) | 2 lần sai qua form → mật khẩu đúng → kiểm đăng nhập thành công | Fail → dự kiến Fail (bug đã biết) |
| 14 | FR02-BVA-02 | BVA | Biên (n = 3) | n = 3 lần sai | Bị từ chối vì khóa | 3 lần sai → đúng → kiểm bị khóa | Pass → dự kiến Pass |
| 15 | FR02-BVA-03 | BVA | Biên (n = 4) | n = 4 lần sai | Bị từ chối vì khóa | 4 lần sai → đúng → kiểm bị khóa | Pass → dự kiến Pass |
| 16 | FR02-BVA-05 | BVA | Biên (t = 29 s) | t = 29 s kể từ lần sai thứ 3 | Vẫn bị khóa | 3 lần sai → chờ 29 s → đúng → kiểm vẫn khóa (`test.slow()`) | Pass → dự kiến Pass |
| 17 | FR02-BVA-06 | BVA | Biên (t = 30 s) | t = 30 s | Đăng nhập thành công (hết 30 giây khóa) | 3 lần sai → chờ 30 s → đúng → kiểm mở khóa (`test.slow()`) | Fail → dự kiến Fail (bug đã biết) |
| 18 | FR02-BVA-07 | BVA | Biên (t = 31 s) | t = 31 s | Đăng nhập thành công | 3 lần sai → chờ 31 s → đúng → kiểm mở khóa (`test.slow()`) | Fail → dự kiến Fail (bug đã biết) |

Cột cuối: kết quả HW02 và kết quả dự kiến khi tự động hóa. TC đã Fail ở HW02 do bug thật thì script vẫn giữ assertion theo đặc tả, nên dự kiến **Fail**; mỗi Fail phải đối chiếu với bug đã báo (#90–#109) ở bước S7.

### S1.2 Test case không tự động hóa trên UI và lý do

| ID (HW02) | Tầng ở HW02 | Lý do |
|---|---|---|
| FR02-BVA-04 | API | Chuỗi status 401/401/403 chỉ quan sát được ở response API; trên UI cả 3 lần đều hiện cùng một thông báo. Ý nghĩa đã được phủ bởi BVA-01…03 |
| FR02-EP-13 | API | Kiểm định dạng email ở **tầng API** (gửi thẳng request). Trên UI, trường hợp này chính là EP-04 |
| FR02-EP-14 | API | Phải chờ hết thời gian khóa thực tế (~180 s, BUG-FR02-02) cho mỗi trình duyệt → chạy quá lâu, dễ flaky |
| FR02-BVA-08a | API | Ca khám phá đo thời gian khóa thực tế (175 s), không có kết quả mong đợi theo đặc tả; quá lâu cho chạy 3 trình duyệt |
| FR02-BVA-08b | API | Như BVA-08a (185 s) |

## S2. File dữ liệu

File: [`data/fr02.json`](../data/fr02.json) — 18 phần tử, mỗi phần tử gồm `id`, `input`, `expected`, `note`. Script chỉ đọc file này; không có dữ liệu test viết cứng trong script.

| Trường | Ý nghĩa |
|---|---|
| `input.preAttempts` | Danh sách lần đăng nhập qua form **trước** lần chính (ví dụ 3 lần mật khẩu sai để khóa tài khoản) |
| `input.waitSeconds` | Số giây chờ sau `preAttempts` (biên thời gian khóa 29 / 30 / 31 s) |
| `input.login` | Email + mật khẩu của lần đăng nhập chính; `null` nếu chỉ kiểm giao diện form (EP-09) |
| `input.afterLogin` | Hành động sau khi đăng nhập (`openProfile` để bắt request có header xác thực) |
| `expected.outcome` | `success` / `rejected` / `locked` |
| `expected.apiStatusClass` | Nhóm status của response `POST /api/login` bắt được trong lúc test UI (`4xx`) |
| `expected.sameResponseAs` | So thông báo với một TC khác (EP-03 phải giống EP-02, không lộ nguyên nhân) |
| `expected.loginRequestSent` | `false` khi trình duyệt phải chặn submit |
| `expected.emailInputType`, `passwordInputType`, `requiredMarkOnLabels` | Thuộc tính form theo FR-22 |
| `expected.uiMessagePattern`, `errorAboveSubmit` | Nội dung và vị trí thông báo khi bị khóa |
| `note` | Căn cứ đặc tả / giả định, và bug HW02 liên quan (nếu có) |
