# AI Audit Report — HW04 Automation Testing on EShop

> Mẫu AI-02 (FIT@HCMUS – AI Policy Templates 2026 v1.0), chuyển sang Markdown.

## 1. Student Information

| Field | Value |
|---|---|
| Student name | Trần Thanh An |
| Student ID | 23120017 |
| Class / Cohort | CSC13003 – Software Testing 2026 |
| Assignment ID | HW04 (HW04-AI) |
| Assignment date | 17/11/2026 – 18/11/2026 |
| AI tool(s) used | Claude Code (VS Code extension / CLI), model Claude Opus 5.5 (`claude-opus-5-5`) |
| AI used? | [x] Yes  [ ] No |

**Khai báo:** *I use AI tools for the following tasks,* liệt kê ở bảng dưới. Nhật ký đầy đủ của từng lần tương tác (tên tool, ngày giờ, prompt nguyên văn, output dạng chữ) nằm trong 2 file phụ lục:
- `ai/prompt_logs/23120017_HW04_prompt_log.md`: phiên làm bài chính (22 prompt).
- `ai/prompt_logs/23120017_HW04_prompt_log_skill_demo.md`: phiên quay video Agent Skill, 5 prompt.

Hai file này có trong file zip nộp Moodle, nhưng **không đẩy lên repo public**, vì đề cấm chép prompt giữa sinh viên.

### Các lần tương tác (phiên chính)

| # | Thời gian | Prompt (tóm tắt — nguyên văn trong log) | AI làm gì |
|---|---|---|---|
| 1 | 22:27 17/11 | Đọc đề HW04, tạo repo cá nhân, xuất prompt log, giải thích yêu cầu, lập kế hoạch | Tóm tắt đề, kế hoạch S0–S11, khung repo, skill xuất log |
| 2 | 23:10 17/11 | Cài Playwright và 3 trình duyệt ở đâu | Giải thích vị trí cài (repo HW04, không phải SUT) |
| 3 | 23:22 17/11 | S1: chọn ≥ 12 TC/feature từ danh mục HW02 | Sinh bảng chọn TC + lý do không tự động hóa |
| 4 | 23:28 17/11 | S2: chuyển TC thành `data/frxx.json` | Sinh 3 file JSON, chép 26 CSV, phát hiện lỗi CRLF |
| 5 | 23:35 17/11 | S3: Page Object (getByRole / Placeholder / Text) | 3 Page Object + helper, chạy thử trên 3 trình duyệt |
| 6 | 23:54 17/11 | S4: sinh spec data-driven, ≥ 3 kiểu assertion | 3 spec, 68 test (commit nguyên bản) |
| 7 | 09:21 18/11 | Chạy bước S5 | Chạy Chromium, review, 6 commit sửa spec, phân loại Fail |
| 8 | 09:36 18/11 | Chuẩn bị S6, hướng dẫn chạy | Config 3 trình duyệt + "Run by", script chạy, hướng dẫn |
| 9 | 10:11 18/11 | Đã chạy S6 (sinh viên tự chạy) | Đọc 9 `results.json`, ghi docs, commit báo cáo |
| 10 | 10:15 18/11 | Làm S7, S8 | Bug report (đối chiếu issue HW02), gap analysis, report chính |
| 11–14 | 10:24–10:38 18/11 | Giải thích việc tự làm; điền link repo; gỡ trailer AI khỏi commit; kiểm tra repo | Hướng dẫn, viết lại message commit, kiểm "Run by" |
| 15 | 10:47 18/11 | S9 Agent Skill, kịch bản 2 video | Skill `playwright-data-driven`, kịch bản video |
| 16–20 | 11:03–11:41 18/11 | Hỏi về lệnh `clean`, ghép video, kịch bản lời đọc, đặt tên video | Giải thích, kịch bản chi tiết |
| 21 | 12:12 18/11 | Push `skill-demo`, viết S11, đề xuất điểm | Tài liệu nộp (file này), PDF, git log |
| 22 | 18/11 | Gửi link 2 video; chốt AI Critique, sửa Audit; kiểm tài liệu; xuất prompt log; push | Điền link video, AI-03 Category 4, AI-04, kiểm tra placeholder, push |

### Phiên demo Agent Skill (FR-05, nhánh `skill-demo`)

| # | Thời gian | Prompt | AI làm gì |
|---|---|---|---|
| 1 | 11:51 18/11 | `/playwright-data-driven` FR-05 + đặc tả | S1: đề xuất 17 TC |
| 2 | 11:53 18/11 | Duyệt S1, bổ sung ca HTML và ca một thẻ `<h1>` | S2: `data/fr05.json` |
| 3–5 | 11:55–11:59 18/11 | "Đồng ý" từng bước | S3 Page Object, S4 spec, S5 chạy + sửa 1 lỗi expected |

## 2. Instructions (read before filling)

- Mỗi dòng ở mục 3 ứng với **một artifact** do AI tạo.
- Prompt và output nguyên văn nằm trong prompt log. Output là file hoặc commit trong repo `Gaaus56/software-testing-2026-HW04`.
- Verdict gồm 3 mức: VALID / INVALID / INCOMPLETE.
- Cột Reasoning dẫn: ISTQB FL v4.0 §6.2 (công cụ hỗ trợ / test automation), §4.2 (EP / BVA), §1.4 (test oracle), §5.5 (defect report), hoặc tài liệu Playwright.

## 3. Audit Table — one row per artifact

| # | (1) Prompt + Tool | (2) AI Output | (3) Verdict | (4) Reasoning | (5) Student Fix |
|---|---|---|---|---|---|
| 1 | Claude Code, 23:22 17/11, Prompt 3 | Bảng chọn 18 / 24 / 26 TC (`docs/*` mục S1) | VALID | Đủ ≥ 12/feature, phủ positive / negative / biên (§4.2); mọi TC HW02 đều được xếp chọn hoặc loại có lý do | Giữ 3 ca chờ 29/30/31 s của FR-02 |
| 2 | Prompt 4 | `data/fr02.json`, `fr09.json`, `fr16.json` + 26 CSV | INCOMPLETE | File CRLF bị Git `autocrlf` đổi thành LF, nên ca EP-20 sẽ sai trên máy khác | Thêm `.gitattributes -text` |
| 3 | Prompt 5 | `pages/AdminImportPage.ts` (bản đầu) | INVALID | Chọn sai khối chứa (không có ô chọn file); `isVisible()` không chờ, nên bỏ qua bước đăng nhập trên WebKit | Sửa selector + chờ `emailInput.or(productsMenu)` |
| 4 | Prompt 5 | `pages/LoginPage.ts`, `CheckoutPage.ts`, `helpers/*` | VALID | Selector ưu tiên vai trò / placeholder; chạy đúng trên 3 trình duyệt | — |
| 5 | Prompt 6 | 3 spec bản gốc (commit `[S4]`) | INCOMPLETE | `mode: 'serial'` bỏ qua 14 test sau ca Fail; assertion cứng dừng ở lỗi đầu tiên; `toHaveCount(0)` Pass giả; thông báo Fail khó chẩn đoán | 6 commit `[S5]` (soft assertion, chờ kết quả trước, bỏ serial) |
| 6 | Prompt 6 | Assertion `toHaveURL(/login$/)` ở ca bị từ chối (FR-02) | INVALID (vô hại) | Luôn đúng, không phân biệt được đúng/sai (§1.4 oracle) | Giữ, ghi nhận ở S8 G3 (đã có assertion khác bảo vệ) |
| 7 | Prompt 7 | Phân loại 32 ca Fail (S5.2) | VALID | Mỗi Fail đối chiếu được với 1 issue HW02; chạy lại nhất quán trên 3 trình duyệt | Đối chiếu ảnh chụp trong báo cáo |
| 8 | Prompt 8 | `playwright.config.ts`, `scripts/run-reports.ps1` | VALID | Báo cáo hiện "Run by: 23120017 — ISO" + metadata | **Sinh viên tự chạy** 9 lần chính thức |
| 9 | Prompt 10 | `docs/Bug_Report.md`, mục S7 / S8, `docs/HW04_Report.md` | VALID | Mapping kiểm tự động (32 TC ↔ 15 issue); gap analysis có nguyên nhân (§5.5) | Sinh viên đăng comment HW04 lên 15 issue |
| 10 | Prompt 15 | Skill `playwright-data-driven` + templates | VALID | Quy tắc lấy từ lỗi thật của HW04; demo FR-05 chạy end-to-end | — |
| 11 | Demo, 11:51–11:59 18/11 | FR-05 trên `skill-demo`: 17 TC, data, Page Object, spec | INCOMPLETE | Bản đầu sai expected ở BVA-01 (tên sản phẩm); skill tự phát hiện ở S5 | Commit `[A-FR05][S5] Fix BVA-01 expected names` sau khi sinh viên duyệt |
| 12 | Prompt 21–22 | AI Critique, form AI-03, AI-04 | VALID | Nội dung bám đúng các lỗi có thật trong S5 / S8; 296 tiếng (đề: 200–300) | Sinh viên đọc lại và chốt nội dung (18/11); chọn AI Category 4; tự ký AI-04 |

## 4. Summary of AI Accuracy

| Metric | Count | Percentage |
|---|---|---|
| Total AI-generated artifacts audited | 12 | 100 % |
| VALID (correct, accepted as-is) | 7 | 58 % |
| INVALID (wrong; rejected / sửa toàn bộ) | 2 | 17 % |
| INCOMPLETE (acceptable after edits) | 3 | 25 % |

Ở mức script: 3 spec / 68 test do AI sinh. Review phát hiện **13 chỗ cần sửa** (2 ở Page Object, 1 ở dữ liệu, 10 ở spec), đã sửa 12. Sau khi sửa, cả 32 ca Fail đều do lỗi thật của SUT.

## 5. Conclusion — When should AI be used (or not)?

AI làm nhanh và đúng các việc có khuôn mẫu: chuyển danh mục TC sang file JSON, dựng Page Object, khung spec data-driven, config nhiều trình duyệt. Tuy vậy AI sai ở những chỗ **chỉ lộ ra khi chạy thật**: chế độ `serial` làm bỏ qua cả chuỗi test, assertion "không tồn tại" Pass trước khi giao diện cập nhật, lệnh chờ không ổn định chỉ lỗi trên WebKit. AI cũng có xu hướng sinh assertion "cho đủ bộ" mà không xét assertion đó có ý nghĩa không. Khuyến nghị: dùng AI theo từng bước, có checklist review rút ra từ lỗi thật (đã đóng gói vào skill), luôn chạy trên cả 3 trình duyệt trước khi tin kết quả. Lần chạy lấy bằng chứng phải do người làm bài tự chạy.
