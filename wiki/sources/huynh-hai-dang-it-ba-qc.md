---
type: source
title: Huynh Hai Dang - IT BA/QC
slug: huynh-hai-dang-it-ba-qc
date_added: 2026-05-18
authors:
  - Huynh Hai Dang
source_type: note
importance: 2
confidence: high
tags:
  - cv
  - interview
  - it-qa
  - business-analyst
  - japanese-n2
raw_paths:
  - raw/sources/interview/CV/HaiDang.pdf
provenance: replayable
sources:
  - {provider: pdf, fetched_at: "2026-05-17T18:56:01Z"}
ingest_status: finalized
id: sources/huynh-hai-dang-it-ba-qc
created: 2026-05-18
updated: 2026-05-18
year: 2026
verify_status: findings_pending
findings:
  - {id: 1, reviewer: external, class: patch, claim: RIKKEI 株式会社 (2025.11–nay), evidence: "Web search xác nhận 株式会社リッケイ (RIKKEI) là công ty Nhật Bản, nhưng là subsidiary của Rikkeisoft — một công ty IT nguồn gốc Việt Nam. Entry dùng tên 株式会社 mà không có ngữ cảnh này, có thể gây hiểu nhầm là công ty thuần Nhật.", action: "Cân nhắc thêm ghi chú: RIKKEI 株式会社 là chi nhánh Nhật Bản của Rikkeisoft (công ty IT Việt Nam)"}
  - {id: 2, reviewer: grounding, class: defer, claim: Học vấn đại học (SAIGON TECHNOLOGY University) không được đề cập trong entry, evidence: "Raw CV ghi rõ SAIGON TECHNOLOGY University, Business Administration, 2012.09–2017.10. Wiki entry không đề cập học vấn đại học này.", action: Có thể thêm vào Key claims hoặc để trống nếu wiki tập trung vào kinh nghiệm làm việc}
  - {id: 3, reviewer: grounding, class: defer, claim: Lịch sử làm việc được mô tả là liên tục, evidence: "Raw CV cho thấy khoảng cách ~2 năm giữa Vietcombank (2017.03) và ユーワ (2019.04), được lấp đầy bởi ABK学館 (2017.10–2019.05). Entry mô tả là liên tục nhưng không nhắc đến giai đoạn học tiếng.", action: Cân nhắc thêm ghi chú về giai đoạn học tiếng Nhật khi mô tả lịch sử làm việc}
  - {id: 4, reviewer: blind, class: defer, claim: Kinh nghiệm làm việc tại Nhật Bản tổng cộng ~4 năm, evidence: "Tính chính xác: ユーワ 2019.04–2020.09 (17 tháng) + 光栄機材 2020.11–2024.01 (38 tháng) = ~55 tháng = ~4.6 năm. Ước lượng ~4 năm hơi thấp.", action: Có thể điều chỉnh thành ~4.5 năm hoặc ~5 năm để chính xác hơn}
---

## Summary

CV tiếng Nhật của Huỳnh Hải Đăng (フィン・ハイ・ダン), ứng viên vị trí IT BA/QC, sinh năm 1993, quê Da Nang. Hiện đang làm BA/QC tại RIKKEI 株式会社 từ tháng 11/2025. Con đường sự nghiệp đặc biệt: từ ngân hàng → quản lý sản xuất tại Nhật Bản (~4 năm) → IT QA cho mail system → Business Analyst cho dự án AI/OCR. Tiếng Nhật N2, từng sống và làm việc thực tế tại Nhật.

## Key claims

- Kinh nghiệm IT Tester tại QUALITIA 株式会社 Da Nang (2024.06–2025.11): QA cho hệ thống Mail Server/Mail Platform, bao gồm test case design, regression testing, VMware/Linux environment setup, log analysis (SMTP/IMAP/POP), API testing với Postman
- Hiện là BA/QC tại RIKKEI 株式会社 (2025.11–nay): phụ trách 2 dự án — AI Virtual Reception (voice recognition, NLP) và OCR Barcode Scanning System
- Kinh nghiệm làm việc tại Nhật Bản: 株式会社ユーワ Osaka (2019–2020) và 光栄機材株式会社 Chiba (2020–2024) tổng cộng ~4 năm — quản lý nhà máy, QC, vẽ bản vẽ kỹ thuật, hàn MIG/TIG/Arc, ISO9001
- Tiếng Nhật N2, học tại ABK学館日本語学校 Tokyo (2017–2019); tiếng Anh giao tiếp
- Kỹ năng bug management: MantisBT, Asana; database: SQL, phpMyAdmin; OS: VMware, Linux

## Evidence

- Lịch sử làm việc liên tục: Vietcombank HCM (2016–2017) → ユーワ Osaka (2019–2020) → 光栄機材 Chiba (2020–2024) → QUALITIA Da Nang (2024–2025) → RIKKEI (2025–nay)
- Chi tiết kỹ thuật cụ thể tại QUALITIA: phân tích log SMTP, IMAP, POP, auth log; quản lý tiến độ/rủi ro/vấn đề; lead nhóm nhỏ; đề xuất tự động hóa test
- Hai dự án BA tại RIKKEI: (1) AI virtual reception — viết requirement doc, thiết kế AI conversation flow, UAT; (2) OCR barcode scanning — phân tích yêu cầu, thiết kế OCR processing flow, cải thiện độ chính xác đọc barcode

## Related concepts

- [[concepts/jiko-pr]]
- [[concepts/cv-tot]]
- [[concepts/natural-language-processing]]

## Related sources

- [[sources/luong-hai-lam]]
- [[sources/buoi-huan-luyen-chuyen-sau-ve-viet-cv-tieng-nhat-phan-tich-jiko-pr-shibodoki-va-phan-hoi-chi-tiet]]

## People

- [[people/huynh-hai-dang]]

## Open questions

- Trình độ thực tế tiếng Nhật N2: khả năng đọc spec tiếng Nhật và viết tài liệu thế nào?
- Kinh nghiệm BA tại RIKKEI mới ~6 tháng — chiều sâu về requirement analysis và stakeholder management?
- Kỹ năng test automation cụ thể: đề cập "đề xuất script hóa" nhưng chưa có ngôn ngữ/framework cụ thể
- Mục tiêu sự nghiệp tiếp theo: thiên về QA chuyên sâu hay BA/PM hướng AI?

## Notes
