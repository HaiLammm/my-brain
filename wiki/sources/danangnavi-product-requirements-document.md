---
type: source
title: DaNangNavi — Product Requirements Document
authors:
  - DaNangNavi Team
source_type: note
importance: 4
confidence: high
tags:
  - prd
  - product-design
  - da-nang
  - japan-community
  - platform
provenance: replayable
raw_paths:
  - raw/sources/danangnavi/planning-artifacts/prd/index.md
  - raw/sources/danangnavi/planning-artifacts/prd/executive-summary.md
  - raw/sources/danangnavi/planning-artifacts/prd/functional-requirements.md
  - raw/sources/danangnavi/planning-artifacts/prd/non-functional-requirements.md
  - raw/sources/danangnavi/planning-artifacts/prd/project-classification.md
  - raw/sources/danangnavi/planning-artifacts/prd/success-criteria.md
  - raw/sources/danangnavi/planning-artifacts/prd/user-journeys.md
  - raw/sources/danangnavi/planning-artifacts/prd/domain-specific-requirements.md
  - raw/sources/danangnavi/planning-artifacts/prd/innovation-novel-patterns.md
  - raw/sources/danangnavi/planning-artifacts/prd/project-scoping-phased-development.md
  - raw/sources/danangnavi/planning-artifacts/prd/web-application-architecture.md
ingest_status: finalized
id: sources/danangnavi-product-requirements-document
created: 2026-05-12
updated: 2026-05-12
year: 2026
verify_status: passed
---

## Tóm tắt

DaNangNavi là nền tảng cộng đồng hướng dẫn cuộc sống địa phương dành riêng cho cộng đồng người Nhật tại Đà Nẵng, Việt Nam. Nền tảng giải quyết đồng thời hai nhu cầu cốt lõi: thông tin địa phương đáng tin cậy và kết nối cộng đồng, thông qua mô hình senpai (người cư trú lâu năm đáng tin cậy) nơi những người Nhật kinh nghiệm chia sẻ đánh giá và hướng dẫn đã xác minh. Mô hình kinh doanh B2B2C cung cấp miễn phí cho người dùng Nhật và thu tiền qua quảng cáo, lưu lượng và phí dịch vụ từ chủ doanh nghiệp Việt Nam.

## Luận điểm chính

- **Mô hình Senpai tạo niềm tin tức thì**: Người dùng mới thấy ngay đánh giá từ senpai — người Nhật thực sự sống ở Đà Nẵng多年 — thay vì đánh giá ẩn danh hoặc nội dung biên tập một chiều
- **Vòng bay tự củng cố (Flywheel)**: Nhiều senpai chia sẻ → nội dung tốt hơn → thu hút người mới → tạo thêm senpai tương lai — hiệu ứng mạng không thể sao chép bởi đối thủ chỉ dựa vào biên tập
- **Triết lý dữ liệu khép kín**: 100% nội dung được tạo nội bộ, chính sách chỉ chụp ảnh bằng camera (EXIF validation) đảm bảo tính xác thực
- **Cầu nối văn hóa ba bên**: Người dùng Nhật, chủ doanh nghiệp Việt Nam và Admin — mỗi bên hoạt động bằng ngôn ngữ mẹ đẻ với dịch tự động kết nối
- **Gamification xã hội thực**: Hệ thống điểm đóng góp gắn với thẩm quyền xã hội thực tế, không phải vanity metrics
- **Dịch giọng theo ngữ cảnh**: Gói câu phrase được tổ chức theo tình huống kinh doanh (nhà hàng, tiệm, bệnh viện) — không cần gõ, không cần biết ngôn ngữ

## Bằng chứng

- 74 yêu cầu chức năng (FR1–FR74) bao phủ 4 vai trò: Guest, User, BusinessOwner, Admin
- Yêu cầu phi chức năng: FCP < 2s, API < 500ms (p95), 500–1000 người dùng đồng thời, SLA 99.5%
- Mục tiêu kinh doanh Tháng 1: 5.000 lượt truy cập/ngày, 50 doanh nghiệp; Tháng 6: 50.000 lượt, 300 doanh nghiệp
- Mục tiêu giữ chân 7 ngày >30%, tỷ lệ tìm-đến-lưu >15%, >50 senpai hoạt động/tháng
- Bộ công nghệ: Next.js SSR + FastAPI + PostgreSQL + Redis + CDN
- Chiến lược khởi động lạnh: tuyển 10–15 "Founding Senpai", tạo 50–100 danh mục hạt giống, trực tiếp tiếp cận 20–30 doanh nghiệp

## Khái niệm liên quan

- [[concepts/danangnavi/senpai-trust-flywheel]]
- [[concepts/danangnavi/closed-data-philosophy]]
- [[concepts/danangnavi/context-aware-voice-translation]]
- [[concepts/danangnavi/contribution-point-system]]
- [[concepts/danangnavi/three-sided-cultural-bridge]]
- [[concepts/danangnavi/camera-only-verification]]

## Nguồn liên quan

_(Chưa có nguồn khác trong wiki)_

## Mọi người

_(Không có cá nhân có thật được nhắc tên — các nhân vật trong user journey là hư cấu)_

## Câu hỏi mở

- Chất lượng dịch tự động có đạt ngưỡng 80% cho tiếng Nhật không? DeepL vs Google — cái nào phù hợp hơn cho ngữ cảnh nhà hàng/ẩm thực Việt Nam?
- Chiến lược khởi động lạnh (Cold Start) có đủ thu hút 10–15 Founding Senpai trong thực tế không?
- Mô hình doanh thu quảng cáo + phí dịch vụ có bền vững khi thị trường ngách (người Nhật tại Đà Nẵng) còn nhỏ?
- SSR Next.js có đáp ứng được yêu cầu real-time (polling 10–60s) cho community feed và notification khi scale lên 50.000 DAU?
- Cần bao lâu để đạt ngưỡng flywheel (60% nội dung tự tạo) — 3 tháng có thực tế với solo developer?

## Ghi chú

PRD được tổ chức thành 11 tài liệu: executive summary, project classification, success criteria, user journeys, domain-specific requirements, innovation patterns, phased development, web architecture, functional requirements (FR1–FR74), và non-functional requirements. Đây là dự án greenfield với kiến trúc Next.js SSR + FastAPI backend.