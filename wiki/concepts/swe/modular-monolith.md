---
type: concept
title: Modular Monolith
confidence: high
tags:
  - architecture
  - design-pattern
  - solo-development
id: modular-monolith
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/danangnavi-architecture-decision-document
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/swe/event-driven-internal-communication
  - concepts/danangnavi/three-sided-cultural-bridge
---

## Definition
Modular monolith là mô hình kiến trúc phần mềm kết hợp tính đơn giản của monolith với tính tách biệt của microservices. Toàn bộ codebase chạy trong một process duy nhất, nhưng module giao tiếp chỉ qua Dependency Injection (sync) hoặc Event Bus (async) — không bao giờ import trực tiếp. Mỗi module sở hữu bảng database riêng, không cross-module SQL joins.

## Variants
- **Strict modular monolith** — áp수 принцип no-cross-module-imports nghiêm ngặt (DaNangNavi case)
- **Loosely-coupled monolith** — cho phép một số shared libraries giữa module
- **Modular monolith with extraction readiness** — thiết kế sẵn để tách module thành microservice khi cần

## Key sources
- [[sources/danangnavi-architecture-decision-document]]

## Related concepts
- [[concepts/swe/event-driven-internal-communication]]
- [[concepts/danangnavi/three-sided-cultural-bridge]]

## Được nhắc đến trong

_(Chưa có)_

## Notes
Lựa chọn này đặc biệt phù hợp cho solo developer + dự án greenfield. Microservices thêm network overhead, distributed debugging complexity, và deployment orchestration cost không cần thiết ở giai đoạn đầu. Modular monolith cho phép tách module thành microservice sau khi xác định được bottleneck cụ thể.

## Key sources

- [[sources/luong-hai-lam-4]]
