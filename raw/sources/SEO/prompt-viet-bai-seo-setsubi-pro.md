# Prompt viết bài SEO cho Setsubi-pro

> File này là **prompt/checklist tự đủ** để dùng khi draft một bài SEO mới cho Setsubi-pro.
> Cách dùng: đính kèm (hoặc yêu cầu Claude đọc) file này khi nhờ viết bài, để bản nháp đầu tiên đã bám sát quy tắc thay vì phải sửa nhiều vòng.
> Nguồn gộp: khung bài từ các bài output hiện có + công thức keyword (kế hoạch nội dung) + checklist on-page (review-seo) + do/don't (review-bai-seo + các vòng review tích lũy).

## 0. Đầu vào cần có trước khi viết

- **Keyword chính** (cụm người dùng thực sự tra, thường ngắn — vd `鍵 なくした`).
- **Pillar / ngành hàng** (鍵, エアコン, トイレ, 給湯器…).
- **Loại bài**: `Situation` (đang gặp sự cố) hay `Solution` (cách xử lý), + mức ưu tiên.
- **Intent chiếm đa số** của keyword → cụ thể hóa đối tượng (vd "mất chìa khóa" → **chìa khóa nhà** `家の鍵`, phân biệt chìa xe).

## 1. Công thức title / keyword

`[Thiết bị/Khu vực] + [Vấn đề] + [Intent]` → triển khai thành câu tự nhiên.

- Bám đúng cụm người dùng tra; **không nhồi keyword** cho dài.
- Kiểm tra từng từ Hán có tự nhiên với bối cảnh đời thường không. Ví dụ `対処法` nghe như "xử lý sự cố kỹ thuật", lệch sắc thái việc mất chìa → dùng câu hỏi tự nhiên hơn.
  - Tránh: `鍵をなくした時の対処法｜やるべきことと業者の選び方`
  - Tốt hơn: `家の鍵をなくしたらどうする？落ち着いて確認したいポイントを解説`
- Cụ thể hóa đối tượng theo intent ngay trong title + lead (`家の鍵`).

## 2. Khung bài chuẩn (skeleton)

### Frontmatter (file `wiki/outputs/seo-NN-slug.md`)
```
---
id: outputs/seo-NN-<slug-romaji>
title: "Bài SEO NN — <tiêu đề tiếng Nhật>"
type: output
created: YYYY-MM-DD
updated: YYYY-MM-DD
covers:
  - sources/ke-hoach-noi-dung-blog-va-seo-cho-setsuki-pro
  - sources/huong-dan-viet-bai-seo-cho-setsubi-pro
  - concepts/seo-symptom-problem-first
  - concepts/noi-dung-giai-thich-cho-nguoi-khong-chuyen
  - concepts/cta-mem
  - concepts/bang-tu-xu-ly-hay-goi-tho
---
```

### SEO metadata (đầu bài)
- `Keyword chinh`, `Meta title`, `Meta description`, `URL slug de xuat`.

### Thân bài (tiếng Nhật)
1. **H1** (`#`) — duy nhất 1 H1, chính là tiêu đề.
2. **Lead** — 2-3 đoạn: tả triệu chứng thực tế → câu đồng cảm → dẫn vào nội dung (nêu rõ đối tượng `家の鍵`).
3. **目次** — liệt kê H2 (và H3 nếu có), không liệt kê H4+.
4. **Các H2 đánh số**: `## 1. …`, `## 2. …`; H3 `### 2.1. …`.
   - Thường: tình huống/kiểm tra → nguyên nhân → tự xử lý → khi nào gọi thợ.
5. **Bảng phân loại** `自分で対応しやすいケース | 業者へ相談したいケース` (bắt buộc, để scan nhanh).
6. **Kết bài + CTA mềm** — liền mạch, **không** tách heading `## まとめ`.

### Ghi chú vận hành (cuối file)
- `Muc tieu bai`, `Pillar`, `Huong viet`, ghi chú internal link, ghi chú an toàn.

## 3. Checklist on-page cốt lõi

- Meta title: keyword trong **50 ký tự đầu**.
- Meta description: keyword trong **160 ký tự đầu**, nêu vấn đề + giải pháp.
- Keyword xuất hiện trong **10% số từ đầu** bài; mật độ toàn bài **1–2%**, dùng từ đồng nghĩa.
- URL slug: **tiếng Anh**, kebab-case, < 75 ký tự, không ký tự đặc biệt (vd `lost-key-what-to-do`).
- 1 H1 duy nhất; mục lục chứa H2 + H3.
- Tối thiểu 1 external link (web uy tín) + 1 internal link; link quảng cáo/affiliate gắn `nofollow`.
- Độ dài: càng dài càng tốt cho điểm (mốc 100% ~ trên 2500 từ; dưới 600 từ = 0%).

## 4. Do / Don't (rút từ các vòng review)

**Title & đối tượng**
- ✅ Title bám cụm người dùng tra, từ Hán tự nhiên; thu hẹp đối tượng theo intent.
- ❌ Nhồi keyword, dùng từ Hán cứng/lệch ngữ cảnh, viết chung chung không rõ đối tượng.

**Lead**
- ✅ Tả triệu chứng cụ thể → đồng cảm → dẫn vào; đổi style giữa các bài.
- ❌ Mở bằng 「〜していませんか」 rồi liệt kê keyword + "この記事では" (quá template).

**Heading**
- ✅ Đánh số, phân cấp rõ; diễn đạt đa dạng; heading bước hành động ngắn gọn (`水を止める`).
- ❌ Spam keyword ở nhiều heading liền nhau; heading mẹ chỉ có 1 heading con; **sub-heading vụn** (vd 4.1–4.4 chỉ liệt kê điểm → gộp thành 1 bullet list để scan nhanh).

**Câu chữ & ngữ nghĩa**
- ✅ Chọn từ đúng hành động thực (`スペアキーを持っているか` chứ không `使えるか`); diễn đạt cụ thể.
- ❌ Cụm trừu tượng/mơ hồ khó hiểu (`思い込みで`); lặp từ đệm `まずは` / `次に`.

**Cấu trúc trình bày**
- ✅ Đa dạng giữa các section (đổi "câu đệm → bullet → câu chốt" sang "bullet → đoạn" cho mạch liền); bullet dùng `・`, giải thích phụ dùng `➞`.
- ✅ Đoạn trên/dưới liên kết logic (`前述のように…`) khi nhắc lại ý.
- ❌ Mọi mục cùng một khuôn; paragraph lẻ loi sau bullet.

**Phần gọi thợ & an toàn**
- ✅ Gộp cảnh báo "không nên tự làm" vào phần "khi nào gọi thợ" (flow: tự sửa → giới hạn → gọi thợ); tông mạnh nếu nguy hiểm; kèm bảng tóm tắt.
- ❌ Hướng dẫn thao tác chuyên sâu/nguy hiểm (tháo máy, chỉnh gas, thay linh kiện…).

**CTA & kết bài**
- ✅ CTA mềm, đủ ý, nhắc rõ dịch vụ hỗ trợ (vd 24h, 鍵開け / 鍵交換); dùng cụm tự nhiên `「自分で確認してみたけれど見つからない」「防犯面が不安」`.
- ❌ CTA cụt; câu chốt sáo/triết lý lạc quẻ (`「その後も安心して住めるか」…`); thêm đoạn tóm tắt thừa sau CTA; tách heading `まとめ`.

**Thương hiệu**
- Nhắc Setsubi-pro tối đa 1 lần ở cuối (thêm tối đa 1 lần ở mở bài/thân bài).

## 5. Self-check trước khi báo xong

1. Title/đối tượng đúng intent, từ Hán tự nhiên?
2. Đã đồng bộ **title ↔ H1 ↔ 目次 ↔ frontmatter title ↔ meta title/description** chưa? (dễ sót khi đổi heading)
3. Mỗi heading có spam keyword / sub-heading vụn không?
4. Có cụm mơ hồ, từ đệm lặp, câu chốt lạc quẻ không?
5. CTA đủ ý + nhắc dịch vụ; không có đoạn thừa sau CTA?
6. Checklist on-page mục 3 đạt chưa?
