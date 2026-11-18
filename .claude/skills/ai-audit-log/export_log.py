"""Xuất transcript Claude Code (.jsonl) thành prompt log Markdown.

Cách dùng:
  python -I export_log.py <file.jsonl> <file_ra.md> "<tiêu đề>" [--since 2026-11-17T15:27:00Z]

--since: chỉ lấy các prompt có thời điểm >= mốc này (UTC, ISO 8601), kèm phần trả lời sau chúng.
"""
import json
import re
import sys
from datetime import datetime, timedelta, timezone

sys.stdout.reconfigure(encoding="utf-8")
args = sys.argv[1:]
since = None
if "--since" in args:
    i = args.index("--since")
    since = datetime.fromisoformat(args[i + 1].replace("Z", "+00:00"))
    args = args[:i] + args[i + 2:]
src, dst, title = args[0], args[1], args[2]

VN = timezone(timedelta(hours=7))
TAG = re.compile(r"<(ide_opened_file|ide_selection|system-reminder|command-[a-z]+|task-notification)>.*?</\1>", re.S)
# Nội dung người dùng dán vào được bọc trong <pasted_content id="…">…</pasted_content>: giữ nội dung, bỏ thẻ
PASTED = re.compile(r"</?pasted_content[^>]*>")


def text_blocks(content):
    if isinstance(content, str):
        return [content]
    return [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]


def when(ts):
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))


entries = []
started = since is None
for line in open(src, encoding="utf-8"):
    try:
        d = json.loads(line)
    except json.JSONDecodeError:
        continue
    t = d.get("type")
    if t not in ("user", "assistant") or d.get("isMeta"):
        continue
    content = d.get("message", {}).get("content", "")
    # Bỏ bản ghi user chỉ chứa tool_result
    if t == "user" and isinstance(content, list) and all(isinstance(b, dict) and b.get("type") == "tool_result" for b in content):
        continue
    texts = [PASTED.sub("", TAG.sub("", x)).strip() for x in text_blocks(content)]
    texts = [x for x in texts if x and not x.startswith("[Request interrupted") and not x.startswith("[SYSTEM NOTIFICATION")]
    if not texts:
        continue
    ts = d.get("timestamp")
    if not started:
        if t == "user" and ts and when(ts) >= since:
            started = True
        else:
            continue
    entries.append((t, ts, "\n\n".join(texts)))

out = [f"# {title}", "",
       "Nguyên văn phiên làm việc với Claude Code (giờ VN). Chỉ gồm prompt do sinh viên gõ và phần trả lời dạng chữ của Claude; "
       "đã bỏ message hệ thống, ngữ cảnh IDE và nội dung tool.", ""]
n = 0
for role, ts, text in entries:
    if role == "user":
        n += 1
        stamp = when(ts).astimezone(VN).strftime("%H:%M %d/%m/%Y") if ts else ""
        out += [f"## Prompt {n} — {stamp}", "", "```text", text, "```", ""]
    else:
        out += ["**Claude:**", "", text, ""]
open(dst, "w", encoding="utf-8").write("\n".join(out))
print(f"Đã ghi {n} prompt vào {dst}")
