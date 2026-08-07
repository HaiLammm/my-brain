---
type: concept
title: Tác vụ định kỳ idempotent
slug: idempotent-scheduled-job
date_added: 2026-05-14
confidence: high
tags:
  - background-task
  - idempotency
  - scheduling
id: concepts/swe/idempotent-scheduled-job
created: 2026-05-14
updated: 2026-08-07
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/swe/soft-delete
  - concepts/swe/payment-webhook-processing
---

## Definition

Pattern cho tác vụ nền chạy theo lịch mà việc chạy lặp không được gây tác dụng lần hai. Thay vì dựng một bảng hàng đợi riêng, mỗi bản ghi nghiệp vụ mang một dấu thời gian "đã xử lý"; job chỉ chọn những bản ghi đến hạn **và** chưa có dấu, đóng dấu ngay sau khi hành động thành công. Job khởi động lại, chạy chồng, hay bị gọi tay nhiều lần đều cho cùng một kết quả.

## Variants

- **Timestamp guard trên chính bảng nghiệp vụ** — rẻ nhất khi khối lượng nhỏ: không thêm hạ tầng, trạng thái đã-xử-lý nằm cạnh dữ liệu nó mô tả nên không lệch pha.
- **Cửa sổ quét theo ngày đến hạn** — lọc theo trường hạn thay vì quét toàn bảng; chi phí không tăng theo tổng số bản ghi lịch sử.
- **Reset dấu theo vòng đời** — khi thực thể quay lại trạng thái xuất phát, dấu được xoá để chu kỳ sau chạy lại được. Thiếu bước này, pattern chỉ đúng cho vòng đời một lần.
- **Cửa chạy tay có phân quyền** — một endpoint cho phép vận hành kích hoạt ngay khi cần, dùng chung đúng hàm mà lịch gọi, và được bảo vệ bằng phân quyền vai trò.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/soft-delete]]
- [[concepts/swe/payment-webhook-processing]]

## Mentioned in

## Notes

Chưng cất từ `email-reminder-scheduler` của tailor_project (nhắc trả đồ thuê trước hạn 24 giờ). Bản gốc neo vào tên hàm, endpoint và giờ chạy cụ thể; phần tái dùng được là ba điều kiện làm nên tính idempotent: dấu thời gian trên bản ghi, cửa sổ quét theo hạn, và reset dấu khi vòng đời lặp lại.

Giới hạn cần biết: cách này giả định **một tiến trình chạy job**. Khi mở rộng ra nhiều tiến trình song song, dấu thời gian không còn đủ — cần thêm khoá ở tầng cơ sở dữ liệu để hai worker không cùng chọn một bản ghi.
