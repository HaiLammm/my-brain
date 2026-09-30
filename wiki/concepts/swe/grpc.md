---
type: concept
title: gRPC
confidence: unverified
id: grpc
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

gRPC là cơ chế gọi thủ tục từ xa hiệu năng cao, thường dùng cho giao tiếp nội bộ giữa các dịch vụ. Nó chạy trên HTTP/2, dùng Protocol Buffers để mã hóa nhị phân và hỗ trợ streaming hai chiều, nhờ đó giảm overhead so với JSON/HTTP truyền thống trong các đường gọi server-to-server.

## Variants

- **Unary RPC**: Một request đi kèm một response.
- **Server / Client Streaming**: Một phía gửi nhiều thông điệp theo luồng.
- **Bidirectional Streaming**: Cả hai phía trao đổi luồng dữ liệu song song trên cùng một kết nối.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Trong blueprint này, gRPC được đặt cạnh REST và GraphQL như lựa chọn ưu tiên cho microservices cần thông lượng cao và hợp đồng dữ liệu chặt chẽ.
