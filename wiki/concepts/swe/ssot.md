---
type: concept
title: Nguồn Sự thật Duy nhất (SSOT)
confidence: medium
tags:
  - architecture
  - data-design
id: ssot
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/tailor/deterministic-guardrails
  - concepts/tailor/pattern-engine
  - concepts/swe/transition-as-video
  - concepts/ops/chong-thuoc-nhan-hoa
  - concepts/ops/chuan-hoa-bang-tai-lieu
---

## Definition

Single Source of Truth (SSOT — Nguồn Sự thật Duy nhất) là nguyên tắc kiến trúc trong tailor_project: Master Geometry Specification đóng vai trò cầu nối duy nhất cho mọi dữ liệu hình học. Backend là nguồn sự thật duy nhất cho tính toán hình học, logic nghiệp vụ và xác thực dữ liệu; Frontend chỉ xử lý render và tương tác người dùng.

## Variants

- **Master Geometry Specification**: Cấu trúc dữ liệu chứa tọa độ (x,y), metadata vải, Ease Profile và tham chiếu rập chuẩn.
- **Authoritative Server Pattern**: Backend đơn vị quyết định mọi tính toán.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]
- [[sources/ban-do-seo-setsubi-pro-net]] — luật "sửa lỗi ở nguồn sinh bài, không vá từng file markdown"

## Related concepts

- [[concepts/tailor/deterministic-guardrails]]
- [[concepts/tailor/pattern-engine]]
- [[concepts/swe/transition-as-video]]
- [[concepts/swe/sua-tai-nguon-sinh]]
- [[concepts/ops/chong-thuoc-nhan-hoa]] — cùng nguyên tắc ở tầng con người: đừng để sự thật chỉ nằm trong đầu một ai
- [[concepts/ops/chuan-hoa-bang-tai-lieu]] — cách hiện thực nguyên tắc đó bằng tài liệu vận hành

## Notes