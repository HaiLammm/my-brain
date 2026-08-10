---
id: themes/luong-hai-lam/ai-khong-duoc-quyet
title: "AI không được quyết"
type: theme
created: 2026-08-10
updated: 2026-08-10
book: luong-hai-lam
---

## Description

Mô-típ: trong mọi hệ thống Lâm dựng có dính AI, mô hình xác suất chỉ được **tư vấn** — quyền quyết định nằm ở một tầng xác định, kiểm toán được, viết bằng luật.

Ranh giới này không được đặt ra sau khi gặp sự cố. Ở cả hai dự án, nó xuất hiện ngay trong tài liệu kiến trúc, trước khi có dòng mã nào.

Tiêu chí phân chia khá nhất quán: **hậu quả không đảo ngược được thì không giao cho xác suất.** Một cái áo cắt sai vải thì hỏng vải. Một form gửi tới nơi cấm chào hàng thì phạt tiền thật.

## Evidence

- [[chapters/luong-hai-lam/tailor-project]] — báo cáo kiến trúc chốt: AI là **thành phần tư vấn**, tầng điều khiển xác định mới thực thi ràng buộc vật lý và tiêu chuẩn sản xuất trước khi xuất kết quả. Kèm hai cơ chế cụ thể: [[concepts/tailor/deterministic-guardrails]] chặn thiết kế vi phạm vùng an toàn ngay ở lớp dữ liệu — không dựa vào AI; và [[concepts/tailor/pattern-engine]] sinh rập hoàn toàn theo công thức, không suy luận AI.
- [[chapters/luong-hai-lam/tool-sales]] — [[concepts/tool-sales/ng-detection]] chạy **không dùng LLM**, chỉ khớp từ khoá và regex, vì cần xác định, kiểm toán được và chi phí bằng không. Đây là rào chắn pháp lý: không đường thực thi nào chạm tới bước gửi mà chưa qua cổng.

## Biến thể đáng chú ý: LLM làm thầy

[[concepts/swe/rule-llm-dual-run]] đẩy mô-típ đi xa hơn một bước. LLM không bị cấm — nó được dùng để **dạy bộ luật**, chạy song song, và khi luật khớp đủ vài trăm lần liên tiếp thì tắt hẳn LLM cho tác vụ đó.

Nói cách khác: mục tiêu của việc đưa AI vào là **để sau này không cần AI nữa**. Đó là một lập trường hiếm gặp ở thời điểm mọi thứ đều muốn thêm mô hình vào.

## Related themes

- [[themes/luong-hai-lam/quy-mo-mot-minh]] — cùng gốc: cả hai đều là chuyện tự đặt ràng buộc trước khi bắt tay làm

## Notes

**Đây là diễn giải, nhưng ở mức bám nguồn cao.** Khác hai chủ đề kia, mô-típ này không cần suy ra từ hành vi — nó được viết thẳng thành nguyên tắc kiến trúc trong cả hai bộ tài liệu, bằng chính chữ của người viết.

**Phản biện cần giữ.** Hai bằng chứng đều là dự án có rủi ro vật lý hoặc pháp lý rõ ràng (cắt vải hỏng, gửi form bị phạt). Chưa biết Lâm sẽ chọn thế nào khi hậu quả nhẹ và tốc độ mới là thứ quan trọng — chẳng hạn gợi ý nội dung hay xếp hạng tìm kiếm. Mô-típ này có thể chỉ là phản ứng đúng trước rủi ro cao, chứ chưa chắc là một lập trường chung.

**Chỗ để kiểm chứng.** [[chapters/luong-hai-lam/seo-setsubi-pro]] là dự án ít rủi ro nhất trong sách. Nếu ở đó Lâm cũng dựng cổng xác định trước khi để mô hình chạm vào, mô-típ này thành lập trường thật. Wiki hiện chưa có dữ liệu về khâu sản xuất bài SEO để trả lời.
