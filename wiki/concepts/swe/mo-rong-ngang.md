---
type: concept
title: Mở rộng chiều ngang
slug: mo-rong-ngang
date_added: 2026-05-15
confidence: unverified
id: concepts/swe/mo-rong-ngang
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

Mở rộng ngang là chiến lược tăng năng lực hệ thống bằng cách thêm nhiều máy chủ hoặc nhiều node cùng chia sẻ tải, thay vì chỉ nâng cấu hình một máy duy nhất. Đây là cách tiếp cận nền tảng của các hệ thống phân tán hiện đại vì nó cải thiện cả khả năng chịu lỗi lẫn biên độ tăng trưởng.

## Variants

- **Stateless application scale-out**: Nhân bản nhiều instance ứng dụng phía sau load balancer.
- **Data partition scale-out**: Chia dữ liệu theo shard hoặc theo miền để phân tải.
- **Geo-distributed scale-out**: Mở rộng qua nhiều khu vực địa lý để giảm độ trễ và tăng dự phòng.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Blueprint này đặt mở rộng ngang đối lập trực tiếp với scale-up và xem nó là chuẩn mặc định cho hệ thống phục vụ hàng triệu người dùng.
