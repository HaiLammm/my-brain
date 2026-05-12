---
type: concept
title: pgvector
slug: pgvector
date_added: 2026-05-12
confidence: high
tags:
  - database
  - vector-search
  - postgresql
id: concepts/pgvector
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/technical-research-semantic-to-geometric-translation-architecture
related_concepts: []
---

## Definition

pgvector là mở rộng PostgreSQL cho tìm kiếm vector similarity, cho phép lưu trữ embeddings trực tiếp cùng dữ liệu quan hệ. Cho phép truy vấn hybrid kết hợp tìm kiếm ngữ nghĩa (semantic recall) và lọc quan hệ chính xác (relational precision).

## Variants

- **Hybrid Search**: Kết hợp vector similarity search với relational filtering
- **Two-Stage Query**: Semantic Recall → Relational Precision để xử lý quy tắc phức tạp

## Key sources

- [[sources/technical-research-semantic-to-geometric-translation-architecture]]

## Related concepts

- [[concepts/two-stage-query]]
- [[concepts/smart-rules]]
- [[concepts/design-atoms]]

## Notes