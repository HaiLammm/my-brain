---
type: concept
title: Đặt lịch Áo dài (Appointment Booking)
slug: appointment-booking
date_added: 2026-05-12
confidence: medium
tags:
  - appointment
  - booking
  - ao-dai
id: concepts/appointment-booking
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/unified-order-workflow
  - concepts/ao-dai-bespoke
  - concepts/audit-trail
---

## Definition

Đặt lịch Áo dài (Appointment Booking) là module cho phép khách hàng chọn ngày giờ đến tiệm qua giao diện lịch trực quan (FR42), gửi thông tin cá nhân và yêu cầu đặc biệt (FR43), nhận xác nhận qua email/SMS gửi cho cả khách hàng và chủ tiệm (FR44). Nếu khách chọn "Bespoke Order" nhưng chưa có số đo, hệ thống tự động redirect sang trang đặt lịch (FR82). Chủ tiệm (Owner) có thể xem và lọc danh sách lịch hẹn theo ngày/trạng thái (FR59-FR60).

## Variants

- **FR42 (Booking Calendar)**: Lịch trực quan cho khách hàng chọn ngày giờ.
- **FR43 (Booking Form)**: Form gửi thông tin cá nhân và yêu cầu đặc biệt.
- **FR44 (Booking Confirmation)**: Xác nhận lịch hẹn gửi cho cả khách và chủ tiệm.
- **FR59 (Appointment List)**: Danh sách lịch hẹn thời gian thực cho chủ tiệm.
- **FR60 (Appointment Filtering)**: Lọc lịch hẹn theo ngày và trạng thái.
- **FR82 (Bespoke Measurement Gate)**: Redirect sang đặt lịch khi chưa có số đo.
- **FR104 (Appointment Transition Log)**: Ghi lại mọi thay đổi trạng thái lịch hẹn.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/unified-order-workflow]]
- [[concepts/ao-dai-bespoke]]
- [[concepts/audit-trail]]

## Notes