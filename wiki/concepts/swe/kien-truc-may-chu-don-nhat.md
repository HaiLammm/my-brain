---
type: concept
title: Kiến trúc Máy chủ Đơn nhất
slug: kien-truc-may-chu-don-nhat
date_added: 2026-05-15
confidence: unverified
id: concepts/swe/kien-truc-may-chu-don-nhat
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

Kiến trúc máy chủ đơn nhất là mô hình triển khai trong đó web, logic nghiệp vụ, cơ sở dữ liệu và cache cùng chạy trên một máy chủ. Đây là bước khởi đầu đơn giản, chi phí thấp và dễ hình dung luồng request, nhưng nhanh chóng lộ giới hạn khi số người dùng tăng mạnh.

## Variants

- **All-in-one MVP**: Toàn bộ thành phần nằm trong một tiến trình hoặc một máy.
- **Single host with separated services**: Vẫn một máy chủ nhưng tách thành nhiều service hoặc container logic.
- **Managed single node**: Một máy chủ chính kèm một vài dịch vụ managed bên ngoài như email hoặc object storage.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Nguồn này xem single server là nền móng để hiểu kiến trúc, đồng thời cảnh báo rõ ràng về điểm lỗi đơn nhất và cạnh tranh CPU/RAM giữa web tier với data tier.
