---
type: concept
title: Tìm lead bằng AI
confidence: medium
tags:
  - tool-sales
  - lead-generation
  - llm
id: ai-prospecting
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/tool-sales/sales-form-pipeline
  - concepts/swe/pure-core-gated-io
---

## Definition

Bước sinh nguồn lead tự động: thay vì chỉ nhận danh sách doanh nghiệp có sẵn, hệ thống tự đi tìm bằng cách gọi một công cụ AI dòng lệnh với mẫu prompt do người vận hành soạn, rồi phân tích kết quả thành các bản ghi doanh nghiệp và nhập vào kho lead.

## Variants

- **Bốn chế độ trên cùng một loại công việc** — tìm mới, thu thập theo trang, làm giàu dữ liệu có sẵn, và chạy thử. Chế độ nằm trong trường dữ liệu của công việc, nên thêm chế độ không phải thêm loại worker.
- **Mẫu prompt là dữ liệu** — lưu trong bảng, người vận hành sửa được, không nằm trong mã.
- **Chế độ chạy thử trước khi chạy thật** — xem trước prompt đã dựng và mẫu kết quả, để bắt lỗi mẫu trước khi tiêu tiền cho cả mẻ.
- **Khử trùng theo tên miền đầy đủ** — chèn kèm bỏ qua khi trùng, nên chạy lại cùng một prompt không sinh bản ghi lặp.
- **Kẹp độ dài và ràng buộc mã quốc gia** — giá trị do mô hình sinh ra bị cắt về giới hạn của cột và kiểm tra theo chuẩn mã quốc gia trước khi ghi.
- **Bộ chạy tiêm được** — bản thật gọi công cụ dòng lệnh, bản giả dùng trong kiểm thử; nhờ đó luồng xử lý test được mà không gọi AI.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/tool-sales/sales-form-pipeline]]
- [[concepts/swe/pure-core-gated-io]]

## Mentioned in

## Notes

Điểm đáng chú ý về mặt kiến trúc: đây là chỗ **duy nhất** trong hệ thống mà đầu ra của mô hình ngôn ngữ được ghi thẳng vào dữ liệu nghiệp vụ. Vì vậy mọi giá trị đều bị kẹp và kiểm tra trước khi ghi — không tin độ dài, không tin định dạng, không tin mã quốc gia. Đây là thái độ đúng với mọi đầu ra sinh tự động: coi như dữ liệu người dùng nhập từ bên ngoài.

Đối chiếu với [[concepts/tool-sales/ng-detection]] cho thấy nguyên tắc phân chia trách nhiệm của cả hệ: **mô hình được dùng ở nơi sai sót chỉ tốn tiền, và bị cấm ở nơi sai sót gây hậu quả pháp lý.** Một lead tìm nhầm chỉ lãng phí một lượt xử lý — và dù sao nó cũng phải đi qua cổng NG trước khi tới bước gửi.

Chưa rõ: chất lượng lead do AI sinh so với danh sách mua sẵn hay tự thu thập, đo bằng tỷ lệ có form liên hệ hợp lệ và tỷ lệ qua được cổng NG. Nếu tỷ lệ bị NG cao bất thường, chi phí thật của kênh này nằm ở lượng crawl lãng phí chứ không phải ở tiền gọi mô hình.
