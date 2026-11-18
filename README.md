# HW04 – Automation Testing on EShop — Trần Thanh An (23120017)

Bài cá nhân HW04 (Automation Testing với Playwright) trên EShop (https://github.com/ttbhanh/eshop-sut).
Dùng lại 3 feature Web đã chọn ở HW02 (repo HW02: `software-testing-2026-HW02`).

## Feature

| Pool | FR | Feature | Giao diện |
|---|---|---|---|
| A | FR-02 | Đăng nhập & khóa tài khoản | Web `:5173` |
| B | FR-09 | Mã giảm giá (Coupon) | Web `:5173` |
| C | FR-16 | Import sản phẩm từ CSV | Web Admin `:5174` |

## Self-assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | Task 1 – Feature A (FR-02) | 25 | |
| 1 | Task 1 – Feature B (FR-09) | 25 | |
| 1 | Task 1 – Feature C (FR-16) | 25 | |
| 2 | Task 2 — Demo video | 15 | |
| 3 | Agent Skills | 10 | |
| | **Total** | **100** | |

## Test summary

| Feature | TC tự động hóa | Lượt chạy (TC × 3 trình duyệt) | Pass | Fail | Browser runs | Bug |
|---|---|---|---|---|---|---|
| FR-02 | 18 | 54 | 33 | 21 | 3 | 6 (trùng HW02: #90, #91, #92, #93, #94, #95) |
| FR-09 | 24 | 72 | 48 | 24 | 3 | 2 (trùng HW02: #96, #97) |
| FR-16 | 26 | 78 | 27 | 51 | 3 | 7 (trùng HW02: #102, #103, #104, #105, #106, #108, #109) |
| **Tổng** | **68** | **204** | **108** | **96** | **9** | **15** (0 bug mới) |

- 3 feature, 68 TC tự động hóa (≥ 12 mỗi feature), 9 lần chạy trên Chromium / Firefox / WebKit, mỗi lần một báo cáo HTML trong [`reports/`](reports/) có "Run by: 23120017" + thời điểm ISO.
- Kết quả giống nhau trên cả 3 trình duyệt, 0 flaky. Mọi ca Fail đều do lỗi thật của EShop, trùng 15 bug đã báo ở HW02 (không có bug mới).
- Bảng tổng hợp lần chạy: [`docs/images/S6_run_summary.png`](docs/images/S6_run_summary.png).

## Liên kết

- Repo public: _(điền link GitHub)_
- Video demo (YouTube unlisted): _(chưa có)_
- Video Agent Skill: _(chưa có)_
