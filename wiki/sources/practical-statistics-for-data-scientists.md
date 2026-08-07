---
type: source
title: Practical Statistics for Data Scientists
slug: practical-statistics-for-data-scientists
date_added: 2026-05-16
authors:
  - Peter Bruce
  - Andrew Bruce
source_type: book
importance: 4
confidence: unverified
tags:
  - statistics
  - data-science
  - machine-learning
  - eda
  - regression
  - classification
  - clustering
raw_paths:
  - raw/sources/book/Practical Statistics for Data Scientists.pdf
id: sources/practical-statistics-for-data-scientists
created: 2026-05-16
updated: 2026-05-16
year: 2017
provenance: replayable
sources:
  - {provider: pdf, fetched_at: "2026-05-16T14:32:56Z"}
ingest_status: finalized
verify_status: passed
findings: []
---

## Summary

Practical Statistics for Data Scientists là cuốn nhập môn thực hành về thống kê dành cho người làm dữ liệu đã biết lập trình nhưng chưa có nền tảng thống kê vững. Sách chọn lọc các khái niệm thống kê thực sự hữu ích cho data science, đi từ phân tích khám phá dữ liệu, lấy mẫu, kiểm định, hồi quy, phân loại cho đến học không giám sát. Giá trị lớn nhất của cuốn sách nằm ở việc nối tư duy thống kê cổ điển với nhu cầu ra quyết định thực tế, nhấn mạnh khi nào một công cụ nên được dùng và khi nào nên dè dặt với nó.

## Key claims

- Phân tích dữ liệu khám phá (EDA) nên là bước đầu tiên trong mọi dự án dữ liệu, vì việc nhìn dữ liệu trước khi mô hình hóa giúp phát hiện cấu trúc, ngoại lệ và câu hỏi đúng để theo đuổi. (độ tin cậy: cao)
- Trong nhiều bài toán thực tế, các thước đo bền vững như median, trimmed mean, MAD hoặc phân vị thường hữu ích hơn việc chỉ dựa vào mean và standard deviation. (độ tin cậy: cao)
- Lấy mẫu ngẫu nhiên, bootstrap và permutation test vẫn là nền tảng quan trọng ngay cả trong bối cảnh big data, vì chúng giúp định lượng bất định và giảm nguy cơ bị đánh lừa bởi ngẫu nhiên. (độ tin cậy: cao)
- P-value và ý nghĩa thống kê có giá trị như một hàng rào chống diễn giải quá mức, nhưng không nên trở thành căn cứ duy nhất cho quyết định kinh doanh hay khoa học dữ liệu. (độ tin cậy: cao)
- Hồi quy tuyến tính là công cụ quan trọng cho cả giải thích lẫn dự báo, còn hồi quy logistic là một phương pháp phân loại phổ biến nhờ tốc độ tính toán và khả năng diễn giải; cả hai đều đòi hỏi phải để ý đến đa cộng tuyến và biến gây nhiễu. (độ tin cậy: cao)
- Các mô hình cây và ensemble như random forest hay boosting thường cho hiệu năng dự báo cao hơn mô hình đơn, đổi lại là mất bớt tính minh bạch trong diễn giải. (độ tin cậy: cao)
- PCA và các kỹ thuật phân cụm rất hữu ích để giảm chiều dữ liệu, phát hiện cấu trúc tiềm ẩn và tổ chức không gian đặc trưng. (độ tin cậy: cao)

## Evidence

- Sách được chia thành 7 chương lớn bao quát toàn bộ pipeline thực hành: EDA, phân phối và lấy mẫu, thí nghiệm thống kê, hồi quy, phân loại, machine learning thống kê và học không giám sát.
- Các ví dụ xuyên suốt dùng dữ liệu thực tế như dân số và tỷ lệ giết người theo bang, dữ liệu vay Lending Club, dữ liệu giá nhà King County và chuỗi lợi nhuận cổ phiếu.
- Tác giả liên tục so sánh giữa tư duy công thức cổ điển và tư duy resampling, đặc biệt trong bootstrap, permutation test, confidence interval và significance testing.
- Sách thường đi kèm ví dụ và mã R, nhấn mạnh khả năng áp dụng hơn là trình bày lý thuyết thuần túy.
- Sách đặt các ý tưởng trong bối cảnh lịch sử qua những nhân vật như John Tukey, R. A. Fisher, Karl Pearson, Bradley Efron và Leo Breiman để làm rõ tiến hóa của thống kê hiện đại.

## Related concepts

- [[concepts/ml/exploratory-data-analysis]]
- [[concepts/ml/random-sampling]]
- [[concepts/ml/bootstrap]]
- [[concepts/ml/hypothesis-testing]]
- [[concepts/ml/linear-regression]]
- [[concepts/ml/logistic-regression]]
- [[concepts/ml/k-nearest-neighbors]]
- [[concepts/ml/decision-tree-models]]
- [[concepts/ml/random-forest]]
- [[concepts/ml/boosting]]
- [[concepts/ml/principal-components-analysis]]
- [[concepts/ml/k-means-clustering]]
- [[concepts/ml/hierarchical-clustering]]

## Related sources

## People

- [[people/peter-bruce]]
- [[people/andrew-bruce]]

## Open questions

- Những phần nào của cuốn sách đã bị thay đổi đáng kể bởi thực hành data science sau 2017, đặc biệt trong deep learning, causal inference và experimentation at scale?
- Những khái niệm nào trong 50 khái niệm nên được nâng thành foundation page để dùng làm nền cho các nguồn thống kê khác về sau?
- Có nên nạp riêng các tài liệu gốc mà sách dựa vào nhiều nhất, như Tukey-1962, Tukey-1977, Efron về bootstrap hay Breiman về random forest?
- Nếu dùng sách này làm khung học, thứ tự nào là tối ưu cho người đã biết code nhưng thiếu nền tảng xác suất và suy luận thống kê?

## Topics

- [[topics/machine-learning]]

## Notes
