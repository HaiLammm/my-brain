---
type: concept
title: Thiếu tín hiệu còn hơn tín hiệu sai
slug: thieu-tin-hieu-con-hon-tin-hieu-sai
date_added: 2026-09-25
confidence: unverified
tags:
  - seo
  - eeat
  - structured-data
id: concepts/seo/thieu-tin-hieu-con-hon-tin-hieu-sai
created: 2026-09-25
updated: 2026-09-25
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
related_concepts:
  - concepts/seo/aggregate-rating-tu-dang
  - concepts/seo/doorway-page
---

## Definition

Khi chưa có dữ liệu thật để khai báo một tín hiệu (tác giả, ngày cập nhật, đánh giá, toạ độ, chứng chỉ), bỏ trống tín hiệu đó tốt hơn là điền giá trị bịa. Tín hiệu sai vừa vi phạm guideline của máy tìm kiếm, vừa phá giá trị của những tín hiệu đúng còn lại; tín hiệu thiếu chỉ là chưa được cộng điểm. Đây là quy tắc chi phối mọi quyết định về structured data và E-E-A-T.

## Variants

- **Không bịa `updatedDate`**: chỉ đổi ngày cập nhật khi có sửa nội dung thật, không dập hàng loạt.
- **Không bịa người giám sát**: giữ `Article.author` là `Organization` cho tới khi có người thật đứng tên, vì bịa chứng chỉ là tín hiệu E-E-A-T giả.
- **Không bịa toạ độ**: một chi nhánh chưa có số nhà thì để trống toạ độ thay vì đặt điểm gần đúng.
- **Không bịa bước để phát `HowTo`**: structured data không khớp nội dung hiển thị là vi phạm guideline.

## Key sources

- [[sources/ban-do-seo-setsubi-pro-net]] — nguyên tắc được nêu thẳng ở đầu tài liệu và áp dụng nhất quán qua các quyết định "cố ý không làm"

## Related concepts

- [[concepts/seo/aggregate-rating-tu-dang]]
- [[concepts/seo/doorway-page]]

## Mentioned in

## Notes
