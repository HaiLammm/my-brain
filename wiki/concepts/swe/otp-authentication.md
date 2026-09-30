---
type: concept
title: OTP Authentication
confidence: high
tags:
  - authentication
  - security
  - email
  - otp
id: otp-authentication
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-1-implementation-artifacts-tailor-project
related_concepts:
  - concepts/swe/auth-js-v5
---

## Definition

OTP Authentication (One-Time Password) là cơ chế xác thực dùng mã 6 chữ số ngẫu nhiên gửi về email, có thời hạn 10 phút, chỉ dùng một lần. Mã được tạo khi đăng ký tài khoản hoặc yêu cầu khôi phục mật khẩu; sau khi nhập đúng, hệ thống kích hoạt tài khoản hoặc cho phép đặt mật khẩu mới.

## Variants

- **Email OTP** — Gửi qua SMTP; dùng cho đăng ký và khôi phục mật khẩu.
- **SMS OTP** — Gửi qua SMS; nhanh hơn email nhưng chi phí cao hơn.
- **TOTP** — Time-based OTP (vd: Google Authenticator); không cần gửi, phù hợp 2FA.

## Key sources

- [[sources/epic-1-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/auth-js-v5]]

## Notes

Trong tailor_project, Email OTP được dùng với các quy tắc: 6 digits, 10 phút hết hạn, one-time use (`is_used=True` sau khi xác thực), invalidate old codes khi resend. Bảng `otp_codes` lưu email, code, expires_at, is_used. Dùng `aiosmtplib` gửi async SMTP với template HTML Heritage Palette.
