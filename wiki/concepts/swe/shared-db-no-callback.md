---
type: concept
title: Chia sẻ cơ sở dữ liệu thay vì gọi lại qua API
confidence: high
tags:
  - architecture
  - integration
  - design-decision
id: shared-db-no-callback
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/db-backed-job-queue
  - concepts/swe/modular-monolith
  - concepts/swe/event-driven-internal-communication
---

## Definition

Quyết định kiến trúc cho hệ có tiến trình nền: worker không gọi ngược về API của backend để báo kết quả, mà ghi thẳng vào cơ sở dữ liệu dùng chung. Backend quan sát trạng thái bằng cách đọc cơ sở dữ liệu, rồi đẩy thay đổi lên giao diện.

Đây là lựa chọn **đi ngược khuyến nghị phổ biến** về việc mỗi dịch vụ sở hữu dữ liệu riêng, nên chỉ đúng trong một vùng điều kiện hẹp — và phải nêu rõ vùng đó.

## Variants

- **Ranh giới bằng quy ước, không bằng mạng** — worker không được import package của backend; lược đồ bảng được khai lại phía worker để hai bên độc lập khi triển khai, dù dùng chung một cơ sở dữ liệu.
- **Một chiều đọc, một chiều đẩy** — worker chỉ ghi; backend chỉ đọc rồi đẩy lên giao diện qua kênh thời gian thực. Không có luồng ngược lại.
- **Ngân sách kết nối chia theo dịch vụ**, xem [[concepts/swe/connection-pool-budget]].

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/db-backed-job-queue]]
- [[concepts/swe/modular-monolith]]
- [[concepts/swe/event-driven-internal-communication]]

## Mentioned in

## Notes

**Đổi cái gì lấy cái gì.** Được: không còn bài toán idempotency ở biên mạng (một giao dịch cơ sở dữ liệu thay cho một lời gọi có thể lặp), bớt hẳn một bề mặt API phải xây và bảo trì, trạng thái công việc luôn nhất quán với dữ liệu nghiệp vụ. Mất: lược đồ bảng trở thành hợp đồng dùng chung mà không có kiểu dữ liệu nào cưỡng chế, nên một lần migration thiếu phối hợp sẽ làm hỏng phía kia lúc chạy chứ không phải lúc biên dịch.

**Điều kiện áp dụng:** cùng một đội sở hữu cả hai phía, triển khai cùng nhịp, và số lượng bảng dùng chung nhỏ đủ để giữ trong đầu. Mất bất kỳ điều kiện nào — đội khác nhau, chu kỳ phát hành khác nhau, lược đồ phình to — thì cái giá vượt lợi ích, và lớp API vốn bị coi là thừa sẽ trở thành thứ đáng có.

Biện pháp giảm rủi ro đáng làm ngay từ đầu: kiểm thử hợp đồng đối chiếu khai báo bảng hai phía, chạy trong CI. Đây là thứ thay thế cho kiểu dữ liệu mà lời gọi API vốn cho không.
