# Bug Report — HW04 Automation Testing (Trần Thanh An, 23120017)

## Tóm tắt

- 9 lần chạy (3 feature × Chromium / Firefox / WebKit) có **32 test case Fail**, giống nhau trên cả 3 trình duyệt (xem `reports/`).
- Mỗi ca Fail đã được phân loại ở bước S5: **không có ca nào Fail do script**. Tất cả là lỗi thật của EShop.
- Toàn bộ lỗi này **đã được báo ở HW02** trên GitHub Issues của nhóm (`angquoc/software-testing-2026-HW02-group`). Vì vậy HW04 **không tạo issue mới**, tránh trùng lặp đúng như quy ước của nhóm (README nhóm, mục 4.1). Thay vào đó, HW04 bổ sung **bằng chứng tái hiện tự động** trên 3 trình duyệt cho 15 issue.
- Số bug mới phát hiện ở HW04: **0**.

## Lỗi được tái hiện bằng automation HW04

Mỗi lỗi: issue gốc (HW02) → test case HW04 đang Fail vì lỗi đó → tái hiện trên mấy trình duyệt → ảnh chụp trang GitHub Issue.

| Issue | Bug | Tiêu đề | Severity | TC HW04 Fail | Tái hiện | Ảnh trang issue |
|---|---|---|---|---|---|---|
| [#90](https://github.com/angquoc/software-testing-2026-HW02-group/issues/90) | BUG-FR02-01 | Sai 2 lần thì lần thứ 3 nhập đúng mật khẩu vẫn bị khóa (ngưỡng khóa lệch 1) | High | FR02-EP-11, FR02-BVA-01 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR02-01.png) |
| [#91](https://github.com/angquoc/software-testing-2026-HW02-group/issues/91) | BUG-FR02-02 | Tài khoản bị khóa khoảng 180 giây thay vì 30 giây | Medium | FR02-BVA-06, FR02-BVA-07 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR02-02.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR02-02-2.png) |
| [#92](https://github.com/angquoc/software-testing-2026-HW02-group/issues/92) | BUG-FR02-03 | Ô Mật khẩu ở trang Đăng nhập là type="text", mật khẩu hiện rõ khi gõ | High | FR02-EP-09 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR02-03.png) |
| [#93](https://github.com/angquoc/software-testing-2026-HW02-group/issues/93) | BUG-FR02-04 | Ô Email ở trang Đăng nhập là type="text", không validate định dạng email (HTML5) | Medium | FR02-EP-04, FR02-EP-09 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR02-04.png) |
| [#94](https://github.com/angquoc/software-testing-2026-HW02-group/issues/94) | BUG-FR02-05 | Khi tài khoản bị khóa, trang Đăng nhập chỉ báo chung "Đăng nhập thất bại" và thông báo nằm dưới nút | Low | FR02-EP-10 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR02-05.png) |
| [#95](https://github.com/angquoc/software-testing-2026-HW02-group/issues/95) | BUG-FR02-06 | Trang Đăng nhập có tiêu đề "Đăng Ký", nhãn "Username", nút "Sign In", thiếu dấu * ở trường bắt buộc | Low | FR02-EP-09 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR02-06.png) |
| [#96](https://github.com/angquoc/software-testing-2026-HW02-group/issues/96) | BUG-FR09-01 | Mã percent (SAVE10) tính sai: tiền giảm âm, thành tiền gấp 10 lần tổng đơn | High | FR09-EP-01, FR09-EP-07, FR09-EP-08, FR09-EP-15, FR09-BVA-03 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR09-01.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR09-01-2.png) |
| [#97](https://github.com/angquoc/software-testing-2026-HW02-group/issues/97) | BUG-FR09-02 | Mã bị từ chối khi tổng đơn đúng bằng ngưỡng tối thiểu (dùng > thay cho >=) | Medium | FR09-BVA-02, FR09-BVA-05, FR09-BVA-08 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR09-02.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR09-02-2.png) |
| [#102](https://github.com/angquoc/software-testing-2026-HW02-group/issues/102) | BUG-FR16-01 | Import CSV không rollback: dòng lỗi bị bỏ qua, các dòng còn lại vẫn được thêm | High | FR16-EP-07, FR16-BVA-13 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR16-01.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR16-01-2.png) |
| [#103](https://github.com/angquoc/software-testing-2026-HW02-group/issues/103) | BUG-FR16-02 | Import CSV chấp nhận giá bằng 0, giá âm và giá không phải số | High | FR16-EP-08, FR16-EP-09, FR16-EP-10, FR16-BVA-01, FR16-BVA-02, FR16-BVA-14 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR16-02.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR16-02-2.png) |
| [#104](https://github.com/angquoc/software-testing-2026-HW02-group/issues/104) | BUG-FR16-03 | Import CSV không hỗ trợ trường có dấu phẩy bọc nháy kép (RFC 4180), dữ liệu bị lệch cột | Medium | FR16-EP-06, FR16-EP-16 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR16-03.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR16-03-2.png) |
| [#105](https://github.com/angquoc/software-testing-2026-HW02-group/issues/105) | BUG-FR16-04 | Import CSV không kiểm tra đuôi/loại file (.txt được import, file nhị phân bị đọc như CSV) | Medium | FR16-EP-02, FR16-EP-03 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR16-04.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR16-04-2.png) |
| [#106](https://github.com/angquoc/software-testing-2026-HW02-group/issues/106) | BUG-FR16-05 | Import CSV không kiểm tra header (sai tên cột, thiếu/thừa cột, không có header vẫn xử lý) | Medium | FR16-EP-04, FR16-EP-05, FR16-BVA-15 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR16-05.png), [ảnh 2](../bugs/issue-screenshots/BUG-FR16-05-2.png) |
| [#108](https://github.com/angquoc/software-testing-2026-HW02-group/issues/108) | BUG-FR16-07 | Import CSV chấp nhận category_id không tồn tại | Medium | FR16-EP-18 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR16-07.png) |
| [#109](https://github.com/angquoc/software-testing-2026-HW02-group/issues/109) | BUG-FR16-08 | Import CSV chấp nhận tên sản phẩm dài 256 ký tự (vượt giới hạn 255) | Low | FR16-BVA-09 | 3/3 trình duyệt | [ảnh 1](../bugs/issue-screenshots/BUG-FR16-08.png) |

Báo cáo HTML (có ảnh chụp lúc Fail của từng TC): [`reports/FR02-chromium`](../reports/FR02-chromium/index.html), [`FR09-chromium`](../reports/FR09-chromium/index.html), [`FR16-chromium`](../reports/FR16-chromium/index.html) (tương tự cho `-firefox`, `-webkit`). Ảnh danh sách issue của sinh viên: [`issue-list-HW02.png`](../bugs/issue-screenshots/issue-list-HW02.png).

## Bug HW02 không tái hiện được bằng automation UI

Các bug sau chỉ tái hiện được ở tầng API (gửi request không qua giao diện), nên nằm ngoài phạm vi automation giao diện Web của HW04 (xem S1.2 của từng feature):

| Issue | Bug | Tiêu đề | Severity | TC HW02 |
|---|---|---|---|---|
| [#98](https://github.com/angquoc/software-testing-2026-HW02-group/issues/98) | BUG-FR09-03 | API áp mã giảm giá không yêu cầu đăng nhập (không token / token sai vẫn áp dụng được) | Critical | FR09-EP-12, EP-13 (chỉ API) |
| [#99](https://github.com/angquoc/software-testing-2026-HW02-group/issues/99) | BUG-FR09-04 | Giới hạn số lần dùng mã bị vượt qua bằng cách đổi user_id trong request | Critical | FR09-EP-16 (chỉ API) |
| [#100](https://github.com/angquoc/software-testing-2026-HW02-group/issues/100) | BUG-FR09-05 | Điều kiện ngưỡng đơn hàng dựa trên total_amount do client gửi, không theo giỏ hàng thật | High | FR09-EP-17 (chỉ API) |
| [#101](https://github.com/angquoc/software-testing-2026-HW02-group/issues/101) | BUG-FR09-06 | Thành tiền bị âm khi mã fixed lớn hơn tổng đơn | Medium | FR09-BVA-16 (chưa tự động hóa, xem S1.2) |
| [#107](https://github.com/angquoc/software-testing-2026-HW02-group/issues/107) | BUG-FR16-06 | Tài khoản user thường gọi được API import sản phẩm (không kiểm tra role admin) | Critical | FR16-EP-13 (chỉ API) |

## Cập nhật trên GitHub Issues

Sinh viên ghi một comment vào từng issue ở bảng đầu, ghi rằng lỗi được tái hiện tự động ở HW04 (TC, 3 trình duyệt, link báo cáo trong repo HW04). Mẫu comment: `docs/W04/HW04_issue_comments.md` (ngoài repo).
