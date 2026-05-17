---
type: concept
title: Rule Editor
slug: rule-editor
date_added: 2026-05-14
confidence: medium
tags:
  - tailor-project
  - smart-rules
  - knowledge-management
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/smart-rules
  - concepts/rbac
---

## Definition

Rule Editor (Trình chỉnh sửa Quy tắc Thông minh) là giao diện cho phép Owner (Cô Lan) xem và điều chỉnh Smart Rules — Style Pillars (Trụ Cốt Phong Cách) và Ease Delta mappings (bảng độ nhường) — trực tiếp mà không cần hỗ trợ lập trình viên. Giao diện gồm bảng danh sách rule theo pillar, bảng chi tiết delta mappings, và form chỉnh sửa với Pydantic validation.

## Variants

- **Phase 1 Requirements Only** (Story 2.5a) — Chỉ có requirements, chưa triển khai implementation. Được giữ làm placeholder cho Epic sau.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/smart-rules]]
- [[concepts/rbac]]

## Notes

- Story 2.5a chưa có implementation — cần Smart Rules engine (Epic 7-8) hoàn thiện trước.
- RBAC protection: chỉ Owner role được truy cập Rule Editor; Customer và Tailor bị redirect.