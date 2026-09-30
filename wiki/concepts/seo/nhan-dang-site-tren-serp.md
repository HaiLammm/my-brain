---
type: concept
title: Nhận dạng site trên SERP (tên site, favicon)
confidence: high
tags:
  - technical-seo
  - branding
  - json-ld
id: nhan-dang-site-tren-serp
created: 2026-08-11
updated: 2026-10-01
key_sources:
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
  - sources/google-title-link
related_concepts:
  - concepts/seo/structured-data-url-tuyet-doi
  - concepts/seo/gioi-han-hien-thi-serp-nhat
---

## Definition

Để Google hiện **tên thương hiệu** thay cho domain trần và gắn **favicon logo** cho mọi kết quả, site cần phát cặp node `Organization` + `WebSite` trên **mọi** trang, không chỉ trang chủ. Đây là thuộc tính cấp domain: đổi một lần thì áp cho cả bài viết lẫn trang dịch vụ, nhưng đổi lại cũng cần thời gian Google xác nhận, không có nút bật tức thì.

## Quy tắc thực hành

- Phát `Organization` + `WebSite` ở layout gốc để không trang nào bị sót.
- `Organization` mang một `@id` cố định duy nhất (ví dụ `https://domain/#organization`). Bất kỳ node `Organization` nào khác nói về **cùng công ty** — như node bọc `AggregateRating` ở trang đánh giá — phải dùng lại đúng `@id` đó, nếu không Google thấy hai thực thể trùng tên trên cùng một trang.
- Khai báo favicon đủ bốn mức: `favicon.ico` (48+32), `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (180).
- `Article` cần `inLanguage` và `isPartOf` để nối bài viết về đúng site.
- Mỗi bài cần `BreadcrumbList` — thường do component breadcrumb tự phát, nên đừng gỡ component khỏi trang bài.
- Thống nhất một separator tiêu đề trên toàn site; với site tiếng Nhật là `｜` (全角) chứ không phải `|`.

## Tên site trong tiêu đề (01/10/2026)

Tài liệu title link của Google [[sources/google-title-link]] nối trang này với tiêu đề của kết quả tìm kiếm:

- Structured data `WebSite` là một trong chín nguồn Google dùng để sinh title link.
- Google khuyên chỉ đặt tên site ở đầu hoặc cuối `<title>`, ngăn bằng một dấu như gạch ngang, hai chấm hoặc gạch đứng — khớp với quy tắc thống nhất một separator ở trên. Các dấu này là ví dụ, Google không bắt buộc riêng dấu nào.
- Với tên site cấp domain, Google có thể bỏ tên site khỏi title link nếu nó lặp với tên site đã hiện trên kết quả tìm kiếm. Suy luận của wiki: nếu site đã được hiện tên site cấp domain và hậu tố thương hiệu trùng với tên đó, hậu tố trong tiêu đề có thể không hiện nữa — xem [[concepts/seo/gioi-han-hien-thi-serp-nhat]].

## Key sources

- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]]
- [[sources/google-title-link]] — tên site trong `<title>`, structured data `WebSite` là nguồn sinh title link

## Related concepts

- [[concepts/seo/structured-data-url-tuyet-doi]]
- [[concepts/seo/gioi-han-hien-thi-serp-nhat]]

## Notes
