---
type: source
title: DaNangNavi — Architecture Decision Document
slug: danangnavi-architecture-decision-document
date_added: 2026-05-12
authors:
  - DaNangNavi Team
source_type: note
importance: 4
confidence: high
tags:
  - architecture
  - da-nang
  - full-stack
  - modular-monolith
  - nextjs
  - fastapi
  - design-decisions
provenance: replayable
raw_paths:
  - raw/sources/danangnavi/planning-artifacts/architecture/index.md
  - raw/sources/danangnavi/planning-artifacts/architecture/project-context-analysis.md
  - raw/sources/danangnavi/planning-artifacts/architecture/starter-template-evaluation.md
  - raw/sources/danangnavi/planning-artifacts/architecture/core-architectural-decisions.md
  - raw/sources/danangnavi/planning-artifacts/architecture/implementation-patterns-consistency-rules.md
  - raw/sources/danangnavi/planning-artifacts/architecture/project-structure-boundaries.md
  - raw/sources/danangnavi/planning-artifacts/architecture/architecture-validation-results.md
ingest_status: finalized
id: sources/danangnavi-architecture-decision-document
created: 2026-05-12
updated: 2026-05-12
year: 2026
---

## Tóm tắt

Tài liệu kiến trúc DaNangNavi xác định **modular monolith + event-driven** làm mô hình kiến trúc chính, với Next.js 16 (App Router, route groups) làm frontend và FastAPI (async, Python) làm backend, chạy trong Turborepo monorepo. Bộ kỹ thuật cốt lõi gồm PostgreSQL 16 + Redis 7 + Meilisearch 1.16 + Celery 5.6. Tài liệu bao phủ 100% yêu cầu chức năng (74 FR) và phi chức năng (46 NFR), cung cấp quy tắc implement chi tiết (13 enforcement rules, 11 anti-patterns), và cấu trúc thư mục hoàn chỉnh (150+ file) với ánh xạ FR-to-module rõ ràng.

## Luận điểm chính

- **Modular monolith** là lựa chọn kiến trúc phù hợp nhất cho solo developer: tránh overhead của microservices, vẫn giữ module tách biệt qua Event Bus và Dependency Injection, cho phép tách module thành microservice khi cần
- **Ba route group Next.js** — `(user)`, `(business)`, `(admin)` — tạo ranh giới kiến trúc rõ ràng: mobile-first SSR cho người dùng Nhật, desktop dashboard cho chủ doanh nghiệp Việt, và admin panel — chia sẻ cùng codebase nhưng tree-shaking tách biệt
- **Event-driven internal communication** là huyết mạch module: module KHÔNG import nhau trực tiếp, chỉ giao tiếp qua Dependency Injection (sync) hoặc Event Bus + Redis Pub/Sub (async), giữ module độc lập và testable
- **Cross-language search** với Meilisearch là khả năng phân biệt nền tảng: tokenization CJK + tiếng Việt, cross-language matching JP↔VN, với PostgreSQL full-text fallback khi Meilisearch lỗi
- **10 insight văn hóa Nhật** hình thành quyết định kiến trúc — từ error handling lịch sự (anshinkan), skeleton loading thay spinner, đến coupon culture và honne/tatemae rating — chứ không chỉ là yêu cầu kỹ thuật thuần túy
- **12-thứ tự implementation sequence** từ infrastructure → auth → listing → search → media → community → gamification → coupon → moderation → notification → analytics, với dependency mapping rõ ràng

## Bằng chứng

- 74/74 yêu cầu chức năng và 46/46 yêu cầu phi chức năng được bao phủ 100%
- 30+ lựa chọn công nghệ với version chính xác và lý do lựa chọn ghi rõ
- 13 module backend (auth, listing, translation, search, community, media, moderation, notification, analytics, coupon, gamification, review, sync) mỗi module tuân theo cấu trúc template đồng nhất
- 3 loại workload được phân tích: synchronous fast (<500ms), synchronous slow (<2s), background deferred (Celery)
- Chiến lược scaling: MVP 1 server $24/mo (4GB) → Scale tháng 6: load balancer + 2x FastAPI + read replicas, xử lý 5000 concurrent
- 8 điểm tích hợp dịch vụ ngoài với circuit breaker (Google/DeepL, LINE Login, Google OAuth, DO Spaces, Email, Meilisearch, Sentry)
- Validation kiểm tra: coherence ✅, requirements coverage ✅, implementation readiness ✅, không có gap nghiêm trọng

## Khái niệm liên quan

- [[concepts/modular-monolith]]
- [[concepts/cross-language-search]]
- [[concepts/event-driven-internal-communication]]
- [[concepts/senpai-trust-flywheel]]
- [[concepts/camera-only-verification]]
- [[concepts/closed-data-philosophy]]
- [[concepts/contribution-point-system]]
- [[concepts/three-sided-cultural-bridge]]
- [[concepts/context-aware-voice-translation]]

## Nguồn liên quan

- [[sources/danangnavi-product-requirements-document]]

## Mọi người

_(Không có cá nhân có thật — tất cả user personas là hư cấu)_

## Câu hỏi mở

- Modular monolith có thực sự giữ được ranh giới module khi solo developer phải tiết kiệm thời gian và có thể "shortcut" qua Event Bus?
- Chiến lược polling thống nhất (`GET /api/v1/sync`) có đạt được latency <100ms khi số module phát triển lên 13+ với nhiều channel subscription?
- Meilisearch 1.16 có tokenization chất lượng cho tiếng Việt không — hay cần custom analyzer bổ sung?
- Docker Compose single-server có chịu nổi 13 backend module + Celery workers + PostgreSQL + Redis + Meilisearch + Nginx trên 4GB RAM ở MVP?
- Bỏ qua WebSocket ở Phase 1 — polling có tạo trải nghiệm đủ tốt cho cộng đồng real-time và notification?

## Ghi chú

Tài liệu kiến trúc gồm 7 file: index (mục lục), project context analysis (74 FR, 46 NFR, 4 user journeys, Japanese culture insights), starter template evaluation (hybrid single app monorepo), core architectural decisions (data, auth, API, frontend, infrastructure), implementation patterns & consistency rules (naming, structure, format, communication, process, enforcement), project structure & boundaries (150+ files/directories, module boundaries, integration points), và architecture validation results (100% FR/NFR coverage confirmed, READY FOR IMPLEMENTATION).