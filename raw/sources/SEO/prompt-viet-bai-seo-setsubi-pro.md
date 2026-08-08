# Prompt viết bài SEO cho Setsubi-pro

> File này là **prompt/checklist tự đủ** để dùng khi draft một bài SEO mới cho Setsubi-pro.
> Cách dùng: đính kèm (hoặc yêu cầu Claude đọc) file này khi nhờ viết bài, để bản nháp đầu tiên đã bám sát quy tắc thay vì phải sửa nhiều vòng.
> Nguồn gộp: khung bài từ các bài output hiện có + công thức keyword (kế hoạch nội dung) + checklist on-page (review-seo) + do/don't (review-bai-seo + các vòng review tích lũy).
> **Cập nhật 2026-08-08:** đồng bộ với prompt sinh bài đang chạy thật của `auto_workflow` (`seo-cockpit/runner/src/jobs/generateWorker.ts` — `SETSUBI_DEFAULTS`). Các mục đánh dấu 🆕 là quy tắc siết thêm sau các vòng review tháng 06–07/2026.

## 0. Đầu vào cần có trước khi viết

- **Keyword chính** (cụm người dùng thực sự tra, thường ngắn — vd `鍵 なくした`).
- **Pillar / ngành hàng** (鍵, エアコン, トイレ, 給湯器…).
- **Loại bài**: `Situation` (đang gặp sự cố) hay `Solution` (cách xử lý), + mức ưu tiên.
- **Intent chiếm đa số** của keyword → cụ thể hóa đối tượng (vd "mất chìa khóa" → **chìa khóa nhà** `家の鍵`, phân biệt chìa xe).
- 🆕 **Danh sách bài đã viết** (`wiki/outputs/seo-*.md`) — để (1) không viết trùng, (2) không trùng H2, (3) lấy slug làm internal link.

## 1. Công thức title / keyword

`[Thiết bị/Khu vực] + [Vấn đề] + [Intent]` → triển khai thành câu tự nhiên.

- Bám đúng cụm người dùng tra; **không nhồi keyword** cho dài.
- Kiểm tra từng từ Hán có tự nhiên với bối cảnh đời thường không. Ví dụ `対処法` nghe như "xử lý sự cố kỹ thuật", lệch sắc thái việc mất chìa → dùng câu hỏi tự nhiên hơn.
  - Tránh: `鍵をなくした時の対処法｜やるべきことと業者の選び方`
  - Tốt hơn: `家の鍵をなくしたらどうする？落ち着いて確認したいポイントを解説`
- Cụ thể hóa đối tượng theo intent ngay trong title + lead (`家の鍵`).

## 2. Chọn cấu trúc theo loại bài 🆕

**Bắt buộc chọn ĐÚNG 1 trong 2 cấu trúc**, không trộn:

### a) Bài CHẨN ĐOÁN hỏng hóc thiết bị → **3 phần checklist**

Nhận diện: `X không chạy / không ra nước / kêu lạ / yếu đi / không lạnh / rò rỉ / có mùi…`
(`動かない`, `出ない`, `つかない`, `止まらない`, `漏れ`, `臭い`, `異音`, `うるさい`, `弱い`, `効かない`, `冷えない`, `暖まらない`, `チカチカ`…)

```
## 1. …順番に確認したいこと
   → checklist từ dễ → khó; mỗi bước gồm cách kiểm tra + thao tác xử lý an toàn
     ngay tại nhà (tắt điện / khoá nước trước)
## 2. それでも改善しないときに考えられる原因
   → hiện tượng cụ thể ĐỨNG TRƯỚC → nguyên nhân.
     CHỈ giải thích. KHÔNG hướng dẫn sửa. KHÔNG kêu gọi thợ ở phần này.
## 3. こんなときは早めの相談を
   → dấu hiệu nguy hiểm phải DỪNG (tông mạnh, tô đậm từ ngữ an toàn)
     + bảng so sánh + kết bài + CTA
```

⚠️ **Tiêu đề trên là KHUNG, không phải chữ để chép nguyên.** Mỗi bài PHẢI gắn từ khoá triệu chứng của chính bài đó vào tiêu đề — nếu không, mọi bài sẽ có mục lục giống hệt nhau và **tự cạnh tranh từ khoá với nhau**.
Ví dụ bài rò nước máy nước nóng: `## それでも水漏れが止まらないときに考えられる原因` / `## 給湯器の水漏れで早めに相談したいケース`.
Đối chiếu danh sách bài đã viết: **KHÔNG được trùng H2 với bất kỳ bài nào đã có.**

### b) Bài QUY TRÌNH / khẩn cấp / côn trùng / phòng ngừa → **4 phần**

(mất chìa khoá, ngập nước, tổ ong…): tình huống → nguyên nhân → tự xử lý → `業者へ相談したほうがよいケース`.

Chi tiết tiêu chí chọn template: xem `wiki/concepts/seo/template-seo-3-phan` và memory `feedback_seo_checklist_template`.

## 3. Khung bài chuẩn (skeleton)

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
  - concepts/seo/seo-symptom-problem-first
  - concepts/seo/cta-mem
---
```

### SEO metadata (đầu bài)
- `Keyword chinh`, `Meta title`, `Meta description`, `URL slug de xuat`.
- 🆕 Nếu bài đi qua cockpit (auto_workflow): 5 dòng comment ngay dưới H1, đúng thứ tự, mỗi comment trọn 1 dòng, không chứa `--` bên trong:
  `<!-- slug: … -->`, `<!-- description: … -->`, `<!-- excerpt: … -->`, `<!-- category: electricity|water -->`, `<!-- subcategory: エアコン|トイレ|給湯器|キッチン|洗濯機… -->`
  (subcategory: bài cùng nhóm với bài đã có phải dùng **đúng cách viết cũ**).

### Thân bài (tiếng Nhật)
1. **H1** (`#`) — duy nhất 1 H1, chính là tiêu đề.
2. 🆕 **Lead 3 đoạn**: hook triệu chứng (đổi kiểu viết giữa các bài, tránh "một màu") → đồng cảm + nguyên nhân đa dạng + lưu ý → đoạn 3 kết bằng **câu đầy đủ** `この記事では、…を解説します。`
3. 🆕 **`## 目次`** — liệt kê đầy đủ H2 + H3, **đánh số lồng nhau** (`1.` / `2.1.`); mục con viết dạng `### 2.1.`
4. **Các H2 đánh số** theo cấu trúc đã chọn ở mục 2.
5. 🆕 **Mục `##` CUỐI CÙNG luôn là phần gọi thợ**: bảng so sánh + kết bài + CTA mềm.
6. 🆕 **TUYỆT ĐỐI KHÔNG thêm mục nào sau CTA** — không `予防`, không `まとめ`, không FAQ. Nội dung phòng ngừa nếu cần thì lồng vào các mục trước.

### 🆕 Bảng so sánh — BẮT BUỘC dùng HTML, không dùng Markdown

```html
<table>
  <tr>
    <th style="background-color:#339900;color:#fff;">自分で対処しやすいケース</th>
    <th style="background-color:#CC3300;color:#fff;">業者へ相談したほうがよいケース</th>
  </tr>
  <tr>
    <td>モード設定のミス</td>
    <td>対処しても暖まらない</td>
  </tr>
</table>
```

- Đúng 2 cột; `<th>` cột tự xử lý `#339900` (lục), `<th>` cột gọi thợ `#CC3300` (đỏ). **Dùng đúng 2 mã màu này**, không tự đổi sang xanh dương hay màu khác.
- Ô `<td>` **không tô màu**; nội dung ô là **label ngắn**, không viết câu hoàn chỉnh.

### Ghi chú vận hành (cuối file)
- `Muc tieu bai`, `Pillar`, `Huong viet`, ghi chú internal link, ghi chú an toàn.

## 4. Checklist on-page cốt lõi

- Meta title: keyword trong **50 ký tự đầu**.
- Meta description: keyword trong **160 ký tự đầu**, nêu vấn đề + giải pháp, 🆕 **tổng độ dài 160–300 ký tự**.
- Keyword xuất hiện trong **10% số từ đầu** bài; mật độ toàn bài **1–2%**, dùng từ đồng nghĩa.
- URL slug: **tiếng Anh**, kebab-case, < 60 ký tự, không ký tự đặc biệt (vd `lost-key-what-to-do`).
- 1 H1 duy nhất; mục lục chứa H2 + H3.
- 🆕 **Độ dài bắt buộc: 3.500–4.500 ký tự Nhật** — không ngắn hơn bài mẫu. Mỗi mục con 2–4 đoạn.
  (Checklist 100 điểm chấm "càng dài càng tốt, mốc 100% ~ >2500 từ, <600 từ = 0 điểm"; 3.500–4.500 là mức thực thi đã chốt.)
- 🆕 **Đoạn văn ngắn**: mỗi đoạn 1–3 câu (≤3 dòng), cách nhau **một dòng trống** — tối ưu đọc trên mobile; tránh khối văn dày đặc nhiều câu liền.
- Tối thiểu 1 external link (web uy tín); link quảng cáo/affiliate gắn `nofollow`.

### 🆕 Internal link

- Xem danh sách bài đã viết, mỗi bài có slug tương ứng.
- Chèn link khi nội dung bài mới **thực sự đề cập/liên quan** tới chủ đề bài đã có.
- Dạng bắt buộc: `[văn bản neo tự nhiên](https://www.setsubi-pro.net/columns/<slug>/)`
  → **URL đầy đủ**: có `https://www.setsubi-pro.net`, tiền tố `/columns/`, dấu `/` ở cuối. KHÔNG ghi mỗi slug, KHÔNG dùng `/blog/`.
- `<slug>` phải **copy chính xác** từ danh sách — tuyệt đối không bịa/đoán/sửa slug.
- Nhắm **2–4 internal link mỗi bài**; không ép link.
- Anchor text là cụm từ tự nhiên trong câu — **không dùng** `こちら` / `詳しくはこちら`.

## 5. Quy tắc trình bày Markdown 🆕

- **BULLET dùng `- ` của Markdown** (mục con thụt 2 dấu cách), có **một dòng trống trước và sau cả khối**.
  ⛔ **TUYỆT ĐỐI KHÔNG mở đầu dòng bằng `・`** — nó không phải cú pháp danh sách, nên các dòng sẽ **dính thành một đoạn** trên site. `・` chỉ được dùng **giữa câu** (`電気設備・水回り`).
  *(Quy tắc cũ "bullet dùng `・`, giải thích phụ dùng `➞`" đã bị bãi bỏ — sai về hiển thị.)*
- Mỗi khối bullet **phải có câu dẫn mở ra trước đó**, không để bullet cụt ngang.
- **IN ĐẬM**: dấu `**` đóng phải đứng **cuối câu / cuối dòng**, không dính liền chữ kế tiếp.
  ✅ `…でください。**` rồi xuống dòng — ⛔ `…でください。**安全に…` (Markdown không hiểu là in đậm, hiện nguyên dấu sao trên web).
- **Văn Nhật phải thuần**: không lẫn ký tự Hàn (한글) hay chữ Hán giản thể (`这`, `们`, `压`, `对`, `说`, `时`, `实`…). Model qua gateway hay trộn — rà lại trước khi báo xong.

## 6. Do / Don't (rút từ các vòng review)

**Title & đối tượng**
- ✅ Title bám cụm người dùng tra, từ Hán tự nhiên; thu hẹp đối tượng theo intent.
- ❌ Nhồi keyword, dùng từ Hán cứng/lệch ngữ cảnh, viết chung chung không rõ đối tượng.
- ❌ Lặp pattern title pipe-stacked `｜` giữa nhiều bài liền nhau.

**Lead**
- ✅ Tả triệu chứng cụ thể → đồng cảm → dẫn vào; đổi style giữa các bài.
- ❌ Mở bằng 「〜していませんか」 rồi liệt kê keyword + "この記事では" (quá template).

**Heading**
- ✅ Đánh số, phân cấp rõ; diễn đạt đa dạng; heading bước hành động ngắn gọn (`水を止める`).
- ✅ Gắn từ khoá triệu chứng riêng của bài vào H2 khung.
- ❌ Spam keyword ở nhiều heading liền nhau; heading mẹ chỉ có 1 heading con; **sub-heading vụn** (vd 4.1–4.4 chỉ liệt kê điểm → gộp thành 1 bullet list để scan nhanh).
- ❌ Trùng H2 với bài đã viết.

**Câu chữ & ngữ nghĩa**
- ✅ Chọn từ đúng hành động thực (`スペアキーを持っているか` chứ không `使えるか`); diễn đạt cụ thể.
- ❌ Cụm trừu tượng/mơ hồ khó hiểu (`思い込みで`); lặp từ đệm `まずは` / `次に`.

**Cấu trúc trình bày**
- ✅ Đa dạng giữa các section (đổi "câu đệm → bullet → câu chốt" sang "bullet → đoạn" cho mạch liền).
- ✅ Đoạn trên/dưới liên kết logic (`前述のように…`) khi nhắc lại ý.
- ❌ Mọi mục cùng một khuôn; paragraph lẻ loi sau bullet.

**Phần gọi thợ & an toàn**
- ✅ Gộp cảnh báo "không nên tự làm" vào phần "khi nào gọi thợ" (flow: tự sửa → giới hạn → gọi thợ); tông mạnh nếu nguy hiểm; kèm bảng tóm tắt.
- ✅ Forward-reference `次のような状況では…` phải nối **thẳng** với bảng phân loại, không chèn block khác vào giữa.
- ❌ Hướng dẫn thao tác chuyên sâu/nguy hiểm (tháo máy, chỉnh gas, thay linh kiện…).

**CTA & kết bài**
- ✅ CTA mềm, đủ ý, nhắc rõ dịch vụ hỗ trợ (`24時間対応`, 鍵開け / 鍵交換); dùng cụm tự nhiên `「自分で確認してみたけれど見つからない」「防犯面が不安」`.
- ❌ CTA cụt; câu chốt sáo/triết lý lạc quẻ; thêm đoạn tóm tắt thừa sau CTA; tách heading `まとめ`.

**Thương hiệu**
- Nhắc Setsubi-pro **đúng 1 lần ở cuối** (tối đa thêm 1 lần ở mở bài/thân bài).

## 7. Self-check trước khi báo xong

1. Đã chọn đúng cấu trúc (3 phần checklist cho bài chẩn đoán / 4 phần cho bài quy trình)?
2. H2 có gắn từ khoá triệu chứng riêng và **không trùng H2** với bài nào đã viết?
3. Title/đối tượng đúng intent, từ Hán tự nhiên?
4. Đã đồng bộ **title ↔ H1 ↔ 目次 ↔ frontmatter title ↔ meta title/description** chưa? (dễ sót khi đổi heading)
5. Bullet có dùng `- ` (không `・` đầu dòng), có dòng trống trước/sau khối, có câu dẫn?
6. Dấu `**` đóng có đứng cuối dòng, không dính chữ kế tiếp?
7. Bảng so sánh có dùng HTML `<table>` với đúng 2 mã màu `#339900` / `#CC3300`, ô `<td>` là label ngắn?
8. Có 2–4 internal link, URL đầy đủ `https://www.setsubi-pro.net/columns/<slug>/`, slug copy chính xác, anchor tự nhiên?
9. Meta description 160–300 ký tự? Độ dài bài 3.500–4.500 ký tự Nhật? Đoạn văn ≤3 dòng?
10. Mục `##` cuối là phần gọi thợ, **không có mục nào sau CTA**?
11. Văn Nhật thuần, không lẫn ký tự Hàn/giản thể?
12. Có cụm mơ hồ, từ đệm lặp, câu chốt lạc quẻ không?
