---
type: source
title: "Kiến trúc Hệ thống: Lộ trình Mở rộng Quy mô cho Hệ thống Hàng triệu Người dùng"
slug: kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
date_added: 2026-05-15
authors: []
source_type: note
importance: 3
confidence: unverified
tags:
  - system-design
  - distributed-systems
  - backend
  - api
  - security
raw_paths:
  - raw/sources/system/system-design.md
  - raw/sources/system/System_Design_Blueprint.pdf
provenance: replayable
id: sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
created: 2026-05-15
updated: 2026-05-15
year: 2026
ingest_status: finalized
verify_status: passed
findings: []
---
## Summary

Tài liệu này là một bản đồ nhập môn về cách một hệ thống đi từ máy chủ đơn lẻ đến kiến trúc phân tán đủ sức phục vụ hàng triệu người dùng. Nó gom các quyết định cốt lõi ở từng tầng vào cùng một mạch suy nghĩ: mở rộng ngang, cân bằng tải, chọn cơ sở dữ liệu, thiết kế API, xác thực, phân quyền và các lớp phòng thủ bảo mật. Giá trị lớn nhất của tài liệu nằm ở tư duy chọn đánh đổi giữa độ tin cậy, độ trễ, khả năng mở rộng và độ an toàn vận hành, thay vì chỉ liệt kê công cụ.

## Key claims

- Kỹ năng thiết kế hệ thống là ranh giới phân biệt người chỉ hiện thực yêu cầu với người có thể tự đưa ra quyết định kiến trúc trong điều kiện mơ hồ.
- Kiến trúc máy chủ đơn nhất là điểm khởi đầu hợp lý để hiểu luồng dữ liệu, nhưng sớm bộc lộ điểm lỗi đơn nhất và tranh chấp tài nguyên khi lưu lượng tăng.
- Mở rộng ngang kết hợp cân bằng tải, health check và hashing nhất quán là nền móng thực tế cho tính sẵn sàng cao và khả năng tăng trưởng dài hạn.
- Việc chọn SQL hay NoSQL, REST hay gRPC, TCP hay UDP phải bám chặt vào đặc tính nghiệp vụ, độ trễ chấp nhận được và yêu cầu nhất quán dữ liệu.
- Xác thực, phân quyền và phòng thủ nhiều lớp không phải phần phụ của kiến trúc, mà là cấu phần đồng thiết kế với API, dữ liệu và hạ tầng.

## Evidence

- Bộ slide đi tuần tự từ single server sang scale-out, rồi mở rộng sang load balancer, dữ liệu, API, real-time, xác thực và bảo mật.
- Tài liệu so sánh trực tiếp vertical scaling với horizontal scaling, nêu rõ giới hạn phần cứng, SPOF và lợi ích fault tolerance.
- Phần load balancer liệt kê 7 thuật toán phân phối traffic cùng health check và vai trò của consistent hashing trong hệ phân tán.
- Phần dữ liệu, giao thức và API đặt SQL cạnh NoSQL, TCP cạnh UDP, REST cạnh GraphQL và gRPC để làm rõ bối cảnh sử dụng của từng lựa chọn.
- Phần cuối hợp nhất toàn bộ các lớp thành một "pháo đài" kiến trúc gồm client, load balancer, auth layer, service layer, cache, queue, database và các cơ chế bảo mật như rate limiting, WAF, CSRF, XSS.
- Nguồn văn bản chính đến từ `raw/sources/system/system-design.md`; tệp PDF đi kèm là bản slide hình ảnh 15 trang cùng nội dung.

## Related concepts

- [[concepts/swe/kien-truc-may-chu-don-nhat]]
- [[concepts/swe/mo-rong-ngang]]
- [[concepts/swe/can-bang-tai]]
- [[concepts/swe/co-so-du-lieu-sql]]
- [[concepts/swe/co-so-du-lieu-nosql]]
- [[concepts/swe/grpc]]
- [[concepts/swe/json-web-token]]
- [[concepts/swe/oauth2-va-oidc]]
- [[concepts/swe/rbac]]
- [[concepts/swe/abac]]
- [[concepts/swe/access-control-list]]
- [[concepts/swe/rate-limiting]]

## Related sources

## People

## Open questions

- Ở ngưỡng tải nào thì một hệ thống nên tách khỏi single server thành nhiều service độc lập, thay vì chỉ scale-out cùng một khối ứng dụng?
- Khi nào mô hình JWT stateless trở nên kém phù hợp hơn session lưu trạng thái, đặc biệt trong bối cảnh cần thu hồi quyền ngay lập tức hoặc audit nghiêm ngặt?
- Với đội ngũ nhỏ, đâu là điểm cân bằng giữa tính đúng đắn kiến trúc và nguy cơ over-engineering khi đưa thêm gRPC, WebSocket hoặc message queue?
- Trong thực tế doanh nghiệp, nên ưu tiên RBAC, ABAC hay ACL theo tiêu chí nào để tránh chi phí vận hành chính sách tăng mất kiểm soát?

## Notes
