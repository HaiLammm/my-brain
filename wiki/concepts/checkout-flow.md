---
type: concept
title: Checkout Flow (3 bước)
slug: checkout-flow
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - e-commerce
  - ux
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/luong-hai-lam-4
related_concepts: []
---

## Definition

Checkout Flow là quy trình thanh toán 3 bước được thiết kế cho tailor_project: (1) Review Cart & Verify — hiển thị và xác thực giỏ hàng với backend (Story 3.2); (2) Shipping Info & Payment Method — nhập địa chỉ giao hàng và chọn phương thức thanh toán COD/VNPay/Momo (Story 3.3); (3) Confirmation — hiển thị thông tin đơn hàng sau khi tạo thành công. Mục tiêu UX: từ Homepage đến Order Confirmation ≤ 3 phút.

## Variants

- **Step 1 — Verify**: CheckoutClient gọi `verifyCartItems()` Server Action; hiển thị unavailable warning (Ruby Red); giá thay đổi hiển thị strikethrough + giá mới.
- **Step 2 — Shipping + Payment**: ShippingFormClient với inline validation; PaymentMethodSelector với COD mặc định; CheckoutProgress bar hiển thị bước hiện tại.
- **Step 3 — Confirmation**: OrderConfirmation hiển thị chi tiết đơn; COD → direct redirect; VNPay/Momo → redirect payment_url gateway.

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]
- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/authoritative-server-pattern]]
- [[concepts/payment-gateway-mvp]]
- [[concepts/inline-validation]]
- [[concepts/zustand-cart-store]]
- [[concepts/heritage-palette]]

## Notes

Flow: CartDrawer "Tiến hành Thanh Toán" → `/checkout` (Step 1) → `/checkout/shipping` (Step 2) → Payment Gateway hoặc `/checkout/confirmation` (Step 3). Responsive: desktop 2-column (8fr + 4fr sidebar), mobile single column với sticky OrderSummary bottom.