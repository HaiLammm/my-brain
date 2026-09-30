---
type: concept
title: OAuth2 và OpenID Connect (OIDC)
confidence: unverified
id: oauth2-va-oidc
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

OAuth2 là khung ủy quyền cho phép một ứng dụng xin quyền truy cập tài nguyên thay mặt người dùng, còn OpenID Connect (OIDC) là lớp định danh bổ sung bên trên OAuth2 để xác thực người dùng là ai. Ghép lại với nhau, chúng tạo thành nền tảng phổ biến cho đăng nhập liên kết, single sign-on và trao đổi token giữa ứng dụng với nhà cung cấp định danh.

## Variants

- **Authorization Code Flow**: Luồng phổ biến cho web app và ứng dụng cần backend giữ bí mật client.
- **OIDC Login**: Bổ sung ID token để trả về thông tin định danh người dùng.
- **SSO Federation**: Dùng cùng một identity provider để đăng nhập vào nhiều hệ thống liên quan.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Tài liệu tách rất rõ ranh giới: OAuth2 lo việc cấp quyền, OIDC lo việc định danh, và SSO là trải nghiệm người dùng được xây trên cặp cơ chế đó.
