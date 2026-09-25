---
type: concept
title: Lõi thuần, vỏ chạm I/O
slug: pure-core-gated-io
date_added: 2026-08-07
confidence: high
tags:
  - testing
  - architecture
  - design-pattern
id: concepts/swe/pure-core-gated-io
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/clean-architecture
  - concepts/swe/contract-driven-development
---

## Definition

Tách mỗi thành phần thành hai lớp: một **lõi thuần** chỉ nhận dữ liệu vào và trả dữ liệu ra, không chạm cơ sở dữ liệu, mạng hay trình duyệt; và một **vỏ điều phối** lo việc đọc ghi, gọi trình duyệt, quản lý giao dịch. Toàn bộ logic khó nằm ở lõi và kiểm thử được không cần hạ tầng; vỏ mỏng đến mức đọc là hiểu.

Phép thử: bộ kiểm thử mặc định chạy được trên máy trắng, không Docker, không cơ sở dữ liệu, trong vài giây.

## Variants

- **Lõi trả kế hoạch, vỏ thi hành** — thay vì điền form trực tiếp, lõi dựng ra một "kế hoạch điền" gồm danh sách thao tác; vỏ nhận kế hoạch rồi thi hành. Kế hoạch là dữ liệu nên so sánh được trong kiểm thử.
- **Chính sách thử lại là hàm thuần** — khoảng lùi theo cấp số nhân, số lần tối đa: tất cả tính từ tham số vào, không đọc đồng hồ bên trong.
- **Kiểm thử chạm hạ tầng đặt sau cờ bật** — nhóm test cần cơ sở dữ liệu hay trình duyệt chỉ chạy khi biến môi trường được bật, và không nằm trong đường chạy mặc định.
- **Quyết định thuần, tác dụng phụ ở vỏ** — lớp quyết định "có nên gửi không" tách khỏi lớp "gửi".

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/clean-architecture]]
- [[concepts/swe/contract-driven-development]]

## Mentioned in

- [[outputs/lo-trinh-tu-chu-tool-sales]] — lộ trình đọc hiểu và làm chủ hệ thống tool_sales (11/08/2026)

## Notes

Lợi ích thật không phải là "test nhanh hơn" mà là **test được viết ra**. Khi bộ kiểm thử cần Docker và cơ sở dữ liệu để chạy, các trường hợp biên hiếm gặp sẽ không bao giờ được viết, vì chi phí dựng bối cảnh cho mỗi trường hợp quá cao. Khi lõi là hàm thuần, thêm một trường hợp biên chỉ tốn vài dòng.

Cái giá: nhiều kiểu dữ liệu trung gian hơn, và cám dỗ để logic rò rỉ dần sang vỏ khi gấp. Dấu hiệu cần chỉnh lại là khi lớp vỏ bắt đầu có câu lệnh rẽ nhánh về nghiệp vụ — điều kiện ở vỏ nên chỉ liên quan tới lỗi hạ tầng.

Cạm bẫy đi kèm: khi phần chạm hạ tầng bị đẩy hết ra sau cờ bật, nó dễ trở thành phần **ít được chạy nhất** trong toàn hệ. Cần đảm bảo CI chạy nhóm test đó theo lịch, nếu không cái giá của lõi thuần sẽ là một vùng mù ở đúng chỗ hay hỏng nhất.
