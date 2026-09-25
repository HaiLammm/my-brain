---
type: concept
title: Answer-first cho AI search (GEO/AIO)
slug: answer-first-cho-ai-search
date_added: 2026-09-25
confidence: unverified
tags:
  - seo
  - geo-aio
  - content-structure
id: concepts/seo/answer-first-cho-ai-search
created: 2026-09-25
updated: 2026-09-25
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
related_concepts:
  - concepts/seo/cau-truc-heading-seo
---

## Definition

Answer-first là cách mở bài trả lời trực tiếp câu hỏi của người đọc trong 1–2 câu đầu, trước mọi đoạn dẫn nhập. Đây là thứ các máy tìm kiếm AI thật sự trích dẫn: một đoạn ngắn, tự đứng được, nằm ngay đầu trang. Cặp đôi của nó là một heading tóm kết ở cuối bài (`## まとめ` trong tiếng Nhật) để đoạn kết luận cũng có thể được trích độc lập. Mở bài kiểu văn kể chuyện đẩy câu trả lời xuống sâu và làm bài mất khả năng được trích.

## Variants

- **Đoạn tóm tắt có id riêng**: đặt một element như `#article-summary` để markup `speakable` có đích thật để trỏ tới — không có nó, `speakable` chỉ resolve được vào `<h1>` và không mang lại giá trị.
- **Block FAQ trong bài**: bổ sung cặp hỏi–đáp ngắn dưới dạng dữ liệu có cấu trúc, để từng câu trả lời là một đơn vị trích dẫn.
- **Hạ tầng xong nhưng thiếu dữ liệu**: schema `FAQPage` có thể đã render và có guard chặn markup rỗng, nhưng nếu chỉ 1 bài có dữ liệu `faq` thì tính năng vẫn bằng không.

## Key sources

- [[sources/ban-do-seo-setsubi-pro-net]] — 0/73 bài có heading tóm kết, `speakable` phát trên toàn bộ bài nhưng chưa có đích tóm tắt để trỏ

## Related concepts

- [[concepts/seo/cau-truc-heading-seo]]

## Mentioned in

## Notes
