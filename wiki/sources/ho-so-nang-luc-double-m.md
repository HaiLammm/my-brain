---
type: source
title: Hồ sơ năng lực Double M (株式会社ダブルエム サービス紹介資料)
authors:
  - 株式会社ダブルエム (Double M Inc.)
source_type: note
importance: 2
confidence: medium
tags:
  - seminar-marketing
  - company-profile
  - nhat-ban
  - marketing
  - b2b
raw_paths:
  - raw/download/hosonangluc.pdf
urls:
  - "https://double-m-inc.com/"
provenance: replayable
id: sources/ho-so-nang-luc-double-m
created: 2026-09-05
updated: 2026-09-05
year: 2024
sources:
  - {provider: pdf, fetched_at: "2026-09-05T09:26:41Z"}
external_ids:
  url: "https://double-m-inc.com/"
ingest_status: finalized
verify_status: passed
findings:
  - {id: 1, reviewer: grounding, class: dismiss, claim: "Câu mở đầu phần Summary: \"Tài liệu giới thiệu dịch vụ (サービス紹介資料 / hồ sơ năng lực) dài 20 trang\"", evidence: "Đã sửa đúng ở lượt này. Trang 1 của PDF ghi nguyên văn 「株式会社ダブルエムサービス紹介資料」; thân bài giờ dùng đúng サービス紹介資料, khớp với frontmatter title. Số trang 20 khớp pypdf. Chuỗi 会社紹介資料 chỉ còn nằm trong khối findings cũ ở frontmatter (bản ghi kiểm tra), không phải luận điểm trong thân bài.", action: Không cần sửa.}
  - {id: 2, reviewer: grounding, class: dismiss, claim: "Key claims, gạch đầu dòng quy mô kinh nghiệm: \"3 cuốn sách chuyên môn đã xuất bản... Bốn đầu sách liệt kê ở trang 19 là 著書 của riêng people/yasui-mayo, không phải của công ty\"", evidence: "Đã sửa đúng ở lượt này. Trang 5 「専門書を3冊出版」 gán cho ダブルエム; trang 19 liệt kê 4 đầu sách dưới nhãn 著書 của cá nhân 安井麻代 (すばる舎 / 同文館出版 / セルバ出版 / ぱる出版). Gạch đầu dòng giờ tách rõ hai chủ thể, đọc rời không còn hiểu nhầm.", action: Không cần sửa.}
  - {id: 3, reviewer: grounding, class: dismiss, claim: "concepts/marketing/noi-bo-hoa-nang-luc-marketing, mục Notes: \"Cách nó tự giải quyết — đây là suy ra từ danh mục chín dòng dịch vụ, không phải điều tài liệu nói ra — là chuyển doanh thu sang tầng cao hơn\"", evidence: "Đã sửa đúng ở lượt này. Cụm \"theo tài liệu\" đã bị thay bằng ghi chú nói rõ đây là suy luận từ danh mục chín dòng dịch vụ ①–⑨. PDF thật sự không có câu nào nói công ty giải mâu thuẫn mô hình bằng cách dịch doanh thu lên tầng cao hơn, nên nhãn suy luận là đúng.", action: Không cần sửa.}
  - {id: 4, reviewer: grounding, class: dismiss, claim: Cạnh đồ thị sources/ho-so-nang-luc-double-m --authored_by--> people/yasui-mayo (và cạnh ngược authored), evidence: "Giới hạn đã biết và được chấp nhận, không phải lỗi cần xử lý. EDGE_TYPES trong _lumina/scripts/schemas.mjs không có quan hệ source→people nào khác ngoài authored_by. Cả hai thân bài đều đã nói rõ 安井麻代 là nhân vật được giới thiệu ở trang 19 (「セミナープロデューサー紹介」), không phải người soạn tài liệu — nên sai lệch được công khai chứ không ngầm.", action: Không cần sửa. Ghi nhận để tra cứu về sau.}
  - {id: 5, reviewer: grounding, class: dismiss, claim: "Rà lại toàn bộ thân bài (Summary, Key claims, Evidence, Related concepts, Related sources, People, Open questions, Notes) cùng bốn trang khái niệm seminar-marketing, ho-tro-mot-dau-moi, noi-bo-hoa-nang-luc-marketing, doi-marketing-thue-ngoai và trang people/yasui-mayo", evidence: "Đối chiếu từng mục với 20 trang PDF: metadata /CreationDate D:20241121 và 20 trang khớp; ba nỗi đau trang 3; bộ ba lợi thế hội thảo ở trang 4 và trang 7; 1500本以上 ở trang 5, 7 và 19; 一気通貫 kèm danh sách LP/動画/チラシ/スライド/講師ブッキング/当日運営/ウェビナー配信 trang 5; bảng so sánh trang 6 gán đúng 「積み上がると結局高くなる」 cho cột セミナー業者・集客代行 và 「ノウハウがなく予算消化して終わりになることが多い」 cho cột 自社で行う; dịch vụ ①–⑨ trang 7–15, mỗi trang đúng khuôn 3 nỗi lo → 3 điều giải được → 6 lợi ích; sáu lợi ích 内製化 trang 8; bốn điểm マカセルプロ trang 14 (một đầu mối, điều chỉnh hằng tháng, quyết định theo dữ liệu thời gian thực, tri thức đọng lại phía khách); bốn lời chứng trang 16 với 1,118名/数百万円, 60万円×約300名/125点, 成約率1.5倍 và 川口 không nêu con số kết quả; trả trước và 2営業日以内 trang 17; 10名～1万人以上, ビジネスセミナー, 3 tháng (1+1+1) trang 18; trang 19 khớp toàn bộ hồ sơ 安井麻代 (1980年愛知県, 2000 nhập công ty, 2007 độc lập + bar Ginza, 1500本/3万人, 4 đầu sách, 書店7店舗1位, 2億円, 再受講率7割, 集客平均3倍, 成約率2倍, 「価値が正しく評価される社会」) và mục 会社概要 chỉ có 社名/本社/事業内容/URL, không có năm thành lập. Bốn cạnh introduces_concept/introduced_in khớp vì cả bốn khái niệm đều được tài liệu nêu tên và giải thích. Liên kết [[sources/bo-kich-ban-email-marketing-wa-craft]] là đối chiếu nội bộ wiki, không phải luận điểm rút từ PDF, và trang đích tồn tại. Không còn luận điểm nào thiếu căn cứ.", action: Không cần sửa.}
---

## Summary

Tài liệu giới thiệu dịch vụ (サービス紹介資料 / hồ sơ năng lực) dài 20 trang của **株式会社ダブルエム — Double M Inc.**, một công ty ở Nagoya chuyên tổ chức và kinh doanh hóa hội thảo doanh nghiệp. Luận điểm trung tâm: mọi vấn đề marketing mà tài liệu nêu ở trang đầu — *"muốn truyền đạt giá trị sản phẩm tốt hơn"*, *"không biết khác biệt hóa với đối thủ ra sao"*, *"làm sao xây được quan hệ tin cậy với khách"* — đều giải được bằng **hội thảo (セミナー) đặt ở vị trí trung tâm của phễu marketing**, chứ không phải bằng thêm quảng cáo.

Đây là tài liệu bán hàng, không phải nghiên cứu. Giá trị của nó với wiki nằm ở chỗ nó trình bày trọn vẹn một **mô hình kinh doanh dựa trên hội thảo**: chín dòng dịch vụ bao trọn chuỗi từ chiến lược → nội dung → thu hút người tham dự → vận hành ngày diễn ra → chốt đơn và chăm sóc sau, cộng một bảng so sánh tự đặt mình cạnh ba lựa chọn thay thế — doanh nghiệp tự làm, công ty môi giới giảng viên, và các nhà thầu hội thảo hoặc thu hút người dự — và bốn lời chứng khách hàng.

Tệp PDF được tạo ngày **21/11/2024** (theo metadata); bản thân nội dung không ghi ngày phát hành.

## Key claims

- **Hội thảo là công cụ marketing hiệu quả hơn quảng cáo ở ba điểm**: xây quan hệ tin cậy qua đối thoại trực tiếp; lọc được người thực sự quan tâm một chủ đề nên nhắm mục tiêu chính xác hơn các kênh quảng cáo khác; và người tham dự giải đáp được thắc mắc ngay tại chỗ nên xác suất bước sang hành động mua cao hơn. *(luận điểm cốt lõi, nêu ở trang 4 và nhắc lại ở trang 7 — nhưng là khẳng định của bên bán, không kèm dữ liệu đối chứng)*
- **Lợi thế cạnh tranh mà công ty tự nhận là "một đầu mối trọn gói"** (一気通貫): từ lập chiến lược, lên kịch bản, làm LP/video/tờ rơi/slide, đặt giảng viên, vận hành tại chỗ tới phát trực tuyến đều do một bên đảm nhận. Bảng so sánh lập luận rằng chia nhỏ cho nhiều nhà thầu thì các khoản cộng lại rốt cuộc đắt hơn (「積み上がると結局高くなる」); còn lời chê "không có know-how nên tiêu hết ngân sách rồi thôi" thì bảng dành riêng cho cột **doanh nghiệp tự làm**, không phải cho các nhà thầu. *(có cơ sở logic, nhưng do chính bên bán soạn)*
- **Quy mô kinh nghiệm được nêu**: hơn **1.500 hội thảo** đã tổ chức, **3 cuốn sách chuyên môn** đã xuất bản, có giảng dạy ở doanh nghiệp và trường đại học. Bốn đầu sách liệt kê ở trang 19 là 著書 của riêng [[people/yasui-mayo]], không phải của công ty. *(số liệu tự công bố)*
- **Nội bộ hóa (内製化) được bán như một dịch vụ, không phải rủi ro**: công ty có hẳn chương trình huấn luyện để khách tự tổ chức hội thảo, kèm sáu lợi ích được liệt kê — giảm chi phí, phản ứng nhanh và linh hoạt, tích lũy know-how nội bộ, mạnh thương hiệu, nâng kỹ năng nhân viên, kiểm soát được kết quả. Đây là chỗ mô hình kinh doanh tự mâu thuẫn thú vị: dạy khách cách không cần mình nữa.
- **"Makaseru Pro" (マカセルプロ) là mô hình đội marketing thuê ngoài theo giai đoạn**: triệu tập chuyên gia marketing trong một khoảng thời gian giới hạn thay vì tuyển nhân sự cố định, với lập luận rằng người được tuyển "chưa chắc phát huy được, hợp không hợp thì nghỉ sớm". Cam kết đi kèm là mọi ý đồ triển khai, kết quả và đề xuất cải tiến đều đọng lại thành tri thức của khách.
- **Phạm vi nhận việc**: chỉ hội thảo doanh nghiệp (ビジネスセミナー), quy mô từ 10 người đến trên 10.000 người, cả trực tiếp lẫn trực tuyến. Dựng một trường học trực tuyến mất khoảng **3 tháng** — 1 tháng nghiên cứu, 1 tháng sản xuất, 1 tháng thu hút và bán.
- **Điều kiện thanh toán là trả trước**: quy trình 5 bước ghi rõ chỉ bắt đầu chuẩn bị chính thức sau khi xác nhận nhận được tiền; phản hồi liên hệ trong vòng **2 ngày làm việc**.

## Evidence

Bốn lời chứng khách hàng, ba trong đó kèm con số:

- **一般社団法人企業共創支援機構 (lý sự 林周平)** — tổ chức mới lập, ít người biết, cần tăng hội viên mà không lỗ. Kết quả nêu: mời được tác giả sách bán chạy, tập hợp **1.118 chủ doanh nghiệp vừa và nhỏ**, thu về "vài triệu yên".
- **株式会社シュウ・カワグチ (giám đốc 川口菜旺子)** — sự kiện kết hợp kế nghiệp gia đình hướng tới 100 năm thành lập và ra mắt sách. Kết quả nêu: có thêm ý tưởng gọi vốn cộng đồng trên chính website công ty, hiệu ứng lan tỏa qua mạng xã hội, phát sinh cuộc hẹn thương thảo.
- **株式会社セミナーエリート (giám đốc 坂田公太郎)** — bán được sản phẩm giá **600.000 yên cho khoảng 300 người**. Câu chấm điểm: *"125 điểm trên thang 100"*.
- **ドットアンドノート株式会社 (giám đốc 稲垣達也)** — sự kiện của một hãng bảo hiểm đã "nhàm", cần chuyển thành sự kiện chốt được đơn. Cách làm: nhắm nhóm mẹ đang nuôi con nhỏ, đàm phán mời người có ảnh hưởng 益若つばさ xuất hiện. Kết quả nêu: tỷ lệ chốt sản phẩm bảo hiểm đạt **1,5 lần** so với trước.

Thành tích cá nhân của người sản xuất nêu ở trang 19: khóa học doanh thu vượt **200 triệu yên**, khóa có tỷ lệ học lại trên **70%**; ở mảng tư vấn cho doanh nghiệp: số người tham dự trung bình tăng **3 lần**, tỷ lệ chốt tăng **2 lần**.

**Cảnh báo đọc:** toàn bộ số liệu trên là do bên bán tự nêu trong tài liệu tiếp thị của chính mình. Không có mẫu đối chứng, không có cách kiểm chứng độc lập trong tài liệu. Hãy đọc chúng như tuyên bố định vị, không như bằng chứng.

## Related concepts

- [[concepts/marketing/seminar-marketing]] — hội thảo đặt ở trung tâm phễu marketing
- [[concepts/marketing/ho-tro-mot-dau-moi]] — trọn gói một nhà cung cấp so với ghép nhiều nhà cung cấp
- [[concepts/marketing/noi-bo-hoa-nang-luc-marketing]] — 内製化, chuyển năng lực từ ngoài vào trong
- [[concepts/marketing/doi-marketing-thue-ngoai]] — thuê đội chuyên gia theo giai đoạn thay vì tuyển cố định

## Related sources

- [[sources/bo-kich-ban-email-marketing-wa-craft]] — cùng thị trường B2B Nhật, nhưng chọn kênh ngược lại: email lạnh hàng loạt thay vì tập hợp người tại một sự kiện
- [[sources/ho-so-cong-ty-wa-craft]] — cùng bài toán bán dịch vụ thuê ngoài cho khách Nhật, khác chỗ đứng: bên này bán năng lực marketing theo giai đoạn, bên kia bán vận hành back-office

## People

- [[people/yasui-mayo]] — 安井麻代, Seminar Producer. Bà là **người duy nhất được nêu tên** trong tài liệu, ở mục 「セミナープロデューサー紹介」 (trang 19). Tài liệu do công ty đứng tên; không có chỗ nào ghi bà là người soạn. Đồ thị của wiki chỉ có một loại quan hệ giữa nguồn và người (`authored_by`), nên liên kết ở đây nên đọc là *được giới thiệu trong*, không phải *viết ra*.

## Open questions

- **Tài liệu này đến wiki để làm gì?** Nó nằm ở `raw/download/` với tên `hosonangluc.pdf` (hồ sơ năng lực) — có thể là mẫu tham khảo để soạn hồ sơ năng lực cho công ty của bạn, có thể là đối thủ, có thể là đối tác tiềm năng. Chưa có gì trong tài liệu trả lời được câu này.
- **Con số "1.500 hội thảo" xuất hiện ba lần** — trang 5 và trang 7 ghi cho công ty, trang 19 ghi cho riêng 安井麻代 ("tự mình sản xuất hơn 1.500 hội thảo, huy động trên 30.000 người"). Không rõ đây là cùng một phép đếm kể ba lần, hay thành tích cá nhân và thành tích công ty trùng nhau vì gần như mọi hội thảo đều do một người sản xuất.
- **Số sách nêu ở hai chỗ không bằng nhau, nhưng cũng không hẳn mâu thuẫn**: trang 5 ghi *công ty* xuất bản 3 cuốn sách chuyên môn, trong khi trang 19 liệt kê 4 đầu sách dưới mục 著書 của *cá nhân* 安井麻代. Hai chủ thể khác nhau nên chưa kết luận được đây là lỗi cập nhật hay hai phép đếm hợp lệ.
- **Tài liệu không công bố năm thành lập công ty** ở bất kỳ trang nào — mục 会社概要 chỉ có tên, địa chỉ, ngành nghề và website.
- Bốn cuốn sách của 安井麻代 chưa có trang nguồn trong wiki; nếu muốn đi sâu vào phương pháp thì `すごいセミナー営業` (ぱる出版) là điểm vào hợp lý.

## Notes

**Cấu trúc tài liệu đáng học riêng, tách khỏi nội dung.** Trình tự 20 trang là một khuôn hồ sơ năng lực B2B Nhật khá chuẩn: nỗi đau của khách → tại sao cách của chúng tôi giải được → tại sao là chúng tôi → so với các lựa chọn khác → từng dịch vụ → lời chứng → quy trình → hỏi đáp → hồ sơ công ty và con người. Mỗi trang dịch vụ lại lặp đúng một khuôn con: *"nỗi lo khi tổ chức"* (3 gạch đầu dòng) → *"điều chúng tôi giải được"* (3 gạch) → *"6 lợi ích"*. Sự lặp lại đó khiến tài liệu đọc rất nhanh — người đọc học khuôn ở trang thứ nhất rồi lướt được các trang sau.

**Chỗ tài liệu tự làm yếu mình.** Chín dòng dịch vụ trên một công ty là nhiều, và hai dòng cuối — マカセルプロ (thuê đội marketing) và トレル (dịch vụ tuyển dụng) — đã rời khỏi trục "hội thảo" mà cả tài liệu dựng lên ở đầu. Người đọc kỹ sẽ thấy mâu thuẫn giữa thông điệp *"chúng tôi là chuyên gia hội thảo"* và danh mục *"chúng tôi làm cả tuyển dụng"*. Đây là cái giá của việc gộp mọi thứ vào một hồ sơ thay vì tách bộ tài liệu theo từng dòng.
