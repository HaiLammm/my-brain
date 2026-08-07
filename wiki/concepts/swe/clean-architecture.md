---
type: concept
title: Clean Architecture
slug: clean-architecture
date_added: 2026-05-12
confidence: high
tags:
  - architecture
  - design-pattern
id: concepts/swe/clean-architecture
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/technical-research-semantic-to-geometric-translation-architecture
related_concepts: []
---

## Definition

Clean Architecture là pattern thiết kế phần mềm tách biệt core domain (business logic) khỏi external dependencies (frameworks, databases, UI). Trong kiến trúc dịch ngữ ngữ nghĩa-hình học, core domain là Physical-Emotional Compiler, được tách biệt khỏi orchestration framework (LangGraph) và data storage (pgvector), đảm bảo logic toán học cốt lõi test độc lập.

## Variants

- **Modular Monolith First**: Bắt đầu với kiến trúc đơn khối module, extract microservices khi cần scale
- **Core Domain Separation**: Tách biệt reasoning engine, geometric calculator và data access layers

## Key sources

- [[sources/technical-research-semantic-to-geometric-translation-architecture]]

## Related concepts

- [[concepts/swe/modular-monolith]]
- [[concepts/tailor/physical-emotional-compiler]]

## Notes