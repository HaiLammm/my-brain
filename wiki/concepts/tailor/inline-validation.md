---
type: concept
title: Inline Validation (không Zod)
slug: inline-validation
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - frontend
  - validation
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources: []
related_concepts: []
---

## Definition

Inline Validation là pattern validation frontend được dùng nhất quán trong tailor_project, thay vì dùng Zod library (không có trong project deps). Mỗi form tự định nghĩa hàm validation inline với regex và logic tùy chỉnh. Validation chạy on blur (real-time) và on submit. Error messages bằng tiếng Việt tự nhiên, không technical.

## Variants

- **Phone VN**: Regex `/^(0[3|5|7|8|9])+([0-9]{8})$/`.
- **Email**: Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- **Địa chỉ**: Province/district/ward required; address_detail min 5 chars.
- **Date range**: start_date >= today, end_date > start_date.
- **Duplicate prevention**: Cart item check (garment_id + type + size/dates).

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/checkout-flow]]
- [[concepts/tailor/calendar-booking-ux]]
- [[concepts/swe/server-action-pattern]]

## Notes

Pattern bắt nguồn từ Story 3.1 (RentalDateModal), được tái sử dụng ở Story 3.2, 3.3 (ShippingFormClient), và 3.4b (BookingForm). Ưu điểm: không cần thêm dependency, control hoàn toàn error messages tiếng Việt, dễ tùy chỉnh cho từng form.