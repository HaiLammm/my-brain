---
type: source
title: Review SEO
slug: review-seo
date_added: 2026-05-20
authors:
  - Quân
source_type: note
importance: 3
confidence: high
tags:
  - seo
  - checklist
  - content-marketing
raw_paths:
  - raw/sources/SEO/Review SEO.pdf
provenance: replayable
id: sources/review-seo
created: 2026-05-20
updated: 2026-08-11
sources:
  - {provider: pdf, fetched_at: "2026-05-20T07:27:25Z"}
ingest_status: linted
year: 2026
verify_status: passed
findings:
  - {id: 1, reviewer: grounding, class: dismiss, claim: mô hình pillar-cluster, evidence: PDF mô tả cấu trúc 3 chủ đề -> 3 từ khóa chính -> nhiều bài nhỏ nhưng không dùng thuật ngữ pillar-cluster. Wiki thêm nhãn này như cách diễn giải hợp lý., action: "Có thể thêm ghi chú rằng thuật ngữ pillar-cluster là do wiki gán, không có trong tài liệu gốc."}
  - {id: 2, reviewer: grounding, class: dismiss, claim: introduces_concept cho mat-do-tu-khoa, evidence: "PDF đề cập mật độ từ khóa 1-2% như một quy tắc áp dụng, không giới thiệu khái niệm mới. Edge type uses_concept chính xác hơn introduces_concept.", action: Cân nhắc đổi edge type từ introduces_concept sang uses_concept.}
---

## Summary

Tài liệu hướng dẫn nội bộ của Setsubi Pro tổng hợp các tiêu chí đánh giá SEO on-page cho bài viết blog. Nội dung chia thành hai phần: Basic SEO (meta title, meta description, từ khóa chính/phụ, tiêu đề H1, cấu trúc URL, nội dung, độ dài bài viết) và Additional SEO (tiêu đề H2+, độ dài URL, hình ảnh/video, alt text, external link, internal link). Tài liệu đặt ra hệ thống chấm điểm theo độ dài bài viết và quy tắc cụ thể cho từng yếu tố.

## Key claims

- Mỗi từ khóa chính chỉ được dùng cho đúng một bài viết; không có hai bài trùng từ khóa chính
- 3 chủ đề lớn tương ứng 3 từ khóa chính, mỗi từ khóa chính dẫn nhiều bài nhỏ hơn — mô hình pillar-cluster
- Từ khóa chính phải xuất hiện trong 50 ký tự đầu của meta title và 160 ký tự đầu của meta description
- Từ khóa chính xuất hiện trong 10% số từ đầu tiên của bài viết; mật độ từ khóa toàn bài 1–2%
- Bài viết trên 2500 từ đạt 100% điểm; dưới 600 từ đạt 0%
- URL tối ưu dưới 75 ký tự (bao gồm https://), chứa từ khóa chính, không ký tự đặc biệt
- 60% alt text chứa từ khóa chính, 40% chứa từ khóa phụ
- Tối thiểu 1 external link đến website uy tín và 1 internal link trong mỗi bài

## Evidence

- Bảng chấm điểm độ dài rõ ràng với 6 mức từ 0% đến 100%
- Quy tắc cấu trúc nội dung: mở bài, mục lục, nội dung chính (H2/H3), kết bài, CTA, thông tin liên hệ
- Quy tắc đặt tên file ảnh: theo từ khóa chính, không dấu, gạch ngang, đánh số 01/02
- Link quảng cáo, affiliate, forum phải đánh dấu "nofollow"; hạn chế link đến đối thủ cạnh tranh

## Related concepts

- [[concepts/seo/checklist-seo-100-diem]]
- [[concepts/seo/mo-hinh-pillar-cluster]]
- [[concepts/seo/mat-do-tu-khoa]]
- [[concepts/seo/cta-mem]]
- [[concepts/seo/seo-symptom-problem-first]]

## Related sources

- [[sources/huong-dan-viet-bai-seo-cho-setsubi-pro]]
- [[sources/ke-hoach-noi-dung-blog-va-seo-cho-setsuki-pro]]
- [[sources/cau-truc-3-phan-bai-seo-troubleshooting]]
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — mặt kỹ thuật của cùng site: tài liệu này chấm nội dung, tài liệu kia chấm markup và hiển thị trên SERP
- [[sources/bo-kich-ban-email-marketing-wa-craft]] — cùng tác giả, cùng cách làm: bộ tiêu chí viết trước, nội dung sản xuất sau
- [[sources/ban-do-seo-setsubi-pro-net]] — bộ tiêu chí này chấm nội dung, bản đồ kia chấm hạ tầng

## People

- [[people/quan]] — người soạn thảo, **soạn từ đầu** chứ không biên soạn lại từ tài liệu của khách (xác nhận 10/08/2026). Trước đó trang ghi tác giả là "Setsubi Pro" — đó là **tên khách hàng trong tiêu đề**, không phải nguồn gốc nội dung.

## Open questions

- Hệ thống chấm điểm này áp dụng cho thị trường Việt Nam hay cả thị trường Nhật Bản?
- Tiêu chí "website uy tín" cho external link được đánh giá cụ thể như thế nào?
- Tần suất review và cập nhật checklist SEO này là bao lâu?

## Notes
