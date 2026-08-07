---
type: concept
title: Hiểu cấu trúc form lạ
slug: form-understanding
date_added: 2026-08-07
confidence: high
tags:
  - tool-sales
  - automation
  - parsing
id: concepts/tool-sales/form-understanding
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/rule-llm-dual-run
  - concepts/swe/budget-tiered-circuit-breaker
  - concepts/tool-sales/sales-form-pipeline
---

## Definition

Bài toán ánh xạ các ô nhập của một form liên hệ do người khác viết — không có tài liệu, không có quy ước chung — sang các trường dữ liệu của mình: tên công ty, người liên hệ, email, nội dung. Đầu ra là một bản đồ trường kèm điểm tin cậy, đủ để bước gửi biết điền gì vào đâu và biết khi nào nên dừng lại.

## Variants

- **Phân tích theo luật trước** — đọc thuộc tính của phần tử nhập và nhãn quanh nó để đoán vai trò; đây là đường chạy mặc định và là đường duy nhất khi ngân sách LLM cạn.
- **Chạy song song với LLM để học**, xem [[concepts/swe/rule-llm-dual-run]] — LLM là người dạy, không phải người làm.
- **Chữ ký form** — băm của tập cặp tên-kiểu đã sắp thứ tự, nên hai form giống nhau về cấu trúc cho cùng một chữ ký bất kể thứ tự khai báo. Đây là khoá để nhận ra "mẫu đã gặp".
- **Điểm tin cậy phân biệt hai nguồn** — mẫu đã biết và mẫu chưa biết nhận thang điểm khác nhau; khi có so sánh với LLM thì điểm tính theo tỷ lệ trường khớp.
- **Nhận diện CAPTCHA** — quét dấu hiệu trong HTML, đánh dấu loại lên bản ghi form để bước gửi biết trước sẽ cần bàn giao cho người hay dịch vụ giải.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/rule-llm-dual-run]]
- [[concepts/swe/budget-tiered-circuit-breaker]]
- [[concepts/tool-sales/sales-form-pipeline]]

## Mentioned in

## Notes

Chữ ký form là chi tiết nhỏ nhưng làm cho cả kiến trúc chạy được: nó biến một tập vô hạn các form lạ thành một tập hữu hạn các **mẫu** đã gặp. Không có nó thì không phân biệt được "trường hợp mới" với "trường hợp cũ", nên tầng giữa của circuit breaker mất ý nghĩa và cơ chế tốt nghiệp cũng không đo được gì.

Giới hạn cần biết: chữ ký dựa trên cấu trúc nên **không phân biệt được hai form có cùng bộ trường nhưng ngữ nghĩa khác nhau** — chẳng hạn cùng ba ô văn bản nhưng một form là liên hệ, một form là đăng ký nhận tin. Ánh xạ đúng cấu trúc mà sai mục đích vẫn dẫn tới gửi nhầm chỗ, và điểm tin cậy sẽ không phản ánh sai lầm này vì nó chỉ đo mức khớp về trường.
