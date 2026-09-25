---
type: concept
title: Circuit breaker phân tầng theo ngân sách
slug: budget-tiered-circuit-breaker
date_added: 2026-08-07
confidence: high
tags:
  - resilience
  - cost-control
  - llm
id: concepts/swe/budget-tiered-circuit-breaker
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/circuit-breaker
  - concepts/swe/graceful-degradation
  - concepts/swe/rule-llm-dual-run
---

## Definition

Biến thể của circuit breaker mà tín hiệu kích hoạt không phải tỷ lệ lỗi mà là **tỷ lệ ngân sách đã tiêu**, và trạng thái không phải đóng/mở nhị phân mà là nhiều tầng thu hẹp dần. Khi chi phí tiến gần trần, hệ thống lần lượt cắt bớt những trường hợp ít cần nhất thay vì tắt hẳn dịch vụ.

Áp dụng điển hình là lời gọi mô hình ngôn ngữ, nơi mỗi lệnh gọi tốn tiền thật và trần chi tiêu là ràng buộc cứng.

## Variants

- **Ba tầng theo tỷ lệ chi tiêu** — dưới 70% ngân sách ngày: gọi cho mọi trường hợp; 70–90%: chỉ gọi cho trường hợp chưa từng gặp; trên 90%: dừng gọi, chạy hoàn toàn bằng luật.
- **Ngân sách theo múi giờ vận hành** — mốc reset đặt theo múi giờ nơi hệ thống phục vụ, không theo UTC, để một ngày làm việc không bị cắt đôi giữa chừng.
- **Ngân sách bằng không là tầng thấp nhất** — cấu hình thiếu hay bằng 0 thì rơi thẳng vào chế độ an toàn nhất, không phải chế độ "không giới hạn".
- **Không bao giờ ném lỗi** — vượt ngân sách làm giảm chất lượng, không tạo lỗi. Lời gọi mất đi phải có đường thoái lui, nếu không thì đây chỉ là hard-stop mang tên khác.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/circuit-breaker]]
- [[concepts/swe/graceful-degradation]]
- [[concepts/swe/rule-llm-dual-run]]

## Mentioned in

- [[outputs/lo-trinh-tu-chu-tool-sales]] — lộ trình đọc hiểu và làm chủ hệ thống tool_sales (11/08/2026)

## Notes

Điều kiện để pattern này hoạt động: **phải có đường thoái lui đủ tốt**. Nếu chế độ rule-only cho kết quả không dùng được thì tầng 3 không phải suy giảm mà là ngừng dịch vụ, và lúc đó nên báo lỗi to thay vì âm thầm trả kết quả kém.

Hệ quả cần lường: chất lượng đầu ra thay đổi theo thời điểm trong ngày. Cùng một dữ liệu vào, xử lý buổi sáng và buổi tối có thể ra kết quả khác nhau. Điều này phải hiện lên trong bản ghi của từng lượt xử lý, nếu không sẽ có người mất hàng giờ tìm nguyên nhân một khác biệt vốn là do thiết kế.
