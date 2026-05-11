---
type: concept
title: "VIM Macro"
slug: vim-macro
id: concepts/vim-macro
date_added: 2026-05-11
created: 2026-05-11
updated: 2026-05-11
confidence: high
tags:
  - vim
  - automation
  - macro
key_sources:
  - sources/lam-chu-dong-lenh-linux-so-tay-phan-loai-cho-nguoi-moi-bat-au
related_concepts:
  - concepts/vim
---

## Definition

VIM Macro là tính năng tự động hóa trong VIM cho phép ghi một chuỗi hành động và lặp lại tự động bằng phím `@` kèm tên register.

## Variants

- **q + letter**: bắt đầu ghi macro vào register chỉ định
- **@ + letter**: phát lại macro từ register

## Key sources

- [[sources/lam-chu-dong-lenh-linux-so-tay-phan-loai-cho-nguoi-moi-bat-au]]

## Related concepts

- [[concepts/vim]]

## Notes

Cách sử dụng: 1) Nhấn `q` kèm chữ cái để bắt đầu ghi, 2) Thực hiện chuỗi hành động, 3) Nhấn `q` lần nữa để dừng, 4) Dùng `@` kèm chữ cái để lặp lại.