# Agent Skills — HW04

Skill cho **Claude Code**, đặt trong [`.claude/skills/`](../.claude/skills/). Mở Claude Code ở thư mục gốc repo thì skill được nhận tự động; gọi bằng `/playwright-data-driven`, `/ai-audit-log` hoặc mô tả yêu cầu bằng lời.

| Skill | Làm gì |
|---|---|
| [`playwright-data-driven`](../.claude/skills/playwright-data-driven/SKILL.md) | Tự động hóa một feature Web: chọn ≥ 12 TC → file data JSON → Page Object → spec data-driven → chạy & review theo checklist → 3 trình duyệt + báo cáo HTML "Run by: MSSV". Có quy trình **bảo trì** khi giao diện đổi / test Fail. Dừng cho người dùng duyệt sau mỗi bước |
| [`ai-audit-log`](../.claude/skills/ai-audit-log/SKILL.md) | Xuất transcript Claude Code thành prompt log Markdown (giờ VN, prompt nguyên văn) cho AI Audit Report; `--since` để lọc theo bài |

## Thành phần đi kèm `playwright-data-driven`

| File | Vai trò |
|---|---|
| `templates/playwright.config.ts` | 3 project, 1 worker, HTML reporter có title "Run by", metadata, JSON reporter |
| `templates/run-reports.ps1` | Chạy feature × trình duyệt; tìm spec theo tên `tests/<fr>-*.spec.ts`; `-OutRoot` để chạy thử không đè báo cáo chính thức |
| `templates/feature.spec.ts`, `Page.ts`, `data.example.json` | Khung spec data-driven, Page Object, file data |

## Thiết kế: quy tắc lấy từ lỗi thật của HW04

| Lỗi đã gặp (report feature) | Quy tắc trong skill |
|---|---|
| `mode: 'serial'` làm 14 test bị bỏ qua (S5 R1, cả 3 feature) | S5 checklist 1: không dùng serial cho bộ data-driven |
| Assertion cứng dừng ở lỗi đầu tiên (FR-02 EP-09 chỉ báo 1/4 lỗi) | S5 checklist 2: `expect.soft` cho các yêu cầu độc lập |
| `toHaveCount(0)` ngay sau response có thể Pass giả (FR-09 R2) | S5 checklist 3: chờ kết quả trước khi kiểm "không tồn tại" |
| Thông báo Fail không cho biết lý do (FR-09 R3) | S5 checklist 4 |
| Assertion luôn đúng `toHaveURL(/login$/)` (FR-02 G3) | S5 checklist 5 |
| `isVisible()` ngay sau `goto` → bỏ qua đăng nhập trên WebKit (FR-16 S3) | S3: chờ `a.or(b)`, không rẽ nhánh tức thời; thử Page Object trên 3 trình duyệt |
| Chọn sai khối chứa (FR-16 S3) | S3: lọc theo tất cả phần tử cần có |
| Nhãn không gắn ô nhập (FR-02 S3) | S3: đọc DOM thật trước khi viết selector |
| CSV CRLF bị Git đổi (FR-16 S2) | S2: `.gitattributes -text` cho fixture |
| Báo cáo HTML phải là bằng chứng thật (đề mục 11) | S6: lần chạy chính thức do người dùng tự chạy, AI không tạo / sửa báo cáo |

## Demo skill trên feature mới: FR-05 Tìm kiếm sản phẩm

Làm trên nhánh [`skill-demo`](https://github.com/Gaaus56/software-testing-2026-HW04/tree/skill-demo) (không merge vào `main`, vì FR-05 không thuộc 3 feature nộp bài). 5 prompt, nguyên văn trong `ai/prompt_logs/23120017_HW04_prompt_log_skill_demo.md`.

| Bước | Kết quả trên nhánh `skill-demo` |
|---|---|
| S1 | 17 TC (positive 11, negative 5, biên 1); sinh viên bổ sung ca từ khóa chứa HTML và ca "đúng một `<h1>`" |
| S2 | `data/fr05.json` |
| S3 | `pages/HomePage` |
| S4 | `tests/fr05-product-search.spec.ts` (commit nguyên bản) |
| S5 | Chạy Chromium; skill phát hiện expected sai ở BVA-01 → commit sửa sau khi sinh viên duyệt |
| S6 | Sinh viên tự chạy 3 trình duyệt (báo cáo ghi ra `reports-demo/`, không commit): Chromium 9 Pass / 8 Fail, Firefox 9 / 8, WebKit 10 / 7, 0 flaky; báo cáo có "Run by: 23120017" |

**Khác biệt giữa các trình duyệt (nghi vấn, chưa kiểm chứng):** FR05-EP-13 (từ khóa có ký tự đặc biệt kiểu SQL) Fail trên Chromium và Firefox, vì trang hiện lỗi DB thô "Database Error" cho người dùng; trên WebKit thì Pass. Có thể do mỗi trình duyệt mã hóa ký tự trong URL tìm kiếm khác nhau. Đây đúng là loại phát hiện mà bước "so 3 trình duyệt" của skill (S6) được thiết kế để làm lộ ra.

Video demo skill (YouTube unlisted): https://youtu.be/G9-n79TaW6Q
