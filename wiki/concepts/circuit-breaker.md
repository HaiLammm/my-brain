---
type: concept
title: Circuit Breaker
slug: circuit-breaker
date_added: 2026-05-14
confidence: high
tags: []
id: concepts/circuit-breaker
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/luong-hai-lam
related_concepts:
  - concepts/tich-hop-he-thong-ben-thu-ba
  - concepts/event-driven-internal-communication
---

## Definition

Circuit Breaker (bộ ngắt mạch) là resilience pattern trong kiến trúc phân tán, ngăn hệ thống gọi lặp lại một dịch vụ đã lỗi và gây cascading failure. Hoạt động như cầu chì điện: khi số lần thất bại vượt ngưỡng, circuit "mở" và các lời gọi tiếp theo bị từ chối ngay lập tức (fail fast) thay vì chờ timeout. Sau một khoảng thời gian, circuit chuyển sang trạng thái "half-open" để kiểm thử xem dịch vụ đã khôi phục chưa.

## Variants

- **Closed** — hoạt động bình thường, cho phép mọi lời gọi qua
- **Open** — từ chối tất cả lời gọi ngay lập tức (fail fast)
- **Half-open** — cho phép một số lời gọi thử nghiệm để kiểm tra khôi phục

## Key sources

- [[sources/luong-hai-lam]]

## Related concepts

- [[concepts/tich-hop-he-thong-ben-thu-ba]]
- [[concepts/event-driven-internal-communication]]

## Mentioned in

## Notes
