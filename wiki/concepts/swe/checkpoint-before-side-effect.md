---
type: concept
title: Ghi checkpoint trước hành động phụ
slug: checkpoint-before-side-effect
date_added: 2026-08-07
confidence: high
tags:
  - idempotency
  - crash-safety
  - job-queue
id: concepts/swe/checkpoint-before-side-effect
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/db-backed-job-queue
  - concepts/swe/idempotent-scheduled-job
  - concepts/swe/audit-trail
---

## Definition

Trước khi thực hiện một hành động không thể hoàn tác — gửi form, gọi thanh toán, phát email — hãy ghi lại **ý định** vào bộ nhớ bền, rồi mới hành động, rồi ghi lại **kết quả**. Lần chạy lại sau sự cố đọc checkpoint để biết mình đã đi tới đâu.

Trực giác thông thường là ghi log sau khi làm xong. Nhưng chính khoảng giữa "đã làm" và "đã ghi" mới là chỗ hệ thống sập, và khi đó bản ghi không tồn tại — lần chạy lại sẽ làm lại lần hai.

## Variants

- **Checkpoint sandwich** — ghi `{phase: "đang gửi"}` trước, thực hiện, rồi ghi `{phase: "đã gửi"}`. Trạng thái giữa chừng là dấu hiệu rõ ràng rằng lần trước đã chạm tới hành động phụ.
- **Kiểm tra sớm khi khởi động lại** — việc đầu tiên của mỗi lần chạy là đọc checkpoint; thấy đã tới pha có hành động phụ thì thoát ngay và đánh dấu "có thể trùng" để người xem, thay vì âm thầm gửi lại.
- **Checkpoint là dữ liệu, không phải log** — lưu trong cột có cấu trúc của bảng công việc, đọc lại được bằng truy vấn; log dạng văn bản không dùng cho mục đích này.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/db-backed-job-queue]]
- [[concepts/swe/idempotent-scheduled-job]]
- [[concepts/swe/audit-trail]]

## Mentioned in

- [[outputs/lo-trinh-tu-chu-tool-sales]] — lộ trình đọc hiểu và làm chủ hệ thống tool_sales (11/08/2026)

## Notes

Pattern này **không** cho bạn tính idempotent thật sự — nó chuyển bài toán từ "có thể lặp âm thầm" sang "có thể phát hiện được nghi ngờ lặp". Trạng thái `đang gửi` là mơ hồ theo đúng nghĩa đen: hành động có thể đã tới đích hoặc chưa, và không cách nào biết từ phía mình.

Vì vậy phải quyết định trước cho từng loại hành động: nghiêng về **gửi lại** (chấp nhận trùng) hay nghiêng về **bỏ qua** (chấp nhận sót). Với việc gửi form chào hàng, gửi trùng gây phiền và có thể vi phạm quy định, nên chọn bỏ qua và đưa vào hàng chờ người xem. Với việc ghi nhận thanh toán, chọn ngược lại. Lựa chọn này phải nêu rõ trong mã, không để mặc định ngầm.
