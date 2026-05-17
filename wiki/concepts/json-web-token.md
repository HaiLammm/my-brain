---
type: concept
title: JSON Web Token (JWT)
slug: json-web-token
date_added: 2026-05-15
confidence: unverified
id: concepts/json-web-token
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

JSON Web Token (JWT) là một định dạng token tự chứa thông tin định danh và quyền hạn dưới dạng các claim đã được ký số. Nhờ khả năng tự xác thực bằng chữ ký, JWT thường được dùng để xây dựng luồng xác thực phi trạng thái, nơi mỗi server có thể kiểm tra token mà không cần truy vấn phiên đăng nhập từ cơ sở dữ liệu ở mọi request.

## Variants

- **Access Token**: Sống ngắn, gắn trực tiếp vào request để truy cập API.
- **Refresh Token**: Sống dài hơn, dùng để xin cấp lại access token khi hết hạn.
- **Signed vs Encrypted JWT**: Token có thể chỉ được ký để đảm bảo toàn vẹn, hoặc được mã hóa thêm khi cần che nội dung.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Tài liệu nhấn mạnh cặp access token và refresh token, cùng khuyến nghị lưu refresh token trong HTTP-only cookie để giảm rủi ro XSS.
