# AI Use Disclosure Form — HW04

> Mẫu AI-03 (FIT@HCMUS – AI Policy Templates 2026 v1.0), chuyển sang Markdown.

## 1. Course & Student Info

| Field | Value |
|---|---|
| Course | CS423 / CSC13003 – Software Testing |
| Assignment ID | HW04 |
| Assignment Title | Automation Testing on EShop |
| AI Use Category (1–5) | Category ___ _(sinh viên chọn theo AI Usage Guideline)_ |
| Date | 18/11/2026 |
| Student name | Trần Thanh An |
| Student ID | 23120017 |

## 2. Disclosure Questions

**1. AI tool(s) used:**
Claude Code (VS Code extension / CLI), model Claude Opus 5.5. Không dùng công cụ AI nào khác.

**2. Stage(s) of the assignment where AI was used:**
[x] brainstorming  [x] outlining  [x] drafting  [x] feedback  [x] revision  [x] coding  [x] data analysis  [ ] visual design  [x] other: chạy thử script trên Chromium, đối chiếu kết quả với issue HW02.

**3. Main prompts or tasks given to the AI** (nguyên văn; toàn bộ ở `ai/prompt_logs/`):
- "sinh tests/frxx-*.spec.ts theo kiểu data-driven (lặp qua file data, mỗi phần tử một test()), dùng ≥ 3 kiểu assertion."
- "Cạy cho tôi bước S5"
- "/playwright-data-driven Tự động hóa feature FR-05 (Pool A) — Xem danh sách & Tìm kiếm sản phẩm …" (phiên demo Agent Skill)

**4. Specific parts of the work AI contributed to:**
- AI sinh: bảng chọn TC (S1), file dữ liệu (S2), Page Object và helper (S3), 3 spec bản gốc (S4).
- AI chạy thử trên Chromium, review và thực hiện 6 commit sửa spec (S5); viết `playwright.config.ts`, script chạy (S6).
- AI soạn: Bug Report, gap analysis (S7, S8), report chính, Agent Skill (S9), kịch bản video, bản nháp AI Audit Report và AI Critique.
- Sinh viên làm: gõ prompt cho từng bước; duyệt kết quả từng bước; **tự chạy 9 lần chính thức** sinh báo cáo HTML "Run by: 23120017"; tạo comment HW04 trên 15 issue; quay và lồng tiếng 2 video; duyệt các bước của skill trong demo FR-05; đọc lại và chỉnh AI Critique; tự chấm điểm.
