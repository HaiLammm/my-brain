---
type: concept
title: "Xác thực chỉ-quay-camera (Camera-Only Verification)"
slug: camera-only-verification
date_added: 2026-05-12
confidence: high
tags:
  - trust
  - content-moderation
  - ux
id: concepts/danangnavi/camera-only-verification
created: '2026-05-12'
updated: '2026-05-12'
key_sources:
  - sources/danangnavi-product-requirements-document
related_concepts:
  - concepts/danangnavi/closed-data-philosophy

---

## Definition
Chính sách chỉ cho phép tải ảnh được chụp trực tiếp bằng camera thiết bị — không cho phép tải lên từ thư viện/gallery. Xác thực được thực hiện qua kiểm tra EXIF metadata của ảnh để đảm bảo ảnh được chụp tại chỗ thay vì tải từ nguồn bên ngoài. Mục đích: đảm bảo hình ảnh đánh giá và danh mục phản ánh trải nghiệm thực tế.

## Variants
- **Review photo enforcement**: Ảnh trong đánh giá phải chụp trực tiếp — EXIF phải chứa thiết bị chụp và thời gian gần đây
- **Business listing photos**: Chủ doanh nghiệp cũng phải chụp trực tiếp — loại bỏ ảnh stock và ảnh sao chép
- **Admin override**: Admin có thể gắn cờ và loại bỏ ảnh nghi ngờ vi phạm chính sách

## Key sources
- [[sources/danangnavi-product-requirements-document]]

## Related concepts
- [[concepts/danangnavi/closed-data-philosophy]]

## Mentioned in
_(Chưa có)_

## Notes
Yêu cầu phi chức năng: ảnh tải lên tối đa 10MB, được quét malware, xác thực loại tệp + EXIF + kích thước. Ảnh được nén và tối ưu cho giao diện web qua CDN.