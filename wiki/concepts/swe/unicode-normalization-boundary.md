---
type: concept
title: Chuẩn hoá Unicode tại một biên duy nhất
confidence: high
tags:
  - i18n
  - text-processing
  - data-quality
id: unicode-normalization-boundary
created: 2026-08-07
updated: 2026-08-07
key_sources:
  - sources/tool-sales-architecture-docs
related_concepts:
  - concepts/swe/inline-form-validation
  - concepts/tool-sales/ng-detection
---

## Definition

Khi hệ thống xử lý văn bản của ngôn ngữ có nhiều cách viết cho cùng một ký tự — tiếng Nhật, tiếng Hàn, tiếng Trung, cả tiếng Việt có dấu — mọi phép so khớp phải chạy trên dạng đã chuẩn hoá, và phép chuẩn hoá đó phải là **một hàm dùng chung duy nhất**, không phải mỗi nơi tự làm một kiểu.

Với tiếng Nhật, cùng một chữ có thể viết bằng ký tự toàn rộng hay nửa rộng, katakana nửa rộng kèm dấu đục tách rời hay ghép liền, khoảng trắng biểu ý hay khoảng trắng ASCII. So khớp chuỗi thô sẽ trượt mà không báo lỗi — nguy hiểm nhất trong nhóm lỗi, vì kết quả trông vẫn hợp lệ.

## Variants

- **Một hàm, nhiều nơi gọi** — bộ dò từ khoá, bộ hiểu form và bộ điền tự động phải gấp chữ giống hệt nhau. Khác nhau dù một bước là hai bên nhìn thấy hai chuỗi khác nhau cho cùng một nội dung.
- **Idempotent** — chuẩn hoá hai lần cho kết quả bằng chuẩn hoá một lần; nhờ đó gọi lặp ở tầng giữa không gây hại.
- **Hai mức** — mức gấp ký tự (dùng cho so khớp chính xác) và mức gộp thêm khoảng trắng (dùng cho so khớp lỏng); tách rõ để nơi cần chặt không vô tình dùng nơi lỏng.
- **So khớp lựa chọn hai tầng** — thử khớp chính xác trên dạng đã gấp trước; không được mới hạ xuống khớp mờ có ngưỡng. Khớp mờ không có ngưỡng là nguồn lỗi âm thầm.

## Key sources

- [[sources/tool-sales-architecture-docs]]

## Related concepts

- [[concepts/swe/inline-form-validation]]
- [[concepts/tool-sales/ng-detection]]

## Mentioned in

## Notes

Quy tắc chọn biên: chuẩn hoá **ngay khi dữ liệu vào hệ thống** và lưu cả bản gốc lẫn bản đã gấp nếu bản gốc còn giá trị pháp lý hay hiển thị. Chuẩn hoá rải rác ở từng điểm so khớp là cách chắc chắn để hai điểm trôi khỏi nhau sau vài tháng.

Cảnh báo quan trọng: **không chuẩn hoá thứ dùng làm bằng chứng.** Đoạn trích lưu lại để chứng minh một trang có nội dung cấm phải giữ nguyên văn như đã thấy. Chuẩn hoá là bước phục vụ so khớp, không phải bước lưu trữ — trộn hai việc này sẽ làm hỏng giá trị pháp lý của bản ghi.
