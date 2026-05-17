---
id: outputs/cv-luong-hai-lam-tieng-viet
title: "CV Tiếng Việt — Lương Hải Lâm (Hoàn chỉnh)"
type: output
created: 2026-05-18
updated: 2026-05-18
covers:
  - sources/luong-hai-lam-4
  - sources/luong-hai-lam
  - sources/eaera-ho-so-cong-ty
  - sources/huynh-hai-dang-it-ba-qc
  - concepts/jiko-pr
  - concepts/shibodoki
  - concepts/khung-trinh-bay-cv
---

# BACKEND DEVELOPER / Python

**Lương Hải Lâm** | 12/07/2001 | luonghaimal@gmail.com | +84 23 120 701
GitHub: github.com/HaiLammm | Đại học Đông Á — Công nghệ Phần mềm, 08/2022–07/2026 (GPA 3.89/4.0)

---

## Giới thiệu bản thân

Backend Developer với điểm mạnh cốt lõi: **nhìn ra vấn đề thực tế của người dùng và thiết kế kiến trúc backend đúng ngay từ đầu** — trước khi viết dòng code đầu tiên.

Năng lực này hình thành từ thực tế: khi thấy mẹ đang gặp khó khăn trong quản lý nhân sự và kết nối khách hàng tại tiệm may, tôi quyết định vừa học vừa tự xây dựng giải pháp. Không xây theo giả định — tôi trực tiếp quan sát quy trình làm việc, phỏng vấn để hiểu nghiệp vụ, liên tục điều chỉnh theo phản hồi thực tế. Hệ thống hiện được mẹ sử dụng hàng ngày: không còn quên lịch hẹn, giao việc thợ rõ ràng, tính lương cuối tháng minh bạch.

Tôi tiếp tục áp dụng cách tiếp cận này khi xây dựng DaNangNavi — kết nối cộng đồng người Nhật tại Đà Nẵng. Bắt đầu từ quan sát nhu cầu thực tế, không phải từ code.

---

## PR bản thân

**[Điểm mạnh]**
Với tôi, một hệ thống backend tốt không bắt đầu từ tech stack mà bắt đầu từ nghiệp vụ thực tế của khách hàng — công nghệ chỉ là công cụ để hiện thực hóa nghiệp vụ đó. Trước khi viết dòng code đầu tiên, tôi đã hiểu nghiệp vụ đủ sâu để phát hiện rủi ro kiến trúc và xử lý ngay từ bản thiết kế, thay vì đợi hệ thống vận hành rồi mới sửa.

**[Bối cảnh cụ thể]**
Ở `tailor_project`, vì hiểu nghiệp vụ đặt may không cho phép overbooking, tôi chủ động thiết kế Authoritative Server Pattern + `SELECT FOR UPDATE` trước khi hệ thống đi vào vận hành. Ở `DaNangNavi`, vì hiểu user là người Nhật cần tìm kiếm song ngữ JP↔VN, tôi chọn Meilisearch với CJK tokenization và thiết kế circuit breaker cho 8 dịch vụ bên ngoài ngay từ bản vẽ đầu tiên — không phải thêm vào sau khi hệ thống bị quá tải.

**[Kết quả]**
300+ backend tests + 500+ frontend tests, tỷ lệ pass 100%. Cả hai hệ thống đạt production-ready ngay từ lần đầu triển khai, không phát sinh lỗi data consistency trong quá trình vận hành.

**[Cam kết cống hiến]**
Tôi muốn mang tư duy "đi từ nghiệp vụ khách hàng, thiết kế đúng ngay từ đầu" vào việc bảo trì và phát triển CRM tại EAERA — nơi mỗi lỗi kiến trúc có thể ảnh hưởng trực tiếp đến khách hàng tài chính thực tế.

---

## Mong muốn làm việc

EAERA xây dựng CRM và brokerage platform cho tổ chức tài chính — đây là domain đòi hỏi đúng những gì tôi đã làm: multi-tenant data isolation (PostgreSQL RLS), event-driven messaging (Redis Pub/Sub), circuit breaker cho tích hợp dịch vụ bên ngoài. Đây là kiến trúc tôi đã thiết kế và vận hành trong hệ thống thực tế.

Khi đảm nhận vai trò này, tôi sẽ bắt đầu bằng cách hiểu sâu nghiệp vụ CRM và quy trình của khách hàng tài chính trước khi viết dòng code đầu tiên — như cách tôi đã làm với tailor_project và DaNangNavi. Với kinh nghiệm xây hệ thống event-driven, tích hợp đa dịch vụ và phân tầng workload, tôi tin mình có thể đóng góp sớm vào việc bảo trì hệ thống hiện có, đồng thời phát hiện sớm rủi ro kiến trúc trước khi chúng trở thành lỗi production.

Điều tôi muốn đóng góp là một sản phẩm CRM mà khách hàng tài chính thực sự muốn dùng — không phải phần mềm xây theo giả định rồi phải chỉnh lại. Đây chính là cách tôi đã làm với tiệm may của mẹ, với DaNangNavi, và là cách tôi sẽ làm tại EAERA.

---

## Kinh nghiệm làm việc

### 04/2026 – Nay | DaNangNavi (Solo Founder / Founding Engineer) / Đà Nẵng, Việt Nam
**Backend Engineer**

- Thiết kế và xây dựng 13 module FastAPI độc lập với Dependency Injection, Event Bus, Redis Pub/Sub.
- Xây dựng tìm kiếm đa ngôn ngữ JP↔VN bằng Meilisearch 1.16 (CJK tokenization); thiết kế fallback sang PostgreSQL full-text search khi dịch vụ gặp lỗi.
- Tích hợp 8 dịch vụ bên ngoài (Google Translate, DeepL, LINE Login, Google OAuth, DO Spaces, Sentry...) với circuit breaker, ngăn lỗi lan dây chuyền.
- Phân loại workload 3 tầng: sync fast (<500ms), sync slow (<2s), Celery async queue.
- Triển khai PostgreSQL Row-Level Security (RLS) cho multi-tenant data isolation, đảm bảo dữ liệu không rò rỉ giữa các tenant.

### 01/2026 – 04/2026 | tailor_project (Self-initiated Project) / Đà Nẵng, Việt Nam
**Backend Engineer**

- Giải quyết race condition khi đặt hàng đồng thời bằng Authoritative Server Pattern + `SELECT FOR UPDATE`.
- Thiết kế và triển khai multi-tenant data isolation với PostgreSQL Row-Level Security (RLS).
- Xây dựng luồng xác thực đa phương thức: Auth.js v5, Google OAuth, Email/OTP.
- Triển khai idempotent payment webhook và checkout 3 bước (Xem lại → Thông tin giao hàng → Xác nhận).
- Đảm bảo chất lượng với pytest (300+ backend tests) và @testing-library/react (500+ frontend tests), tỷ lệ pass 100%.

---

## Điểm mạnh kỹ thuật

- Thiết kế kiến trúc backend phức tạp: event-driven, multi-tenant RLS, circuit breaker — từ bản vẽ đến production.
- Tự giải quyết bài toán concurrency, tích hợp đa dịch vụ, phân tầng workload — không có mentor.
- Tư duy kiểm thử: 300+ backend + 500+ frontend tests, tỷ lệ pass 100%.
- Thành thạo Python, FastAPI, PostgreSQL, Redis, Docker, Kubernetes trong hệ thống thực tế.
