---
type: concept
title: Cross-Language Search
slug: cross-language-search
date_added: 2026-05-12
confidence: high
tags:
  - search
  - multilingual
  - i18n
  - meilisearch
id: concepts/cross-language-search
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/danangnavi-architecture-decision-document
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/three-sided-cultural-bridge
  - concepts/context-aware-voice-translation
---

## Định nghĩa

Cross-language search là khả năng tìm kiếm nội dung bằng ngôn ngữ truy vấn khác với ngôn ngữ nội dung, trả kết quả đa ngôn ngữ được xếp hạng. Ví dụ: người dùng Nhật gõ "美味しいラーメー" (ramen ngon) và nhận kết quả nhà hàng Việt Nam "Phở Hòa" với mô tả tiếng Việt đã được dịch và đánh matching score.

## Biến thể

- **Index-side bilingual** — nội dung được dịch và index song song (cả JP + VN trong Meilisearch), query gốc match trực tiếp
- **Query-side translation** — query được dịch trước rồi tìm trong index mono-language
- **Hybrid** — kết hợp cả hai: Meilisearch chạy query trên cả trường JP và VN, xếp hạng bằng relevance scoring

## Nguồn chính

- [[sources/danangnavi-architecture-decision-document]]

## Khái niệm liên quan

- [[concepts/three-sided-cultural-bridge]]
- [[concepts/context-aware-voice-translation]]

## Được nhắc đến trong

_(Chưa có)_

## Ghi chú

DaNangNavi sử dụng Meilisearch 1.16+ với CJK tokenization cho tiếng Nhật và analysis cho tiếng Việt. Flow: JP Query → Translation Module → Normalized Query → Meilisearch (JP + VN content) → Ranked Results. PostgreSQL full-text search là fallback khi Meilisearch không khả dụng.

## Key sources

- [[sources/luong-hai-lam-4]]
