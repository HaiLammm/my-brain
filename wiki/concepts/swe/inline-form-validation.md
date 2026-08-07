---
type: concept
title: Validation form nội tuyến không dùng thư viện schema
slug: inline-form-validation
date_added: 2026-05-14
confidence: high
tags:
  - frontend
  - validation
  - form
id: concepts/swe/inline-form-validation
created: 2026-05-14
updated: 2026-08-07
key_sources:
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/swe/react-hook-form-zod
  - concepts/swe/authoritative-server-pattern
---

## Definition

Cách kiểm tra dữ liệu form mà mỗi form tự khai hàm kiểm tra của mình, không thêm thư viện schema vào phụ thuộc. Kiểm tra chạy hai tầng — khi rời khỏi ô nhập để bắt lỗi sớm, và khi gửi để chặn dữ liệu sai — với thông báo viết bằng ngôn ngữ người dùng thay vì thuật ngữ kỹ thuật.

## Variants

- **Hai tầng on-blur + on-submit** — on-blur sửa được lỗi ngay khi trí nhớ còn nóng; on-submit là chốt chặn cuối vì người dùng có thể gửi mà chưa từng rời một ô nào.
- **Thông báo theo ngôn ngữ người dùng** — nói cái cần làm, không nêu tên trường trong cơ sở dữ liệu hay tên ràng buộc.
- **Ràng buộc theo miền địa phương** — định dạng số điện thoại, đơn vị hành chính, cách viết địa chỉ khác nhau theo quốc gia; đây là phần thư viện schema dùng chung ít khi phủ đúng.
- **Ràng buộc quan hệ giữa các trường** — khoảng ngày phải hợp lệ với nhau và với hiện tại, không chỉ hợp lệ riêng lẻ.
- **Chống trùng ở tầng form** — phát hiện mục trùng trước khi gửi, để người dùng nhận phản hồi tức thì thay vì đợi backend từ chối.

## Key sources

- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/swe/react-hook-form-zod]]
- [[concepts/swe/authoritative-server-pattern]]

## Mentioned in

## Notes

Chưng cất từ `inline-validation` của tailor_project. Bản gốc ghi lý do chọn là "Zod không có trong dependencies" — một trạng thái nhất thời, không phải lập luận.

Đánh đổi thật nằm ở chỗ khác: viết tay cho phép thông báo lỗi sát ngữ cảnh và ràng buộc địa phương chính xác, đổi lại mỗi form một bản logic riêng, dễ trôi khỏi nhau khi số form tăng. Ngưỡng nên cân nhắc chuyển sang schema dùng chung là khi cùng một quy tắc bắt đầu lặp ở form thứ ba. Trong mọi trường hợp, validation phía client chỉ là trải nghiệm — ràng buộc thật vẫn phải đặt ở server, xem [[concepts/swe/authoritative-server-pattern]].
