---
id: sources/google-seo-starter-guide
title: SEO Starter Guide — hướng dẫn SEO cơ bản của Google
type: source
created: 2026-09-29
updated: 2026-10-01
authors:
  - Google Search Central
year: 2025
source_type: article
importance: 4
provenance: replayable
confidence: high
tags:
  - seo
  - google
  - tai-lieu-chinh-thuc
  - on-page
  - off-page
urls:
  - "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
raw_paths:
  - raw/download/google-search/seo-starter-guide.md
external_ids:
  url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
sources:
  - {provider: pdf, fetched_at: "2026-09-29T09:43:59Z", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"}
pending_citations:
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/301-redirects?hl=en", title: Redirects and Google Search}
  - {ns: url, value: "https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials?hl=en", title: Avoid intrusive interstitials and dialogs}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/canonicalization?hl=en", title: What is canonicalization}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=en", title: "How to specify a canonical URL with rel=\"canonical\" and other methods"}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/control-what-you-share?hl=en", title: Control what you share with Google}
  - {ns: url, value: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=en", title: "Creating helpful, reliable, people-first content"}
  - {ns: url, value: "https://developers.google.com/search/docs/fundamentals/do-i-need-seo?hl=en", title: Do you need an SEO?}
  - {ns: url, value: "https://developers.google.com/search/docs/essentials?hl=en", title: Google Search Essentials}
  - {ns: url, value: "https://developers.google.com/search/docs/appearance/google-images?hl=en", title: Google image SEO best practices}
  - {ns: url, value: "https://developers.google.com/search/docs/fundamentals/how-search-works?hl=en", title: In-depth guide to how Google Search works}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en", title: Link best practices for Google}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links?hl=en", title: Qualify your outbound links to Google}
  - {ns: url, value: "https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=en", title: Get started with Search Console}
  - {ns: url, value: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=en", title: Learn about sitemaps}
  - {ns: url, value: "https://developers.google.com/search/docs/appearance/snippet?hl=en", title: Control your snippets in search results}
  - {ns: url, value: "https://developers.google.com/search/docs/essentials/spam-policies?hl=en", title: Spam policies for Google web search}
  - {ns: url, value: "https://developers.google.com/search/docs/essentials/technical?hl=en", title: Google Search technical requirements}
  - {ns: url, value: "https://developers.google.com/search/docs/appearance/video?hl=en", title: Video SEO best practices}
ingest_status: finalized
verify_status: passed
findings:
  - {id: 1, reviewer: grounding, class: dismiss, claim: "[[sources/ban-do-seo-setsubi-pro-net]] — bản đồ nội bộ, phần bổ sung ở tầng chiến lược và đo lường mà tài liệu Google không nói tới (§Related sources)", evidence: "Raw có nói tới đo lường ở mức cơ bản: dòng 22 (wait a few weeks to assess whether your work had beneficial effects) và dòng 246 (Search Console helps you monitor and optimize how your website performs). Chính trang này cũng ghi hai ý đó ở §Key claims và ở chú thích cho concepts/seo/do-luong-truoc-khi-toi-uu. Tuy vậy, phần đo lường sâu của bản đồ nội bộ (GA4, baseline, tap-to-call) cùng bản đồ keyword, backlink và đối thủ thì raw đúng là không nhắc tới, nên quan hệ complementary_to vẫn đúng. Chỉ có chữ 'không nói tới' là hơi tuyệt đối.", action: "Không bắt buộc sửa. Muốn chặt hơn thì viết: tài liệu Google chỉ điểm qua phần đo lường (chờ vài tuần, Search Console) và không nói tới bản đồ keyword, backlink hay đối thủ."}
---

## Summary

Tài liệu chính thức của Google Search Central dành cho người mới làm SEO: giải thích Google tìm và hiển thị nội dung như thế nào, rồi đưa ra các việc nên làm theo thứ tự — giúp Google tìm thấy nội dung, tổ chức site, viết nội dung hữu ích, ảnh hưởng cách site hiện trên kết quả tìm kiếm, tối ưu ảnh và video, quảng bá site. Điểm đáng chú ý nhất với wiki này là phần cuối: danh sách những thứ Google nói **không nên** tập trung vì mục đích xếp hạng — trong đó có hai thứ mà thang chấm nội bộ của Setsubi-pro đang đặt trọng số (độ dài bài tối thiểu và từ khóa trong URL). Điều này không có nghĩa là phải bỏ hai thứ đó: Google vẫn khuyên URL chứa từ ngữ có ích cho người dùng, chỉ nói từ khóa trong URL hầu như không giúp xếp hạng.

Đây là trang nguồn **đầu tiên** trong wiki đến từ tài liệu chính thức của Google; toàn bộ 9 trang nguồn SEO trước đó là tài liệu nội bộ. Nó cung cấp tầng "Google vận hành thế nào" mà kho tri thức SEO của wiki trước đây không có.

## Key claims

- Google là máy tìm kiếm tự động dùng crawler khám phá web liên tục; phần lớn site trong kết quả được tìm và thêm vào index **tự động**, không cần làm gì thêm ngoài việc công bố site (§How does Google Search work?)
- Thay đổi có thể mất vài giờ tới vài tháng mới phản ánh; nên chờ **vài tuần** trước khi đánh giá, và không phải thay đổi nào cũng tạo khác biệt rõ rệt trên kết quả tìm kiếm (§How long until I see impact in search results?)
- Việc đầu tiên nên làm là **kiểm tra xem Google đã có site mình chưa** bằng toán tử `site:` — có thể bạn không cần làm gì cả (§Help Google find your content)
- Google chủ yếu tìm trang qua **liên kết từ các trang khác** đã được crawl; sitemap là tuỳ chọn, không bắt buộc, và nên ưu tiên việc để người khác biết tới site trước (§Help Google find your content)
- Crawler phải truy cập được **cùng tài nguyên như trình duyệt** (CSS, JavaScript); nếu Google không đọc được các thành phần quan trọng thì trang có thể không xuất hiện hoặc không xếp hạng tốt; nội dung phụ thuộc vị trí được Google nhìn từ vị trí crawler, thường là Mỹ (§Check if Google can see your page the same way a user does)
- Google hỗ trợ nhiều cách để **chặn** một trang, một thư mục hoặc cả site khỏi kết quả tìm kiếm (§Don't want a page in Google's search results?)
- URL mô tả rõ ràng có ích vì một phần URL hiện thành breadcrumb; URL chỉ chứa chuỗi định danh ngẫu nhiên thì kém hữu ích với người dùng (§Use descriptive URLs)
- Với site từ vài nghìn URL trở lên, nhóm trang theo **thư mục** giúp Google học được nhịp thay đổi của từng nhóm và crawl khác tần suất (§Group topically similar pages in directories)
- **Nội dung trùng lặp không vi phạm** chính sách chống spam; nếu bạn không tự khai canonical thì Google sẽ tự chọn giúp; cái đáng lo là trải nghiệm người dùng và lãng phí tài nguyên crawl (§Reduce duplicate content)
- Nội dung khiến người đọc thấy hấp dẫn và hữu ích **nhiều khả năng** ảnh hưởng tới hiện diện trên kết quả tìm kiếm **nhiều hơn mọi gợi ý khác** trong tài liệu này; bốn thuộc tính chung: dễ đọc và có tổ chức, độc nhất, cập nhật, hữu ích — đáng tin — hướng người dùng (§Make your site interesting and useful)
- Không cần đoán hết mọi biến thể truy vấn: hệ thống khớp ngôn ngữ của Google hiểu được quan hệ giữa trang và nhiều truy vấn khác nhau kể cả khi trang không dùng đúng từ đó (§Expect your readers' search terms)
- Quảng cáo và trang chèn ngắt quãng (interstitial) làm khó việc đọc là điều cần tránh (§Avoid distracting advertisements)
- Đại đa số trang mới Google tìm thấy là **qua liên kết**; chữ trong liên kết (anchor text) giúp người dùng và Google hiểu trang đích trước khi bấm vào; liên kết tới nguồn không đáng tin nên gắn `nofollow`, và nội dung do người dùng đăng phải được CMS tự động gắn `nofollow` (§Link to relevant resources, §Write good link text, §Link when you need to)
- Tiêu đề trên kết quả tìm kiếm (title link) do Google **tự sinh** từ thẻ `<title>` **và các heading khác trên trang**; muốn ảnh hưởng thì phải viết tiêu đề tốt: duy nhất cho trang, rõ ràng, ngắn gọn, mô tả đúng nội dung (§Influence your title links)
- Đoạn mô tả (snippet) được lấy **từ nội dung thật của trang**; thẻ meta description chỉ là nguồn phụ, và mô tả tốt là ngắn, duy nhất cho một trang, chứa các ý quan trọng nhất (§Control your snippets)
- Ảnh: dùng ảnh sắc nét, đặt **gần đoạn chữ liên quan** vì chữ xung quanh giúp Google hiểu ảnh, và viết alt text mô tả quan hệ giữa ảnh với nội dung (§Add high-quality images near relevant text, §Add descriptive alt text to the image)
- Video: nội dung chất lượng cao, nhúng trên **trang riêng** gần chữ liên quan, viết tiêu đề và mô tả có thông tin (§Optimize your videos)
- Quảng bá site gồm mạng xã hội, tham gia cộng đồng, quảng cáo (cả offline), và truyền miệng — trong đó truyền miệng được nêu là **một trong những cách hiệu quả và bền vững nhất**; nhưng **lạm dụng quảng bá có thể bị coi là thao túng kết quả tìm kiếm** (§Promote your website)
- Danh sách "những thứ không nên tập trung": thẻ meta keywords không được dùng, nhồi từ khóa là vi phạm chính sách chống spam, từ khóa trong tên miền hoặc đường dẫn URL hầu như không có tác dụng xếp hạng ngoài việc hiện trong breadcrumb, TLD chỉ có ý nghĩa khi nhắm người dùng một quốc gia, **độ dài nội dung tự nó không ảnh hưởng xếp hạng**, subdomain hay thư mục con là quyết định kinh doanh, PageRank chỉ là một trong nhiều tín hiệu, trùng lặp nội dung không bị xử phạt thủ công (nhưng sao chép nội dung người khác thì khác), thứ tự heading không quan trọng với Google Search và không có số lượng heading lý tưởng (dù "nếu bạn thấy nhiều quá thì có lẽ là nhiều quá"), và **E-E-A-T không phải yếu tố xếp hạng** (§Things we believe you shouldn't focus on)
- Bước tiếp theo: lập tài khoản Search Console để theo dõi, duy trì SEO theo thời gian, và dùng structured data hợp lệ để mở ra các tính năng đặc biệt trên kết quả tìm kiếm (§Next steps)

## Evidence

- Ví dụ URL tốt và xấu: `https://www.example.com/pets/cats.html` so với `https://www.example.com/2/6772756D707920636174` (§Use descriptive URLs)
- Ví dụ thư mục đổi khác nhau: nội dung trong `policies/` hiếm khi đổi, trong `promotions/` đổi rất thường xuyên — Google học được điều này và crawl hai thư mục với tần suất khác nhau (§Group topically similar pages in directories)
- Ví dụ về biến thể truy vấn: người hiểu biết gõ "charcuterie", người mới gõ "cheese board" (§Expect your readers' search terms)
- Ví dụ về ảnh: tìm "daisies" mà gặp một bông edelweiss lẫn vào — ảnh chất lượng cao giúp người dùng phân biệt đúng loài hoa (§Add high-quality images near relevant text)
- Cách kiểm tra phía Google: toán tử `site:` để xem mình đã trong index chưa, và URL Inspection Tool trong Search Console để xem Google nhìn trang như thế nào (§Help Google find your content, §Check if Google can see your page the same way a user does)
- Dẫn chứng ngoài cho luận điểm truyền miệng: tài liệu trỏ tới một tài liệu của Nielsen về niềm tin vào quảng cáo và thông điệp thương hiệu (§Promote your website)

## Related concepts

- [[concepts/seo/google-thu-thap-va-lap-chi-muc]] — tầng nền tảng mà tài liệu này bổ sung cho wiki
- [[concepts/seo/sitemap]]
- [[concepts/seo/quang-ba-website]]
- [[concepts/seo/tieu-de-lien-ket]]
- [[concepts/seo/van-ban-lien-ket-anchor-text]]
- [[concepts/seo/noi-dung-huong-nguoi-dung-va-eeat]]
- [[concepts/seo/nhung-thu-khong-nen-toi-uu-seo]]
- [[concepts/seo/mot-url-canonical-duy-nhat]] — tài liệu xác nhận hướng dẫn canonical/redirect mà wiki đã ghi từ nguồn nội bộ
- [[concepts/seo/mat-do-tu-khoa]] — nhồi từ khóa nằm trong chính sách chống spam của Google
- [[concepts/seo/cau-truc-heading-seo]] — Google nói thứ tự heading không ảnh hưởng xếp hạng và không có số heading lý tưởng
- [[concepts/seo/do-luong-truoc-khi-toi-uu]] — mốc thời gian chờ và Search Console
- [[concepts/seo/checklist-seo-100-diem]] — tài liệu phản bác hai hạng mục của thang chấm này với tư cách quy luật xếp hạng (độ dài bài, từ khóa trong URL)

## Related sources

- [[sources/ban-do-seo-setsubi-pro-net]] — bản đồ nội bộ của setsubi-pro.net, phần bổ sung ở tầng chiến lược và đo lường mà tài liệu Google không nói tới
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — bộ luật kỹ thuật nội bộ; nhiều luật trùng hướng với tài liệu này
- [[sources/review-seo]] — tiêu chí chấm nội dung nội bộ, nơi có các ngưỡng số cần đối chiếu lại
- [[sources/google-title-link]] — tài liệu chuyên về title link mà §Influence your title links trỏ tới; trả lời phần tiêu đề của câu hỏi mở bên dưới

## Open questions

- Mười chín tài liệu Search Central khác đã được tải về `raw/download/google-search/` nhưng chưa nạp — nên nạp theo thứ tự nào, và tài liệu nào thật sự cần cho công việc của Setsubi-pro?
- Hai hạng mục nội bộ đặt trọng số vào thứ Google nói không nên tập trung vì xếp hạng (điểm theo độ dài ≥2500 từ; yêu cầu URL chứa từ khóa chính) nên được sửa, hay giữ nguyên kèm nhãn "tiêu chuẩn nội bộ, không phải quy luật xếp hạng"? Với URL, lưu ý Google vẫn khuyên đưa từ ngữ có ích cho người dùng vào URL (§Use descriptive URLs).
- Cách Google cắt tiêu đề và mô tả theo **bề ngang hiển thị** (và việc Google không công bố giới hạn ký tự) **không nằm trong tài liệu này** mà ở hai tài liệu đã tải nhưng chưa nạp: `raw/download/google-search/title-link.md` và `snippet.md`. Wiki đang dùng ngưỡng ký tự nội bộ cho SERP tiếng Nhật — cần đối chiếu khi nạp hai tài liệu đó. *(Cập nhật 01/10/2026: phần tiêu đề đã được trả lời khi nạp [[sources/google-title-link]] — `<title>` không có giới hạn độ dài, title link bị cắt thường để vừa bề ngang thiết bị. Phần mô tả vẫn chờ `snippet.md`.)*
- Với site chỉ 128 trang, khuyến nghị "nhóm theo thư mục để Google học tần suất thay đổi" (dành cho site vài nghìn URL trở lên) có áp dụng được không, hay chỉ là thông tin tham khảo?

## Notes

- Bản lưu là Markdown chuyển từ HTML bằng pandoc, giữ nguyên văn tiếng Anh; khối chú thích ở đầu tệp ghi URL gốc, ngày tải và ngày Google cập nhật (2025-12-10 UTC).
- Google công bố trang này ở chế độ "Last updated"; nội dung có thể thay đổi mà không có phiên bản — khi trích dẫn lại nên kèm ngày tải.
