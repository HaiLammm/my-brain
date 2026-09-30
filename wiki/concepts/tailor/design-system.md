---
type: concept
title: Hệ thống thiết kế tailor_project
confidence: high
tags:
  - tailor-project
  - design-system
  - ui
id: design-system
created: 2026-05-14
updated: 2026-08-07
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
  - sources/epic-5-implementation-artifacts-tailor-project
related_concepts:
  - concepts/tailor/dual-mode-ui
  - concepts/tailor/digital-showroom
---

## Definition

Hệ thống thiết kế của tailor_project lấy cảm hứng từ áo dài truyền thống Việt Nam, xây trên ba trục: một bảng màu di sản dùng chung, hai mật độ bố cục tách theo vai trò người dùng, và một bộ quy ước thị giác để trạng thái nghiệp vụ đọc được ngay không cần chữ. Nguyên tắc nền là **màu mang nghĩa** — mỗi sắc độ gắn với một trạng thái cụ thể trong vòng đời đơn hàng, nên người dùng học một lần và áp dụng ở mọi màn hình.

## Variants

- **Heritage Palette** — Indigo Depth `#1A2B4C` làm primary, Silk Ivory `#F9F7F2` làm surface, Heritage Gold `#D4AF37` làm accent. Ba màu đủ để dựng toàn bộ giao diện; mọi sắc khác chỉ dùng cho trạng thái.
- **Typography ba tầng** — Cormorant Garamond (serif) cho heading, JetBrains Mono cho giá và số liệu, Inter cho body. Chữ số dùng font đơn cách để cột số thẳng hàng khi quét mắt.
- **Màu theo trạng thái** — Jade Green `#059669` sẵn sàng/hoàn thành, Amber `#D97706` chờ/đang thuê, Ruby Red `#DC2626` hỏng/huỷ/quá hạn, Indigo đang sản xuất. Trạng thái quá hạn thêm hiệu ứng nhấp nháy để tách khỏi "đỏ tĩnh".
- **Mật độ theo chế độ** — Boutique Mode (khách hàng) giãn 16–24px, nền ngà, serif heading. Command Mode (chủ tiệm/thợ may) dồn 8–12px, nền trắng, sans-serif. Xem [[concepts/tailor/dual-mode-ui]] cho cơ chế chọn chế độ theo route group.
- **Đếm ngược deadline** — mã hoá ba mức theo khoảng cách tới hạn: còn trên 7 ngày xanh, 2–7 ngày hổ phách, dưới 2 ngày đỏ. Quá hạn đổi nhãn thành số ngày trễ thay vì số ngày còn lại.
- **Filter chips thay dropdown** — bộ lọc dùng chip bật/tắt thay vì select, cho phép chọn nhiều tiêu chí thấy được cùng lúc, ghép bằng AND, có debounce và lưu trạng thái vào URL để chia sẻ được kết quả lọc.
- **Sidebar theo vai trò** — điều hướng cố định trên desktop, thu gọn thành overlay trên tablet/mobile; số mục menu khác nhau giữa chủ tiệm và thợ may.
- **Touch target tối thiểu 44×44px** — ràng buộc mobile-first áp cho mọi phần tử bấm được.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]
- [[sources/epic-5-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/dual-mode-ui]]
- [[concepts/tailor/digital-showroom]]

## Mentioned in

## Notes

Trang này gộp từ 6 trang rời trước đây (`heritage-palette`, `command-mode-layout`, `status-badge`, `deadline-countdown`, `workplace-sidebar`, `filter-chips`) — mỗi trang khi đó mô tả một component đơn lẻ kèm đường dẫn file và tên component cụ thể, vốn thay đổi theo từng lần refactor. Phần giữ lại ở đây là quyết định thiết kế; chi tiết triển khai tra trong repo tailor_project.
