---
type: source
title: WA CRAFT — Hồ sơ công ty (会社概要 / Company Profile, bản HP)
authors:
  - CÔNG TY TNHH WA CRAFT
source_type: note
importance: 3
confidence: unverified
tags:
  - wa-craft
  - bpo
  - company
  - da-nang
  - nhat-ban
raw_paths:
  - raw/wa-craft-about-us.docx
provenance: replayable
id: sources/ho-so-cong-ty-wa-craft
created: 2026-09-05
updated: 2026-09-05
year: 2026
ingest_status: finalized
findings:
  - {id: 1, reviewer: grounding, class: defer, claim: "Cạnh đồ thị authored_by sources/ho-so-cong-ty-wa-craft -> people/nomoto (và cạnh ngược people/nomoto authored ...), confidence: medium.", evidence: "Tồn đọng từ lượt trước. Phần ## Notes nay đã cảnh báo rõ ràng và đúng chỗ: 'mối nối đó chỉ có nghĩa người đại diện chịu trách nhiệm nội dung, không có nghĩa ông là người viết' — lời cảnh báo này đủ cho người ĐỌC TRANG. Nhưng bản thân cạnh trong wiki/graph/edges.jsonl vẫn là authored_by với confidence medium, không mang chú thích nào; ai đọc đồ thị mà không mở trang vẫn hiểu sai. Tài liệu gốc không nêu người soạn ở bất kỳ chỗ nào và viết về Nomoto ở ngôi thứ ba (Nomoto Takahiko（野本享彦）は… / Nomoto Takahiko spent ten years…).", action: "Không sửa được bằng công cụ hiện có (add-edge/batch-edges bỏ qua cạnh đã tồn tại, sửa tay edges.jsonl bị cấm). Giữ tồn đọng; khi wiki.mjs có lệnh cập nhật confidence cạnh thì hạ xuống low. Lời cảnh báo trong Notes tạm đủ ở mức trang."}
  - {id: 2, reviewer: grounding, class: defer, claim: Năng lực tiếng Nhật ... Đây là lần đầu wiki có một con số về quy mô nhân sự do chính công ty công bố. (Key claims), evidence: "PHÁT HIỆN MỚI. Con số N1×1, N2×2 khớp nguồn (line 19/77/138). Nhưng vế 'lần đầu wiki có một con số về quy mô nhân sự do chính công ty công bố' bị chính trang này tự phản: mục Related sources trỏ tới sources/tool-sales-architecture-docs, và trang đó đã ghi con số nhân sự lấy từ tài liệu của công ty — 'thay thế một quy trình thủ công cần 30 nhân sự bằng đường ống tự động do khoảng 5 điều phối viên vận hành'. Khác biệt duy nhất là tài liệu kia nội bộ còn hồ sơ này để đăng web, nhưng câu văn không nói rõ sắc thái đó.", action: "Thu hẹp thành 'lần đầu công ty nêu quy mô nhân sự trong một tài liệu công khai' hoặc bỏ hẳn vế so sánh, chỉ giữ con số N1×1 / N2×2."}
  - {id: 3, reviewer: grounding, class: defer, claim: "Sun Frontier Fudousan có thật và mô tả 10 năm có khớp không? Đây là công ty bất động sản niêm yết ở Nhật, nhưng wiki chưa kiểm chứng độc lập. (Open questions)", evidence: "PHÁT HIỆN MỚI. Tài liệu nguồn chỉ nêu tên サンフロンティア不動産 / Sun Frontier Fudousan Co., Ltd. (line 49, 107, 168) và không nói gì về việc công ty này có niêm yết hay không. Câu 'Đây là công ty bất động sản niêm yết ở Nhật' được viết như sự thật, lấy từ kiến thức ngoài nguồn, rồi ngay sau đó lại nói 'wiki chưa kiểm chứng độc lập' — hai vế tự vênh nhau trong cùng một gạch đầu dòng.", action: "Đổi thành dạng nghi vấn ('nghe nói là công ty niêm yết — chưa kiểm chứng') hoặc bỏ mệnh đề khẳng định, giữ nguyên đề xuất chạy /lumi-verify --external."}
  - {id: 4, reviewer: grounding, class: defer, claim: Nền tảng của người đại diện là bất động sản và thiết kế quy trình; hồ sơ không nêu nền tảng phần mềm nào. (Key claims), evidence: "Tồn đọng nhẹ của mục id 6 lượt trước. Cách diễn đạt mới đã đúng hơn nhiều — không còn khẳng định 'không phải phần mềm'. Nhưng vẫn hơi mạnh so với nguồn: câu chốt phần tiểu sử ghi ông phụ trách trọn gói tới cả tự động hóa AI — 業務ヒアリング、標準化、改善提案、AI自動化まで一貫して対応する (line 58; bản Anh line 117-119, bản Việt line 178-180). Đó không phải 'nền tảng' quá khứ, nhưng hồ sơ CÓ gán cho ông năng lực liên quan tới công nghệ.", action: "Nếu muốn chặt chẽ hoàn toàn: 'hồ sơ không nêu nền tảng đào tạo hay kinh nghiệm phần mềm nào, dù có ghi ông phụ trách cả khâu tự động hóa AI ở WA CRAFT hiện nay'. Mức hiện tại chấp nhận được."}
  - {id: 5, reviewer: grounding, class: dismiss, claim: Luận điểm cốt lõi ... tái hiện chất lượng nghiệp vụ kiểu Nhật trong môi trường nhân sự địa phương — 日本式の業務品質をローカル環境で再現する運用体制を構築, evidence: "Mục id 5 lượt trước ĐÃ ĐƯỢC GIẢI QUYẾT: vế diễn giải 'bán hệ vận hành chứ không bán giờ công' đã biến mất, thay bằng trích nguyên văn. Trích dẫn tiếng Nhật khớp từng ký tự với nguồn (line 55). Dư nhỏ: nguồn viết ローカル環境 (môi trường địa phương), trang dịch thành 'môi trường nhân sự địa phương' — thêm chữ 'nhân sự' không có trong nguyên văn, nhưng không đổi nghĩa.", action: Không cần sửa; ghi lại để lưu vết.}
  - {id: 6, reviewer: grounding, class: dismiss, claim: "Người đại diện là Nomoto Takahiko (野本享彦), chức danh Director / Giám đốc ... (chắc chắn cao — lặp ở cả ba bản ngôn ngữ)", evidence: "Mỗi bản chỉ mang một nửa chức danh: bản Nhật ghi 'Director / Giám đốc' (line 14), bản Anh chỉ 'Director' (line 72), bản Việt chỉ 'Giám đốc' (line 133); Hán tự 野本享彦 chỉ có ở bản Nhật — đúng như phần Evidence của chính trang đã nói. Cách diễn đạt 'lặp ở cả ba bản' đúng ở mức con người và vai trò, hơi lỏng ở mức chuỗi chữ.", action: Không cần sửa; ghi lại để lưu vết.}
  - {id: 7, reviewer: grounding, class: dismiss, claim: Sau đó 9 năm làm giám đốc doanh nghiệp tại Đà Nẵng., evidence: "Giữ nguyên từ lượt trước. Nguồn không nói rõ thứ tự thời gian: bản Nhật chỉ đặt cạnh nhau 'サンフロンティア不動産にて10年間…' rồi 'ダナンにおいては現地法人の代表として9年間'. Trật tự trước-sau là suy ra từ mạch kể, hợp lý và không đổi nghĩa.", action: Không cần sửa; ghi lại để lưu vết.}
verify_status: findings_pending
---

## Summary

Hồ sơ giới thiệu chính thức của **CÔNG TY TNHH WA CRAFT**, soạn để đăng lên trang chủ (`HP掲載用`) và viết song song ba thứ tiếng — Nhật, Anh, Việt — với nội dung gần như trùng khít nhau. Đây là tài liệu đầu tiên trong wiki cung cấp **dữ kiện hành chính** của công ty: mã số doanh nghiệp, địa chỉ, ngày thành lập, vốn điều lệ, hai lĩnh vực kinh doanh và tiểu sử người đại diện. (Giọng công ty thì [[sources/bo-kich-ban-email-marketing-wa-craft]] đã có trước; cái mới ở đây là phần giấy tờ.)

Giá trị lớn nhất của nó không nằm ở phần quảng cáo mà ở phần dữ kiện hành chính. Wiki đã biết về Wa+Craft qua công việc (kịch bản email, hệ thống tool_sales, sơ đồ tổ chức do bạn kể) nhưng chưa từng biết công ty **đặt ở đâu, đăng ký khi nào, và người đứng đầu từ đâu tới**. Tài liệu này trả lời cả ba, đồng thời mở ra vài chỗ vênh với những gì wiki đang ghi.

Điểm bán xuyên suốt: **vận hành back-office theo tiêu chuẩn Nhật, giao được bằng tiếng Nhật, và không phụ thuộc vào một cá nhân nào**.

## Key claims

- **Pháp nhân Việt Nam, đặt tại Đà Nẵng.** CÔNG TY TNHH WA CRAFT / WA CRAFT COMPANY LIMITED, mã số doanh nghiệp **0402324942**, đăng ký tại Sở Kế hoạch và Đầu tư Đà Nẵng; trụ sở **15 Ngô Thì Sĩ, Ngũ Hành Sơn, Đà Nẵng**. *(chắc chắn cao — có mã số và cơ quan đăng ký)*
- **Thành lập 03/03/2026, vốn điều lệ 500.000.000 VND.** *(tài liệu ghi rõ; xem Open questions — mốc này vênh với dòng thời gian wiki đang có)*
- **Người đại diện là Nomoto Takahiko (野本享彦), chức danh Director / Giám đốc**, quốc tịch Nhật Bản, đã sống tại Đà Nẵng 9 năm. *(chắc chắn cao — lặp ở cả ba bản ngôn ngữ)*
- **Công ty tự mô tả bằng đúng hai lĩnh vực**, không phải năm dòng dịch vụ: (1) **Dịch vụ BPO — vận hành back-office**; (2) **Hỗ trợ kinh doanh địa phương — tư vấn**.
- **Năng lực tiếng Nhật được nêu thành con số cụ thể: N1 × 1 người, N2 × 2 người.** Đây là con số nhân sự đầu tiên công ty nêu trong một tài liệu **công khai** (tài liệu nội bộ thì [[sources/tool-sales-architecture-docs]] đã có con số 30 nhân sự / khoảng 5 điều phối viên). *(chắc chắn cao — nêu ở cả ba bản)*
- **Bảy dịch vụ BPO**: hỗ trợ kế toán (xử lý hóa đơn, xác nhận thanh toán, quản lý dữ liệu), hỗ trợ hành chính (nhập liệu, xử lý yêu cầu), hỗ trợ kinh doanh (báo giá, quản lý khách hàng, chuẩn bị tài liệu), biên dịch Nhật ⇄ Việt, **tự động hóa bằng AI (ChatGPT API / RPA / Python)**, xây dựng tài liệu và chuẩn hóa quy trình, báo cáo hàng tháng kèm đề xuất cải tiến.
- **Hệ vận hành nêu năm nguyên tắc**: chuẩn hóa bằng tài liệu tiếng Nhật; quy trình kiểm tra hai bước; vận hành theo nhóm, **không phụ thuộc cá nhân** (属人化しない); thiết kế quy trình khớp với luồng nghiệp vụ doanh nghiệp Nhật; đề xuất cải tiến và tự động hóa định kỳ.
- **Bảy dịch vụ hỗ trợ địa phương**: tư vấn – môi giới bất động sản, quản lý cho thuê và quản lý tài sản, tư vấn thiết kế – thi công nội thất, xúc tiến đầu tư và hỗ trợ thành lập doanh nghiệp, tư vấn phát triển website, hỗ trợ quảng cáo – marketing, **vận hành trung tâm tiếng Nhật**.
- **Nền tảng của người đại diện là bất động sản và thiết kế quy trình; hồ sơ không nêu nền tảng phần mềm nào.** 10 năm tại **Sun Frontier Fudousan** (サンフロンティア不動産, Nhật Bản): phát triển kinh doanh mới, bán hàng tư vấn, thiết kế – cải tiến quy trình nghiệp vụ, quản lý back-office. Sau đó 9 năm làm giám đốc doanh nghiệp tại Đà Nẵng: đào tạo nhân viên Việt, chuẩn hóa quy trình, quản lý chất lượng.
- **Luận điểm cốt lõi của hồ sơ**: tái hiện chất lượng nghiệp vụ kiểu Nhật trong môi trường nhân sự địa phương — nguyên văn bản Nhật là *"xây dựng hệ vận hành tái hiện được chất lượng nghiệp vụ kiểu Nhật"* (`日本式の業務品質をローカル環境で再現する運用体制を構築`).

## Evidence

- Tiêu đề bản Nhật ghi thẳng mục đích sử dụng: `🏢 WA CRAFT — 会社概要（HP掲載用）` — tức đây là bản dựng cho trang web, không phải hồ sơ nội bộ.
- Ba bản ngôn ngữ **không phải bản dịch lỏng lẻo mà là bản song hành**: cùng số mục, cùng thứ tự, cùng số gạch đầu dòng. Chỗ vênh nằm ở chi tiết, và có ít nhất bốn chỗ: bản Nhật viết `Nomoto Takahiko（野本享彦）` kèm Hán tự còn hai bản kia chỉ để tên La-tinh; bản Nhật dùng `法人番号` còn hai bản kia dùng "Business Registration Number" / "Mã số doanh nghiệp"; chú thích soạn thảo `（信用を最大化した記載）` chỉ có ở bản Nhật (xem gạch đầu dòng dưới); và cách gọi đơn vị hành chính của địa chỉ.
- Cụm `属人化しないチーム運用` (bản Nhật) — dịch Anh là *"Non-personalized team-based operations"*, dịch Việt là *"Vận hành theo mô hình nhóm, không phụ thuộc cá nhân"*. Ba cách nói cùng một nguyên tắc; đây là ý được nhấn mạnh nhất trong tài liệu vì nó xuất hiện **hai lần**: một lần ở hệ vận hành, một lần trong tiểu sử người đại diện (*"dẫn dắt nhiều dự án loại bỏ sự phụ thuộc cá nhân"*).
- Bản Nhật của phần tiểu sử có chú thích thẳng trong tiêu đề: `代表者紹介（信用を最大化した記載）` — *"giới thiệu người đại diện (cách viết tối đa hóa uy tín)"*. Ghi chú soạn thảo này lọt vào tài liệu và **không có ở hai bản còn lại**; nó cho biết phần tiểu sử được viết có chủ đích thuyết phục, nên đọc như tài liệu tiếp thị chứ không như lý lịch trung tính.
- Địa chỉ ghi hai cách trong cùng một tệp: bản Nhật dùng `Phường Ngũ Hành Sơn` (phường), bản Anh và Việt dùng `Ngũ Hành Sơn District / Quận Ngũ Hành Sơn` (quận). Tài liệu không giải thích chỗ vênh này; **suy đoán** dễ nhất là bản thảo chưa qua rà soát cuối, nhưng đó là phỏng đoán của wiki chứ không phải điều tài liệu nói.
- Tên đăng ký viết rời, in hoa, **không có dấu cộng**: `CÔNG TY TNHH WA CRAFT`. Đây là căn cứ pháp lý đầu tiên cho cách viết tên công ty.

## Related concepts

- [[concepts/ops/bpo-back-office]] — mô hình dịch vụ mà toàn bộ lĩnh vực 1 của công ty nằm trong đó
- [[concepts/ops/chong-thuoc-nhan-hoa]] — nguyên tắc vận hành được nhấn mạnh nhất trong tài liệu
- [[concepts/ops/chuan-hoa-bang-tai-lieu]] — cơ chế cụ thể để đạt được nguyên tắc trên

Các khái niệm để đối chiếu (thuê ngoài marketing, giữ năng lực trong nhà, đòn bẩy một người vận hành) được nối từ [[concepts/ops/bpo-back-office]] chứ không nối thẳng từ đây — tài liệu này không bàn tới chúng.

## Related sources

- [[sources/bo-kich-ban-email-marketing-wa-craft]] — cùng một công ty, phía chào hàng; tài liệu đó bán *năm* dòng dịch vụ, tài liệu này giới thiệu *hai* lĩnh vực (xem Open questions)
- [[sources/tool-sales-architecture-docs]] — cỗ máy kỹ thuật đứng sau dòng "tự động hóa bằng AI (ChatGPT API / RPA / Python)" nêu trong hồ sơ
- [[sources/ho-so-nang-luc-double-m]] — cũng là hồ sơ năng lực bán dịch vụ thuê ngoài cho thị trường Nhật, nhưng bán năng lực marketing theo giai đoạn thay vì vận hành back-office
- [[sources/ho-so-luong-hai-lam]] — hồ sơ của người làm kỹ thuật trong chính công ty này

## People

- [[people/nomoto]] — người đại diện; tài liệu này là nguồn đầu tiên cho tiểu sử nghề nghiệp của ông
- [[people/luong-hai-lam]] — làm việc tại công ty này (bạn cung cấp 10/08/2026); hồ sơ không nêu tên nhân viên nào
- [[people/quan]] — làm việc tại công ty này (bạn cung cấp 10/08/2026)

## Open questions

- **Ngày thành lập 03/03/2026 vênh với dòng thời gian wiki đang có.** Wiki ghi [[people/luong-hai-lam]] làm tailor_project trong khoảng 01–04/2026 và mô tả Wa+Craft như nơi làm việc đã có sẵn. Một pháp nhân đăng ký tháng 03/2026 không tự động mâu thuẫn — hoạt động có thể có trước khi lập công ty, hoặc đây là pháp nhân mới của một nhóm đã làm việc cùng nhau từ trước. **Chưa đủ căn cứ để kết luận; đừng viết thành sự thật ở trang nào khác trước khi hỏi bạn.**
- **"WA CRAFT" trong hồ sơ này và "Wa+Craft" trong các nguồn khác có phải một?** Bằng chứng thuận: cùng Director Nomoto Takahiko, cùng Đà Nẵng, cùng bán BPO cho doanh nghiệp Nhật, cùng có trung tâm tiếng Nhật và mảng web. Chưa có gì phản bác. Nhưng tên đăng ký không có dấu cộng, nên cách viết chuẩn nên theo tài liệu này.
- **Hai lĩnh vực ở đây so với năm dòng dịch vụ ở bộ kịch bản email** (EC Operations, BPO, Digital Marketing, Video Production, Sales & CRM). Có ít nhất ba cách giải thích: (a) năm dòng kia là cách chẻ nhỏ của lĩnh vực BPO khi đi chào hàng; (b) danh mục đã đổi giữa tháng 08 và nay; (c) hai tài liệu nhắm hai đối tượng khác nhau nên gói khác nhau. Chưa chọn được cách nào.
- **N1 × 1 và N2 × 2 là ba người — trên tổng bao nhiêu?** Hồ sơ chỉ đếm người có chứng chỉ tiếng Nhật, không nêu tổng quân số. Sơ đồ tổ chức trong lớp nhân vật có 6 người; chưa rõ ba người này là ai trong số đó.
- **Sun Frontier Fudousan có thật và mô tả 10 năm có khớp không?** Tài liệu chỉ nêu tên công ty (サンフロンティア不動産), không nói gì thêm; wiki chưa kiểm chứng độc lập xem công ty này có thật, quy mô ra sao, và mốc 10 năm có khớp không. Càng đáng kiểm vì phần tiểu sử tự ghi là "cách viết tối đa hóa uy tín". Đáng chạy `/lumi-verify --external` cho riêng luận điểm này.
- **Trung tâm tiếng Nhật đang vận hành hay là dịch vụ chào bán?** Mục này nằm trong danh sách "dịch vụ cung cấp" của lĩnh vực 2, cùng chỗ với môi giới bất động sản — nhưng vận hành một trung tâm là việc rất khác với tư vấn theo vụ.
- **Hồ sơ này soạn khi nào?** Tệp không có ngày. Nếu nó được soạn sau tháng 08/2026 thì nó đứng cạnh một sự kiện đáng chú ý trong lớp nhân vật (kế hoạch xử lý pháp lý bàn ngày 14/08/2026) — nhưng nối hai việc này lại là suy diễn, không phải điều tài liệu nói.

## Notes

**Về người đứng tên tài liệu — đọc kỹ chỗ này.** Tệp **không ghi ai soạn**. Phần tiểu sử viết về ông Nomoto ở **ngôi thứ ba** (`Nomoto Takahiko（野本享彦）は…`), nên gần như chắc chắn do người khác cầm bút. Wiki ghi tác giả ở cấp công ty, và trong đồ thị vẫn có một mối nối `tác giả` từ tài liệu này tới [[people/nomoto]] — **mối nối đó chỉ có nghĩa "người đại diện chịu trách nhiệm nội dung", không có nghĩa ông là người viết.** Bộ loại quan hệ hiện tại giữa nguồn và người chỉ có đúng một lựa chọn là "tác giả", nên đây là chỗ mượn tạm; đừng đọc nó theo nghĩa đen.

**Vì sao tài liệu mỏng này lại đáng giá.** Nó ngắn và mang giọng quảng cáo, nhưng là mảnh **hạ tầng dữ kiện** mà wiki thiếu suốt: trước hôm nay, mọi thứ wiki biết về công ty đều đến từ tài liệu công việc và lời bạn kể. Giờ có mã số doanh nghiệp, địa chỉ, ngày đăng ký, vốn điều lệ — những thứ kiểm chứng được ở nguồn ngoài.

**Một câu hỏi treo lâu nay đã đóng.** Trang [[people/nomoto]] và lớp nhân vật đều treo câu *"Wa+Craft đặt ở Việt Nam hay Nhật?"*. Trả lời: **Việt Nam, Đà Nẵng, pháp nhân Việt Nam**. Khách hàng Nhật, nhân sự Việt, công ty Việt.

**Chi tiết giải thích được danh mục dịch vụ trông rời rạc.** Nhìn riêng thì lĩnh vực 2 rất lạ: một công ty BPO mà bán cả môi giới bất động sản, thi công nội thất và trung tâm tiếng Nhật. Đặt cạnh tiểu sử người đại diện thì hợp lý ngay — 10 năm bất động sản ở Nhật, 9 năm điều hành ở Đà Nẵng. **Lĩnh vực 2 là mạng lưới và nghề cũ của ông; lĩnh vực 1 là việc mới.** Đây là diễn giải, không phải điều tài liệu nói.

**Một quan sát về cách tự mô tả.** Hồ sơ nhấn mạnh "không phụ thuộc cá nhân" như điểm bán chính, trong khi lớp nhân vật của wiki ghi bộ phận kỹ thuật của công ty có đúng một người ([[themes/luong-hai-lam/quy-mo-mot-minh]]). Hai điều này không mâu thuẫn về logic — lời hứa là dành cho dịch vụ bán ra, không phải cho nội bộ — nhưng đây đã là lần thứ hai wiki bắt gặp khoảng cách ấy. Ghi lại để trong đầu, không kết luận.
