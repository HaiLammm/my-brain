---
type: concept
title: Thang cứu hộ tín hiệu
confidence: high
tags:
  - verification
  - heuristics
  - automation
id: rescue-ladder
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/graceful-degradation
  - concepts/tool-sales/submission-verification
---

## Definition

Cách kết luận về một sự kiện không quan sát trực tiếp được, bằng cách xếp các tín hiệu gián tiếp theo **độ tin cậy giảm dần** và hỏi lần lượt. Tín hiệu đầu tiên đưa ra được kết luận sẽ thắng; tín hiệu không có mặt thì bỏ phiếu trắng chứ không đoán. Nếu cả thang đi hết mà không tín hiệu nào kết luận, kết quả là "không xác định" — một trạng thái hợp lệ, khác với "thất bại".

Bài toán gốc: sau khi tự động gửi một form trên website người khác, làm sao biết nó đã được nhận? Ta không có quyền truy cập hệ thống của họ.

## Variants

- **Xếp thang theo độ gần với sự thật** — sự thật mạng (mã trạng thái của chính lời gọi) đứng trên; hình thức đứng dưới (form biến mất, ô nhập bị xoá, trạng thái hợp lệ của trường). Suy đoán từ giao diện xếp cuối.
- **Bỏ phiếu trắng, không đoán** — tín hiệu vắng mặt trả về "không biết", không trả về "thất bại". Gộp hai thứ này lại là nguồn lỗi phổ biến nhất.
- **Tách "không kết luận được" khỏi "thất bại"** — hai mã lỗi riêng, vì chỉ một trong hai đáng thử lại.
- **Loại bỏ tín hiệu nhiễu có chủ đích** — một số dấu hiệu tưởng hữu ích lại xuất hiện cả khi thành công lẫn thất bại; loại chúng khỏi thang và ghi rõ lý do, nếu không người sau sẽ thêm lại.
- **Ghi lại đã dùng nấc nào** — kết quả kèm theo thông tin nấc nào kết luận, để đo được nấc nào thực sự gánh việc và nấc nào chưa từng dùng tới.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/graceful-degradation]]
- [[concepts/tool-sales/submission-verification]]

## Mentioned in

- [[outputs/lo-trinh-tu-chu-tool-sales]] — lộ trình đọc hiểu và làm chủ hệ thống tool_sales (11/08/2026)

## Notes

Giá trị của pattern nằm ở chỗ nó biến một câu hỏi nhị phân bất khả thi ("đã gửi được chưa?") thành một chuỗi câu hỏi khả thi kèm mức tin cậy. Cái giá phải trả là **tỷ lệ không xác định không bao giờ về không** — phải có đường xử lý cho phần đó, thường là hàng chờ người xem.

Chỉ tiêu nên theo dõi không phải tỷ lệ thành công mà là **phân bố theo nấc thang**. Nếu phần lớn kết luận đến từ nấc cuối cùng, nghĩa là các tín hiệu mạnh đang không hoạt động và độ chính xác thực tế thấp hơn con số tổng gợi ý.
