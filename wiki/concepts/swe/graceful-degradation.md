---
type: concept
title: Suy giảm mềm thay vì gãy
slug: graceful-degradation
date_added: 2026-08-07
confidence: high
tags:
  - resilience
  - architecture
  - reliability
id: concepts/swe/graceful-degradation
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/budget-tiered-circuit-breaker
  - concepts/swe/rescue-ladder
  - concepts/swe/circuit-breaker
---

## Definition

Nguyên tắc thiết kế: khi một thành phần phụ hỏng hoặc cạn tài nguyên, hệ thống chuyển sang chế độ kém hơn nhưng vẫn chạy, thay vì dừng. Điều kiện để nguyên tắc này không trở thành cái cớ che lỗi là mỗi lần suy giảm phải **để lại dấu vết đo được**.

## Variants

- **Fail-open có giới hạn thời gian** — thao tác có nguy cơ treo (biểu thức chính quy phức tạp, lời gọi mạng) được đặt hạn đồng hồ thực; hết hạn thì bỏ qua phần đó và giữ kết quả đã có. Áp dụng khi mất một phần kết quả tốt hơn treo vô hạn.
- **Thoái lui về đường xác định** — khi thành phần xác suất không dùng được, quay về bộ luật; chất lượng giảm, hành vi vẫn dự đoán được.
- **Bảng điều khiển hỏng thì dùng mặc định an toàn** — không đọc được cấu hình động thì chạy theo giá trị dè dặt nhất, không phải giá trị rộng rãi nhất.
- **Cạn ngân sách thì thu hẹp phạm vi**, xem [[concepts/swe/budget-tiered-circuit-breaker]].
- **Thiếu tín hiệu thì bỏ phiếu trắng**, xem [[concepts/swe/rescue-ladder]].

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/budget-tiered-circuit-breaker]]
- [[concepts/swe/rescue-ladder]]
- [[concepts/swe/circuit-breaker]]

## Mentioned in

## Notes

Ranh giới cần phân biệt: **fail-open** (bỏ qua kiểm tra, cho đi tiếp) và **fail-safe** (chặn lại khi không chắc) là hai lựa chọn ngược nhau, và chọn sai chỗ thì nguy hiểm.

Quy tắc phân định theo hậu quả bất đối xứng: nơi cho nhầm gây thiệt hại không thể thu hồi — vi phạm pháp luật, mất tiền, lộ dữ liệu — phải fail-safe, dù có làm chậm công việc. Nơi chặn nhầm chỉ gây chậm trễ thì fail-open để hệ thống tiếp tục chạy. Trong `tool_sales`, cùng một hệ thống áp dụng cả hai: hết hạn regex thì fail-open giữ kết quả từ khoá đã có, nhưng nghi ngờ site cấm chào hàng thì fail-safe dừng hẳn lead đó.

Rủi ro thường gặp là **suy giảm im lặng**: hệ thống chạy nhiều tuần ở chế độ thoái lui mà không ai biết, vì mọi thứ trông vẫn "xanh". Mỗi lần suy giảm phải tăng một bộ đếm nhìn thấy được, và tỷ lệ thời gian ở chế độ thoái lui phải là một chỉ số được theo dõi, không phải chi tiết ẩn trong log.
