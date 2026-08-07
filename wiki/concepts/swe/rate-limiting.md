---
type: concept
title: Giới hạn tốc độ yêu cầu (Rate Limiting)
slug: rate-limiting
date_added: 2026-05-15
confidence: unverified
id: concepts/swe/rate-limiting
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

Giới hạn tốc độ yêu cầu (rate limiting) là cơ chế kiểm soát số lượng request mà một client, IP hoặc token được phép gửi trong một khoảng thời gian. Nó vừa là biện pháp bảo mật chống lạm dụng, vừa là cách bảo vệ chi phí hạ tầng và giữ tính sẵn sàng của hệ thống khi có bot, traffic đột biến hoặc client lỗi.

## Variants

- **Fixed Window / Sliding Window**: Giới hạn theo cửa sổ thời gian cố định hoặc trượt.
- **Token Bucket / Leaky Bucket**: Mô hình cân bằng giữa burst ngắn hạn và thông lượng dài hạn.
- **Per-IP / Per-user / Per-route**: Áp chính sách ở các cấp định danh hoặc endpoint khác nhau.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Trong blueprint này, rate limiting được xem là lớp phòng thủ ưu tiên hàng đầu vì nó chặn được cả lạm dụng bảo mật lẫn thất thoát tài nguyên do hệ client hoạt động sai.
