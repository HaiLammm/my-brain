---
type: concept
title: Celery
slug: celery
date_added: 2026-05-14
confidence: high
tags: []
id: concepts/celery
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/luong-hai-lam
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/event-driven-internal-communication
  - concepts/fastapi
  - concepts/lap-trinh-backend-python
---

## Definition

Celery là distributed task queue cho Python, cho phép xử lý các tác vụ nền (background jobs) bất đồng bộ và theo lịch (scheduled tasks). Celery nhận task từ broker (thường là Redis hoặc RabbitMQ), phân phối cho các worker, và lưu kết quả vào result backend. Được dùng khi một thao tác quá chậm để trả lời ngay trong HTTP request — ví dụ: gửi email, xử lý ảnh, đồng bộ dữ liệu với dịch vụ ngoài.

## Variants

- **Celery Beat** — scheduler tích hợp để chạy task định kỳ (giống cron)
- **Flower** — dashboard monitoring cho Celery workers và task queue
- **Async result chaining** — chain, group, chord để orchestrate nhiều task phụ thuộc nhau

## Key sources

- [[sources/luong-hai-lam]]
- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/event-driven-internal-communication]]
- [[concepts/fastapi]]
- [[concepts/lap-trinh-backend-python]]

## Mentioned in

## Notes
