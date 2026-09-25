---
type: concept
title: aggregateRating từ review tự đăng
slug: aggregate-rating-tu-dang
date_added: 2026-09-25
confidence: unverified
tags:
  - seo
  - structured-data
  - guideline
id: concepts/seo/aggregate-rating-tu-dang
created: 2026-09-25
updated: 2026-09-25
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
related_concepts:
  - concepts/seo/thieu-tin-hieu-con-hon-tin-hieu-sai
---

## Definition

Khi một site tự thu thập và tự đăng lời khen của khách rồi dựng `aggregateRating` từ đó, markup trở thành *self-serving review* — đúng mẫu mà chính sách review snippet của Google loại trừ. Chính sách này áp cho `Organization` y như cho `LocalBusiness`, nên gắn vào `Organization` không phải cách lách. Rủi ro tăng thêm khi cùng một payload được phát lại trên nhiều URL (ví dụ trang 1 và trang 2 của mục cảm nhận), khiến cùng một aggregate xuất hiện nhiều nơi.

## Variants

- **Bỏ khỏi markup**: giữ testimonial ở phần hiển thị cho người đọc, nhưng không phát `aggregateRating`/`Review` dạng JSON-LD.
- **Chuyển nguồn đánh giá ra nền tảng thứ ba**: thu review trên Google Business Profile, nơi đánh giá không do site tự đăng.

## Key sources

- [[sources/ban-do-seo-setsubi-pro-net]] — ca thực tế: `ratingValue` 5.0 dựng từ 17 testimonial tự đăng, phát trên 3 URL, mâu thuẫn với chính luật nội bộ của dự án

## Related concepts

- [[concepts/seo/thieu-tin-hieu-con-hon-tin-hieu-sai]]

## Mentioned in

## Notes
