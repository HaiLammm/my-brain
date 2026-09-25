---
type: concept
title: Hàng đợi công việc đặt trong cơ sở dữ liệu
slug: db-backed-job-queue
date_added: 2026-08-07
confidence: high
tags:
  - job-queue
  - concurrency
  - postgresql
id: concepts/swe/db-backed-job-queue
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/checkpoint-before-side-effect
  - concepts/swe/shared-db-no-callback
  - concepts/swe/race-condition-prevention
---

## Definition

Dùng chính cơ sở dữ liệu quan hệ làm hàng đợi công việc thay vì thêm một message broker riêng. Nhiều worker cùng đọc một bảng `jobs`, mỗi worker giành lấy một bản ghi bằng khoá hàng bỏ qua hàng đã khoá, rồi ghi kết quả về cùng cơ sở dữ liệu đó. Đổi lại việc mất các tính năng của broker chuyên dụng, ta được **một nguồn sự thật duy nhất**: trạng thái công việc và dữ liệu nghiệp vụ nằm trong cùng một giao dịch, nên không bao giờ lệch pha.

## Variants

- **Claim nguyên tử** — `SELECT … WHERE status='pending' FOR UPDATE SKIP LOCKED LIMIT 1` rồi `UPDATE` sang `in_progress`, cả hai trong **một** giao dịch. `SKIP LOCKED` là mấu chốt: worker thứ hai bỏ qua hàng đang bị khoá thay vì xếp hàng chờ, nên số worker tăng không làm tăng tranh chấp.
- **Heartbeat** — worker đang chạy cập nhật dấu thời gian định kỳ (ví dụ 30 giây) từ một phiên kết nối riêng, để nhịp tim không bị chặn bởi giao dịch dài của công việc chính.
- **Reaper** — một tiến trình độc lập quét job có nhịp tim quá hạn (ví dụ 5 phút) và trả chúng về `pending`; job vượt số lần thử tối đa thì chuyển hẳn sang `failed` thay vì quay vòng mãi.
- **Fencing token** — mọi ghi kết thúc đều kèm điều kiện `WHERE status='in_progress'`. Nếu reaper đã thu hồi và worker khác đã nhận lại, bản ghi không còn ở trạng thái đó nên lượt ghi muộn của worker cũ rơi vào hư không thay vì đè lên kết quả mới.
- **Poison job retirement** — đếm số lần thử trên chính bản ghi; vượt ngưỡng thì rút khỏi vòng quay và đánh dấu để người xem.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/checkpoint-before-side-effect]]
- [[concepts/swe/shared-db-no-callback]]
- [[concepts/swe/race-condition-prevention]]

## Mentioned in

- [[outputs/lo-trinh-tu-chu-tool-sales]] — lộ trình đọc hiểu và làm chủ hệ thống tool_sales (11/08/2026)

## Notes

Bốn cơ chế trên phải đi cùng nhau. Claim nguyên tử mà thiếu heartbeat thì worker chết sẽ giữ job vĩnh viễn. Có heartbeat mà thiếu fencing thì worker "chết giả" (bị treo rồi tỉnh lại) sẽ ghi đè kết quả của worker đã tiếp quản — đây là lỗi khó tái hiện nhất trong nhóm.

**Khi nào không nên dùng:** khi thông lượng vượt vài nghìn job mỗi giây, hoặc khi cần fan-out nhiều consumer cho cùng một sự kiện. Lúc đó chi phí polling và áp lực lên bảng vượt qua lợi ích của một nguồn sự thật duy nhất.
