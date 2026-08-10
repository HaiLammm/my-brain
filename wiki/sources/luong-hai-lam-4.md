---
type: source
title: CV chính thức — Lương Hải Lâm (phiên bản 4)
slug: luong-hai-lam-4
date_added: 2026-05-18
authors:
  - Lương Hải Lâm
source_type: note
importance: 4
confidence: high
tags:
  - cv
  - interview
  - personal
provenance: replayable
raw_paths:
  - raw/sources/interview/LƯƠNG HẢI LÂM-4.pdf
id: sources/luong-hai-lam-4
created: 2026-05-18
updated: 2026-05-18
year: 2026
sources:
  - {provider: pdf, fetched_at: "2026-05-17T18:23:52Z"}
ingest_status: finalized
verify_status: passed
findings: []
---

## Summary

CV chính thức dạng PDF của Lương Hải Lâm — Backend Developer chuyên Python với kinh nghiệm xây dựng hai hệ thống production độc lập từ đầu đến cuối. Tài liệu ghi lại kinh nghiệm tại Tailor project (01–04/2026) và DaNangNavi (04/2026–nay), danh sách kỹ năng kỹ thuật đầy đủ và thông tin học vấn tại Đại học Đông Á. GPA 3.89/4.0, chuyên ngành Công nghệ phần mềm, dự kiến tốt nghiệp 07/2026.

## Key claims

- Backend Developer chuyên Python, thành thạo FastAPI, PostgreSQL, Redis, Celery, Docker và Kubernetes trong event-driven architecture (Pub/Sub, Event Bus) và Multi-tenant RLS ở môi trường production thực tế [confidence: high]
- Tailor project (01–04/2026): nền tảng may đo Áo dài bespoke tích hợp AI; thiết kế checkout 3 bước với Authoritative Server Pattern; 300+ backend tests + 500+ frontend tests [confidence: high]
- DaNangNavi (04/2026–nay): nền tảng B2B2C hỗ trợ người Nhật tại Đà Nẵng; 13 module FastAPI với Dependency Injection + Event Bus + Redis Pub/Sub; tìm kiếm đa ngôn ngữ JP↔VN; 8 dịch vụ bên thứ ba với circuit breaker [confidence: high]
- Stack đầy đủ: Python/FastAPI/asyncio/Celery | Next.js 16/TypeScript/React/Zustand/TanStack Query | PostgreSQL/MongoDB/Redis/MySQL | Docker/Kubernetes | pytest/@testing-library/react [confidence: high]
- GPA 3.89/4.0, Công nghệ phần mềm, Đại học Đông Á, 08/2022–07/2026 [confidence: high]

## Evidence

- Thông tin liên lạc: luonghaimal@gmail.com | +8423120701 | github.com/HaiLammm
- Mục tiêu ứng tuyển: hệ thống CRM và brokerage platform tại EAERA
- Tailor project: webhook thanh toán idempotent; bảng điều phối đơn hàng; quản lý thuê đồ; profile hub tự phục vụ cho khách hàng
- DaNangNavi: phân loại workload thành sync fast, sync slow và background Celery; định hướng scale từ MVP một server lên nhiều FastAPI instance và read replicas
- Fallback tìm kiếm: Meilisearch → PostgreSQL full-text search khi dịch vụ gặp lỗi

## Related concepts

- [[concepts/swe/modular-monolith]]
- [[concepts/swe/event-driven-internal-communication]]
- [[concepts/swe/fastapi]]
- [[concepts/swe/docker-va-kubernetes]]
- [[concepts/swe/multi-tenant-rls]]
- [[concepts/swe/authoritative-server-pattern]]
- [[concepts/swe/circuit-breaker]]
- [[concepts/swe/celery]]
- [[concepts/tailor/checkout-and-payment]]
- [[concepts/swe/cross-language-search]]
- [[concepts/swe/race-condition-prevention]]
- [[concepts/swe/tanstack-query]]
- [[concepts/swe/lap-trinh-backend-python]]
- [[concepts/swe/co-so-du-lieu-nosql]]

## Related sources

- [[sources/ho-so-luong-hai-lam]]
- [[sources/danangnavi-architecture-decision-document]]
- [[sources/danangnavi-product-requirements-document]]
- [[sources/tailor-project-prd]]

## People

- [[people/luong-hai-lam]]

## Open questions

- MongoDB được liệt kê trong kỹ năng nhưng chưa có dự án cụ thể nào đề cập — sử dụng ở đâu trong thực tế?
- Thông tin về các dự án phụ hoặc đóng góp mã nguồn mở ngoài hai dự án chính có không?
