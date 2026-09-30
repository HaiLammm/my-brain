---
type: concept
title: Triết lý dữ liệu khép kín (Closed-Data Philosophy)
confidence: high
tags:
  - data-strategy
  - trust
  - content-moderation
id: closed-data-philosophy
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/danangnavi-product-requirements-document
related_concepts:
  - concepts/danangnavi/senpai-trust-flywheel
  - concepts/danangnavi/camera-only-verification
---

## Definition
Triết lý thiết kế trong đó 100% nội dung nền tảng được tạo nội bộ — không nhập dữ liệu từ nguồn bên ngoài. Niềm tin được xây dựng thông qua kiểm duyệt và xác minh thay vì số lượng. Chính sách chỉ chụp ảnh bằng camera (EXIF metadata validation) đảm bảo hình ảnh là thực tế, không phải tải lên từ thư viện.

## Variants
- **Camera-only photo policy**: Chỉ cho phép chụp ảnh trực tiếp, không tải lên từ gallery — xác thực qua EXIF metadata
- **Staff seed content**: Ban đầu nội dung do team tạo (50–100 danh mục hạt giống), sau đó chuyển sang nội dung do người dùng tạo
- **100% internal UGC**: Tất cả đánh giá, bài viết, hình ảnh do cộng đồng tạo trên nền tảng

## Key sources
- [[sources/danangnavi-product-requirements-document]]

## Related concepts
- [[concepts/danangnavi/senpai-trust-flywheel]]
- [[concepts/danangnavi/camera-only-verification]]

## Mentioned in
_(Chưa có)_

## Notes
Triết lý này tạo rào cản cạnh tranh vì nội dung xác thực không thể sao chép dễ dàng bởi đối thủ nhập dữ liệu ngoài. Tuy nhiên, nó cũng yêu cầu chiến lược khởi động lạnh mạnh để vượt qua bài toán con gà-trứng nội dung ban đầu.