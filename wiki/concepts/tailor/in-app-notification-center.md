---
type: concept
title: Trung tâm Thông báo Trong ứng dụng (In-App Notification Center)
confidence: unverified
tags:
  - tailor-project
  - notifications
  - event-driven
  - customer-experience
id: in-app-notification-center
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/epic-4-implementation-artifacts-tailor-project
related_concepts:
  - concepts/swe/event-driven-internal-communication
  - concepts/swe/soft-delete
  - concepts/swe/optimistic-update
  - concepts/tailor/design-system
---

## Definition

Trung tâm Thông báo Trong ứng dụng là lớp feed giúp khách hàng xem các cập nhật quan trọng như đổi trạng thái đơn, lịch hẹn, nhắc trả đồ và thông điệp hệ thống ngay trong profile. Concept này thường đi kèm unread badge, đánh dấu đã đọc, đánh dấu tất cả đã đọc và soft delete để biến thông báo thành một kênh giữ chân sau mua.

## Variants

- **Unread badge** — Hiển thị số thông báo chưa đọc trên navbar hoặc sidebar.
- **Event-generated feed** — Notification được tạo tự động từ order flow, appointment flow hoặc return reminder.
- **Soft-delete timeline** — Cho phép ẩn thông báo khỏi giao diện mà vẫn giữ log backend.

## Key sources

- [[sources/epic-4-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/event-driven-internal-communication]]
- [[concepts/swe/soft-delete]]
- [[concepts/swe/optimistic-update]]
- [[concepts/tailor/design-system]]

## Mentioned in

## Notes

Trong Epic 4, concept này mới ở trạng thái thiết kế chi tiết; checklist triển khai vẫn còn bỏ trống ở Story 4.4f.
