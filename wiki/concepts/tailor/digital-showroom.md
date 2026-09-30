---
type: concept
title: Digital Showroom
confidence: high
tags:
  - tailor-project
  - ecommerce
  - product-catalog
id: digital-showroom
created: 2026-05-14
updated: 2026-08-07
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/swe/tanstack-query
  - concepts/tailor/design-system
  - concepts/swe/multi-tenant-rls
---

## Definition

Showroom Ảo là mặt tiền catalog dành cho khách, giải một mâu thuẫn quen thuộc của trang thương mại điện tử: trang phải để công cụ tìm kiếm đọc được, nhưng lọc sản phẩm phải phản hồi tức thì. Lời giải là tách hai đường — lần tải đầu dựng sẵn ở server để có nội dung cho SEO và hiển thị nhanh, các lần đổi bộ lọc sau đó chỉ lấy dữ liệu ở client và không tải lại trang.

## Variants

- **Lưới danh sách** — thẻ sản phẩm gồm ảnh, tên, mô tả ngắn, kích cỡ, giá thuê và tình trạng còn hàng cập nhật theo thời gian thực. Tình trạng phải là dữ liệu sống, vì cùng một chiếc áo có thể đang được người khác thuê.
- **Trang chi tiết** — bộ ảnh độ phân giải cao có phóng to, bảng size dạng gấp mở, và công tắc chuyển giữa mua và thuê ngay trên trang.
- **Lọc đa chiều** — năm chiều: dịp, chất liệu, màu, kích cỡ, loại áo. Danh sách màu lấy động từ dữ liệu thật thay vì cố định trong mã, nên bộ lọc không bao giờ chào một màu đã hết hàng. Cơ chế chip xem [[concepts/tailor/design-system]].
- **Ngân sách hiệu năng** — dưới 500ms cho mỗi lần đổi bộ lọc; vượt ngưỡng này thì trải nghiệm lọc mất cảm giác tức thì và người dùng quay lại thói quen tải trang.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/tanstack-query]]
- [[concepts/tailor/design-system]]
- [[concepts/swe/multi-tenant-rls]]

## Mentioned in

## Notes

Đã lược các mã story của bản cũ và gộp phần chip lọc vào [[concepts/tailor/design-system]]. Phần giữ lại là lý do tách hai đường tải và các ngân sách hiệu năng — chúng vẫn đúng khi thay framework.
