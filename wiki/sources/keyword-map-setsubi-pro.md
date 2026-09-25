---
type: source
title: Keyword map Setsubi-pro
slug: keyword-map-setsubi-pro
date_added: 2026-09-16
authors: []
source_type: note
importance: 4
confidence: unverified
tags:
  - seo
  - keyword
  - planning
  - setsubi-pro
  - japanese
  - home-services
  - internal-link
raw_paths:
  - raw/sources/SEO/Keyword Setsubi-Pro.xlsx
provenance: replayable
id: sources/keyword-map-setsubi-pro
created: 2026-09-16
updated: 2026-09-16
year: 2026
ingest_status: finalized
verify_status: findings_pending
findings:
  - {id: 1, reviewer: grounding, class: defer, claim: bathtub-lifespan đã tick nhưng bỏ trống URL ... tổng cộng có 59 URL trên setsubi-pro.net/columns/, evidence: "Đúng là cột 'URL đã đăng' của dòng bathtub-lifespan trống và cột đó có 59 URL. Nhưng dòng này bị lệch một cột: URL https://www.setsubi-pro.net/columns/bathtub-lifespan/ nằm ở cột 'Tham khảo' ngay bên trái. Tính cả ô lệch cột thì có 60 dòng mang URL thật, và bài này thực tế đã đăng chứ không phải thiếu URL.", action: "Thêm một mệnh đề ngắn: dòng bathtub-lifespan bị nhập lệch cột — URL nằm ở cột Tham khảo, nên tổng số dòng có URL thật là 60"}
  - {id: 2, reviewer: grounding, class: defer, claim: "Bảng có cột `Internal Link đến` khai báo trước mạng liên kết nội bộ: 20 dòng đã điền", evidence: "Cột này đúng 20 ô có giá trị, nhưng 4 ô chỉ là placeholder 'chưa có' / 'chưa có internal link' (loose-power-outlet, power-outlet-no-power, waterheater-not-working, shower-water-leak). Chỉ 16 dòng thật sự khai báo bài đích.", action: "Đổi thành '20 ô đã điền, trong đó 16 ô khai báo bài đích thật, 4 ô là ghi chú chưa có link'"}
  - {id: 3, reviewer: grounding, class: defer, claim: "124 dòng đã có slug, ví dụ air-conditioner-not-heating, breaker-keeps-tripping, toilet-water-leak-causes-solutions", evidence: "Cột Slug có đúng 124 ô có giá trị, nhưng 11 ô trong đó là ghi chú tiếng Việt (chính là 11 ô mà trang tự nêu ở luận điểm bên dưới). Số slug tiếng Anh thật là 113. Hai con số 124 và 11 nằm ở hai luận điểm khác nhau nên người đọc dễ cộng nhầm.", action: "Ghi '124 ô có giá trị ở cột Slug, trong đó 113 là slug tiếng Anh thật và 11 là ghi chú ý tưởng'"}
  - {id: 4, reviewer: grounding, class: dismiss, claim: "Năm chỗ đã sửa theo lượt rà trước (cụm điều hòa 3/4, 9 sub category, mã lỗi để ngỏ, 9 hub chia 6+3, 58 bài đăng kèm lệch 3 dòng)", evidence: "Đối chiếu lại raw: cột 'Internal Link đến' đúng 3/4 bài trỏ ngược về cleaning-guide (air-conditioner-no-power chỉ trỏ sang air-conditioner-not-cooling); cột 'Sub category' có 10 ô, 9 sub category thật cộng ô ghi chú 'quạt nước, quạt nước to'; ô raw ghi 'sửa mã lỗi của các điều hòa -> cân nhắc' và cụm 給湯器 còn ô 'các bài viết về mã lỗi'; có 9 ô nhắc 'tổng hợp' với đúng 6 ô dùng nguyên văn '1 bài tổng hợp triệu chứng/vấn đề/sự cố' và 3 hub khác loại; Posted=TRUE đúng 58 dòng (40 điện / 18 nước) và lệch đúng 3 dòng so với cột URL.", action: Không cần sửa — cả năm chỗ đã khớp raw}
  - {id: 5, reviewer: grounding, class: dismiss, claim: Trang tính thứ ba là checklist SEO on-page 38 dòng, evidence: "Sheet 'Trang tính2' có đúng 38 dòng không rỗng, nhưng gồm cả dòng tiêu đề cột, dòng 'Xác minh website' và 2 dòng tiêu đề khối; số tiêu chí thực khoảng 34. Mọi nội dung được trích (50 ký tự, 1-2%, URL <75 ký tự, ít nhất 1 external + 1 internal link, logo B PRODUCTIONS, bprovn.com) đều khớp raw.", action: "Không bắt buộc sửa; nếu muốn chính xác thì ghi '38 dòng, trong đó khoảng 34 tiêu chí'"}
  - {id: 6, reviewer: grounding, class: dismiss, claim: "Bản chính gồm 11 cột: Category, Sub category, từ khóa, Slug, ...", evidence: "Sheet có đúng 11 cột và 10 tiêu đề khớp raw; riêng cột thứ ba (chứa từ khóa tiếng Nhật) không có tiêu đề trong bảng — 'từ khóa' là tên do trang đặt. Không ảnh hưởng nghĩa.", action: Không cần sửa}
---

## Summary

Đây là bảng tính bản đồ từ khóa tổng thể cho blog Setsubi-pro, gồm ba trang tính: một bản nháp ban đầu, một bản chính đã mở rộng và một checklist SEO on-page. Bản chính liệt kê 211 dòng chủ đề xếp theo hai nhóm lớn là điện và nước, mỗi dòng gắn từ khóa tiếng Nhật, slug tiếng Anh, tiêu đề bài, URL đã đăng và danh sách bài cần link nội bộ. So với bản nháp, bản chính đã bỏ nhóm gas riêng và chuyển máy nước nóng sang nhóm điện. Toàn bảng cho thấy tiến độ thực tế: 58 bài đã đăng, phần còn lại mới ở dạng từ khóa hoặc ghi chú ý tưởng bằng tiếng Việt.

## Key claims

- [high] Trục tổ chức chính của bản đồ là `Category → Sub category → từ khóa`, không phải theo thời gian. Bản chính chỉ còn hai category là `電気` (117 dòng) và `水回り` (94 dòng), tổng 211 dòng chủ đề.
- [high] Bản nháp ở trang tính đầu chia ba pillar `電気`, `水回り`, `ガス` với 40 dòng; bản chính đã bỏ hẳn pillar gas và gom `給湯器` vào nhóm điện.
- [high] Lý do gom `給湯器` vào nhóm điện được ghi thẳng trong ô tiêu đề nhóm: nhóm nước tổ chức theo địa điểm xảy ra sự cố còn nhóm điện tổ chức theo thiết bị, mà máy nước nóng nằm giữa ranh giới điện và nước.
- [high] Bản chính có 9 sub category thật: `エアコン`, `アンテナ`, `コンセント`, `ブレーカー`, `照明`, `給湯器` thuộc nhóm điện; `浴室・洗面所`, `トイレ`, `キッチン` thuộc nhóm nước. Cột này còn một ô thứ mười là ghi chú ý tưởng tiếng Việt (`quạt nước, quạt nước to`) chưa gắn dòng từ khóa nào.
- [high] Tiến độ tại thời điểm chụp bảng là 58 dòng đánh dấu đã đăng, chia 40 bài nhóm điện và 18 bài nhóm nước. Cột đánh dấu và cột URL lệch nhau ở 3 dòng: `bathtub-lifespan` đã tick nhưng bỏ trống URL, còn `bathtub-drain-clog` và `水道メーターが故障` có URL thật nhưng chưa tick — tổng cộng có 59 URL trên `setsubi-pro.net/columns/`.
- [high] Mỗi bài được gán trước một slug tiếng Anh dù nội dung và tiêu đề đều bằng tiếng Nhật — 124 dòng đã có slug, ví dụ `air-conditioner-not-heating`, `breaker-keeps-tripping`, `toilet-water-leak-causes-solutions`.
- [medium] Bảng có cột `Internal Link đến` khai báo trước mạng liên kết nội bộ: 20 dòng đã điền, trong đó `air-conditioner-cleaning-guide` đóng vai trò trục, link ra bốn bài triệu chứng điều hòa nhưng chỉ ba trong bốn bài đó link ngược lại — cụm chưa khép kín.
- [medium] Kế hoạch dự trù 9 bài hub. Sáu bài dùng đúng công thức "1 bài tổng hợp triệu chứng/vấn đề/sự cố" theo từng nhóm thiết bị, ba bài còn lại là hub loại khác: tuổi thọ thiết bị, hub sự cố đường ống nước và hub tự xử lý tắc bồn cầu. Ba nhóm đã có từ khóa hub riêng dạng `完全ガイド`: `エアコントラブル完全ガイド`, `アンテナトラブル完全ガイド`, `コンセントトラブル完全ガイド`.
- [medium] 22 từ khóa thuộc nhóm chi phí (`費用` hoặc `料金`), nhưng một ghi chú trong bảng nói công ty không có bảng giá công khai, nên hướng xử lý là viết khoảng giá tham khảo kèm cảnh báo giá thay đổi theo dòng máy và mức hư hại.
- [medium] 84 dòng có từ khóa nhưng chưa gán slug, cho thấy phần lớn backlog vẫn ở giai đoạn thu thập từ khóa chứ chưa lên kế hoạch bài cụ thể.
- [medium] 11 ô ở cột slug thực chất là ghi chú tiếng Việt chứ không phải slug, ví dụ ý tưởng bài về tuổi thọ thiết bị hoặc bài cân nhắc sửa hay thay máy.
- [low] Slug `antenna-repair-price` xuất hiện hai lần cho hai biến thể từ khóa gần như trùng nhau (`アンテナ 修理 費用` và `アンテナ修理 費用`), là rủi ro trùng lặp nội dung cần gộp.
- [low] Trang tính thứ ba là checklist SEO on-page 38 dòng, chia hai khối `Basic SEO` và `Additional SEO`, quy định meta title trong 50 ký tự đầu, mật độ từ khóa 1–2%, URL dưới 75 ký tự, tối thiểu một external link và một internal link.
- [low] Checklist này còn sót ràng buộc từ dự án khác: yêu cầu ảnh chứa logo B PRODUCTIONS và internal link trỏ về `bprovn.com`, không phải `setsubi-pro.net`.

## Evidence

- Bản chính gồm 11 cột: `Category`, `Sub category`, từ khóa, `Slug`, `Nội dung sơ bộ`, `Blog Title`, `Tham khảo`, `URL đã đăng`, `Posted`, `Tóm tắt bài viết`, `Internal Link đến`. Hai cột `Nội dung sơ bộ` và `Tóm tắt bài viết` gần như bỏ trống.
- Cụm điều hòa minh họa rõ mô hình hub: `air-conditioner-cleaning-guide` khai báo link đến `air-conditioner-not-cooling`, `air-conditioner-not-heating`, `air-conditioner-noisy`, `air-conditioner-no-power`. Ba bài đầu khai báo link ngược về cleaning-guide, riêng `air-conditioner-no-power` chỉ trỏ về `air-conditioner-not-cooling`.
- Cụm cầu dao dùng một trục khác: bốn bài `breaker-keeps-tripping`, `breaker-trip-cannot-reset`, `earth-leakage-breaker-tripped`, `safety-breaker-tripped` đều link về `breaker-tripping`, và bài `breaker-tripping` ghi rõ đoạn nào trong bài sẽ dẫn sang bài nào.
- Ghi chú ở cụm toilet mô tả chiến lược hai bài link chéo: một bài chẩn đoán nguyên nhân tắc và một bài hướng dẫn tự xử lý từng bước, với mục đích được nêu thẳng là "xây dựng uy tín, thay vì chỉ suốt ngày hối họ liên hệ".
- Ghi chú ở cụm điều hòa để ngỏ chủ đề mã lỗi với lý do mỗi hãng máy dùng một bảng mã khác nhau — bảng ghi "cân nhắc" chứ chưa loại bỏ, và ở cụm máy nước nóng vẫn còn một dòng "các bài viết về mã lỗi". Bài "cách chọn công ty sửa chữa uy tín" cũng đang ở trạng thái cân nhắc.
- Dòng cuối bảng đặt câu hỏi mở về việc có nên thêm nhóm tủ lạnh, máy giặt, máy rửa bát hay không, với điều kiện phải khảo sát xem các website sửa chữa khác có phân nhóm này không.

## Related concepts

- [[concepts/seo/ngan-hang-tu-khoa-theo-thiet-bi-van-de-va-intent]]
- [[concepts/seo/mo-hinh-pillar-cluster]]
- [[concepts/seo/seo-symptom-problem-first]]
- [[concepts/seo/checklist-seo-100-diem]]
- [[concepts/seo/gop-tu-khoa-cung-intent-vao-mot-bai]]
- [[concepts/seo/ma-tran-internal-link-khai-bao-truoc]]
- [[concepts/seo/slug-tieng-anh-cho-noi-dung-tieng-nhat]]

## Related sources

- [[sources/ke-hoach-noi-dung-blog-va-seo-cho-setsuki-pro]]
- [[sources/list-keyword-seo-setsubi-pro-thang-8-va-9]]
- [[sources/huong-dan-viet-bai-seo-cho-setsubi-pro]]
- [[sources/ban-do-seo-setsubi-pro-net]] — ghi nhận bản đồ keyword đã dừng ở giai đoạn đầu trong khi site đã lên 73 bài

## People

## Open questions

- Có nên mở thêm nhóm thiết bị gia dụng (tủ lạnh, máy giặt, máy rửa bát) không? Bảng ghi điều kiện là phải khảo sát cách phân nhóm của các website sửa chữa khác trước.
- Nhóm gas đã biến mất khỏi bản chính — đây là quyết định bỏ hẳn hay chỉ tạm hoãn? Bảng không ghi lý do.
- 22 từ khóa chi phí sẽ xử lý thế nào khi công ty không công bố bảng giá? Bảng mới nêu hướng viết khoảng tham khảo, chưa chốt nguồn số liệu.
- Checklist ở trang tính thứ ba đang tham chiếu `bprovn.com` và logo B PRODUCTIONS; cần xác nhận checklist này có được điều chỉnh lại cho Setsubi-pro hay không.
- Hai từ khóa `アンテナ 修理 費用` và `アンテナ修理 費用` cùng trỏ vào slug `antenna-repair-price` — gộp làm một bài hay tách?
- Cụm điều hòa chưa khép kín: `air-conditioner-no-power` chưa khai báo link ngược về bài trục `air-conditioner-cleaning-guide`. Đây là thiếu sót trong bảng hay là chủ ý?
