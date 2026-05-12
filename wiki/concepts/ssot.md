---
type: concept
title: Nguồn Sự thật Duy nhất (SSOT)
slug: ssot
date_added: 2026-05-12
confidence: medium
tags:
  - architecture
  - data-design
id: concepts/ssot
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/deterministic-guardrails
  - concepts/pattern-engine
  - concepts/transition-as-video
---

## Definition

Single Source of Truth (SSOT — Nguồn Sự thật Duy nhất) là nguyên tắc kiến trúc trong tailor_project: Master Geometry Specification đóng vai trò cầu nối duy nhất cho mọi dữ liệu hình học. Backend là nguồn sự thật duy nhất cho tính toán hình học, logic nghiệp vụ và xác thực dữ liệu; Frontend chỉ xử lý render và tương tác người dùng.

## Variants

- **Master Geometry Specification**: Cấu trúc dữ liệu chứa tọa độ (x,y), metadata vải, Ease Profile và tham chiếu rập chuẩn.
- **Authoritative Server Pattern**: Backend đơn vị quyết định mọi tính toán.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/deterministic-guardrails]]
- [[concepts/pattern-engine]]
- [[concepts/transition-as-video]]

## Notes