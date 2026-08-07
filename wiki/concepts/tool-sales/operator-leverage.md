---
type: concept
title: Đòn bẩy điều phối viên
slug: operator-leverage
date_added: 2026-08-07
confidence: high
tags:
  - tool-sales
  - automation
  - operations
id: concepts/tool-sales/operator-leverage
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/tool-sales/sales-form-pipeline
  - concepts/tool-sales/ng-detection
  - concepts/swe/tiered-refresh-cadence
---

## Definition

Mệnh đề định hình mọi quyết định của `tool_sales`: thay 30 nhân sự làm thủ công bằng khoảng 5 điều phối viên vận hành máy, ở mức ~12.000 lượt gửi mỗi ngày. Con số này không phải chỉ tiêu marketing mà là **ràng buộc thiết kế** — nó quyết định cái gì được tự động hoá, cái gì để lại cho người, và giao diện phải trông thế nào.

Hệ quả trực tiếp: hệ thống không tối ưu cho việc làm thay con người ở mọi khâu, mà tối ưu cho việc **một người trông được nhiều việc cùng lúc**.

## Variants

- **Người ở vòng ngoài, không ở vòng trong** — người xử lý ngoại lệ (hàng chờ rà NG, bàn giao CAPTCHA, lead không xác minh được), không tham gia đường chạy chính.
- **Hàng chờ không chặn** — mọi việc cần người xem đều đưa vào hàng chờ chạy song song; không có bước nào đứng đợi người bấm nút mới đi tiếp.
- **Mật độ thông tin cao** — giao diện vận hành thiên về dày đặc và quét nhanh, không thiên về thoáng đãng.
- **Nhịp làm mới theo vùng** để một màn hình theo dõi được nhiều luồng mà không tạo tải vô ích, xem [[concepts/swe/tiered-refresh-cadence]].
- **Không phải SaaS** — một đội, một thị trường, một quy trình. Không đa người thuê, không cổng công khai, không bản di động. Mỗi tính năng bị loại bỏ là một khoản phức tạp không phải trả.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/tool-sales/sales-form-pipeline]]
- [[concepts/tool-sales/ng-detection]]
- [[concepts/swe/tiered-refresh-cadence]]

## Mentioned in

## Notes

Điều đáng giữ lại nhất từ dự án này không phải kiến trúc mà là **việc dám tuyên bố không xây gì**. Danh sách "không đa người thuê, không cổng công khai, không di động, không SaaS" viết ngay ở đầu tài liệu tổng quan, và nó giải thích vì sao một hệ thống xử lý 12.000 lượt mỗi ngày lại vừa với một đội nhỏ: phần lớn độ phức tạp của phần mềm doanh nghiệp đến từ việc phục vụ những người dùng chưa tồn tại.

Chỉ tiêu "điều phối viên làm việc được sau một ngày" là một ràng buộc thiết kế đáng mượn cho dự án khác. Nó buộc mọi màn hình phải tự giải thích, và loại bỏ những tính năng chỉ dùng được sau khi đọc tài liệu.

Cần theo dõi khi mở rộng: đòn bẩy 6:1 giữ được bao lâu khi lượng ngoại lệ tăng theo quy mô? Nếu tỷ lệ lead rơi vào hàng chờ người xem tăng nhanh hơn tổng lượng, số điều phối viên sẽ tăng theo — và lúc đó nút thắt nằm ở tỷ lệ ngoại lệ, không phải ở thông lượng máy.
