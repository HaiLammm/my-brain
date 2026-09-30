---
id: sources/lap-trinh-vien-python-mid-level-2-3-nam-kinh-nghiem-thai-binh
title: Lập Trình Viên Python Mid-Level (2-3 Năm Kinh Nghiệm) - Thái Bình
type: source
created: 2026-05-14
updated: 2026-05-14
authors:
  - CÔNG TY TNHH THƯƠNG MẠI CÔNG NGHỆ THÁI BÌNH
year: 2026
importance: 2
provenance: replayable
confidence: unverified
source_type: note
tags:
  - interview
  - jd
  - python
  - erp
  - mid-level
raw_paths:
  - raw/sources/interview/jd/middle-python.md
ingest_status: finalized
verify_status: findings_pending
findings:
  - {id: 1, reviewer: blind, class: patch, claim: "Đây là JD cho vị trí Lập trình viên Python mid-level tại Công ty TNHH Thương mại Công nghệ Thái Bình, làm việc tại văn phòng DHL - VNPT ở TP. Hồ Chí Minh.", evidence: "Phần Evidence không trích dẫn trực tiếp tên công ty, địa điểm làm việc, hoặc cụm \"văn phòng DHL - VNPT\". Đây là thông tin rất cụ thể nhưng không có dẫn chiếu nội tuyến trong entry.", action: "Thêm trích dẫn nguyên văn từ JD cho tên công ty và địa điểm, hoặc giảm độ chắc chắn của câu nếu entry không có câu chữ nguồn tương ứng."}
  - {id: 2, reviewer: blind, class: patch, claim: "Vai trò tập trung phát triển và tuỳ chỉnh các module cho giải pháp ERP về quản trị nguồn nhân lực và chuỗi cung ứng, đồng thời xử lý tích hợp bên thứ ba, review code và gỡ lỗi.", evidence: "Evidence có hỗ trợ cho phát triển module, tuỳ chỉnh hệ thống và tích hợp bên thứ ba, nhưng không trích rõ phần \"review code\". Câu Summary gộp nhiều trách nhiệm thành một mệnh đề khẳng định mà không tách phần nào là trích trực tiếp, phần nào là suy luận tóm tắt.", action: "Tách các ý có trích dẫn rõ khỏi các ý chưa có trích dẫn; nếu JD có nêu code review thì thêm câu dẫn nguyên văn, nếu không thì bỏ hoặc đổi sang cách diễn đạt dè dặt hơn."}
  - {id: 3, reviewer: blind, class: patch, claim: "Ứng viên cần đồng thời có nền tảng frontend web và cơ sở dữ liệu SQL, cho thấy đây không phải vai trò Python thuần một mảng.", evidence: "Vế đầu được hỗ trợ bởi Evidence, nhưng vế sau là diễn giải kết luận của người viết, được nêu như fact thay vì đánh dấu là nhận định.", action: "Giữ nguyên dữ kiện yêu cầu frontend và SQL, nhưng đổi phần kết luận sang ngôn ngữ quy nạp như \"gợi ý rằng\" hoặc \"có thể cho thấy\"."}
  - {id: 4, reviewer: blind, class: patch, claim: "JD đồng thời yêu cầu tích hợp bên thứ ba và kỹ năng giao tiếp, truyền đạt rõ ràng.", evidence: "Evidence xác nhận có yêu cầu tích hợp bên thứ ba và \"kỹ năng giao tiếp tốt\", nhưng cụm \"truyền đạt rõ ràng\" là diễn đạt mở rộng, không có trích dẫn nội tuyến.", action: Đổi về đúng ngôn ngữ đã được nêu trong Evidence/JD hoặc thêm trích dẫn trực tiếp nếu JD thật sự nói tới khả năng truyền đạt rõ ràng.}
  - {id: 5, reviewer: blind, class: patch, claim: "Quyền lợi cho thấy môi trường doanh nghiệp quốc tế, có lộ trình phát triển dài hạn và đào tạo thêm.", evidence: "Đây là attribution khá mushy: không nêu quyền lợi nào cụ thể dẫn tới kết luận \"môi trường doanh nghiệp quốc tế\" hay \"lộ trình phát triển dài hạn\". Câu hiện là diễn giải tổng quát không có neo chứng cứ nội tuyến.", action: "Thay bằng các quyền lợi cụ thể được liệt kê trong JD, hoặc thêm trích dẫn nguyên văn trước khi rút ra kết luận."}
---
## Summary

Đây là JD cho vị trí Lập trình viên Python mid-level tại Công ty TNHH Thương mại Công nghệ Thái Bình, làm việc tại văn phòng DHL - VNPT ở TP. Hồ Chí Minh. Vai trò tập trung phát triển và tuỳ chỉnh các module cho giải pháp ERP về quản trị nguồn nhân lực và chuỗi cung ứng, đồng thời xử lý tích hợp bên thứ ba, review code và gỡ lỗi. Ứng viên cần tối thiểu 2 năm kinh nghiệm Python, có nền tảng frontend web, làm việc với cơ sở dữ liệu SQL và quen với Linux, Unix, Windows.

## Key claims

- [Cao] Vị trí này nghiêng về phát triển ứng dụng Python cho môi trường doanh nghiệp, với trọng tâm là phân tích yêu cầu, xây module và xử lý lỗi kỹ thuật.
- [Cao] Kiến thức về [[concepts/swe/he-thong-erp]] là bối cảnh nghiệp vụ trung tâm, vì sản phẩm nhắm vào quản trị nguồn nhân lực và chuỗi cung ứng.
- [Cao] Ứng viên cần đồng thời có nền tảng [[concepts/swe/lap-trinh-giao-dien-web]] và [[concepts/swe/co-so-du-lieu-sql]], cho thấy đây không phải vai trò Python thuần một mảng.
- [Cao] JD đồng thời yêu cầu [[concepts/swe/tich-hop-he-thong-ben-thu-ba]] và kỹ năng giao tiếp, truyền đạt rõ ràng.
- [Trung bình] Kinh nghiệm với .NET được nêu là lợi thế, cho thấy kinh nghiệm công nghệ bổ sung ngoài Python vẫn được đánh giá tích cực.

## Evidence

- JD nêu rõ trách nhiệm "thiết kế và phát triển các module cho giải pháp quản trị nguồn nhân lực và chuỗi cung ứng (ERP)".
- Phần công việc yêu cầu "tạo tính năng mới, tuỳ chỉnh hệ thống, tích hợp với các bên thứ ba".
- Phần yêu cầu ứng viên liệt kê JavaScript, HTML, CSS, XML cùng SQL (PostgreSQL, MySQL, MSSQL).
- JD yêu cầu kiến thức về Linux, Unix, Windows và nhấn mạnh kỹ năng giao tiếp tốt.
- Quyền lợi cho thấy môi trường doanh nghiệp quốc tế, có lộ trình phát triển dài hạn và đào tạo thêm.

## Related concepts

- [[concepts/swe/lap-trinh-python]] - năng lực phát triển ứng dụng bằng Python là yêu cầu cốt lõi
- [[concepts/swe/he-thong-erp]] - bối cảnh sản phẩm chính của vị trí
- [[concepts/swe/tich-hop-he-thong-ben-thu-ba]] - tích hợp hệ thống với dịch vụ ngoài
- [[concepts/swe/lap-trinh-giao-dien-web]] - phần nền tảng frontend được yêu cầu
- [[concepts/swe/co-so-du-lieu-sql]] - nhóm kỹ năng cơ sở dữ liệu quan hệ bắt buộc

## Related sources

Chưa nối trực tiếp với nguồn nào khác trong wiki hiện tại.

## People

Chưa có nhân vật cụ thể nào cần tách thành trang riêng từ JD này.

## Open questions

- Giải pháp ERP hiện tại đang dùng framework Python nào và kiến trúc triển khai ra sao?
- Mức "thu nhập hấp dẫn" cụ thể nằm trong khoảng nào cho mặt bằng mid-level tại TP. Hồ Chí Minh?
- Phần tích hợp bên thứ ba chủ yếu là ERP nội bộ, logistics, hay hệ thống của DHL hoặc VNPT?
- Vai trò này thiên nhiều hơn về backend ứng dụng hay đòi hỏi đóng góp thường xuyên vào giao diện web?

## Notes
