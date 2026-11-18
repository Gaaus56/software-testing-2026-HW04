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

## Video demo skill

Dùng skill end-to-end trên feature **FR-05 Tìm kiếm sản phẩm** (không thuộc 3 feature đã nộp; làm trên nhánh `skill-demo`).
Link YouTube: _(sinh viên bổ sung)_
