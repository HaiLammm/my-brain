---
type: concept
title: Ví Voucher Khách hàng (Customer Voucher Wallet)
slug: customer-voucher-wallet
date_added: 2026-05-15
confidence: unverified
tags:
  - tailor-project
  - voucher
  - customer
  - promotions
id: concepts/customer-voucher-wallet
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/epic-4-implementation-artifacts-tailor-project
related_concepts:
  - concepts/heritage-palette
  - concepts/soft-delete
  - concepts/rbac
  - concepts/checkout-flow
---

## Definition

Ví Voucher Khách hàng là giao diện và dữ liệu tự phục vụ để người dùng xem các voucher đã được gán cho tài khoản của mình, phân biệt còn hiệu lực, hết hạn hay đã dùng, và sao chép mã để áp dụng lúc thanh toán. Nó đóng vai trò chiếc cầu giữa CRM khuyến mãi phía owner và trải nghiệm checkout phía customer.

## Variants

- **Assigned voucher list** — Mỗi user có tập voucher riêng thay vì chỉ xem danh sách khuyến mãi chung.
- **Copy-to-clipboard feedback** — Sao chép mã và phản hồi trạng thái ngay trong card.
- **Forward-compatible schema** — Tách `vouchers` và `user_vouchers` để phục vụ owner CRUD ở story sau.

## Key sources

- [[sources/epic-4-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/heritage-palette]]
- [[concepts/soft-delete]]
- [[concepts/rbac]]
- [[concepts/checkout-flow]]

## Mentioned in

## Notes

Artifact 4.4g cho thấy phần schema và UI đã được mô tả khá cụ thể, nhưng completion notes trống nên mức độ hoàn tất triển khai cần được xác nhận thêm.
