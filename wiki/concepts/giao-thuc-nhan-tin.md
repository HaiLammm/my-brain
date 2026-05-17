---
type: concept
title: Giao thức nhắn tin
slug: giao-thuc-nhan-tin
date_added: 2026-05-14
confidence: unverified
tags:
  - messaging
  - amqp
  - rpc
  - pub-sub
  - interview
id: concepts/giao-thuc-nhan-tin
created: 2026-05-14
updated: 2026-05-15
key_sources:
  - sources/lap-trinh-vien-backend-python-2-nam-kinh-nghiem-eaera
  - sources/eaera-ho-so-cong-ty
related_concepts:
  - concepts/event-driven-internal-communication
  - concepts/he-thong-crm
---

## Definition

Giao thức nhắn tin (messaging protocols) là các chuẩn giao tiếp giữa các thành phần hệ thống phân tán. Ba giao thức chính được nhắc đến trong JD của EAERA là AMQP (Advanced Message Queuing Protocol), Pub/Sub (Publish/Subscribe) và RPC (Remote Procedure Call). Đây là nice-to-have cho vị trí, gợi ý kiến trúc hệ thống theo hướng event-driven.

## Variants

- **AMQP**: Giao thức hàng đợi tin nhắn mở, phổ biến với RabbitMQ.
- **Pub/Sub**: Mô hình phát hành/đăng ký nơi nhà xuất bản gửi tin nhắn đến nhiều người đăng ký.
- **RPC**: Gọi thủ tục từ xa, cho phép dịch vụ gọi hàm trên dịch vụ khác như gọi cục bộ.

## Key sources

- [[sources/lap-trinh-vien-backend-python-2-nam-kinh-nghiem-eaera]]
- [[sources/eaera-ho-so-cong-ty]]

## Related concepts

- [[concepts/event-driven-internal-communication]]
- [[concepts/he-thong-crm]]

## Mentioned in

## Notes
