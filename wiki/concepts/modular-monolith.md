---
type: concept
title: Modular Monolith
slug: modular-monolith
date_added: 2026-05-12
confidence: high
tags:
  - architecture
  - design-pattern
  - solo-development
id: concepts/modular-monolith
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/danangnavi-architecture-decision-document
related_concepts:
  - concepts/event-driven-internal-communication
  - concepts/three-sided-cultural-bridge
---

## Định nghĩa

Modular monolith là mô hình kiến trúc phần mềm kết hợp tính đơn giản của monolith với tính tách biệt của microservices. Toàn bộ codebase chạy trong một process duy nhất, nhưng module giao tiếp chỉ qua Dependency Injection (sync) hoặc Event Bus (async) — không bao giờ import trực tiếp. Mỗi module sở hữu bảng database riêng, không cross-module SQL joins.

## Biến thể

- **Strict modular monolith** — áp수 принцип no-cross-module-imports nghiêm ngặt (DaNangNavi case)
- **Loosely-coupled monolith** — cho phép một số shared libraries giữa module
- **Modular monolith with extraction readiness** — thiết kế sẵn để tách module thành microservice khi cần

## Nguồn chính

- [[sources/danangnavi-architecture-decision-document]]

## Khái niệm liên quan

- [[concepts/event-driven-internal-communication]]
- [[concepts/three-sided-cultural-bridge]]

## Được nhắc đến trong

_(Chưa có)_

## Ghi chú

Lựa chọn này đặc biệt phù hợp cho solo developer + dự án greenfield. Microservices thêm network overhead, distributed debugging complexity, và deployment orchestration cost không cần thiết ở giai đoạn đầu. Modular monolith cho phép tách module thành microservice sau khi xác định được bottleneck cụ thể.