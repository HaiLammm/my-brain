---
type: concept
title: Email Reminder Scheduler
slug: email-reminder-scheduler
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - automation
  - email
  - background-task
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/tailor/order-status-pipeline
---

## Definition

Email Reminder Scheduler là hệ thống nhắc nhở tự động gửi email cho khách hàng 24 giờ trước hạn trả đồ thuê. Sử dụng asyncio background task chạy định kỳ lúc 8:00 AM (configurable), quét garments có status `rented` và `expected_return_date = ngày mai`. Tính idempotent nhờ trường `reminder_sent_at` trên bảng garments — không gửi trùng lặp cho cùng một đơn thuê.

## Variants

- **Background Scheduler** (Story 2.6) — `asyncio` scheduler chạy mỗi ngày, gọi `send_return_reminders()` service.
- **Manual Trigger** — Endpoint `POST /api/v1/notifications/send-return-reminders` cho Owner trigger thủ công, RBAC protected.
- **Idempotent Guard** — `reminder_sent_at` timestamp; reset về null khi garment chuyển từ `rented` sang `available` hoặc `maintenance`.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/order-status-pipeline]]

## Notes

- Hiện dùng SMTP trực tiếp — chưa tích hợp email service provider (SendGrid, AWS SES) cho production.
- Lỗi gửi email cho một khách hàng không dừng toàn bộ quy trình (resilient by design).