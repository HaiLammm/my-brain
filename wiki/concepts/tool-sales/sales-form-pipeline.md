---
type: concept
title: Đường ống tự động gửi form bán hàng
slug: sales-form-pipeline
date_added: 2026-08-07
confidence: high
tags:
  - tool-sales
  - automation
  - pipeline
id: concepts/tool-sales/sales-form-pipeline
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/tool-sales/ng-detection
  - concepts/tool-sales/form-understanding
  - concepts/tool-sales/submission-verification
  - concepts/swe/db-backed-job-queue
---

## Definition

Chuỗi sáu bước đưa một dòng dữ liệu thô về doanh nghiệp thành một lượt gửi form đã được xác minh: **nhập lead → tìm form liên hệ → cổng NG → hiểu cấu trúc form → gửi → xác minh kết quả**. Mỗi bước là một loại công việc riêng trong hàng đợi, do một loại worker riêng xử lý, và trạng thái chuyển tiếp nằm hết trong cơ sở dữ liệu.

Đặc điểm quan trọng nhất về mặt thiết kế: các bước **không** nối với nhau bằng lời gọi trực tiếp. Mỗi worker chỉ đọc trạng thái đầu vào và ghi trạng thái đầu ra; thứ tự được đảm bảo bởi điều kiện trạng thái chứ không phải bởi luồng điều khiển.

## Variants

- **Nhập lead ba đường** — tệp CSV, Google Sheets, hoặc sinh tự động qua [[concepts/tool-sales/ai-prospecting]].
- **Discovery** — duyệt theo chiều rộng trên website của lead để tìm trang chứa form liên hệ, chấm điểm các bộ chọn ứng viên, có checkpoint để nối lại khi gián đoạn.
- **Cổng NG bắt buộc** — xem [[concepts/tool-sales/ng-detection]]; đây là điểm duy nhất trong đường ống có quyền dừng hẳn một lead.
- **Chiến dịch điều tiết nhịp** — bước gửi bị chặn bởi hạn mức mỗi phút của chiến dịch; worker xin phép trước khi thao tác và nhận lại thời gian chờ nếu bị từ chối.
- **Trạng thái chảy ngược lên giao diện** — điều phối viên theo dõi tiến độ qua kênh đẩy thời gian thực thay vì tự làm mới trang.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/tool-sales/ng-detection]]
- [[concepts/tool-sales/form-understanding]]
- [[concepts/tool-sales/submission-verification]]
- [[concepts/swe/db-backed-job-queue]]

## Mentioned in

## Notes

Điều đáng học ở kiến trúc này là **vị trí đặt cổng chặn**. Cổng NG nằm sau bước tìm form và trước bước hiểu form — tức là sau khi đã tốn công crawl nhưng trước khi tốn bất kỳ chi phí LLM nào và trước mọi hành động không đảo ngược được. Đặt sớm hơn thì chưa có đủ nội dung trang để phán đoán; đặt muộn hơn thì đã tiêu tiền hoặc đã gửi.

Nguyên tắc rút ra cho đường ống bất kỳ: **cổng chặn đặt ở điểm sớm nhất mà thông tin đã đủ**, không phải ở điểm tiện nhất về mặt mã.

Hệ quả của việc nối các bước bằng trạng thái thay vì lời gọi: có thể chạy lại một bước riêng lẻ cho một tập lead mà không đụng các bước khác, và thêm bước mới không phải sửa bước cũ. Cái giá là không có chỗ nào trong mã đọc được toàn cảnh đường ống — thứ tự thật sự chỉ hiện ra khi ghép các điều kiện trạng thái rải rác ở từng worker, nên tài liệu như trang này trở thành nguồn duy nhất mô tả trình tự.
