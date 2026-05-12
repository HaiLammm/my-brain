---
id: sources/tailor-project-prd
title: Product Requirements Document — tailor_project
type: source
created: 2026-05-12
updated: 2026-05-12
authors:
  - tailor_project team
year: 2026
importance: 3
provenance: replayable
confidence: high
source_type: note
tags:
  - prd
  - sao-dang
  - ai-bespoke
  - e-commerce
  - product-requirements
raw_paths:
  - raw/sources/projects/tailor-project/planning-artifacts/prd/index.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/executive-summary.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/product-scope.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/functional-requirements.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/non-functional-requirements-nfrs.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/user-journeys.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/success-criteria.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/technical-project-type-requirements.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/domain-specific-requirements.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/validation-report-2026-03-10.md
  - raw/sources/projects/tailor-project/planning-artifacts/prd/validation-report-2026-04-03.md
ingest_status: finalized
verify_status: passed
---

## Summary

Đây là Product Requirements Document (PRD) cho **tailor_project** — nền tảng may đo bespoke kết hợp AI chuyên về Áo dài Việt Nam. PRD xác định bốn chức năng cốt lõi: (1) AI Bespoke Engine dịch cảm xúc phong cách thành sai số hình học (Geometric Delta), (2) E-commerce & Rental — storefront số cho mua/thuê Áo dài, (3) Operations & CRM — dashboard phân vai cho chủ tiệm, thợ may và khách hàng, (4) Technical Pattern Generation — công cụ xác định tạo 3 mảnh rập cắt may từ 10 số đo cơ thể, xuất SVG/G-code. Phiên bản này đã trải qua 3 lần Sprint Change Proposal mở rộng phạm vi từ AI Bespoke thuần túy thành nền tảng thương mại điện tử + đặt lịch + quản lý vận hành hoàn chỉnh, với 107 yêu cầu chức năng (FR1–FR107) và 20 yêu cầu phi chức năng (NFR1–NFR20).

## Key Claims

- **Khoảng cách ngôn ngữ (language gap)** giữa mong muốn cảm xúc của khách hàng và thực thi kỹ thuật của thợ may là vấn đề cốt lõi; nền tảng giải quyết bằng Physical-Emotional Compiler dịch tính từ phong cách thành Geometric Delta chính xác.
- **Độ chính xác hình học** mục tiêu ΔG ≤ 1mm (so sánh với lý thuyết); độ chính xác xác suất < 1mm so với công thức thợ may xác thực cho Pattern Engine.
- **Tỷ lệ vừa vặn lần đầu (First-Fit Rate)** mục tiêu > 90%, giảm thời gian tư vấn 70% (từ 60 phút xuống 15 phút).
- **Mô hình 3 vai trò** rõ ràng: Khách hàng (Linh), Chủ tiệm (Cô Lan), Thợ may (Minh), mỗi vai có dashboard và luồng công việc riêng.
- **Quy trình đặt hàng thống nhất (Unified Order Workflow)** phân nhánh theo loại dịch vụ: Mua (100% thanh toán trước), Thuê (Đặt cọc + CCCD/Bảo hiểm), Bespoke (Đặt cọc trước → phần còn lại khi nhận).
- **Kiểm duyệt xác định (Deterministic Guardrails)** chặn mọi thiết kế vi phạm vùng an toàn vật lý ở lớp dữ liệu, không dựa vào AI.
- **Pattern Engine** hoạt động xác định (deterministic) dựa trên công thức, không dùng suy luận AI; sinh 3 mảnh rập (thân trước, thân sau, tay áo) từ 10 số đo.
- **Audit Trail toàn diện** ghi lại mọi chuyển trạng thái cho đơn hàng, thanh toán, nhiệm vụ thợ may, trang phục, lịch hẹn, và lead CRM (FR100–FR107).

## Evidence

- 107 yêu cầu chức năng (FR1–FR107) trải qua 18 hạng mục: Style & Semantic Interpretation, Geometric Transformation Engine, Deterministic Guardrails, Tailor Collaboration, Measurement & Profile, Rental Catalog, Authentication, Product & Inventory, E-commerce, Appointment Booking, Order & Payment, Operations Dashboard, Tailor Dashboard, Customer Management, CRM & Marketing, Unified Order Workflow, Technical Pattern Generation, Status Transition & Audit Trail.
- 20 yêu cầu phi chức năng (NFR1–NFR20) với chỉ số đo lường cụ thể: AI latency < 15s, page load < 2s (P95), API < 300ms (P95), 100 concurrent users, ΔG ≤ 1mm, availability 99.9%, PCI DSS compliance.
- 3 persona journey chi tiết: Linh (khách hàng mua/thuê/bespoke), Minh (thợ may nhận task và sản xuất), Cô Lan (chủ tiệm quản lý vận hành).
- 2 Validation Report (2026-03-10, 2026-04-03) xác nhận toàn bộ PRD đạt quality rating 4.5/5, zero implementation leakage, zero measurability violations, 100% product brief coverage.
- Phạm vi sản phẩm chia 3 giai đoạn: MVP (6 epic chính + AI Core + Pattern Engine), Growth (Rule Editor, Body Version Control, Grading), Vision (Atelier Academy, Laser Automation, Open Garment System, 3D Simulation, Multi-Tenant).

## Related concepts

- [[concepts/physical-emotional-compiler]]
- [[concepts/geometric-delta]]
- [[concepts/deterministic-guardrails]]
- [[concepts/pattern-engine]]
- [[concepts/ao-dai-bespoke]]
- [[concepts/unified-order-workflow]]
- [[concepts/audit-trail]]
- [[concepts/ssot]]
- [[concepts/rbac]]
- [[concepts/appointment-booking]]

## People

- [[people/linh-customer]]
- [[people/minh-tailor]]
- [[people/co-lan-owner]]

## Open questions

- Epic 11 (Technical Pattern Generation) chỉ mới được thêm vào Executive Summary; Product Scope và FR91–FR99 cần cập nhật đầy đủ theo Sprint Change Proposal 2026-04-03 Edits 2-3.
- Chưa có Success Criteria riêng cho Pattern Engine (đề xuất: pattern accuracy, SVG 1:1 scale verification, G-code compatibility rate).
- User Journey chưa cập nhật bước Pattern Generation cho Cô Lan (generate → preview → export → attach to order) và Minh (receive pattern → validate → cut).
- Mô hình thuê (multi-tenant) chỉ mới đề cập ở Vision (Phase 3); chưa có thiết kế chi tiết cho data isolation.
- Chi tiết tích hợp thanh toán (payment gateway cụ thể nào cho thị trường Việt Nam) chưa được chỉ định.