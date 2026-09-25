---
type: concept
title: Sửa tại nguồn sinh, không vá đầu ra
slug: sua-tai-nguon-sinh
date_added: 2026-08-11
confidence: high
tags:
  - code-generation
  - maintainability
  - pipeline
id: concepts/swe/sua-tai-nguon-sinh
created: 2026-08-11
updated: 2026-08-11
key_sources:
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
related_concepts:
  - concepts/swe/ssot
  - concepts/seo/gioi-han-hien-thi-serp-nhat
---

## Definition

Khi một tạo phẩm được sinh tự động (file markdown do worker tạo, migration do ORM sinh, cấu hình do template render), lỗi hàng loạt trong tạo phẩm phải được sửa ở **bộ sinh**, không phải ở từng file đầu ra. Vá đầu ra khắc phục được triệu chứng hôm nay nhưng để nguyên khuyết tật: lần sinh tiếp theo tái tạo lại lỗi, và các bản vá thủ công bị ghi đè mất — công sức biến mất không dấu vết.

## Vì sao dễ vi phạm

Vá đầu ra rẻ và nhìn thấy được ngay: sửa 30 file bằng sed thấy kết quả tức thì, còn sửa bộ sinh đòi hiểu logic của nó và phải sinh lại toàn bộ. Áp lực deadline luôn đẩy về phía rẻ. Chi phí chỉ hiện ra ở lần sinh sau.

## Quy tắc thực hành

- Coi thư mục đầu ra là **chỉ đọc với con người** — cùng tinh thần với `raw/` trong wiki này hay `dist/` trong một dự án web.
- Khi buộc phải vá gấp đầu ra, ghi ngay một issue cho bộ sinh; bản vá là khoản nợ, không phải bản sửa.
- Sau khi sửa bộ sinh, sinh lại toàn bộ và diff — diff phải chỉ chứa đúng thay đổi mong đợi.
- Với tạo phẩm đã xuất bản (bài viết đã index, bản ghi đã gửi), quyết định riêng: chỉ áp cho bản sinh mới, hay hồi tố cả tập cũ.

## Key sources

- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]]

## Related concepts

- [[concepts/swe/ssot]]
- [[concepts/seo/gioi-han-hien-thi-serp-nhat]]

## Notes
