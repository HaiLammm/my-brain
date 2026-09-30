---
type: concept
title: Manufacturing Blueprint (Bản Vẽ Sản Xuất)
confidence: medium
tags:
  - manufacturing
  - cnc
  - output-format
id: manufacturing-blueprint
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/technical-research-semantic-to-geometric-translation-architecture
related_concepts: []
---

## Definition

Manufacturing Blueprint là output CNC-ready từ Geometric Transformation Engine — kết quả cuối cùng của pipeline dịch ngữ ngữ nghĩa-hình học. Blueprint kết hợp STEP (ISO 10303) cho manufacturing chuẩn với custom JSON (tương tự GeoJSON) cho inter-agent communication tốc độ cao.

## Variants

- **STEP Format (ISO 10303)**: Chuẩn manufacturing cho CAD/CNC export
- **Custom JSON (GeoJSON-like)**: Format tốc độ cao cho geometric deltas giữa agents

## Key sources

- [[sources/technical-research-semantic-to-geometric-translation-architecture]]

## Related concepts

- [[concepts/tailor/geometric-transformation-engine]]
- [[concepts/tailor/deterministic-guardrails]]

## Notes