---
type: concept
title: Một URL canonical duy nhất
slug: mot-url-canonical-duy-nhat
date_added: 2026-09-25
confidence: unverified
tags:
  - seo
  - technical-seo
  - canonical
id: concepts/seo/mot-url-canonical-duy-nhat
created: 2026-09-25
updated: 2026-09-25
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
related_concepts:
  - concepts/seo/structured-data-url-tuyet-doi
  - concepts/swe/gac-cong-tu-dong-vs-quy-uoc
---

## Definition

Mỗi trang chỉ nên tồn tại ở đúng một địa chỉ, và mọi biến thể khác phải 301 về đó. Biến thể gồm: có/không `www`, có/không trailing slash, `http`/`https`, và các slug cũ đã đổi tên. Khi một trang có nhiều địa chỉ sống song song, tín hiệu bị chia và máy tìm kiếm có thể bỏ index — đây là nguyên nhân phổ biến nhất của sự cố "trang không được index" dù nội dung không có vấn đề gì.

## Variants

- **Bản đồ 301 giữ lại slug cũ**: mỗi lần đổi slug phải thêm một redirect, kèm bản percent-encoded cho URL không phải ASCII (tiếng Nhật, tiếng Việt).
- **Trailing slash nhất quán cả ở link nội bộ**: canonical đúng nhưng link nội bộ thiếu dấu `/` vẫn tạo ra một vòng redirect cho crawler.
- **Self-referencing canonical cho trang phân trang**: trang 2 canonical về chính trang 2, không về trang 1 — `rel=prev/next` đã bị Google bỏ hỗ trợ từ 2019.
- **noindex thì bỏ canonical**: không nên vừa `noindex` vừa khai canonical, vì hai tín hiệu này xung đột.
- **Chuỗi redirect nhiều hop có khi là cố ý**: 2 hop `http://apex → https://apex → https://www` là điều kiện bắt buộc của HSTS preload, và crawler theo tới 10 hop nên không gây hại.

## Key sources

- [[sources/ban-do-seo-setsubi-pro-net]] — sự cố 70/108 trang không index truy về trailing slash cộng với lỗi sinh link ở pipeline
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — nguồn gốc của luật (R15–R18)

## Related concepts

- [[concepts/seo/structured-data-url-tuyet-doi]]
- [[concepts/swe/gac-cong-tu-dong-vs-quy-uoc]]

## Mentioned in

## Notes
