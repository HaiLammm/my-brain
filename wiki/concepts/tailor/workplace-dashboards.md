---
type: concept
title: Bảng điều khiển vận hành theo vai trò
confidence: medium
tags:
  - tailor-project
  - dashboard
  - task-management
id: workplace-dashboards
created: 2026-05-16
updated: 2026-08-07
key_sources:
  - sources/epic-5-implementation-artifacts-tailor-project
related_concepts:
  - concepts/tailor/design-system
  - concepts/tailor/order-status-pipeline
---

## Definition

Bộ bảng điều khiển ở Command Mode được cắt theo **câu hỏi mà từng vai trò cần trả lời trong ngày**, không theo cấu trúc dữ liệu. Chủ tiệm hỏi "hôm nay tiền vào bao nhiêu, đơn nào sắp trễ, ai đang rảnh"; thợ may hỏi "việc nào của tôi, hạn khi nào, tháng này được bao nhiêu". Hai câu hỏi khác nhau dẫn tới hai bố cục khác nhau dù dùng chung nguồn dữ liệu.

## Variants

- **Quick-glance KPI (chủ tiệm)** — doanh thu theo ngày/tuần/tháng kèm mũi tên xu hướng, phân bố đơn theo trạng thái, cảnh báo đơn sắp quá hạn, lịch hẹn trong ngày. Tất cả gói trong một màn hình không cuộn.
- **Bảng điều phối sản xuất (chủ tiệm)** — giao đơn đang sản xuất cho thợ, theo dõi tiến độ toàn xưởng, thống kê task theo trạng thái, gắn deadline và tiền công ngay lúc giao việc.
- **Trạm làm việc của thợ may** — bốn thẻ tóm tắt theo trạng thái, danh sách task kèm đếm ngược hạn, chuyển trạng thái một chạm theo luồng một chiều Được giao → Đang làm → Hoàn thành.
- **Widget thu nhập (thợ may)** — tháng này, tháng trước, tỷ lệ tăng trưởng, kèm biểu đồ so sánh. Đặt ngay dưới danh sách task để nối trực tiếp *việc đã làm* với *tiền nhận được*.

## Key sources

- [[sources/epic-5-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/design-system]]
- [[concepts/tailor/order-status-pipeline]]

## Mentioned in

## Notes

Hai nguyên tắc rút ra, dùng lại được cho dashboard vận hành bất kỳ:

1. **Tổng hợp ở backend, hiển thị ở frontend.** Số liệu gộp theo kỳ được tính sẵn phía server; client không tự cộng để tránh lệch giữa các màn hình.
2. **Mỗi vai trò chỉ thấy phần của mình.** Thợ may thấy thu nhập của chính mình, không thấy doanh thu tiệm — phân quyền nằm ở tầng dữ liệu chứ không phải ở tầng ẩn/hiện giao diện.

Gộp từ 4 trang rời (`kpi-dashboard`, `production-board`, `tailor-workstation`, `tailor-income-tracking`); các endpoint và chu kỳ polling cụ thể đã lược bỏ vì thuộc về repo.
