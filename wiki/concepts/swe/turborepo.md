---
type: concept
title: Turborepo
slug: turborepo
date_added: 2026-05-14
confidence: high
tags: []
id: concepts/swe/turborepo
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/ho-so-luong-hai-lam
related_concepts:
  - concepts/swe/docker-va-kubernetes
  - concepts/swe/lap-trinh-giao-dien-web
---

## Definition

Turborepo là high-performance build system dành cho JavaScript/TypeScript monorepo, do Vercel phát triển. Sử dụng caching thông minh (local và remote) và task graph để chỉ build lại những package thực sự thay đổi. Trong một monorepo chứa nhiều app và package, Turborepo giúp `build`, `test`, `lint` chạy song song và bỏ qua kết quả đã cache — giảm đáng kể thời gian CI.

## Variants

- **Remote caching** — chia sẻ build cache giữa các máy CI/CD và developer
- **Task pipeline** — khai báo phụ thuộc giữa các task (`build` phải chạy trước `test`)
- **Affected packages** — chỉ chạy task cho package bị ảnh hưởng bởi thay đổi

## Key sources

- [[sources/ho-so-luong-hai-lam]]

## Related concepts

- [[concepts/swe/docker-va-kubernetes]]
- [[concepts/swe/lap-trinh-giao-dien-web]]

## Mentioned in

## Notes
