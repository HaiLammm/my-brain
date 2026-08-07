---
type: source
title: Hồ sơ cá nhân — Lương Hải Lâm
slug: luong-hai-lam
date_added: 2026-05-14
authors:
  - Lương Hải Lâm
source_type: note
importance: 3
confidence: high
tags: []
provenance: replayable
raw_paths:
  - raw/sources/personal/luonghailam.md
sources:
  - "provider: pdf"
ingest_status: finalized
id: sources/luong-hai-lam
created: 2026-05-14
updated: 2026-05-14
year: 2026
verify_status: passed
findings: []
---

## Summary

Hồ sơ cá nhân của Lương Hải Lâm — fullstack developer sinh năm 2001, tốt nghiệp Công nghệ phần mềm tại Đại học Đông Á. Tài liệu ghi lại hai dự án cá nhân lớn: DaNangNavi (nền tảng B2B2C hỗ trợ người Nhật tại Đà Nẵng) và tailor_project (nền tảng may đo Áo dài tích hợp AI). Cả hai đều sử dụng Python/FastAPI + Next.js 16 và thể hiện kiến trúc Modular Monolith với event-driven communication.

## Key claims

- DaNangNavi được xây dựng với 13 module FastAPI độc lập giao tiếp qua Event Bus + Redis Pub/Sub; tích hợp Meilisearch để tìm kiếm đa ngôn ngữ JP↔VN với CJK tokenization [confidence: high]
- tailor_project sử dụng Authoritative Server Pattern + `SELECT ... FOR UPDATE` để ngăn race condition khi đặt hàng đồng thời; đạt 300+ pytest backend tests + 500+ frontend tests ở 100% pass rate [confidence: high]
- Stack chính: Python, FastAPI, Next.js 16, TypeScript, PostgreSQL 16 (RLS), Redis 7, Meilisearch 1.16, Celery 5.6, Docker, Kubernetes, Turborepo [confidence: high]
- DaNangNavi tích hợp 8 dịch vụ ngoài với circuit breaker: Google/DeepL, LINE Login, Google OAuth, DO Spaces, Email, Sentry [confidence: high]
- Workload DaNangNavi được phân loại ba tầng: sync fast (<500ms), sync slow (<2s), background Celery deferred [confidence: high]

## Evidence

- DaNangNavi bao phủ 74 functional requirements và 46 non-functional requirements
- tailor_project: checkout 3 bước (Review → Shipping Info → Confirmation) thiết kế hoàn thành ≤ 3 phút
- tailor_project triển khai xác thực đa phương thức: Auth.js v5, Google OAuth, Email/OTP
- PostgreSQL với Row-Level Security (RLS) cho multi-tenant data isolation trong tailor_project
- Turborepo monorepo với 3 route group Next.js: (user) mobile-first SSR, (business) dashboard, (admin)

## Related concepts

- [[concepts/swe/modular-monolith]]
- [[concepts/swe/event-driven-internal-communication]]
- [[concepts/swe/cross-language-search]]
- [[concepts/swe/authoritative-server-pattern]]
- [[concepts/swe/multi-tenant-rls]]
- [[concepts/swe/race-condition-prevention]]
- [[concepts/swe/fastapi]]
- [[concepts/swe/docker-va-kubernetes]]
- [[concepts/tailor/checkout-and-payment]]
- [[concepts/tailor/booking-flow]]
- [[concepts/tailor/checkout-and-payment]]
- [[concepts/swe/zustand-cart-store]]
- [[concepts/swe/react-hook-form-zod]]
- [[concepts/swe/tanstack-query]]
- [[concepts/swe/optimistic-update]]
- [[concepts/swe/tich-hop-he-thong-ben-thu-ba]]
- [[concepts/swe/celery]]
- [[concepts/swe/circuit-breaker]]
- [[concepts/swe/turborepo]]

## Related sources

- [[sources/danangnavi-architecture-decision-document]]
- [[sources/danangnavi-product-requirements-document]]
- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]
- [[sources/epic-1-implementation-artifacts-tailor-project]]
- [[sources/epic-2-implementation-artifacts-tailor-project]]
- [[sources/epic-3-implementation-artifacts-tailor-project]]

## People

- [[people/luong-hai-lam]]

## Open questions

- Năm tốt nghiệp Đại học Đông Á chưa được ghi rõ trong hồ sơ
- Roadmap tiếp theo của DaNangNavi sau giai đoạn MVP?
- Kế hoạch thâm nhập thị trường người dùng Nhật Bản tại Đà Nẵng?
