---
name: ai-audit-log
description: Xuất log phiên Claude Code (file .jsonl) thành prompt log Markdown (tool, ngày giờ VN, prompt nguyên văn, phần trả lời bằng chữ) để làm phụ lục AI Audit Report của HW04. Dùng cuối mỗi phiên làm bài, hoặc khi được yêu cầu "xuất log", "audit log", "prompt log".
---

# Xuất log AI cho AI Audit Report (HW04)

1. Transcript của phiên nằm ở `~/.claude/projects/<tên-thư-mục-làm-việc>/*.jsonl`. Chọn file của phiên hiện tại.
2. Chạy:
   ```
   python -I .claude/skills/ai-audit-log/export_log.py <file.jsonl> ai/prompt_logs/23120017_HW04_prompt_log.md "Prompt Log — Trần Thanh An (23120017) — HW04" --since 2026-11-17T15:27:00Z
   ```
   - `--since` là mốc bắt đầu HW04 (UTC). Prompt của HW02 trong cùng transcript sẽ bị bỏ qua.
   - Script chỉ giữ prompt do sinh viên gõ và phần trả lời bằng chữ; bỏ message hệ thống, ngữ cảnh IDE, lời gọi tool.
3. Mở file vừa tạo, kiểm tra không có dữ liệu nhạy cảm. Không sửa nội dung prompt.
4. Prompt log **không** được đẩy lên GitHub public (đã có trong `.gitignore`), vì đề cấm chép prompt giữa sinh viên. File vẫn nằm trong thư mục repo để đưa vào file zip nộp Moodle.
