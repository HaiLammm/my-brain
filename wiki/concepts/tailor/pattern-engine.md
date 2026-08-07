---
type: concept
title: Công cụ Rập Xác định (Pattern Engine)
slug: pattern-engine
date_added: 2026-05-12
confidence: medium
tags:
  - pattern-generation
  - manufacturing
  - ao-dai
id: concepts/tailor/pattern-engine
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/tailor/geometric-delta
  - concepts/tailor/ao-dai-bespoke
---

## Definition

Pattern Engine (Công cụ Rập Xác định) là module sinh rập cắt may dựa trên công thức xác định (deterministic), không sử dụng AI inference. Từ 10 số đo cơ thể (chiều dài thân, hạ eo, vòng cổ, vòng nách, vòng ngực, vòng eo, vòng hông, dài tay, vòng bắp tay, vòng cổ tay), Engine sinh 3 mảnh rập sản xuất (thân trước, thân sau, tay áo) với sai số hình học < 1mm. Xuất được SVG (tỷ lệ 1:1 in ấn) và G-code (cắt laser).

## Variants

- **SVG Export**: Xuất rập tỷ lệ 1:1 cho in ấn và cắt thủ công.
- **G-code Export**: Xuất cho máy cắt laser với đường cắt kín, thứ tự cắt, tốc độ và công suất.
- **Curve Generation**: Cong nách (1/4 ellipse) và cong đầu tay (1/2 ellipse) xác thực bởi thợ may.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/tailor/geometric-delta]]
- [[concepts/tailor/ao-dai-bespoke]]

## Notes