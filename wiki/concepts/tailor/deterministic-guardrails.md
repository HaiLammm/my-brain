---
type: concept
title: Rào chắn Xác định (Deterministic Guardrails)
slug: deterministic-guardrails
date_added: 2026-05-12
confidence: medium
tags:
  - ai-bespoke
  - safety
id: concepts/tailor/deterministic-guardrails
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/tailor/physical-emotional-compiler
  - concepts/tailor/geometric-delta
  - concepts/swe/ssot
---

## Definition

Deterministic Guardrails (Rào chắn Xác định) là hệ thống kiểm tra ràng buộc vật lý hoạt động ở lớp dữ liệu, chặn mọi thiết kế vi phạm vùng an toàn vật lý. Khác với AI inference, hệ thống này dựa trên công thức toán học xác định — không có yếu tố ngẫu nhiên. Khi tham số hình học nằm trong ±5% ngưỡng giới hạn vật liệu, hệ thống phát cảnh báo kỹ thuật.

## Variants

- **Golden Rules**: Tập quy tắc di sản (heritage knowledge) được số hóa làm tài sản tham chiếu.
- **Manual Override**: Thợ may có thể ghi đè đề xuất AI dựa trên kinh nghiệm thực tế.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/tailor/physical-emotional-compiler]]
- [[concepts/tailor/geometric-delta]]
- [[concepts/swe/ssot]]

## Notes