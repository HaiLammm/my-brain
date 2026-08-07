---
type: concept
title: Two-Stage Query (Truy vấn Hai Giai đoạn)
slug: two-stage-query
date_added: 2026-05-12
confidence: medium
tags:
  - search-strategy
  - vector-search
  - tailor-project
id: concepts/swe/two-stage-query
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/technical-research-semantic-to-geometric-translation-architecture
related_concepts: []
---

## Definition

Two-Stage Query là chiến lược truy vấn hybrid kết hợp Semantic Recall (tìm kiếm vector nhanh để tìm ứng viên) và Relational Precision (lọc quan hệ chính xác và LLM-based re-ranking) để xử lý các quy tắc may vá phức tạp mà vector filtering đơn thuần không đáp ứng.

## Variants

- **Semantic Recall**: Tìm kiếm vector similarity nhanh để thu hẹp không gian ứng viên
- **Relational Precision**: Lọc quan hệ chính xác và LLM reasoning để xác định vi phạm cụ thể

## Key sources

- [[sources/technical-research-semantic-to-geometric-translation-architecture]]

## Related concepts

- [[concepts/swe/pgvector]]
- [[concepts/tailor/smart-rules]]
- [[concepts/swe/langgraph]]

## Notes