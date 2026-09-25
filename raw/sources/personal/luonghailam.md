Họ và tên : Lương Hải Lâm
  Ngày sinh : 12/07/2001
  Giới tính: Nam
  Học tập : Đại học Đông Á — Tốt nghiệp [2026]
  Chuyên ngành: Công nghệ thông tin / Công nghệ phần mềm

  ## Kinh nghiệm làm việc

  ### DaNangNavi — Fullstack Developer (Personal Project)
  04/2026 – Hiện tại

  Nền tảng cộng đồng hướng dẫn cuộc sống địa phương cho người Nhật tại Đà Nẵng.
  Mô hình B2B2C: người dùng Nhật, chủ doanh nghiệp Việt Nam, Admin — đa ngôn
  ngữ.

  - Thiết kế kiến trúc Modular Monolith + Event-driven: các module không import
  nhau
    trực tiếp, giao tiếp qua Event Bus + Redis Pub/Sub
  - Xây dựng backend FastAPI (async Python) với 13 module độc lập:
    auth, listing, translation, search, community, media, gamification...
  - Tích hợp Meilisearch cho cross-language search JP↔VN (CJK tokenization)
  - Phân loại workload: sync fast (<500ms), sync slow (<2s), background Celery
  deferred
  - Triển khai 3 route group Next.js: (user) mobile-first SSR, (business)
  dashboard,
    (admin) — cùng codebase, tree-shaking tách biệt
  - Tích hợp 8 dịch vụ ngoài với circuit breaker: Google/DeepL, LINE Login,
    Google OAuth, DO Spaces, Email, Sentry
  - Bao phủ 74 functional requirements và 46 non-functional requirements

  **Tech stack:** Python, FastAPI, Next.js 16, TypeScript, PostgreSQL 16, Redis
  7,
  Meilisearch 1.16, Celery 5.6, Docker, Turborepo monorepo, Linux

  ---

  ### tailor_project — Fullstack Developer (Personal Project)
  01/2026 – 04/2026

  Nền tảng may đo bespoke kết hợp AI chuyên về Áo dài Việt Nam.
  Hệ thống: E-commerce thuê/mua, CRM dashboard đa vai trò, Pattern Generation,
  Booking.

  - Xây dựng REST API với FastAPI phục vụ 3 nhóm người dùng (Owner, Thợ may,
  Khách hàng)
  - Triển khai xác thực đa phương thức: Auth.js v5, Google OAuth, Email/OTP
  - PostgreSQL với Row-Level Security (RLS) — multi-tenant data isolation
  - Order service với Authoritative Server Pattern + `SELECT ... FOR UPDATE`
    ngăn race condition khi đặt hàng đồng thời
  - Appointment service: slot management (max 3/slot), email reminder tự động
    24h trước hạn trả đồ (asyncio background scheduler)
  - Tích hợp Payment Gateway: COD, VNPay, Momo
  - Cart state management: Zustand v5 + localStorage persist (Optimistic UI)
  - Checkout 3 bước: Review → Shipping Info → Confirmation (≤ 3 phút)
  - 300+ pytest backend tests + 500+ frontend tests, 100% pass rate

  **Tech stack:** Python, FastAPI, Next.js 16, TypeScript, PostgreSQL (RLS),
  MongoDB,
  Docker, Kubernetes, Zustand, TanStack Query, React Hook Form, Zod, Linux

  ## Kỹ năng kỹ thuật

  - **Backend**: Python, FastAPI, REST API design, asyncio, Celery
  - **Frontend**: Next.js 16, TypeScript, React, Zustand, TanStack Query
  - **Database**: PostgreSQL, MongoDB, Redis, MySQL
  - **Search**: Meilisearch (cross-language JP↔VN)
  - **Container & Deploy**: Docker, Kubernetes
  - **Architecture**: Modular Monolith, Event-driven, Multi-tenant RLS
  - **Testing**: pytest, @testing-library/react
  - **OS**: Linux

  ## Tiếng Anh
  Giao tiếp cơ bản — đọc technical docs tốt

## Kỹ năng kỹ thuật  
    - Backend: Python trình độ tạm được chưa thực sự hiểu os tốt , FastAPI, REST API design ở mức cơ bản (asyncio, Celery chưa thực sự giỏi)
    - Frontend: Next.js 16, TypeScript, React, Zustand, TanStack Query
    - Database: PostgreSQL, MongoDB, Redis, MySQL
    - Search: Meilisearch (cross-language JP↔VN)
    - Container & Deploy: Docker, Kubernetes
    - Architecture: Modular Monolith, Event-driven, Multi-tenant RLS
    - Testing: pytest, @testing-library/react
    - OS: Linux
