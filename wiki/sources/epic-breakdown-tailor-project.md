---
id: sources/epic-breakdown-tailor-project
title: Epic Breakdown — tailor_project
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
  - epic-breakdown
  - sao-dang
  - project-planning
  - agile
  - story-decomposition
raw_paths:
  - raw/sources/projects/tailor-project/planning-artifacts/epics.md
ingest_status: finalized
sources:
  - {provider: pdf, url: ""}
verify_status: findings_pending
findings:
  - {id: 1, reviewer: grounding, class: patch, claim: 6 Story trong Epic 15, evidence: "Nguồn gốc liệt kê 7 story (15.1–15.7), không phải 6", action: Sửa thành 7 story}
  - {id: 2, reviewer: grounding, class: patch, claim: 107 yêu cầu chức năng (FR1–FR107) và 107 FR trải qua 17 section, evidence: "Nguồn chỉ có 104 FR (FR19–FR21 bị bỏ trống, nhảy từ FR18 sang FR22). Dải số hiệu FR1–FR107 chứa 3 khoảng trống.", action: "Sửa số lượng thành 104 FR, hoặc ghi rõ FR1–FR107 (có khoảng trống FR19–21)"}
---

## Summary

Đây là tài liệu phân tích Epic cho **tailor_project**, phân tách toàn bộ 107 yêu cầu chức năng (FR1–FR107) và 20 yêu cầu phi chức năng (NFR1–NFR20) thành 15 Epic có thể triển khai. Tài liệu tạo cầu nối giữa PRD và implementation bằng cách gộp các yêu cầu liên quan thành các nhóm logic, định nghĩa thứ tự phụ thuộc và ưu tiên. Đáng chú ý: Epic 1–11 + Epic 15 thuộc MVP, còn Epic 12–14 (AI Bespoke) bị hoãn đến sau khi ra mắtthương mại điện tử. Epic 15 (Status Transition & Business Event Tracking) được thêm sau qua Sprint Change Proposal, áp dụng nguyên tắc "Video, Not Snapshot" — mọi chuyển trạng thái phải được ghi lại dưới dạng sự kiện bất biến.

## Key Claims

- **15 Epic** phân bổ toàn bộ phạm vi chức năng: Foundation & Authentication (Epic 1), Product Catalog (Epic 2), E-commerce (Epic 3), Appointment Booking (Epic 4), Order & Rental Management (Epic 5), Measurement & Customer Profiles (Epic 6), Operations Dashboard (Epic 7), Tailor Dashboard (Epic 8), CRM & Marketing (Epic 9), Unified Order Workflow (Epic 10), Pattern Generation (Epic 11), AI Style (Epic 12 — hoãn), AI Geometry (Epic 13 — hoãn), AI Guardrails (Epic 14 — hoãn), Status Transition Tracking (Epic 15).
- **Dual-Mode UI** là nguyên tắc kiến trúc: Boutique Mode (khách hàng — nền ngà, khoảng cách rộng 16–24px, serif heading) vs Command Mode (chủ tiệm/thợ may — nền trắng, dày đặc 8–12px, sans-serif).
- **Quy trình đặt hàng phân nhánh** theo 3 loại dịch vụ: Mua (100% thanh toán trước), Thuê (Đặt cọc + CCCD/Bảo hiểm), Bespoke (Đặt cọc trước → phần còn lại khi nhận).
- **"Video, Not Snapshot"** — mọi chuyển trạng thái (đơn hàng, thanh toán, nhiệm vụ, trang phục, lịch hẹn, lead) được ghi lại dưới dạng sự kiện bất biến với actor, timestamp, context; trạng thái hiện tại chỉ là giá trị dẫn xuất/cache.
- **Pattern Engine** hoàn toàn xác định (deterministic), không phụ thuộc AI/LLM; sinh 3 mảnh rập (thân trước, thân sau, tay áo) từ 10 số đo với sai số < 1mm.
- **6 Story trong Epic 15** triển khai tuần tự: Story 15.1 (Transition Infrastructure) → 15.2–15.5 (tích hợp từng thực thể) → 15.6 (API) → 15.7 (Frontend).
- **UX Design Requirements** (UX-DR1–DR21) định nghĩa toàn bộ hệ thống design token, component tùy chỉnh (ProductCard, BookingCalendar, KPICard, StatusBadge, TaskRow, OrderTimeline, LeadCard, MeasurementForm, PatternPreview, PatternExportBar), và chiến lược responsive mobile-first.

## Evidence

- Bảng FR Coverage Map ánh xạ từng FR (FR1–FR107) đến Epic tương ứng, tránh trùng lặp và đảm bảo không có FR bị bỏ sót.
- 107 FR trải qua 17 section chức năng + thêm FR100–FR107 cho Status Transition.
- 20 NFR với chỉ số đo lường cụ thể (latency, P95, accuracy, uptime, compliance).
- 21 UX Design Requirements (UX-DR1–DR21) với token, component, animation, accessibility, i18n chi tiết.
- Epic 15 có dependency graph rõ ràng: Story 15.1 chặn tất cả story khác, 15.2–15.5 chạy song song, 15.6 phụ thuộc 15.2–15.5, 15.7 phụ thuộc 15.6.

## Related concepts

- [[concepts/dual-mode-ui]]
- [[concepts/order-status-pipeline]]
- [[concepts/transition-as-video]]
- [[concepts/unified-order-workflow]]
- [[concepts/pattern-engine]]
- [[concepts/deterministic-guardrails]]
- [[concepts/geometric-delta]]
- [[concepts/ao-dai-bespoke]]
- [[concepts/audit-trail]]
- [[concepts/rbac]]
- [[concepts/ssot]]
- [[concepts/physical-emotional-compiler]]
- [[concepts/appointment-booking]]

## Related sources

- [[sources/tailor-project-prd]]

## People

- [[people/co-lan-owner]]
- [[people/linh-customer]]
- [[people/minh-tailor]]

## Open questions

- Epic 12–14 (AI Bespoke) bị hoãn nhưng FR1–FR16 vẫn nằm trong PRD; cần xác nhận timeline cho giai đoạn post-launch.
- Chi tiết triển khai UX-DR components chưa có design file hoặc Figma link.
- Pattern Engine (Epic 11) không có API contract hoặc OpenAPI spec chi tiết trong tài liệu này (chỉ nêu 6 endpoints).
- Multi-tenancy (tenant_id) được đề cập nhưng chưa có Epic riêng cho data isolation và tenant provisioning.
- Chiến lược i18n (UX-DR21) chỉ đề cập Vietnamese + English; chưa rõ luồng lazy-loading JSON locale.