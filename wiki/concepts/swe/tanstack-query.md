---
type: concept
title: TanStack Query
slug: tanstack-query
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - state-management
  - react
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/swe/ssot
  - concepts/tailor/digital-showroom
---

## Definition

TanStack Query (trước đây là React Query) là thư viện quản lý state server-side trong React, dùng trong tailor_project cho client-side data fetching với cache invalidation. Kết hợp với Server Actions (Next.js) làm proxy layer, đảm bảo Authoritative Server Pattern — backend là SSOT, frontend chỉ gửi params và render kết quả.

## Variants

- **SSR + TanStack Query** (Story 2.3) — Server Component fetch data ban đầu, pass vào `initialData` cho TanStack Query; `staleTime: 60000`, `keepPreviousData: true` cho UX mượt.
- **Cache Invalidation** (Story 2.4) — Sau CRUD mutation, gọi `revalidatePath` để đồng bộ cache giữa customer (showroom) và owner (products) views.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]
- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/swe/ssot]]
- [[concepts/tailor/digital-showroom]]

## Notes