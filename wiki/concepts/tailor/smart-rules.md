---
type: concept
title: Smart Rules (Quy tắc Thông minh)
slug: smart-rules
date_added: 2026-05-12
confidence: medium
tags:
  - rule-engine
  - vector-search
  - tailor-project
id: concepts/tailor/smart-rules
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/technical-research-semantic-to-geometric-translation-architecture
related_concepts: []
---

## Definition

Smart Rules là các quy tắc may vá được lưu trữ dưới dạng vector ngữ nghĩa trong pgvector, cho phép retrieval dựa trên ngữ cảnh thiết kế thay vì hard-coded logic. Khi agent thiết kế đưa ra quyết định, Smart Rules liên quan được tìm kiếm qua vector similarity và áp dụng như ràng buộc.

## Key sources

- [[sources/technical-research-semantic-to-geometric-translation-architecture]]

## Related concepts

- [[concepts/swe/pgvector]]
- [[concepts/swe/two-stage-query]]
- [[concepts/tailor/deterministic-guardrails]]

## Notes