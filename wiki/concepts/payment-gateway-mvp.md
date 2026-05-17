---
type: concept
title: Payment Gateway MVP
slug: payment-gateway-mvp
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - e-commerce
  - payment
  - mvp
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources: []
related_concepts: []
---

## Definition

Payment Gateway MVP là chiến lược tích hợp thanh toán cho tailor_project ở giai đoạn MVP, với 3 phương thức: COD (Cash On Delivery — mặc định, không cần gateway), VNPay (thẻ ATM/Visa/Mastercard — mock URL), và Momo (ví điện tử — mock URL). Backend tạo OrderDB với status "pending"; VNPay/Momo trả về mock `payment_url`; webhook xử lý thực tế sẽ ở Story 4.1.

## Variants

- **COD (Thanh toán khi nhận hàng)**: Mặc định, không cần tích hợp gateway. Order giữ status "pending" → Owner xác nhận thủ công (Story 4.2).
- **VNPay mock**: Backend generate `payment_url` dạng `/checkout/confirmation?orderId={id}&status=success` (simulate success).
- **Momo mock**: Tương tự VNPay, mock URL cho MVP.
- **Security**: `isSafePaymentUrl()` allowlist validation trước khi redirect; không lưu raw card data (PCI DSS compliance).

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/checkout-flow]]
- [[concepts/order-status-pipeline]]
- [[concepts/race-condition-prevention]]
- [[concepts/server-action-pattern]]

## Notes

Real VNPay/Momo integration cần merchant account + sandbox environment. Webhook callback xử lý ở Story 4.1. Cart chỉ clear sau khi order thành công (COD) hoặc after confirmation page (VNPay/Momo) — không clear trước.