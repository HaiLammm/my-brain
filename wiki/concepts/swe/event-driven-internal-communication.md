---
type: concept
title: Event-Driven Internal Communication
slug: event-driven-internal-communication
date_added: 2026-05-12
confidence: high
tags:
  - architecture
  - design-pattern
  - event-bus
  - decoupling
id: concepts/swe/event-driven-internal-communication
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/danangnavi-architecture-decision-document
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/swe/modular-monolith
---

## Definition
Event-driven internal communication là mô hình giao tiếp giữa các module trong backend, trong đó module phát sự kiện (event) thay vì gọi trực tiếp module khác. Đồng bộ qua Dependency Injection (FastAPI `Depends()`), bất đồng bộ qua Redis Pub/Sub. Mỗi module chỉ biết interface của event, không biết implementation của module nhận.

## Variants
- **In-process synchronous** — event được xử lý ngay trong cùng process, dùng cho side effects cần kết quả tức thì (ví dụ: cập nhật cache sau khi tạo listing)
- **Redis Pub/Sub asynchronous** — event được publish lên Redis, Celery workers subscribe và xử lý (ví dụ: dịch listing, nén ảnh, moderate nội dung)
- **Hybrid** — DaNangNavi dùng cả hai: synchronous cho critical path, async cho background processing

## Key sources
- [[sources/danangnavi-architecture-decision-document]]

## Related concepts
- [[concepts/swe/modular-monolith]]

## Được nhắc đến trong

_(Chưa có)_

## Notes
Quy ước đặt tên event: `{module}.{entity}.{action}` (snake_case). Ví dụ: `listing.listing.created`, `review.review.voted_helpful`, `gamification.user.badge_upgraded`. Payload chuẩn gồm `event`, `timestamp`, `actor_id`, và `payload`. Anti-pattern nghiêm cấm: import module khác trực tiếp trong backend Python code.

## Key sources

- [[sources/luong-hai-lam-4]]
