---
type: concept
title: Sitemap — công cụ tuỳ chọn, không phải điều kiện bắt buộc
confidence: high
tags:
  - seo
  - technical-seo
  - crawling
id: sitemap
created: 2026-09-29
updated: 2026-09-29
key_sources:
  - sources/google-seo-starter-guide
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
  - sources/ban-do-seo-setsubi-pro-net
related_concepts:
  - concepts/seo/google-thu-thap-va-lap-chi-muc
  - concepts/seo/technical-seo-khong-du-de-len-hang
---

## Definition

Sitemap là tệp liệt kê các URL trên site mà bạn muốn Google biết. Google nói rõ nó **không bắt buộc**: crawler vẫn tìm được trang qua liên kết, nên việc cần làm trước là để người khác biết tới site, chứ không phải sinh sitemap. Nhiều hệ quản trị nội dung tự sinh sitemap giúp bạn. Vì vậy sitemap thuộc nhóm "làm cho sạch và rõ ràng", không thuộc nhóm "đòn bẩy tăng thứ hạng" — cùng chỗ đứng với phần còn lại của tầng kỹ thuật, xem [[concepts/seo/technical-seo-khong-du-de-len-hang]].

## Variants

- **Khi nào sitemap thật sự có ích**: site lớn, nhiều URL khó khám phá qua liên kết, hoặc trang mới chưa có liên kết trỏ tới.
- **Sitemap tự sinh theo framework**: với site tĩnh dựng bằng framework, sitemap thường do cấu hình build sinh ra — kiểm tra nó có phản ánh đúng tập URL đang tồn tại.
- **`lastmod` phải là ngày thật**: ngày cập nhật trong bài điều khiển trực tiếp `lastmod` của sitemap, nên ngày giả là tín hiệu sai gửi cho Google (quy ước nội bộ đã ghi ở [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]]).
- **Sitemap không thay được chất lượng**: sitemap càng đầy đủ cũng không làm một trang kém giá trị được xếp hạng.
- **Số đo trên setsubi-pro.net**: sitemap có 126 `<loc>` nhưng chỉ 73 `<lastmod>` — chênh lệch này là một điểm cần hiểu trước khi tin vào tín hiệu ngày cập nhật ([[sources/ban-do-seo-setsubi-pro-net]]).

## Key sources

- [[sources/google-seo-starter-guide]] — §Help Google find your content
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — luật về `updatedDate` điều khiển `lastmod`
- [[sources/ban-do-seo-setsubi-pro-net]] — số đo sitemap thực tế trên build 25/09/2026

## Related concepts

- [[concepts/seo/google-thu-thap-va-lap-chi-muc]]
- [[concepts/seo/technical-seo-khong-du-de-len-hang]]

## Topics

- [[topics/seo]]

## Mentioned in

## Notes
