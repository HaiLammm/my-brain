---
type: concept
title: Chạy song song luật và LLM để tốt nghiệp khỏi LLM
slug: rule-llm-dual-run
date_added: 2026-08-07
confidence: high
tags:
  - llm
  - cost-control
  - automation
id: concepts/swe/rule-llm-dual-run
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/budget-tiered-circuit-breaker
  - concepts/swe/graceful-degradation
  - concepts/swe/agentic-rag
---

## Definition

Chiến lược đưa LLM vào một tác vụ lặp lại mà mục tiêu cuối là **không cần LLM nữa**. Với mỗi lượt xử lý, chạy cả bộ luật và LLM trên cùng dữ liệu, so sánh hai kết quả: khớp thì tăng bộ đếm tin cậy, lệch thì lấy kết quả LLM cập nhật lại bộ luật và đặt bộ đếm về không. Khi bộ đếm khớp liên tiếp đạt ngưỡng, tắt hẳn LLM cho tác vụ đó.

LLM ở đây đóng vai **người dạy**, không phải người làm. Chi phí cao lúc đầu là học phí, giảm dần về không khi luật đã bắt kịp.

## Variants

- **Chỉ đếm lượt có so sánh thật** — lượt chạy rule-only (do breaker cắt) không được tính vào chuỗi khớp; chúng bỏ phiếu trắng. Không có điều này, một đợt hết ngân sách sẽ đẩy hệ thống tốt nghiệp sớm mà chưa từng được kiểm chứng.
- **Lệch thì luật học, không phải luật thắng** — khi hai bên khác nhau, mặc định tin LLM và ghi đè luật. Đây là chỗ pattern có thể phản tác dụng nếu LLM sai; xem phần Notes.
- **Ngưỡng tốt nghiệp cao** — vài trăm lần khớp liên tiếp. Chi phí của việc tốt nghiệp sớm (im lặng làm sai mãi mãi) lớn hơn nhiều chi phí gọi thêm vài trăm lần.
- **Người vận hành bật lại được** — tắt LLM là quyết định đảo ngược được; bật lại đặt bộ đếm về không.
- **Chữ ký đầu vào** — băm các đặc trưng cấu trúc của dữ liệu vào (đã sắp thứ tự) để nhận ra "mẫu đã gặp"; nhờ đó tầng giữa của breaker biết trường hợp nào là mới.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/budget-tiered-circuit-breaker]]
- [[concepts/swe/graceful-degradation]]
- [[concepts/swe/agentic-rag]]

## Mentioned in

- [[outputs/lo-trinh-tu-chu-tool-sales]] — lộ trình đọc hiểu và làm chủ hệ thống tool_sales (11/08/2026)

## Notes

Điểm yếu nằm ở giả định "LLM đúng khi hai bên lệch nhau". Nếu LLM sai một cách có hệ thống trên một lớp đầu vào nào đó, pattern sẽ **ghi cái sai đó vào luật** rồi tốt nghiệp với nó — và từ đó không còn nguồn nào để phát hiện nữa. Cần một kênh kiểm chứng độc lập với LLM, dù chỉ là lấy mẫu ngẫu nhiên cho người xem, trước khi cho phép tốt nghiệp.

Điều kiện áp dụng: tác vụ phải có **đầu ra kiểm tra được bằng máy** (so khớp cấu trúc, không phải đánh giá chủ quan) và phân bố đầu vào phải tương đối ổn định. Với tác vụ mà đầu vào liên tục xuất hiện dạng mới, chuỗi khớp sẽ không bao giờ đủ dài để tốt nghiệp — và đó là tín hiệu đúng, không phải lỗi.
