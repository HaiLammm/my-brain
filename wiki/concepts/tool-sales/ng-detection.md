---
type: concept
title: NG Detection — cổng chặn pháp lý
slug: ng-detection
date_added: 2026-08-07
confidence: high
tags:
  - tool-sales
  - compliance
  - japan
id: concepts/tool-sales/ng-detection
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/tool-sales/sales-form-pipeline
  - concepts/swe/audit-trail
  - concepts/swe/unicode-normalization-boundary
---

## Definition

Bộ dò các website Nhật có tuyên bố từ chối chào hàng thương mại — biển "営業お断り", viện dẫn Luật Giao dịch thương mại đặc định. Gửi form tới những nơi này có thể dẫn tới **phạt tiền thật**, nên đây không phải một tính năng mà là **rào chắn pháp lý**: không đường thực thi nào chạm tới bước gửi form mà chưa qua cổng này.

Quyết định định hình toàn bộ thiết kế: bộ dò chạy **hoàn toàn không dùng LLM** — chỉ so khớp từ khoá chính xác, biểu thức chính quy, và bộ lọc dương tính giả.

## Variants

- **Ba tầng so khớp** — tìm từ khoá chính xác (dừng ở lần khớp đầu), quét regex (lấy mọi lần khớp), rồi lọc dương tính giả bằng regex kiểm tra ngữ cảnh xung quanh. Kết quả khử trùng và giới hạn số lượng.
- **Đóng cổng ngay khi khớp** — trạng thái lead chuyển sang "NG" tức thì, để một lần crawl nối lại sau đó không thể chấp nhận lại trang đã bị gắn cờ.
- **Khử trùng khi chạy song song** — chỉ mục duy nhất trên tổ hợp lead, phương pháp khớp và băm của mẫu lẫn đoạn trích, kèm bỏ qua khi trùng, để nhiều worker cùng phát hiện một vi phạm không tạo nhiều bản ghi.
- **Bằng chứng ảnh chụp màn hình** kèm hàng chờ người xem — không chặn đường chạy chính.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/tool-sales/sales-form-pipeline]]
- [[concepts/swe/audit-trail]]
- [[concepts/swe/unicode-normalization-boundary]]

## Mentioned in

- [[outputs/lo-trinh-tu-chu-tool-sales]] — lộ trình đọc hiểu và làm chủ hệ thống tool_sales (11/08/2026)

## Notes

**Vì sao không dùng LLM — đây là bài học chuyển được sang bài toán khác.** Ba lý do, xếp theo sức nặng:

1. **Xác định.** Cùng một trang phải cho cùng một phán quyết, hôm nay và sáu tháng nữa. Một mô hình xác suất không đảm bảo điều đó, kể cả khi nhiệt độ bằng không.
2. **Kiểm toán được.** Khi bị chất vấn, hệ thống phải chỉ ra *đúng mẫu nào* khớp *đúng đoạn văn bản nào*. "Mô hình đánh giá là có rủi ro" không phải câu trả lời trước cơ quan quản lý.
3. **Chi phí và độ trễ.** Cổng chạy trên mọi trang của mọi lead; dưới một phần nghìn giây và không tốn phí API là điều kiện để nó chạy được ở quy mô này.

**Bất đối xứng của sai sót định hình mọi ngưỡng.** Dương tính giả chỉ làm chậm một lead. Âm tính giả có thể dẫn tới tiền phạt. Vì thế chỉ tiêu tối quan trọng là **dưới 1% âm tính giả**, và mọi lựa chọn khi phân vân đều nghiêng về chặn.

**Câu hỏi còn bỏ ngỏ:** đo âm tính giả bằng cách nào, khi theo định nghĩa đó là thứ hệ thống không nhìn thấy? Chỉ số này chỉ có nghĩa nếu có một quy trình lấy mẫu độc lập cho người rà lại các trang đã được cho qua. Nếu quy trình đó chưa tồn tại, con số 1% là một mục tiêu chứ chưa phải một phép đo.
