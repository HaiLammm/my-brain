---
id: google-title-link
title: Title link — hướng dẫn của Google về tiêu đề trên kết quả tìm kiếm
type: source
created: 2026-10-01
updated: 2026-10-01
authors:
  - Google Search Central
year: 2025
source_type: article
importance: 3
provenance: replayable
confidence: unverified
tags:
  - seo
  - google
  - tai-lieu-chinh-thuc
  - serp
  - on-page
urls:
  - "https://developers.google.com/search/docs/appearance/title-link"
raw_paths:
  - raw/download/google-search/title-link.md
external_ids:
  url: "https://developers.google.com/search/docs/appearance/title-link?hl=en"
sources:
  - {provider: pdf, fetched_at: "2026-09-30T17:04:13Z", url: "https://developers.google.com/search/docs/appearance/title-link"}
pending_citations:
  - {ns: url, value: "https://developers.google.com/search/docs/essentials/spam-policies?hl=en", title: Spam policies for Google web search}
  - {ns: url, value: "https://developers.google.com/search/docs/appearance/site-names?hl=en"}
  - {ns: url, value: "https://developers.google.com/search/reference/robots_txt?hl=en"}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=en"}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=en"}
ingest_status: finalized
verify_status: passed
findings:
  - {id: 1, reviewer: grounding, class: dismiss, claim: "[concepts/seo/gioi-han-hien-thi-serp-nhat, §Vì sao ngưỡng khác tiếng Latin] \"Ký tự kanji/kana chiếm bề ngang gấp đôi chữ Latin, nên cùng một bề ngang chứa ít ký tự tiếng Nhật hơn. Vì vậy ngưỡng '60 ký tự tiêu đề' quen thuộc từ tài liệu SEO tiếng Anh không áp dụng được.\"", evidence: "Tài liệu Google không nói gì về bề ngang kanji/kana hay ngưỡng 60 ký tự tiếng Anh; ghi chú gốc NOTE.md của trang rules cũng không có. Hai câu này có từ trước lần sửa và không bị gán cho Google, vì cụm \"Theo Google\" và trích dẫn chỉ bao câu đầu. Nội dung cũng là hiểu biết phổ biến (全角/半角). Nhưng hai câu đứng ngay sau trích dẫn, còn nhãn \"Suy luận của wiki\" chỉ gắn cho câu cuối, nên người đọc dễ tưởng cả chuỗi lập luận đều lấy từ tài liệu Google.", action: "Tùy chọn: gắn nhãn \"hiểu biết chung, không từ tài liệu Google\" cho hai câu này, hoặc đưa chúng vào đoạn \"Suy luận của wiki\"."}
  - {id: 2, reviewer: grounding, class: dismiss, claim: "Các chú thích ngắn \"cắt theo bề ngang thiết bị\" / \"cơ chế cắt theo bề ngang được xác nhận\": [sources/google-title-link] mục Related concepts (tieu-de-lien-ket) và Related sources (rules); [concepts/seo/tieu-de-lien-ket] Key sources; [concepts/seo/gioi-han-hien-thi-serp-nhat] câu mở §Đối chiếu, Key sources và Notes", evidence: "Nguồn viết \"truncated ... as needed, typically to fit the device width\". Các câu chính trong thân bài đều giữ đúng \"khi cần, thường\", chỉ các chú thích ngắn bỏ hai chữ rào này. Nghĩa không đổi nhiều.", action: "Tùy chọn: thêm \"thường\" vào các chú thích ngắn cho khớp lời nguồn."}
  - {id: 3, reviewer: grounding, class: dismiss, claim: "[sources/google-title-link, Summary] \"Tài liệu có ba phần: các thực hành tốt khi viết thẻ <title>, chín nguồn ..., và bảy lỗi thường gặp ...\"", evidence: "Tài liệu gốc có bốn mục cấp H2. Mục thứ tư \"Submitting feedback about title links\" chỉ dài một đoạn và đã được tóm ở Key claims cuối. Các con số chín nguồn và bảy lỗi đều khớp với nguồn.", action: "Tùy chọn: sửa thành \"ba phần chính\" hoặc nhắc thêm đoạn gửi phản hồi."}
---

## Summary

Tài liệu chính thức của Google Search Central về **title link** — dòng tiêu đề của một kết quả tìm kiếm, phần người dùng bấm vào. Tài liệu có ba phần: các thực hành tốt khi viết thẻ `<title>`, chín nguồn mà Google dùng để tự động sinh title link, và bảy lỗi thường gặp mà Google tự xử lý bằng cách viết lại tiêu đề.

Với wiki này, tài liệu trả lời một câu hỏi mở từ [[sources/google-seo-starter-guide]]: thẻ `<title>` **không có giới hạn độ dài**, còn title link bị cắt "khi cần, thường để vừa bề ngang thiết bị". Nghĩa là các ngưỡng số ký tự đang dùng cho SERP tiếng Nhật là ước lượng của ngành, không phải con số Google công bố. Tài liệu cũng cho biết, với tên site cấp domain, Google có thể **bỏ tên site khỏi title link** nếu tên đó lặp với tên site đã hiện trên kết quả — điều có thể ảnh hưởng tới hậu tố `｜設備プロ` mà Setsubi-pro gắn vào mọi tiêu đề.

## Key claims

- Title link là tiêu đề của một kết quả trên Google Search và các sản phẩm khác (ví dụ Google News), dẫn tới trang web; Google dùng nhiều nguồn để **tự động** xác định nó, người viết chỉ có thể nêu mong muốn bằng cách làm theo thực hành tốt (§Influencing your title links — đoạn mở đầu)
- Title link thường là thông tin chính người dùng dựa vào để quyết định bấm kết quả nào, nên chữ trong `<title>` cần chất lượng cao (§Best practices for influencing title links)
- Mỗi trang cần có `<title>`; chữ trong đó nên **mô tả và ngắn gọn**, tránh các nhãn mơ hồ như "Home" hay "Profile" (§Best practices)
- Thẻ `<title>` **không có giới hạn độ dài**, nhưng title link bị cắt khi cần, **thường để vừa bề ngang thiết bị**; vì vậy nên tránh chữ dài dòng không cần thiết (§Best practices)
- Vài từ mô tả trong `<title>` là có ích, nhưng lặp cùng một từ hoặc cụm từ là **nhồi từ khóa**: không giúp người dùng và có thể khiến kết quả trông như spam với cả Google lẫn người dùng (§Best practices — Avoid keyword stuffing)
- Mỗi trang cần `<title>` riêng mô tả đúng nội dung của nó; tiêu đề giống nhau trên nhiều trang, hoặc tiêu đề dài chỉ khác nhau một chi tiết (boilerplate), đều làm người dùng không phân biệt được các trang. Một cách xử lý là sinh `<title>` động theo nội dung thật của từng trang (§Best practices — Avoid repeated or boilerplate text)
- Gắn thương hiệu **ngắn gọn**: trang chủ có thể thêm vài thông tin về site; các trang khác chỉ nên đặt tên site ở đầu hoặc cuối `<title>`, ngăn với phần còn lại bằng dấu gạch ngang, dấu hai chấm hoặc dấu gạch đứng (§Best practices — Brand your titles concisely)
- Cần làm rõ đâu là **tiêu đề chính** của trang: nổi bật nhất trang, ví dụ cỡ chữ lớn hơn hoặc đặt trong phần tử `<h1>` hiển thị đầu tiên; nhiều heading cùng độ nổi bật sẽ gây nhầm, và khi đó Google có thể lấy heading đầu tiên làm title link (§Best practices — Make it clear which text is the main title; §No clear main title)
- robots.txt chặn Google crawl trang nhưng **không phải lúc nào cũng chặn được việc lập chỉ mục**: Google vẫn có thể index trang tìm thấy qua liên kết từ site khác, và khi không đọc được nội dung thì title link được lấy từ nội dung ngoài trang như anchor text của site khác. Muốn chặn lập chỉ mục thì dùng quy tắc `noindex` (§Best practices — Be careful about disallowing search engines)
- `<title>` nên dùng **cùng ngôn ngữ và hệ chữ** với nội dung chính của trang; nếu không khớp, Google có thể chọn đoạn chữ khác làm title link (§Best practices — Use the same language and writing system; §Mismatch of writing system or language)
- Việc sinh title link **hoàn toàn tự động**, xét cả nội dung trang lẫn các tham chiếu tới trang trên web. Chín nguồn Google dùng: nội dung `<title>`, tiêu đề hiển thị chính, các heading như `<h1>`, thẻ `og:title`, chữ lớn và nổi bật nhờ định dạng, chữ khác trong trang, anchor text trên trang, chữ trong các liên kết trỏ tới trang, và structured data `WebSite` (§How title links in Google Search are created)
- Google phải crawl và xử lý lại trang mới thấy được thay đổi ở các nguồn trên, việc này mất **vài ngày tới vài tuần**; có thể yêu cầu Google crawl lại (§How title links in Google Search are created)
- Google không chỉnh tay title link cho từng site (§How title links in Google Search are created)
- Bảy lỗi thường gặp mà Google tự xử lý: `<title>` thiếu một nửa, `<title>` lỗi thời (năm cũ), `<title>` không đúng nội dung trang, boilerplate lặp ở một nhóm trang (micro-boilerplate), không có tiêu đề chính rõ ràng, ngôn ngữ hoặc hệ chữ của `<title>` lệch với nội dung, và tên site bị lặp (§Common issues and how Google manages them)
- Với tên site cấp domain, Google có thể **bỏ tên site khỏi title link** nếu nó lặp lại tên site đã hiện trên kết quả tìm kiếm (§Duplication of the site name in the title element)
- Khi thấy title link bị sửa, trước hết kiểm tra trang có mắc một trong các lỗi trên không; nếu không, xét xem title link trên kết quả có hợp với truy vấn hơn không (§Submitting feedback about title links)

## Evidence

- Ví dụ nhồi từ khóa: `Foobar, foo bar, foobars, foo bars` (§Best practices)
- Ví dụ boilerplate: đặt mọi trang của một site bán hàng là "Cheap products for sale", hoặc `<title>` chung "Band Name - See videos, lyrics, posters, albums, reviews and concerts" cho mọi trang; cách sửa là chỉ đưa chữ "video" và "lyrics" vào khi trang đó thật sự có video hay lời bài hát (§Best practices)
- Ví dụ gắn thương hiệu: trang chủ dùng "ExampleSocialSite, a place for people to meet and mingle", còn trang con dùng "ExampleSocialSite: Sign up for a new account." (§Best practices — Brand your titles concisely)
- Ví dụ Google tự sửa: `| Site Name` thành "Product Name | Site Name" (title thiếu nửa); "2020 admissions criteria" thành "2021 admissions criteria" theo tiêu đề hiển thị trên trang (title lỗi thời); "Giant stuffed animals, teddy bears, polar bears - Site Name" thành "Stuffed animals - Site Name" (title không đúng nội dung); ba trang cùng tiêu đề một chương trình TV được thêm "Season 1/2/3" lấy từ tiêu đề lớn trên trang (micro-boilerplate) (§Common issues)
- Ví dụ lệch hệ chữ: trang viết tiếng Hindi nhưng `<title>` viết tiếng Anh hoặc phiên âm sang chữ Latin (§Use the same language and writing system)
- Trường hợp đặc biệt: trang vé máy bay không nên đưa giá vào `<title>`, vì giá đổi quá nhanh (có khi vài phút một lần) nên Google gần như sẽ không hiện giá trong title link (§Avoid including flight price information)

## Related concepts

- [[concepts/seo/tieu-de-lien-ket]] — tài liệu chuyên về khái niệm này: bổ sung danh sách chín nguồn, bảy lỗi Google tự sửa, và cơ chế cắt theo bề ngang thiết bị
- [[concepts/seo/gioi-han-hien-thi-serp-nhat]] — title link bị cắt khi cần, thường để vừa bề ngang thiết bị, và tài liệu không đưa ra con số ký tự nào; Google có thể bỏ tên site cấp domain khỏi title link (việc này ảnh hưởng tới hậu tố thương hiệu ra sao là suy luận của wiki, ghi trên trang khái niệm)
- [[concepts/seo/nhan-dang-site-tren-serp]] — tên site đặt ở đầu hoặc cuối `<title>` với một dấu ngăn; structured data `WebSite` là một nguồn sinh title link; tên site có thể bị bỏ nếu lặp với dòng tên site
- [[concepts/seo/cau-truc-heading-seo]] — một `<h1>` hiển thị đầu tiên, nổi bật nhất trang, giúp Google nhận ra tiêu đề chính; nhiều heading ngang nhau thì Google có thể lấy heading đầu tiên
- [[concepts/seo/mat-do-tu-khoa]] — lặp từ khóa trong `<title>` là nhồi từ khóa và có thể trông như spam
- [[concepts/seo/google-thu-thap-va-lap-chi-muc]] — robots.txt chặn crawl nhưng không chắc chặn được index; muốn chặn index dùng `noindex`; thay đổi cần vài ngày tới vài tuần để Google thấy

## Related sources

- [[sources/google-seo-starter-guide]] — Starter Guide chỉ nói một đoạn ngắn về title link (§Influence your title links) và trỏ sang tài liệu này; câu hỏi mở trên trang Starter Guide về cách cắt tiêu đề được trả lời ở đây
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — bộ luật nội bộ đặt ngưỡng ~30–32 ký tự cho tiêu đề và giới hạn ≤24 ký tự để chừa chỗ cho `｜設備プロ`; tài liệu này là căn cứ chính thức cho ghi chú độ tin cậy trên trang nguồn đó: title link bị cắt theo bề ngang thiết bị, và tài liệu không đưa ra giới hạn ký tự nào

## People

Không có — tác giả là tổ chức Google Search Central.

## Open questions

- Lý do đặt tiêu đề ≤24 ký tự là "dài hơn thì chính phần thương hiệu bị cắt". Nhưng nếu setsubi-pro.net đã có tên site cấp domain hiện trên kết quả, Google có thể tự bỏ hậu tố `｜設備プロ` khỏi title link. Site đã được Google hiện tên site chưa, và title link thật trên SERP đang hiện hậu tố hay không? Chỉ kiểm tra được bằng cách xem kết quả tìm kiếm thật.
- Tài liệu không đưa ra con số ký tự nào. Ngưỡng ~30–32 ký tự cho tiêu đề tiếng Nhật trên mobile vẫn là quan sát của ngành — cần đối chiếu bằng kết quả tìm kiếm thật trên vài thiết bị trước khi coi là quy tắc cứng.
- Tài liệu chỉ nói về tiêu đề. Phần mô tả (snippet) nằm ở tài liệu `snippet.md` đã tải nhưng chưa nạp; ngưỡng mô tả trên trang [[concepts/seo/gioi-han-hien-thi-serp-nhat]] cần đối chiếu khi nạp tài liệu đó.
- `og:title` và structured data `WebSite` cũng là nguồn sinh title link. `og:title` trên các bài Setsubi-pro có khớp với `<title>` không? Wiki chưa có thông tin.

## Notes

- Bản lưu là Markdown chuyển từ HTML bằng pandoc, giữ nguyên văn tiếng Anh; khối chú thích ở đầu tệp ghi URL gốc, ngày tải (2026-09-29) và ngày Google cập nhật (2025-12-10 UTC). Một hình minh hoạ SVG nhúng trong tệp không mang thông tin văn bản.
- Google công bố trang này ở chế độ "Last updated"; nội dung có thể thay đổi mà không có phiên bản — khi trích dẫn lại nên kèm ngày tải.
