---
type: concept
title: Luồng đặt lịch tư vấn
slug: booking-flow
date_added: 2026-05-12
confidence: medium
tags:
  - tailor-project
  - booking
  - ao-dai
id: concepts/tailor/booking-flow
created: 2026-05-12
updated: 2026-08-07
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/tailor/unified-order-workflow
  - concepts/tailor/ao-dai-bespoke
  - concepts/swe/audit-trail
---

## Definition

Luồng đặt lịch đưa khách từ ý định đến một cuộc hẹn có xác nhận qua ba bước — chọn ngày, chọn khung giờ, nhập thông tin — rồi phát xác nhận cho **cả hai phía**. Ràng buộc nghiệp vụ quan trọng nhất không nằm ở giao diện mà ở chỗ nối với đơn hàng: khách muốn đặt may đo nhưng chưa có số đo trong hồ sơ sẽ bị chặn lại và điều hướng sang đặt lịch đo trước.

## Variants

- **Cổng số đo (measurement gate)** — không có bộ số đo hợp lệ thì không đặt được đơn bespoke. Đây là điểm biến quy trình offline (đến tiệm đo) thành một bước bắt buộc trong luồng online, thay vì để đơn treo giữa chừng.
- **Khung giờ theo buổi** — chia sáng/chiều thay vì từng giờ, mỗi khung giới hạn số lượt. Giảm số lựa chọn khách phải cân nhắc và khớp với cách tiệm thực sự sắp người.
- **Xác nhận hai chiều** — cùng một sự kiện sinh thông báo cho khách và cho chủ tiệm; không bên nào phải chủ động hỏi bên kia.
- **Khung nhìn của chủ tiệm** — danh sách lịch hẹn cập nhật liên tục, lọc theo ngày và trạng thái.
- **Nhật ký chuyển trạng thái** — mọi thay đổi trạng thái lịch hẹn ghi lại bất biến, theo [[concepts/swe/audit-trail]].
- **Ngân sách thời gian** — mục tiêu dưới 60 giây từ lúc mở lịch đến khi nhận xác nhận; con số này là ràng buộc thiết kế, không phải chỉ số đo sau.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/tailor/unified-order-workflow]]
- [[concepts/tailor/ao-dai-bespoke]]
- [[concepts/swe/audit-trail]]

## Mentioned in

## Notes

Gộp từ `appointment-booking` và `calendar-booking-ux`. Bản cũ liệt kê bảy mã yêu cầu chức năng và tên từng component giao diện — chúng đổi theo mỗi lần sửa PRD nên đã lược; phần giữ lại là quy tắc nghiệp vụ và ngân sách thời gian.
