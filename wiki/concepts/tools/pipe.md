---
type: concept
title: Pipe
id: pipe
created: 2026-05-11
updated: 2026-05-11
confidence: high
tags:
  - shell
  - unix
  - pipe
key_sources:
  - sources/lam-chu-dong-lenh-linux-so-tay-phan-loai-cho-nguoi-moi-bat-au
related_concepts: []
---

## Definition

Pipe (|) là cơ chế trong shell cho phép lấy đầu ra (stdout) của lệnh này làm đầu vào (stdin) cho lệnh kế tiếp, tạo thành một chuỗi xử lý dữ liệu.

## Variants

- **Anonymous pipe**: dùng `|` giữa 2 lệnh
- **Named pipe / FIFO**: dùng `mkfifo` tạo pipe có tên

## Key sources

- [[sources/lam-chu-dong-lenh-linux-so-tay-phan-loai-cho-nguoi-moi-bat-au]]

## Related concepts

## Notes

Ví dụ: `cat log.txt | grep "Critical"` — đọc tệp và lọc ngay lập tức các cảnh báo nghiêm trọng.