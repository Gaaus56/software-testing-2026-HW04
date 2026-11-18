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
| 1 | Task 1 – Feature A (FR-02) | 25 | 22 |
| 1 | Task 1 – Feature B (FR-09) | 25 | 22 |
| 1 | Task 1 – Feature C (FR-16) | 25 | 22 |
| 2 | Task 2 — Demo video | 15 | 13 |
| 3 | Agent Skills | 10 | 8 |
| | **Total** | **100** | **87** |

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

- Repo public: https://github.com/Gaaus56/software-testing-2026-HW04 (nhánh `main`: bài nộp; nhánh `skill-demo`: kết quả demo Agent Skill trên FR-05)
- Video demo Task 2 (YouTube unlisted): https://youtu.be/fAnBwRB6nJs
- Video Agent Skill (YouTube unlisted): https://youtu.be/G9-n79TaW6Q

## Tài liệu nộp

| Yêu cầu (đề mục 14) | File |
|---|---|
| Report chính (MD + PDF): automation + review / gap analysis | [`docs/HW04_Report.md`](docs/HW04_Report.md), report từng feature [`docs/A-FR02_Login_Lockout.md`](docs/A-FR02_Login_Lockout.md), [`docs/B-FR09_Coupon.md`](docs/B-FR09_Coupon.md), [`docs/C-FR16_CSV_Import.md`](docs/C-FR16_CSV_Import.md); PDF trong [`pdf/`](pdf/) |
| Repo public (script, data, báo cáo HTML) | `tests/`, `pages/`, `helpers/`, `data/`, `reports/` |
| Báo cáo HTML nhiều trình duyệt | [`reports/`](reports/): 9 thư mục `<FR>-<chromium\|firefox\|webkit>/index.html` |
| Link video demo | Mục Liên kết ở trên |
| AI Critique + AI Audit Report (MD + PDF) | [`ai/AI_Critique.md`](ai/AI_Critique.md), [`ai/AI_Audit_Report.md`](ai/AI_Audit_Report.md), form [`AI-03`](ai/forms/AI-03_Disclosure_Form.md), [`AI-04`](ai/forms/AI-04_Reflective_Statement.md) (AI Category 4); prompt log `ai/prompt_logs/` (chỉ có trong file zip) |
| Git commit log | [`git_log.txt`](git_log.txt) |
| Bug report + ảnh trang GitHub Issues | [`docs/Bug_Report.md`](docs/Bug_Report.md), [`bugs/issue-screenshots/`](bugs/issue-screenshots/) |
| Agent Skill | [`.claude/skills/`](.claude/skills/), mô tả [`docs/Agent_Skill.md`](docs/Agent_Skill.md) |

## Chạy lại bộ test

```powershell
npm install
npx playwright install chromium firefox webkit
# EShop: chạy frontend-web (:5173) rồi frontend-admin (:5174); backend do test tự khởi động lại
npm run test:reports            # 3 feature × 3 trình duyệt → reports/<FR>-<browser>/
```
