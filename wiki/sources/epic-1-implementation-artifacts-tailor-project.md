---
id: sources/epic-1-implementation-artifacts-tailor-project
title: Epic 1 — Implementation Artifacts (tailor_project)
type: source
created: 2026-05-12
updated: 2026-05-12
authors:
  - tailor_project team
year: 2026
importance: 3
provenance: replayable
confidence: high
source_type: note
tags:
  - tailor-project
  - implementation
  - epic-1
  - authentication
  - multi-tenant
  - customer-management
raw_paths:
  - raw/sources/projects/tailor-project/implementation-artifacts/1-1-thiet-lap-cau-truc-du-an-tu-starter-template.md
  - raw/sources/projects/tailor-project/implementation-artifacts/1-2-thiet-ke-va-khoi-tao-database-multi-tenant.md
  - raw/sources/projects/tailor-project/implementation-artifacts/1-3-dang-nhap-he-thong-da-phuong-thuc.md
  - raw/sources/projects/tailor-project/implementation-artifacts/1-4-dang-ky-tai-khoan-xac-thuc-otp.md
  - raw/sources/projects/tailor-project/implementation-artifacts/1-5-khoi-phuc-mat-khau-otp.md
  - raw/sources/projects/tailor-project/implementation-artifacts/1-6-quan-ly-nhan-su.md
  - raw/sources/projects/tailor-project/implementation-artifacts/1-7-quan-ly-ho-so-so-do-khach-hang.md
ingest_status: finalized
verify_status: findings_pending
findings:
  - {id: 1, reviewer: grounding, class: defer, claim: Story 1.5 tái sử dụng OTP service từ Story 1.4, evidence: "Raw 1.5 không ghi chi tiết triển khai, chỉ có status:done và traceability. Suy luận hợp lý từ tiêu đề và hạ tầng OTP chung.", action: Giữ nguyên — suy luận hợp lý từ ngữ cảnh}
---

## Summary

Đây là bộ 7 artifact triển khai (implementation artifacts) cho **Epic 1 — Foundation & Authentication** của tailor_project, nền tảng may đo bespoke kết hợp AI. Bộ artifact ghi lại toàn bộ quá trình triển khai từ khởi tạo cấu trúc dự án (Story 1.1), thiết kế database multi-tenant (Story 1.2), xây dựng hệ thống đăng nhập đa phương thức (Story 1.3), đăng ký với OTP (Story 1.4), khôi phục mật khẩu (Story 1.5), quản lý nhân sự (Story 1.6), đến quản lý hồ sơ và số đo khách hàng (Story 1.7). Tất cả 7 story đều ở trạng thái `done`, với hàng trăm test backend (156 cumulative tại Story 1.2, 135 tại Story 1.6) và 39 test frontend (12 + 27) đạt 100% pass rate.

## Key Claims

- **Cấu trúc Monorepo-lite** — Frontend (Next.js 16) và Backend (FastAPI) trong cùng repo, độc lập về deployment; Next.js 16 dùng `proxy.ts` thay `middleware.ts` cho auth logic.
- **Multi-tenant bằng PostgreSQL RLS** — Mọi bảng nghiệp vụ chứa `tenant_id`, kích hoạt Row-Level Security (RLS) với 4 policy (SELECT/INSERT/UPDATE/DELETE), đảm bảo thợ tiệm A không xem được dữ liệu tiệm B.
- **Xác thực đa phương thức qua Auth.js v5** — Google OAuth + Email/Password, JWT lưu trong HttpOnly cookie (không localStorage), role tự nhận diện qua OWNER_EMAIL → staff_whitelist → Customer default.
- **OTP 6 chữ số, 10 phút hết hạn** — Dùng cho cả đăng ký tài khoản và khôi phục mật khẩu; mã cũ tự vô hiệu hóa khi gửi lại; mật khẩu hash bằng bcrypt trước khi lưu DB.
- **Quản lý nhân sự qua Staff Whitelist** — Chỉ Owner mới được thêm/xóa email nhân viên vào whitelist; khi nhân viên đăng nhập, `determine_role()` tự cập nhật vai trò từ whitelist.
- **Số đo khách hàng có versioning** — Mỗi khách có nhiều bộ số đo theo thời gian; bộ đầu tiên tự thành mặc định; chỉ 1 bộ mặc định tại một thời điểm; hỗ trợ soft delete (`is_deleted=True`).
- **Local-first ready** — Các bảng nghiệp vụ có trường `version` (integer) và `is_deleted` (boolean) để phục vụ đồng bộ hóa local-first trong tương lai.

## Evidence

- **Story 1.1** (Starter Template): Next.js 16.1.6 + FastAPI 0.133.1, 22 pytest tests pass, `npm run build` pass.
- **Story 1.2** (Multi-tenant): Migration 006 tạo bảng `tenants`, bật RLS trên `customer_profiles` và `measurements`, 14 unit tests + 156 tổng test pass.
- **Story 1.3** (Đăng nhập): 20 backend tests + 12 frontend tests; Auth.js v5 với `CredentialsProvider` gọi `POST /api/v1/auth/login`; review fix: `determine_role()` được gọi trong `/login` endpoint.
- **Story 1.4** (Đăng ký OTP): 70 backend + 27 frontend tests; 3 endpoint `/register`, `/verify-otp`, `/resend-otp`; email SMTP với template Heritage Palette.
- **Story 1.5** (Khôi phục mật khẩu): Hoàn thành nhưng không có Phase 1 story tương ứng; tái sử dụng OTP service từ Story 1.4.
- **Story 1.6** (Quản lý nhân sự): 135 backend tests pass (100%); fix bug `OwnerOnly` dependency double-wrapping; QA review 5/5 rating.
- **Story 1.7** (Hồ sơ & Số đo): 36 backend tests (12 service + 13 measurement + 11 API); 10 API endpoints cho CRUD khách hàng + số đo; migration 005 với triggers auto-update `updated_at`.
- **Database migrations**: 001 → 006 (users, staff_whitelist, user profiles, otp_codes, customer_profiles + measurements, multi-tenant infrastructure).

## Related concepts

- [[concepts/swe/multi-tenant-rls]]
- [[concepts/swe/otp-authentication]]
- [[concepts/swe/auth-js-v5]]
- [[concepts/tailor/measurement-versioning]]
- [[concepts/swe/soft-delete]]
- [[concepts/swe/local-first-data-model]]
- [[concepts/swe/rbac]]
- [[concepts/swe/ssot]]
- [[concepts/swe/audit-trail]]

## Related sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## People

- [[people/co-lan-owner]]
- [[people/linh-customer]]
- [[people/minh-tailor]]

## Open questions

- Story 1.5 (Khôi phục mật khẩu) không có Phase 1 story tương ứng — chi tiết triển khai chưa được ghi lại đầy đủ.
- Story 1.6 (Quản lý nhân sự) còn task chưa hoàn thành: thêm mật khẩu khi tạo tài khoản nhân viên (thủ công hoặc mặc định `Tailor@123`).
- Story 1.7 có 1 review item bị trì hoãn: nút "Xóa khách hàng" trên UI cần tích hợp auth state management.
- Avatar upload cho khách hàng (Story 1.7) hiện dùng local filesystem; chưa tích hợp S3/Cloudinary.
- Google OAuth yêu cầu credentials thực từ Google Cloud Console để test.
