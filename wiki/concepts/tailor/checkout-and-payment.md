---
type: concept
title: Thanh toán và chiến lược cổng thanh toán
slug: checkout-and-payment
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - e-commerce
  - payment
id: concepts/tailor/checkout-and-payment
created: 2026-05-14
updated: 2026-08-07
key_sources:
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/tailor/unified-order-workflow
  - concepts/swe/payment-webhook-processing
  - concepts/swe/authoritative-server-pattern
---

## Definition

Quy trình thanh toán ba bước — xác thực giỏ hàng, nhập địa chỉ và chọn phương thức, xác nhận đơn — cùng chiến lược chọn cổng thanh toán cho thị trường Việt Nam. Quyết định cốt lõi là **COD làm mặc định**: phần lớn khách chưa quen trả trước cho hàng may đo, nên buộc qua cổng thanh toán ngay từ MVP sẽ chặn doanh thu thật để đổi lấy tiện lợi vận hành.

## Variants

- **Xác thực giỏ hàng phía server** — trước khi sang bước thanh toán, giá và tình trạng còn hàng được kiểm lại ở backend. Client báo giá nào không quan trọng; sai lệch hiện ra dưới dạng cảnh báo và giá cũ gạch ngang. Đây là ứng dụng trực tiếp của [[concepts/swe/authoritative-server-pattern]].
- **COD-first** — thanh toán khi nhận hàng không cần tích hợp cổng, đơn giữ trạng thái chờ đến khi chủ tiệm xác nhận thủ công. Ví điện tử và thẻ bổ sung sau, không phải điều kiện để chạy.
- **Allowlist URL chuyển hướng** — mọi URL do cổng thanh toán trả về đều kiểm tra đối chiếu danh sách cho phép trước khi điều hướng, chặn hướng khách sang miền lạ.
- **Không chạm dữ liệu thẻ** — thông tin thẻ thô không đi qua và không lưu ở hệ thống, để phạm vi tuân thủ PCI DSS nằm hết ở phía cổng.
- **Xác nhận đơn không tin tham số URL** — trạng thái thanh toán chỉ đổi khi webhook đã xác thực chữ ký, xem [[concepts/swe/payment-webhook-processing]].
- **Ngân sách thời gian** — mục tiêu dưới 3 phút từ trang chủ đến màn hình xác nhận đơn.

## Key sources

- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/tailor/unified-order-workflow]]
- [[concepts/swe/payment-webhook-processing]]
- [[concepts/swe/authoritative-server-pattern]]

## Mentioned in

## Notes

Gộp từ `checkout-flow` và `payment-gateway-mvp`. Bản cũ mô tả URL giả lập và mã story của giai đoạn MVP — những thứ đã hết giá trị ngay khi tích hợp thật hoàn tất. Phần bền là thứ tự ba bước, nguyên tắc không tin client, và lý do chọn COD-first cho thị trường Việt Nam.
