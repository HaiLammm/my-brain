---
type: concept
title: Gửi form và xác minh kết quả
slug: submission-verification
date_added: 2026-08-07
confidence: high
tags:
  - tool-sales
  - automation
  - verification
id: concepts/tool-sales/submission-verification
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/checkpoint-before-side-effect
  - concepts/swe/rescue-ladder
  - concepts/tool-sales/sales-form-pipeline
---

## Definition

Hai bước cuối của đường ống, gắn liền nhau vì cùng đối mặt một khó khăn: hành động xảy ra trên hệ thống của người khác, nên ta **không có phản hồi đáng tin nào** về việc nó có thành công hay không. Bước gửi lo điền và bấm; bước xác minh lo suy ra kết quả từ những gì quan sát được sau đó.

## Variants

- **Kế hoạch điền tách khỏi việc điền** — lớp thuần dựng danh sách thao tác (gõ vào ô nào, chọn giá trị nào), lớp vỏ thi hành trên trình duyệt. Xem [[concepts/swe/pure-core-gated-io]].
- **So khớp lựa chọn hai tầng** — với ô chọn, thử khớp chính xác trên dạng đã chuẩn hoá trước, không được mới hạ xuống khớp mờ có ngưỡng.
- **Trường bắt buộc không ánh xạ được thì dừng** — báo lỗi rõ ràng thay vì điền bừa; trường tuỳ chọn không ánh xạ được thì bỏ qua.
- **Checkpoint bọc quanh hành động**, xem [[concepts/swe/checkpoint-before-side-effect]].
- **Thang cứu hộ khi xác minh không kết luận được**, xem [[concepts/swe/rescue-ladder]].
- **Thử lại có lùi theo cấp số nhân**, giới hạn bởi số lần tối đa của chiến dịch.
- **CAPTCHA bàn giao** — phát hiện thì chuyển sang hàng chờ giải, không cố vượt.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/checkpoint-before-side-effect]]
- [[concepts/swe/rescue-ladder]]
- [[concepts/tool-sales/sales-form-pipeline]]

## Mentioned in

## Notes

Điểm khó nhất không phải kỹ thuật điền form mà là **định nghĩa thế nào là thành công**. Một form gửi đi có thể: được nhận và xử lý; được nhận rồi rơi vào hộp thư không ai đọc; bị bộ lọc chặn im lặng; trả về trang cảm ơn nhưng không lưu gì cả. Từ phía tự động hoá, cả bốn trường hợp trông giống nhau.

Vì thế chỉ tiêu "≥80% tỷ lệ gửi thành công" đo **thành công kỹ thuật** — form đã được chấp nhận về mặt giao thức — chứ không đo thành công kinh doanh. Trộn hai khái niệm này là cách nhanh nhất để tin rằng chiến dịch đang chạy tốt trong khi không có ai bên kia đọc được gì. Ranh giới đó cần nói rõ với người đọc báo cáo, không chỉ với người viết mã.
