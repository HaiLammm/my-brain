---
type: source
title: Hồ sơ cá nhân — Lương Hải Lâm
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
id: sources/ho-so-luong-hai-lam
created: 2026-05-14
updated: 2026-08-11
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
- Tự đánh giá của chính tác giả ở cuối hồ sơ **hạ thấp** mức thành thạo so với danh sách stack phía trên: Python "tạm được, chưa thực sự hiểu OS tốt"; FastAPI và REST API design "ở mức cơ bản"; asyncio và Celery "chưa thực sự giỏi" [confidence: high]

## Evidence

- Hồ sơ chứa **hai bản** mục "Kỹ năng kỹ thuật": bản đầu liệt kê công nghệ trung tính, bản sau (viết sau, ở cuối tài liệu) gắn thêm mức độ tự đánh giá. Bản sau là bản có thẩm quyền vì phản ánh nhìn nhận cập nhật của tác giả
- Mốc thời gian hai dự án: tailor_project 01/2026 – 04/2026, DaNangNavi 04/2026 – hiện tại (nối tiếp nhau, không chồng lấn)
- Trình độ tiếng Anh: giao tiếp cơ bản, đọc technical docs tốt
- Nhóm cơ sở dữ liệu đã dùng gồm cả MySQL bên cạnh PostgreSQL, MongoDB, Redis
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
- [[sources/ho-so-cong-ty-wa-craft]] — hồ sơ của công ty nơi người này làm kỹ thuật

## People

- [[people/luong-hai-lam]]

## Open questions

- Năm tốt nghiệp Đại học Đông Á chưa được ghi rõ trong hồ sơ (bản gốc để trống `[năm]`)
- Khoảng cách giữa tự đánh giá ("FastAPI ở mức cơ bản", "Celery chưa thực sự giỏi") và quy mô hai dự án đã làm (13 module, event-driven, Celery deferred workload) nên được giải thích thế nào khi trình bày CV — khiêm tốn quá mức, hay thật sự chưa nắm phần lý thuyết nền?
- "Chưa thực sự hiểu OS tốt" cụ thể là thiếu mảng nào — process/thread, I/O, memory, hay networking?
- Roadmap tiếp theo của DaNangNavi sau giai đoạn MVP?
- Kế hoạch thâm nhập thị trường người dùng Nhật Bản tại Đà Nẵng?
