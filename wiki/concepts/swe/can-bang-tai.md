---
type: concept
title: Cân bằng tải
slug: can-bang-tai
date_added: 2026-05-15
confidence: unverified
id: concepts/swe/can-bang-tai
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

Cân bằng tải là kỹ thuật phân phối lưu lượng truy cập đến nhiều máy chủ hoặc nhiều instance để tránh dồn tải vào một điểm duy nhất. Đây là lớp điều phối trung tâm giúp hệ thống tăng tính sẵn sàng, giảm độ trễ và tận dụng tốt hơn tài nguyên khi triển khai mở rộng ngang.

## Variants

- **Round Robin**: Luân phiên phân phối request qua các node.
- **Least Connections / Least Response Time**: Dồn lưu lượng về node đang nhẹ tải hoặc phản hồi tốt hơn.
- **Hash-based routing**: Dùng IP hash hoặc consistent hashing để giữ tính ổn định phân phối.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Blueprint này nhấn mạnh hai nhiệm vụ nền tảng của load balancer: điều phối request và tự loại các node lỗi ra khỏi pool qua health check.
