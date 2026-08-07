---
type: concept
title: Hồ sơ Khách hàng Tự phục vụ (Customer Self-Service Profile)
slug: customer-self-service-profile
date_added: 2026-05-15
confidence: unverified
tags:
  - tailor-project
  - profile
  - self-service
  - customer
id: concepts/tailor/customer-self-service-profile
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/epic-4-implementation-artifacts-tailor-project
related_concepts:
  - concepts/tailor/heritage-palette
  - concepts/tailor/measurement-versioning
  - concepts/tailor/appointment-booking
  - concepts/swe/rbac
  - concepts/tailor/order-status-pipeline
---

## Definition

Hồ sơ Khách hàng Tự phục vụ là lớp giao diện và API để khách đã đăng nhập tự quản lý hậu mua trên một điểm vào duy nhất như `/profile`. Nó gom các lát cắt cá nhân, đơn hàng, số đo, lịch hẹn, thông báo và voucher nhưng vẫn giữ ranh giới phân quyền rõ ràng giữa dữ liệu khách được sửa và dữ liệu chỉ tiệm mới được cập nhật.

## Variants

- **Profile hub shell** — Một layout chung với sidebar/tab bar cho nhiều module con.
- **Authenticated self-service** — Dữ liệu đi qua session/JWT và Server Actions thay vì fetch trực tiếp từ client.
- **Role-aware fallbacks** — User OAuth không có mật khẩu sẽ nhận luồng riêng, còn số đo chỉ đọc.

## Key sources

- [[sources/epic-4-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/heritage-palette]]
- [[concepts/tailor/measurement-versioning]]
- [[concepts/tailor/appointment-booking]]
- [[concepts/swe/rbac]]
- [[concepts/tailor/order-status-pipeline]]

## Mentioned in

## Notes

Trong Epic 4, shell này đã hoàn thiện cho profile, đơn hàng, số đo và lịch hẹn; phần thông báo vẫn đang ở mức blueprint.
