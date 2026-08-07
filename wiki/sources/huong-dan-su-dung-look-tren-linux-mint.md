---
type: source
title: Hướng dẫn sử dụng Look trên Linux Mint
slug: huong-dan-su-dung-look-tren-linux-mint
date_added: 2026-05-15
authors: []
source_type: note
importance: 2
confidence: high
tags:
  - productivity
  - linux
  - tool
raw_paths:
  - raw/sources/system/look.md
provenance: replayable
ingest_status: finalized
id: sources/huong-dan-su-dung-look-tren-linux-mint
created: 2026-05-15
updated: 2026-05-15
year: 2026
verify_status: passed
---

## Summary

Look là một app launcher điều khiển bằng bàn phím chạy trên Linux Mint, cho phép mở ứng dụng, tìm file, xem lịch sử clipboard, tính toán và dịch ngôn ngữ mà không cần chuột. Tài liệu này hướng dẫn đầy đủ từ cách mở/đóng, tìm kiếm cơ bản với prefix, cho đến các command mode nâng cao và cấu hình file. Look ưu tiên local-first: hầu hết tính năng không cần mạng, chỉ trừ dịch (`t"`) và tìm Google (`Ctrl+Enter`).

## Key claims

- Phím tắt chính là `Alt+Space` để mở/ẩn launcher; `Ctrl+/` hoặc `:cmd` để vào command mode.
- Các prefix tìm kiếm (`a"`, `f"`, `d"`, `r"`, `c"`, `t"`) giúp thu hẹp phạm vi tìm kiếm.
- Command mode hỗ trợ `/calc`, `/pomo`, `/kill`, `/shell`, `/sys` — đủ dùng cho công việc hằng ngày.
- Clipboard history (`c"`) cho phép tìm lại nội dung đã copy và reuse chỉ bằng `Enter`.
- Cấu hình qua `~/.look.config`; có thể thêm thư mục scan thêm bằng `file_scan_extra_roots`.

## Evidence

- Bảng prefix đầy đủ với ví dụ cụ thể (a", f", d", r", c", t") được trình bày trong mục 5.
- Mục 12 trình bày 5 workflow gợi ý hằng ngày với bước cụ thể.
- Mục 13 liệt kê troubleshooting thường gặp: hotkey xung đột, file không hiện, copy file vào file manager.

## Related concepts

- [[concepts/tools/app-launcher]]
- [[concepts/tools/clipboard-history]]
- [[concepts/tools/pomodoro-timer]]

## Related sources

## People

## Open questions

- Look có phiên bản nào chạy trên Wayland ổn định chưa? Mục 13 ghi global hotkey có thể phụ thuộc compositor.
- `t"` dùng dịch vụ web nào? Tài liệu không đặc tả provider.

## Notes
