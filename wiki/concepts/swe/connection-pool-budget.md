---
type: concept
title: Ngân sách kết nối chia theo dịch vụ
confidence: high
tags:
  - database
  - operations
  - capacity-planning
id: connection-pool-budget
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/shared-db-no-callback
  - concepts/swe/db-backed-job-queue
---

## Definition

Khi nhiều dịch vụ cùng nối tới một cơ sở dữ liệu, tổng số kết nối tối đa phải được phân bổ tường minh cho từng dịch vụ sao cho **tổng nằm dưới trần của máy chủ**, thay vì để mỗi dịch vụ tự đặt kích thước pool theo nhu cầu riêng. Không làm việc này thì lỗi xuất hiện dưới dạng khó chẩn đoán nhất: dịch vụ nào cũng cấu hình "hợp lý", nhưng thêm một bản sao là cả hệ thống hết kết nối cùng lúc.

## Variants

- **Bảng phân bổ tường minh** — ghi rõ mỗi loại dịch vụ bao nhiêu, nhân với số bản sao, cộng lại và so với trần. Bảng này thuộc tài liệu vận hành, không phải giá trị rải trong mã.
- **Chừa biên an toàn** — không phân bổ hết trần; để lại phần cho kết nối quản trị, công cụ migration và phiên gỡ lỗi. Hết kết nối đúng lúc cần vào sửa là tình huống tệ nhất.
- **Pool nhỏ cho tiến trình phụ** — tiến trình dọn dẹp chạy nền chỉ cần vài kết nối; cấp bằng dịch vụ chính là lãng phí.
- **Phiên riêng cho nhịp tim** — tín hiệu sống phải đi qua kết nối riêng, không dùng chung với giao dịch dài của công việc chính, nếu không nhịp tim sẽ tắt đúng lúc công việc chạy lâu nhất.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/shared-db-no-callback]]
- [[concepts/swe/db-backed-job-queue]]

## Mentioned in

## Notes

Điểm dễ quên: ngân sách phải tính theo **số bản sao khi mở rộng**, không theo số dịch vụ. Một cấu hình vừa khít ở một bản sao mỗi loại sẽ vỡ ngay lần đầu nhân đôi worker để chạy kịp tải — đúng lúc hệ thống đang bận nhất và ít ai muốn gỡ lỗi kết nối.

Cách phòng rẻ tiền: đưa phép tính tổng vào một kiểm thử hoặc bước CI đọc cấu hình triển khai và so với trần đã khai. Sai lệch được phát hiện lúc sửa cấu hình, không phải lúc chạy.
