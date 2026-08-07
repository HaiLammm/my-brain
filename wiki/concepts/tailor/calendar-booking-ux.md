---
type: concept
title: Calendar Booking UX
slug: calendar-booking-ux
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - ux
  - booking
  - calendar
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources: []
related_concepts: []
---

## Definition

Calendar Booking UX là giao diện đặt lịch tư vấn Bespoke với 3 bước: (1) Chọn ngày trên calendar grid — hiển thị available (Jade Green), unavailable (grayed), selected (Heritage Gold), today (Indigo dot), past (disabled); (2) Chọn khung giờ sáng/chiều — mỗi slot tối đa 3 bookings; (3) Nhập thông tin khách hàng — form với inline validation. Responsive: week view mobile, month view desktop. Target: ≤ 60 giây từ bắt đầu đến xác nhận.

## Variants

- **BookingCalendar**: Grid 7 cột (T2-CN); navigation < / > chuyển tháng; Framer Motion fade-in transition; WCAG 2.1 aria-label cho mỗi ngày.
- **SlotSelector**: 2 slot cards (Sáng 9:00-12:00, Chiều 13:00-17:00); available → Heritage Gold hover; unavailable → grayed "Đã đầy".
- **BookingForm**: Inline validation (không Zod); phone regex VN; error messages tiếng Việt; submit loading state.
- **BookingConfirmationModal**: Framer Motion checkmark scale animation; CTAs "Về Trang Chủ" và "Xem Lịch Hẹn".

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/appointment-booking]]
- [[concepts/tailor/inline-validation]]
- [[concepts/swe/server-action-pattern]]
- [[concepts/swe/race-condition-prevention]]
- [[concepts/tailor/heritage-palette]]

## Notes

Backend: `get_month_availability()` trả về map cho cả tháng; `get_availability(date)` cho ngày đơn; `create_appointment()` với FOR UPDATE lock. Email confirmation và reminder là non-blocking (try/except → log → continue). `framer-motion` package được install mới cho Story 3.4b.