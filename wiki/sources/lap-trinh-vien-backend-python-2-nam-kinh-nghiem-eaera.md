---
type: source
title: Lập Trình Viên Backend (Python) - 2+ Năm Kinh Nghiệm - EAERA
slug: lap-trinh-vien-backend-python-2-nam-kinh-nghiem-eaera
date_added: 2026-05-14
authors:
  - EAERA
source_type: note
importance: 2
confidence: unverified
tags:
  - interview
  - jd
  - backend
  - python
  - eaera
raw_paths:
  - raw/sources/interview/jd/cong-ty-EAERA.md
provenance: replayable
created: 2026-05-14
updated: 2026-05-15
year: 2026
ingest_status: finalized
id: sources/lap-trinh-vien-backend-python-2-nam-kinh-nghiem-eaera
verify_status: findings_pending
findings:
  - {id: 1, reviewer: blind, class: patch, claim: "Hệ thống CRM hiện có là sản phẩm chính cần bảo trì và nâng cấp, cho thấy công ty có sản phẩm ổn định dài hạn trong lĩnh vực fintech.", evidence: "Câu này tự suy luận thêm hai ý không thấy được neo ngay trong văn bản: \"sản phẩm chính\" và đặc biệt là \"trong lĩnh vực fintech\". Phần sau là diễn giải vượt quá mệnh đề \"bảo trì và nâng cấp hệ thống CRM hiện có\".", action: "Tách phần mô tả trực tiếp khỏi phần suy luận; giữ lại việc bảo trì/nâng cấp CRM như fact, còn suy luận về độ ổn định dài hạn hoặc lĩnh vực fintech thì bỏ hoặc ghi rõ là suy đoán yếu."}
  - {id: 2, reviewer: blind, class: patch, claim: Yêu cầu thành thạo Python cho backend development cùng kinh nghiệm thực tế với Docker và Kubernetes — đây là yêu cầu cứng (must-have)., evidence: "Mệnh đề \"đây là yêu cầu cứng\" là kết luận phân loại mạnh nhưng không có trích dẫn inline hoặc dấu hiệu quy chiếu trực tiếp trong entry. Với blind review, đây là một bước diễn giải thêm từ JD chứ không phải nguyên văn được gắn nguồn tại chỗ.", action: "Đổi thành mô tả bám sát hơn như \"JD nêu yêu cầu kinh nghiệm với Python, Docker, Kubernetes\" hoặc thêm dấu hiệu quy chiếu rõ ràng thay vì khẳng định \"must-have\"."}
  - {id: 3, reviewer: blind, class: patch, claim: "Messaging protocols (AMQP, Pub/Sub, RPC) và cloud platforms (AWS, Azure, GCP) là điểm cộng, gợi ý kiến trúc phân tán.", evidence: "Vế \"là điểm cộng\" còn bám được vào cách diễn đạt nice-to-have, nhưng \"gợi ý kiến trúc phân tán\" là suy luận kiến trúc không có attribution inline. Đây là diễn giải hợp lý nhưng vẫn là diễn giải.", action: "Giữ phần liệt kê kỹ năng như fact; bỏ hoặc hedge phần \"gợi ý kiến trúc phân tán\" thành \"có thể cho thấy\" nếu thật sự cần nêu suy luận."}
  - {id: 4, reviewer: blind, class: patch, claim: Quyền lợi bao gồm lương tháng 13 bắt buộc và tháng 14–15 theo hiệu suất., evidence: "Đây là claim khá cụ thể về chế độ đãi ngộ nhưng trong entry không có trích dẫn inline hay dấu hiệu quy chiếu nào ngoài khẳng định trực tiếp. Theo rubric, claim quá cụ thể mà thiếu source reference tại chỗ cần bị gắn cờ.", action: "Thêm quy chiếu inline rõ ràng đến JD hoặc làm mềm câu thành \"entry ghi nhận quyền lợi gồm...\" thay vì nêu như fact trần."}
  - {id: 5, reviewer: grounding, class: patch, claim: Quyền lợi bao gồm lương tháng 13 bắt buộc và tháng 14–15 theo hiệu suất., evidence: "Raw chỉ ghi: \"Lương tháng 13 (thưởng cuối năm).\" và \"Tháng 14–15 tùy theo hiệu suất.\" Không có từ ngữ nào xác nhận tháng 13 là \"bắt buộc\".", action: "Bỏ từ \"bắt buộc\" hoặc thay bằng diễn đạt bám sát nguồn như \"có lương tháng 13 (thưởng cuối năm)\"."}
  - {id: 6, reviewer: grounding, class: patch, claim: "Quyền lợi nổi bật: lương tháng 13 bắt buộc, tháng 14–15 theo hiệu suất, đào tạo kỹ thuật hàng tháng, môi trường đa văn hóa quốc tế.", evidence: "Raw xác nhận các ý về tháng 14–15, đào tạo hàng tháng và môi trường đa văn hóa quốc tế, nhưng không xác nhận \"lương tháng 13 bắt buộc\"; raw chỉ nói \"Lương tháng 13 (thưởng cuối năm)\".", action: "Sửa cụm này thành \"lương tháng 13 (thưởng cuối năm)\" hoặc tương đương, bỏ từ \"bắt buộc\"."}
  - {id: 7, reviewer: external, class: defer, claim: Không thể xác minh các claim trong entry bằng 2 web search bắt buộc., evidence: web search unreachable, action: Thử lại với công cụ hoặc tuyến web search khác để chạy 1 truy vấn xác nhận và 1 truy vấn phản biện bắt buộc.}
---

## Summary

Mô tả công việc Lập trình viên Backend (Python) tại công ty EAERA, yêu cầu 2+ năm kinh nghiệm. Vị trí tập trung bảo trì và nâng cấp hệ thống CRM hiện có, phát triển backend bằng Python, thiết kế API và messaging protocols. Môi trường kỹ thuật sử dụng Docker, Kubernetes, cơ sở dữ liệu đa dạng (MySQL, PostgreSQL, MongoDB), chạy trên Linux. Quyền lợi bao gồm lương tháng 13 bắt buộc và tháng 14–15 theo hiệu suất.

## Key claims

- Yêu cầu thành thạo Python cho backend development cùng kinh nghiệm thực tế với Docker và Kubernetes — đây là yêu cầu cứng (must-have) (độ tin cậy: cao)
- Hệ thống CRM hiện có là sản phẩm chính cần bảo trì và nâng cấp, cho thấy công ty có sản phẩm ổn định dài hạn trong lĩnh vực fintech (độ tin cậy: trung bình — suy luận từ mô tả)
- Yêu cầu quen thuộc nhiều ngôn ngữ lập trình khác (JavaScript, Ruby, Java, C#) gợi ý môi trường đa công nghệ và cần khả năng thích ứng nhanh (độ tin cậy: cao — nêu rõ trong nice-to-have)
- Messaging protocols (AMQP, Pub/Sub, RPC) và cloud platforms (AWS, Azure, GCP) là điểm cộng, gợi ý kiến trúc phân tán (độ tin cậy: cao — nice-to-have)
- Quyền lợi nổi bật: lương tháng 13 bắt buộc, tháng 14–15 theo hiệu suất, đào tạo kỹ thuật hàng tháng, môi trường đa văn hóa quốc tế (độ tin cậy: cao — nêu trong JD)

## Related concepts

- [[concepts/lap-trinh-backend-python]]
- [[concepts/he-thong-crm]]
- [[concepts/docker-va-kubernetes]]
- [[concepts/giao-thuc-nhan-tin]]
- [[concepts/event-driven-internal-communication]]

## Related sources


## People

## Open questions

- Hệ thống CRM hiện tại được xây dựng bằng Python framework nào?
- Mức lương cụ thể cho vị trí này là bao nhiêu?
- EAERA hoạt động trong lĩnh vực fintech — quy mô đội ngũ backend hiện tại như thế nào?
