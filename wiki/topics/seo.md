---
id: seo
title: SEO — cơ sở tri thức tái dùng cho nhiều site
type: topic
created: 2026-09-26
updated: 2026-10-01
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
  - sources/huong-dan-viet-bai-seo-cho-setsubi-pro
  - sources/review-bai-seo-cho-setsubi-pro
  - sources/review-seo
  - sources/cau-truc-3-phan-bai-seo-troubleshooting
  - sources/ke-hoach-noi-dung-blog-va-seo-cho-setsuki-pro
  - sources/keyword-map-setsubi-pro
  - sources/list-keyword-seo-setsubi-pro-thang-8-va-9
  - sources/google-seo-starter-guide
  - sources/google-title-link
compiled_at: 2026-10-01
---

## Description

Trang này là điểm vào duy nhất cho toàn bộ tri thức SEO trong wiki, được tổ chức theo nguyên tắc kế thừa: phần lớn khái niệm là **lớp cha** — nguyên lý đúng với bất kỳ website nào — còn một nhóm nhỏ là **lớp con**, tức cách áp dụng các nguyên lý đó vào một site cụ thể. Hiện chỉ có một thể hiện đã được nạp đầy đủ là setsubi-pro.net (dịch vụ sửa thiết bị gia dụng, thị trường Nhật).

Kho có hai loại nguồn. Chín nguồn là tài liệu nội bộ sinh ra từ công việc trên setsubi-pro.net: bản đồ SEO, bộ luật on-page, hướng dẫn và hai vòng review bài viết, khung bài chẩn đoán, kế hoạch nội dung và dữ liệu keyword. Hai nguồn là tài liệu chính thức của Google Search Central: SEO Starter Guide cho bức tranh tổng quan, và tài liệu chuyên về title link đi sâu vào một mảng hẹp là tiêu đề trên kết quả tìm kiếm. Chúng mang tới tầng "Google vận hành thế nào" mà các nguồn nội bộ không có, và một thước đo bên ngoài để tách hai thứ vẫn bị gộp làm một: điều gì là quy luật xếp hạng hay hiển thị của Google, điều gì chỉ là tiêu chuẩn biên tập nội bộ tự đặt.

Ranh giới chung/riêng được vẽ bằng một phép thử: *"Điều này còn đúng khi đổi sang một site khác ngành, khác ngôn ngữ không?"* Nếu còn đúng, khái niệm thuộc lớp cha và nằm ở `concepts/seo/`. Nếu chỉ đúng vì site bán dịch vụ sửa chữa hoặc vì SERP tiếng Nhật, nó thuộc lớp con và về lâu dài nên chuyển sang một namespace riêng theo site.

Các tầng khái niệm bên dưới xếp từ nền lên: Google thu thập và hiểu trang thế nào, rồi kỹ thuật, nội dung, chiến lược, quảng bá ngoài site, và GEO/AI search. Về đòn bẩy, hai loại nguồn gặp nhau ở cùng một kết luận: kỹ thuật sạch là điều kiện cần chứ không đủ. Bản đồ SEO nội bộ đặt đo lường và chiến lược lên đầu; Google nói nội dung hấp dẫn và hữu ích nhiều khả năng ảnh hưởng tới hiện diện trên kết quả tìm kiếm hơn mọi gợi ý khác. Bốn cặp nguồn đang mâu thuẫn nhau đã được đánh dấu và liệt kê ở mục Open questions.

## Key sources

### Tài liệu chính thức

- [[sources/google-seo-starter-guide]] — tài liệu chính thức đầu tiên của kho (Google Search Central, nạp 29/09/2026): cách Google thu thập, lập chỉ mục và hiển thị trang, cùng danh sách những thứ không nên tập trung vì mục đích xếp hạng; là thước đo bên ngoài cho các quy ước nội bộ, và đang thách thức hai hạng mục chấm điểm của [[sources/review-seo]]
- [[sources/google-title-link]] — tài liệu Google chuyên về title link (nạp 01/10/2026): chín nguồn Google dùng để tự sinh tiêu đề, bảy trường hợp Google tự viết lại, `<title>` không có giới hạn độ dài và tiêu đề bị cắt khi cần, thường theo bề ngang thiết bị; là căn cứ chính thức để đọc lại các ngưỡng ký tự nội bộ cho SERP tiếng Nhật

### Tài liệu nội bộ setsubi-pro.net

- [[sources/ban-do-seo-setsubi-pro-net]] — bản đồ toàn cảnh chia mọi hạng mục thành đã làm / cố ý không làm / chưa làm; khung ba nhóm này tái dùng được cho site bất kỳ. Đây là nguồn của thứ tự đòn bẩy và nguyên tắc tín hiệu, và đang thách thức quy định không tách heading まとめ của review vòng 1
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — bộ luật on-page gốc, nơi sinh ra phần lớn khái niệm tầng kỹ thuật: URL tuyệt đối trong dữ liệu có cấu trúc, ảnh ≥1200px, một `@id` cho mỗi tổ chức, ngưỡng hiển thị SERP tiếng Nhật
- [[sources/huong-dan-viet-bai-seo-cho-setsubi-pro]] — quy trình viết một bài từ keyword đến bản đăng được: blog xoay quanh sự cố nhà ở, giọng chuyên gia giải thích cho người không chuyên, CTA mềm
- [[sources/review-bai-seo-cho-setsubi-pro]] — review vòng 1: quy tắc chi tiết về heading, mật độ từ khóa, mở bài, thân bài, CTA và số lần nhắc thương hiệu. Nguồn này nằm trong ba trên bốn cặp mâu thuẫn của kho
- [[sources/review-seo]] — review vòng 2: thang chấm on-page bằng con số (vị trí từ khóa, mật độ 1–2% theo từ, độ dài ≥2500 từ, URL chứa từ khóa); các con số này nên đọc như tiêu chuẩn nội bộ chứ không phải quy luật xếp hạng
- [[sources/cau-truc-3-phan-bai-seo-troubleshooting]] — khung bài riêng cho nội dung chẩn đoán sự cố: checklist tự xử lý trước, nguyên nhân sau, dừng lại và gọi thợ ở cuối
- [[sources/ke-hoach-noi-dung-blog-va-seo-cho-setsuki-pro]] — 52 bài trong 26 tuần, lập lịch theo pillar, intent và mức ưu tiên
- [[sources/keyword-map-setsubi-pro]] — bản đồ keyword cấp site theo trục Category → Sub category → từ khóa; ví dụ mẫu cho việc dựng bản đồ ở site mới
- [[sources/list-keyword-seo-setsubi-pro-thang-8-va-9]] — backlog keyword tháng 8–9 đã chuẩn hóa, đầu vào của bản đồ trên

## Key concepts

### Tầng nền: Google vận hành thế nào (lớp cha)

- [[concepts/seo/google-thu-thap-va-lap-chi-muc]] — crawler tự tìm trang qua liên kết; kiểm tra bằng `site:`; Google phải thấy trang như người dùng thấy
- [[concepts/seo/sitemap]] — tệp liệt kê URL, tuỳ chọn chứ không bắt buộc; `lastmod` phải là ngày thật
- [[concepts/seo/nhung-thu-khong-nen-toi-uu-seo]] — những chủ đề Google nói không đáng tập trung vì xếp hạng; bộ lọc để không đổ công vào sai chỗ, và là gốc của mâu thuẫn giữa Google với thang chấm nội bộ

### Tầng kỹ thuật (lớp cha)

- [[concepts/seo/mot-url-canonical-duy-nhat]] — mỗi nội dung chỉ được có một địa chỉ chính thức; nền móng của mọi thứ phía sau
- [[concepts/seo/structured-data-url-tuyet-doi]] — dữ liệu có cấu trúc phải dùng URL tuyệt đối để máy đọc không hiểu sai phạm vi
- [[concepts/seo/aggregate-rating-tu-dang]] — vì sao điểm đánh giá do chính site tự đăng là tín hiệu sai chứ không phải tín hiệu tốt
- [[concepts/seo/tieu-de-lien-ket]] — tiêu đề trên kết quả tìm kiếm do Google tự sinh từ chín nguồn, trong đó có `<title>` và heading; Google tự viết lại trong bảy trường hợp, nên muốn ảnh hưởng thì phải viết tiêu đề tốt chứ không có cách chốt cứng
- [[concepts/seo/thumbnail-serp-google]] — điều kiện để ảnh đại diện thật sự xuất hiện trên kết quả tìm kiếm
- [[concepts/seo/nhan-dang-site-tren-serp]] — site hiện ra như thế nào dưới mắt người tìm kiếm trước khi họ bấm vào; tên site trong tiêu đề nên ngắn, ở đầu hoặc cuối, và Google có thể bỏ nó khỏi tiêu đề nếu đã hiện ở dòng tên site
- [[concepts/seo/technical-seo-khong-du-de-len-hang]] — luận điểm bản lề: sạch kỹ thuật là điều kiện cần, không phải điều kiện đủ

### Tầng nội dung (lớp cha)

- [[concepts/seo/noi-dung-huong-nguoi-dung-va-eeat]] — bốn thuộc tính của nội dung hữu ích; theo Google đây nhiều khả năng là đòn bẩy lớn nhất, còn E-E-A-T không phải yếu tố xếp hạng
- [[concepts/seo/cau-truc-heading-seo]] — bộ khung heading phục vụ người đọc và trình đọc màn hình; với xếp hạng thì thứ tự heading không quan trọng, còn với hiển thị thì tiêu đề chính cần nổi bật nhất trang để Google nhận đúng
- [[concepts/seo/mat-do-tu-khoa]] — mật độ từ khóa nên hiểu là hệ quả của viết đúng chủ đề, không phải chỉ tiêu cần đạt; ngưỡng đang dùng là 1–3% trên số ký tự
- [[concepts/seo/checklist-seo-100-diem]] — danh sách kiểm trước khi đăng; hai hạng mục của nó (độ dài bài, từ khóa trong URL) là tiêu chuẩn nội bộ chứ không phải quy luật xếp hạng
- [[concepts/seo/van-ban-lien-ket-anchor-text]] — chữ trong liên kết giúp người đọc và Google hiểu trang đích; khi nào phải gắn `nofollow`
- [[concepts/seo/cta-mem]] — cách mời hành động mà không phá mạch đọc
- [[concepts/seo/noi-dung-giai-thich-cho-nguoi-khong-chuyen]] — viết cho người đang gặp vấn đề chứ không cho đồng nghiệp trong ngành
- [[concepts/seo/template-seo-3-phan]] — khung ba phần cho bài chẩn đoán; là một lựa chọn template, không phải khuôn duy nhất

### Tầng chiến lược (lớp cha)

- [[concepts/seo/do-luong-truoc-khi-toi-uu]] — không có số liệu thì mọi tối ưu chỉ là phỏng đoán; đây là đòn bẩy đứng đầu. Google bổ sung mốc chờ vài tuần trước khi đánh giá, và Search Console làm công cụ theo dõi
- [[concepts/seo/mo-hinh-pillar-cluster]] — cách tổ chức cả kho bài thành trụ và nhánh thay vì một đống bài rời
- [[concepts/seo/ma-tran-internal-link-khai-bao-truoc]] — khai báo liên kết nội bộ trước khi viết, để mạng link không mọc tùy tiện
- [[concepts/seo/gop-tu-khoa-cung-intent-vao-mot-bai]] — nhiều từ khóa cùng ý định người dùng thì gom về một bài, tránh tự cạnh tranh
- [[concepts/seo/doorway-page]] — dạng trang cần tránh khi mở rộng theo địa phương hoặc theo biến thể từ khóa
- [[concepts/seo/lap-lich-xuat-ban-theo-uu-tien-va-pillar]] — thứ tự xuất bản bám theo độ ưu tiên và cấu trúc trụ
- [[concepts/seo/thieu-tin-hieu-con-hon-tin-hieu-sai]] — nguyên tắc nền cho mọi quyết định đánh dấu dữ liệu và ghi công
- [[concepts/seo/seo-symptom-problem-first]] — xuất phát từ triệu chứng người dùng gõ ra, không từ tên sản phẩm của mình

### Tầng quảng bá ngoài site (lớp cha)

- [[concepts/seo/quang-ba-website]] — mạng xã hội, cộng đồng, quảng cáo và truyền miệng; kèm ranh giới: quảng bá quá đà có thể bị coi là thao túng kết quả tìm kiếm

### Tầng GEO / AI search (lớp cha)

- [[concepts/seo/answer-first-cho-ai-search]] — trả lời ngay ở đoạn mở, vì đó là phần các công cụ AI thật sự trích

### Lớp con — thể hiện setsubi-pro.net

- [[concepts/seo/blog-giai-quyet-su-co-nha-o]] — định vị blog quanh sự cố nhà ở, áp dụng của mô hình triệu chứng-trước
- [[concepts/seo/noi-dung-phong-ngua-bao-tri-thiet-bi]] — nhánh nội dung phòng ngừa, mở rộng vòng đời khách hàng của ngành sửa chữa
- [[concepts/seo/ngan-hang-tu-khoa-theo-thiet-bi-van-de-va-intent]] — cách dựng bản đồ keyword ba trục cho một site dịch vụ thiết bị
- [[concepts/seo/bang-tu-xu-ly-hay-goi-tho]] — thành phần đặc thù của bài sự cố, dẫn người đọc tới quyết định gọi thợ
- [[concepts/seo/gioi-han-hien-thi-serp-nhat]] — ngưỡng độ dài tiêu đề và mô tả cho SERP tiếng Nhật; theo tài liệu Google, các con số ký tự chỉ là ước lượng vì tiêu đề bị cắt theo bề ngang thiết bị
- [[concepts/seo/slug-tieng-anh-cho-noi-dung-tieng-nhat]] — quy ước đặt slug khi nội dung là tiếng Nhật
- [[concepts/seo/meo-google-business-profile]] — SEO bản đồ cho doanh nghiệp có phạm vi phục vụ theo địa lý
- [[concepts/seo/email-marketing-tu-bai-huong-dan]] — tái sử dụng bài hướng dẫn thành chuỗi email, cầu nối sang nhóm khái niệm marketing

## Open questions

- Bốn cặp nguồn mâu thuẫn đã được đánh dấu. Ba cặp còn mở và cần quyết định trước khi viết bài mới:
  - **Độ dài bài và từ khóa trong URL.** Google nói cả hai không phải quy luật xếp hạng, còn review vòng 2 chấm điểm theo đó. Giữ làm tiêu chuẩn biên tập nội bộ có ghi nhãn rõ, hay bỏ? Lưu ý Google vẫn khuyên URL chứa từ ngữ có ích cho người dùng, chỉ nói từ khóa trong URL hầu như không giúp xếp hạng.
  - **Heading まとめ.** Bản đồ SEO coi việc 0/73 bài có heading tóm kết là một lý do bài không được AI trích, còn review vòng 1 quy định không tách heading まとめ. Khi mục tiêu có cả AI search, quy tắc nào thắng?
  - **Thứ tự thân bài chẩn đoán.** Checklist tự xử lý trước (cấu trúc 3 phần) hay nguyên nhân trước (review vòng 1)? Cấu trúc 3 phần tự giới hạn ở bài chẩn đoán, nên hai quy tắc có thể cùng tồn tại nếu ghi rõ phạm vi của từng cái.
  - Cặp thứ tư, mật độ từ khóa 1–3% theo ký tự (vòng 1) so với 1–2% theo từ (vòng 2), đã được chốt ngày 26/09/2026 theo vòng 1 — xem [[concepts/seo/mat-do-tu-khoa]].
- Ranh giới lớp cha / lớp con hiện mới được vẽ trên trang này, chưa phản ánh vào cấu trúc thư mục. Tám khái niệm ở nhóm cuối vẫn nằm trong `concepts/seo/` — có nên chuyển sang một namespace riêng theo site không, và khi nào?
- Vài khái niệm ở nhóm lớp con thật ra có lõi dùng chung. `seo-symptom-problem-first` đã được xếp lên lớp cha, nhưng `bang-tu-xu-ly-hay-goi-tho` cũng có dạng tổng quát là "bảng tự làm hay thuê" dùng được cho mọi ngành dịch vụ. Nên chưng cất tiếp hay để nguyên?
- Hai tài liệu của Google xác nhận nhiều nguyên lý lớp cha từ bên ngoài, nhưng toàn bộ phần áp dụng vẫn rút ra từ đúng một site, trong đúng một ngành, ở đúng một thị trường. Khái niệm nào thật ra phụ thuộc bối cảnh chỉ lộ ra khi áp dụng cho site thứ hai.
- Tầng đo lường và tầng quảng bá ngoài site đã có điểm tựa đầu tiên ([[concepts/seo/do-luong-truoc-khi-toi-uu]] với Search Console và mốc chờ vài tuần; [[concepts/seo/quang-ba-website]]), nhưng xây dựng liên kết (backlink), phân tích đối thủ và cách đọc số liệu sau khi đo vẫn trắng. Đây là khoảng trống lớn nhất của kho.
- Hậu tố `｜設備プロ` và quy tắc tiêu đề ≤24 ký tự: tài liệu title link cho biết Google có thể bỏ tên site cấp domain khỏi tiêu đề nếu đã hiện ở dòng tên site. Wiki suy luận rằng khi đó hậu tố có thể không hiện, và lý do của quy tắc ≤24 ký tự nên chuyển từ "bảo vệ hậu tố" sang "giữ trọn phần tiêu đề thật". Suy luận này chỉ kiểm được bằng kết quả tìm kiếm thật: setsubi-pro.net đã được hiện tên site chưa, và hậu tố có đang hiện không?
- Mười tám tài liệu Search Central khác đã được tải về nhưng chưa nạp (chính sách chống spam, snippet, ảnh, video, redirect, sitemap chi tiết, Search Console…). Nên nạp tài liệu snippet trước: phần tiêu đề đã được đối chiếu qua tài liệu title link, còn ngưỡng mô tả trên [[concepts/seo/gioi-han-hien-thi-serp-nhat]] vẫn chưa được đối chiếu với tài liệu Google. Các tài liệu còn lại cần nạp sao cho không tạo khái niệm trùng với các khái niệm đã có từ hai tài liệu Google.

## Timeline

<!-- lumina:timeline -->
- **2026-09-30** | ingest | [[sources/google-seo-starter-guide]] — Google's official starter guide says compelling, useful content likely matters more than any other tip, and lists content length, URL keywords, heading order and E-E-A-T among things not to optimize for ranking
- **2026-09-30** | note | Marked [[sources/google-seo-starter-guide]] challenges [[sources/review-seo]]: Google says content length alone and keywords in the URL path do not drive ranking, while review-seo scores articles on a 2500-word target and a keyword-in-URL rule
- **2026-09-30** | note | Marked [[sources/ban-do-seo-setsubi-pro-net]] challenges [[sources/review-bai-seo-cho-setsubi-pro]]: the SEO map counts the missing まとめ summary heading as a reason articles are not cited by AI engines, while the first review round forbids a separate まとめ heading
- **2026-09-30** | note | Marked [[sources/cau-truc-3-phan-bai-seo-troubleshooting]] challenges [[sources/review-bai-seo-cho-setsubi-pro]]: for diagnostic articles the 3-part structure puts the self-fix checklist before causes, while the first review round orders situation, causes, self-fix, then calling a technician
- **2026-09-30** | note | Marked [[sources/review-bai-seo-cho-setsubi-pro]] challenges [[sources/review-seo]]: keyword density 1-3% of characters versus 1-2% of words, and first 10% of characters versus first 10% of words; resolved on 2026-09-26 in favour of the first review round
- **2026-10-01** | ingest | [[sources/google-title-link]] — Google's title-link guide says the <title> element has no length limit and title links are truncated as needed, typically to fit device width, and Google may drop a domain-level site name from the title link
<!-- /lumina:timeline -->
