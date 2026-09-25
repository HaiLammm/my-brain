---
id: themes/ostep/luu-tru-ben-vung
title: "Lưu trữ bền vững (Persistence)"
type: theme
created: 2026-08-14
updated: 2026-08-14
book: ostep
---

## Description

Bộ nhớ DRAM là tạm thời — mất điện hoặc crash là mất dữ liệu — nên cần phần cứng (đĩa cứng, SSD) và phần mềm (file system) để lưu dữ liệu bền vững. Khác với CPU và bộ nhớ, OS không ảo hóa đĩa cho riêng từng tiến trình mà cho các tiến trình chia sẻ file với nhau qua system call.

## Evidence

- [[chapters/ostep/gioi-thieu-ve-he-ieu-hanh]] — demo `io.c` với `open`/`write`/`close`; journaling và copy-on-write để chịu lỗi khi ghi; "Crux" về lưu dữ liệu bền vững

## Related themes

- [[themes/ostep/ba-manh-ghep]]

## Notes

