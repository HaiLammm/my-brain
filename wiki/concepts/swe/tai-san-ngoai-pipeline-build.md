---
type: concept
title: Tài sản nằm ngoài pipeline build
slug: tai-san-ngoai-pipeline-build
date_added: 2026-08-11
confidence: high
tags:
  - build-tooling
  - asset-pipeline
  - performance
id: concepts/swe/tai-san-ngoai-pipeline-build
created: 2026-08-11
updated: 2026-08-11
key_sources:
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
related_concepts:
  - concepts/seo/thumbnail-serp-google
  - concepts/swe/sua-tai-nguon-sinh
---

## Definition

Mọi bộ build hiện đại chỉ tối ưu những tài sản nó **quét thấy** — thường là một glob cố định như `src/assets/**`. File đặt ở thư mục tĩnh (`public/`, `static/`) được phục vụ nguyên trạng: không đổi định dạng, không nén, không sinh biến thể kích thước. Đây là chế độ hỏng im lặng đặc trưng: trang vẫn chạy, ảnh vẫn hiện, chỉ là nặng gấp nhiều lần và mọi URL sinh ra trỏ tới file thô.

## Triệu chứng

- Ảnh phục vụ nguyên JPEG/PNG gốc thay vì WebP/AVIF đã nén.
- URL trong HTML hoặc JSON-LD trỏ thẳng `/images/...` thay vì đường dẫn có hash của bộ build.
- Điểm hiệu năng tụt mà không giải thích được bằng code.

## Cách xử lý

- Ưu tiên chỉ giữ tài sản ở thư mục được bộ build quét; chỉ để ở thư mục tĩnh những gì thật sự cần URL cố định (favicon, `robots.txt`, file xác thực).
- Nếu buộc phải có cả hai bản (ví dụ frontmatter trỏ đường dẫn công khai còn bộ build cần bản nguồn), giữ **cùng một đường dẫn tương đối** ở hai thư mục để quy ước tự giải thích, và tự động hóa việc đồng bộ.
- Thêm một bước kiểm tra sau build: xác nhận URL tài sản trong HTML đã qua bộ tối ưu, thay vì tin vào mắt thường.

## Key sources

- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]]

## Related concepts

- [[concepts/seo/thumbnail-serp-google]]
- [[concepts/swe/sua-tai-nguon-sinh]]

## Notes
