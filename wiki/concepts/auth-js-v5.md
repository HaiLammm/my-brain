---
type: concept
title: Auth.js v5
slug: auth-js-v5
date_added: 2026-05-12
confidence: high
tags:
  - authentication
  - nextjs
  - oauth
  - jwt
id: TODO
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-1-implementation-artifacts-tailor-project
related_concepts:
  - concepts/otp-authentication
  - concepts/rbac
---

## Definition

Auth.js v5 (next-auth@5.0.0-beta.30) là thư viện xác thực cho Next.js, hỗ trợ nhiều nhà cung cấp (Google OAuth, Email/Password Credentials), quản lý session bằng JWT lưu trong HttpOnly + Secure + SameSite cookie. Tích hợp chặt chẽ với Next.js 16 qua `proxy.ts` thay vì `middleware.ts` truyền thống.

## Variants

- **Session strategy: JWT** — Stateless, token lưu trong cookie; phù hợp cho API-first backend.
- **Session strategy: Database** — Session lưu trong DB; cho phép thu hồi session tức thời.
- **Multiple providers** — Google OAuth + Credentials; người dùng chọn cách đăng nhập linh hoạt.

## Key sources

- [[sources/epic-1-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/otp-authentication]]
- [[concepts/rbac]]

## Notes

Trong tailor_project, Auth.js v5 dùng JWT strategy với `CredentialsProvider` gọi `POST /api/v1/auth/login` tại FastAPI backend. Role (Owner/Tailor/Customer) được đính kèm vào JWT token và đọc trong session callback. Proxy.ts (`frontend/src/proxy.ts`) xử lý role-based redirect: Owner→/owner, Tailor→/tailor, Customer→/. Version PHẢI pin exact: `"5.0.0-beta.30"`.
