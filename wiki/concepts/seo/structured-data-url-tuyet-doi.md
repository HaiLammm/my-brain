---
type: concept
title: URL tuyệt đối trong dữ liệu có cấu trúc
slug: structured-data-url-tuyet-doi
date_added: 2026-08-11
confidence: high
tags:
  - structured-data
  - json-ld
  - technical-seo
id: concepts/seo/structured-data-url-tuyet-doi
created: 2026-08-11
updated: 2026-08-11
key_sources:
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
related_concepts:
  - concepts/seo/thumbnail-serp-google
  - concepts/seo/nhan-dang-site-tren-serp
---

## Definition

Trong JSON-LD, mọi trường mang URL — ảnh, logo, `@id` — phải viết dạng tuyệt đối (`https://domain/...`). Google **bỏ qua** đường dẫn tương đối trong dữ liệu có cấu trúc, khác với thẻ `og:image` mà trình duyệt tự ghép với domain hiện tại. Sự khác biệt này là bẫy phổ biến: cùng một biến ảnh dùng được cho OG nhưng vô hiệu trong schema, và triệu chứng duy nhất là bài viết mất thumbnail trên kết quả tìm kiếm mà không có cảnh báo nào.

## Variants

- **Helper tập trung**: một hàm `absoluteUrl()` dùng chung cho mọi generator schema, thay vì ghép chuỗi rải rác ở từng trang.
- **Ghép tại chỗ**: `new URL(path, site).href` ngay trong trang khi chỉ có một điểm phát sinh.

## Trường thường quên

- `Article.image`
- `publisher.logo.url`
- `Organization.logo`
- `LocalBusiness.image`

## Cách kiểm chứng

Grep trường `"image"` trên HTML đã build để chắc giá trị bắt đầu bằng `https://` (xem lệnh cụ thể trong checklist deploy ở trang nguồn), sau đó chạy Google Rich Results Test hoặc Schema Markup Validator trên URL đã deploy.

## Key sources

- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]]
- [[sources/ban-do-seo-setsubi-pro-net]] — mọi JSON-LD phát qua một generator duy nhất, không bao giờ inline trong trang

## Related concepts

- [[concepts/seo/thumbnail-serp-google]]
- [[concepts/seo/nhan-dang-site-tren-serp]]

## Notes
