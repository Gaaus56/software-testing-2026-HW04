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

## S3. Page Object

File: [`pages/LoginPage.ts`](../pages/LoginPage.ts). Helper dùng chung: [`helpers/backend.ts`](../helpers/backend.ts) (reset backend để xóa bộ đếm đăng nhập sai), [`helpers/data.ts`](../helpers/data.ts) (đọc `data/fr02.json`).

| Phần tử | Selector | Lý do |
|---|---|---|
| Ô email | `getByText(/^(Username\|Email)\s*\*?$/)` → khối cha → `input` | `<label>` không gắn với ô nhập (không có `htmlFor`), ô nhập không có placeholder → không dùng được `getByLabel`/`getByPlaceholder`. Regex chấp nhận cả nhãn "Email" nếu giao diện được sửa |
| Ô mật khẩu | `getByText(/^Mật khẩu\s*\*?$/)` → khối cha → `input` | Như trên. Không dùng `getByRole('textbox')` vì khi sửa đúng thành `type="password"` thì ô không còn vai trò textbox |
| Nút đăng nhập | `getByRole('button', { name: /Sign In\|Đăng nhập/i })` | Nhãn hiện tại "Sign In" (tiếng Anh, bug #95) |
| Thông báo lỗi | `getByText(/thất bại\|không đúng\|khóa\|lỗi/i)` | Không có vai trò `alert` |
| Response đăng nhập | `page.waitForResponse('/api/login')` trong `login()` | Phân biệt 401 (sai) và 403 (khóa) ngay trong test UI |

Không dùng XPath hay class Tailwind. Đã chạy thử trên Chromium, Firefox, WebKit.

## S4. Script do AI sinh (bản đầu)

File: [`tests/fr02-login.spec.ts`](../tests/fr02-login.spec.ts) — commit `[A-FR02][S4]` là **bản gốc AI sinh**, chưa chạy, chưa review. Mọi sửa đổi sau đó nằm trong các commit `[A-FR02][S5]`.

- **Data-driven:** đọc `data/fr02.json`, mỗi phần tử sinh một `test()` (18 test). Dữ liệu (tài khoản, số lần sai, số giây chờ, kết quả mong đợi) chỉ nằm trong file data.
- **Thứ tự chạy:** `test.describe.configure({ mode: 'serial' })`, vì các test dùng chung bộ đếm đăng nhập sai của backend. Mỗi test bắt đầu bằng `resetBackend()`.
- **Kiểu assertion:**

| Kiểu | Ví dụ trong script | Dùng cho |
|---|---|---|
| URL trang | `expect(page).toHaveURL(...)` | Đăng nhập thành công / ở lại trang login |
| Thuộc tính DOM | `expect(lp.emailInput).toHaveAttribute('type', 'email')` | Form theo FR-22 |
| Nội dung / hiển thị | `toBeVisible()`, `toContainText(/khóa/i)`, `toHaveText(...)` | Thông báo lỗi |
| Giá trị response bắt được | `expect(status).toBe(200)`, `toBeGreaterThanOrEqual(400)`, `toEqual(reference.body)` | 401/403, không lộ nguyên nhân |
| Trạng thái client | `expect(token).toBeTruthy()` / `toBeNull()` | Lưu JWT |
| Vị trí phần tử | `expect(err.y).toBeLessThan(btn.y)` | Thông báo nằm trên nút submit |

## S5. Chạy thử, review và sửa script AI

Chạy trên Chromium: `npx playwright test tests/fr02-login.spec.ts --browser=chromium --workers=1`.

### S5.1 Lỗi của script AI và cách sửa

| # | Vấn đề trong bản AI (S4) | Loại | Vì sao AI sai | Sửa | Commit |
|---|---|---|---|---|---|
| R1 | `test.describe.configure({ mode: 'serial' })`: test EP-04 Fail (bug thật) làm **14 test sau bị bỏ qua** | Cấu hình chạy sai | AI chọn "serial" vì các test dùng chung backend, nhưng không lường tới việc trong bộ test **có sẵn ca dự kiến Fail**. Với serial, một Fail sẽ chặn cả chuỗi | Bỏ serial; mỗi test tự reset backend nên độc lập; chạy 1 worker | `[A-FR02][S5] Run data-driven cases independently…` |
| R2 | EP-09 kiểm 4 thuộc tính form bằng `expect` thường → Fail ở thuộc tính đầu (ô email `type="text"`), **3 lỗi còn lại không được báo**. EP-10 tương tự: chưa bao giờ kiểm tới vị trí thông báo | Assertion yếu / thiếu | Prompt yêu cầu "≥ 3 kiểu assertion" chứ không nói về việc báo **đủ** lỗi trong một ca. AI mặc định dùng assertion cứng | Đổi sang `expect.soft` kèm thông báo dễ hiểu cho từng yêu cầu | `[A-FR02][S5] Use soft assertions so every GUI defect is reported` |

Sau khi sửa, EP-09 báo đủ 4 lỗi: email `type="text"`, mật khẩu `type="text"`, 2 nhãn thiếu `*`. EP-10 báo đủ 2 lỗi: thông báo không nói "khóa", và thông báo nằm dưới nút (y = 517 > 425).

Lỗi đã phát hiện và sửa ngay trong Page Object (xem S3): không có lỗi nào riêng cho `LoginPage`.

### S5.2 Kết quả trên Chromium và phân loại Fail

**11 Pass / 7 Fail.** Cả 7 Fail đều do **lỗi thật của SUT**, không có Fail nào do script:

| TC | Thông báo Fail | Bug HW02 |
|---|---|---|
| FR02-EP-04 | Form vẫn gửi `POST /api/login` với email "abc" | #93 |
| FR02-EP-09 | Email và mật khẩu đều `type="text"`; nhãn thiếu `*` | #92, #93, #95 |
| FR02-EP-10 | Thông báo "Đăng nhập thất bại…" (không nói khóa), nằm dưới nút | #94 |
| FR02-EP-11 | 2 sai → đúng → 403 (khóa sớm) | #90 |
| FR02-BVA-01 | 2 lần sai → mật khẩu đúng → 403 | #90 |
| FR02-BVA-06 | Chờ 30 s → vẫn 403 | #91 |
| FR02-BVA-07 | Chờ 31 s → vẫn 403 | #91 |

## S6. Chạy trên 3 trình duyệt

Lệnh (sinh viên tự chạy): `npm run test:reports` → [`scripts/run-reports.ps1`](../scripts/run-reports.ps1). Mỗi lần chạy có một báo cáo HTML Playwright, tiêu đề `EShop HW04 — Run by: 23120017 — <thời điểm ISO>`, metadata `Run by` / `Run at (ISO)`, ảnh chụp ở các test Fail.

| Trình duyệt | Báo cáo HTML | Bắt đầu (ISO, UTC) | Run by | Pass | Fail | Flaky | Skipped | Giây |
|---|---|---|---|---|---|---|---|---|
| chromium | [`reports/FR02-chromium/`](../reports/FR02-chromium/index.html) | 2026-11-18T02:47:31.215Z | 23120017 | 11 | 7 | 0 | 0 | 161 |
| firefox | [`reports/FR02-firefox/`](../reports/FR02-firefox/index.html) | 2026-11-18T02:50:13.420Z | 23120017 | 11 | 7 | 0 | 0 | 206 |
| webkit | [`reports/FR02-webkit/`](../reports/FR02-webkit/index.html) | 2026-11-18T02:53:40.877Z | 23120017 | 11 | 7 | 0 | 0 | 157 |

- **Kết quả giống nhau trên cả 3 trình duyệt:** có. Cùng 7 ca Fail: FR02-BVA-01, FR02-BVA-06, FR02-BVA-07, FR02-EP-04, FR02-EP-09, FR02-EP-10, FR02-EP-11.
- **Không có ca flaky**, không có ca bị bỏ qua. Không có lỗi nào chỉ xuất hiện trên một trình duyệt.
- Mọi ca Fail đều do lỗi thật của SUT đã phân loại ở S5.2, trùng các bug HW02: #90, #91, #92, #93, #94, #95.
- Ảnh bảng tổng hợp của lần chạy: [`docs/images/S6_run_summary.png`](images/S6_run_summary.png).

## S7. Bug

7 TC Fail → 6 issue HW02, Fail trên cả 3 trình duyệt. Không có bug mới, nên **không tạo issue mới** (tránh trùng, theo quy ước nhóm). Bằng chứng tái hiện tự động được ghi vào [`docs/Bug_Report.md`](Bug_Report.md), kèm ảnh trang GitHub Issue trong `bugs/issue-screenshots/`.

| Issue | Bug HW02 | Lỗi | TC HW04 Fail |
|---|---|---|---|
| [#90](https://github.com/angquoc/software-testing-2026-HW02-group/issues/90) | BUG-FR02-01 | Sai 2 lần thì lần 3 đúng vẫn bị khóa | EP-11, BVA-01 |
| [#91](https://github.com/angquoc/software-testing-2026-HW02-group/issues/91) | BUG-FR02-02 | Khóa ~180 s thay vì 30 s | BVA-06, BVA-07 |
| [#92](https://github.com/angquoc/software-testing-2026-HW02-group/issues/92) | BUG-FR02-03 | Ô mật khẩu type="text" | EP-09 |
| [#93](https://github.com/angquoc/software-testing-2026-HW02-group/issues/93) | BUG-FR02-04 | Ô email type="text", không validate | EP-04, EP-09 |
| [#94](https://github.com/angquoc/software-testing-2026-HW02-group/issues/94) | BUG-FR02-05 | Thông báo khi khóa không nói khóa, nằm dưới nút | EP-10 |
| [#95](https://github.com/angquoc/software-testing-2026-HW02-group/issues/95) | BUG-FR02-06 | Tiêu đề/nhãn sai, thiếu * | EP-09 |
