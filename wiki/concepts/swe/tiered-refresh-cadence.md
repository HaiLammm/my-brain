---
type: concept
title: Nhịp làm mới phân tầng theo độ biến động
slug: tiered-refresh-cadence
date_added: 2026-08-07
confidence: high
tags:
  - frontend
  - performance
  - real-time
id: concepts/swe/tiered-refresh-cadence
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/tanstack-query
  - concepts/tailor/workplace-dashboards
---

## Definition

Thay vì chọn một chu kỳ làm mới cho cả trang, chia màn hình thành các vùng và gán cho mỗi vùng một nhịp khớp với **tốc độ thay đổi thật** của dữ liệu trong đó. Vùng đang chạy cập nhật gần thời gian thực; vùng trạng thái vài chục giây; vùng lịch sử vài phút.

Lý do: chi phí làm mới dồn lên cơ sở dữ liệu tỷ lệ với số vùng nhân tần suất. Một dashboard làm mới toàn bộ mỗi 5 giây tạo tải gấp nhiều lần mức cần thiết, phần lớn để lấy lại những con số không đổi.

## Variants

- **Vùng sống** — nhận tín hiệu đẩy từ máy chủ, kèm một nhịp polling ngắn làm lưới an toàn phòng khi kết nối đẩy rơi mà không báo.
- **Vùng trạng thái** — polling chu kỳ trung bình cho thứ đổi theo phút: tình trạng worker, hàng chờ xử lý.
- **Vùng lịch sử** — polling thưa, và truy vấn nền tựa trên khung nhìn vật chất hoá thay vì tính lại từ bảng gốc mỗi lần.
- **Nhịp khai báo tập trung** — các mức nhịp định nghĩa ở một chỗ và tham chiếu theo tên, không rải số ma thuật trong từng component.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/tanstack-query]]
- [[concepts/tailor/workplace-dashboards]]

## Mentioned in

## Notes

Cách phân tầng đúng là hỏi **người dùng chịu được độ trễ bao nhiêu ở từng vùng**, không phải hỏi dữ liệu đổi nhanh thế nào. Số liệu doanh thu tháng có thể đổi từng giây, nhưng không ai ra quyết định khác đi vì biết sớm hơn hai phút.

Cạm bẫy: khi hai vùng cùng hiển thị một đại lượng ở hai nhịp khác nhau, người dùng sẽ thấy hai con số lệch nhau trên cùng màn hình và mất niềm tin vào cả hai. Hoặc đừng để trùng đại lượng giữa các vùng, hoặc hiển thị mốc thời gian của số liệu ở vùng chậm.
