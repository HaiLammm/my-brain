---
id: sources/profile-ho-tro-san-xuat-video-va-van-hanh-thuong-mai-ien-tu
title: Profile — Hỗ trợ sản xuất video và vận hành thương mại điện tử
type: source
created: 2026-09-06
updated: 2026-09-06
source_type: note
authors:
  - Nhung
year: 2026
importance: 2
provenance: replayable
confidence: unverified
raw_paths:
  - raw/Profile.md
tags:
  - dich-vu
  - video
  - ec
  - nhat-ban
company: WA CRAFT
ingest_status: finalized
verify_status: findings_pending
findings:
  - {id: 1, reviewer: grounding, class: patch, claim: "Đồ thị vẫn giữ cặp cạnh authored_by/authored nối tài liệu này với people/nomoto ở mức confidence \"high\", trong khi trang khẳng định tác giả là Nhung.", evidence: "TỒN ĐỌNG TỪ LƯỢT TRƯỚC, CHƯA GIẢI QUYẾT ĐƯỢC Ở TẦNG ĐỒ THỊ. raw/Profile.md không nêu bất kỳ tên người nào — tệp chỉ tự xưng 当社, không ký tên, không ghi ngày — nên raw không hậu thuẫn edge type authored_by cho Nomoto ở bất kỳ mức confidence nào. Kiểm chứng lại: wiki/graph/edges.jsonl dòng 3368-3369 vẫn ghi cặp nomoto↔source ở mức \"high\", còn cặp nhung↔source (dòng 3370-3371) chỉ \"medium\" — cạnh sai vẫn đang mạnh hơn cạnh đúng, người đọc thẳng edges.jsonl mà không mở trang sẽ hiểu ngược. Phần thân bài đã làm đúng phần thuộc thẩm quyền của nó: mục Notes nay nêu thẳng mâu thuẫn, khẳng định \"Trang này là chỗ đúng\", và giao TODO có chủ ngữ rõ ràng (\"người bảo trì wiki, ở lượt chạy /lumi-check đầu tiên sau khi công cụ có lệnh đó\"). `node _lumina/scripts/wiki.mjs --help` xác nhận bộ lệnh (add-edge, batch-edges, dedup-edges) KHÔNG có lệnh xóa cạnh hay sửa confidence cạnh — đây là tồn đọng bị chặn bởi công cụ, không phải việc bị bỏ quên.", action: "Không sửa thêm ở thân bài — phần khai báo đã đủ. Không sửa tay edges.jsonl (bị cấm). Khi wiki.mjs có lệnh xóa cạnh hoặc cập nhật confidence, xóa cặp sources/profile-ho-tro-san-xuat-video-va-van-hanh-thuong-mai-ien-tu ↔ people/nomoto (authored_by/authored) ngay lượt /lumi-check kế tiếp."}
  - {id: 2, reviewer: grounding, class: defer, claim: "Cạnh authored_by → people/nhung ở mức confidence \"medium\", cùng frontmatter authors: [Nhung].", evidence: "PHÁT HIỆN MỚI. raw/Profile.md hoàn toàn không có tên Nhung, không có phòng ban, không có chữ ký. Quy gán tác giả chỉ dựa trên lời người dùng nói ngày 06/09/2026 — chính thân bài và wiki/people/nhung.md đều nói thẳng điều này, và frontmatter để confidence: unverified. Mức \"medium\" của cạnh do đó cao hơn mức chắc chắn mà trang tự khai. Đây là tổng hợp ngoài raw CÓ khai báo rõ ràng nên không phải lỗi bịa, nhưng đồ thị và trang đang lệch mức.", action: "Không cần sửa văn bản — phần khai nguồn đã đầy đủ và chính xác. Khi wiki.mjs có lệnh chỉnh confidence cạnh, xử lý cùng lúc với id 1: xóa cặp Nomoto trước, rồi mới cân nhắc giữ hay nâng cặp Nhung."}
  - {id: 3, reviewer: grounding, class: dismiss, claim: "\"sản xuất liên tục cho TikTok, Instagram, YouTube Shorts và website EC\" (Key claims — Video)", evidence: "GIỮ NGUYÊN TỪ LƯỢT TRƯỚC, chưa sửa và không cần sửa. Raw gắn 継続制作 riêng với nhóm SNS: 「TikTok・Instagram・YouTube Shortsなどに合わせた動画を継続制作し、SNSで発信できる体制を支援」. ECサイト chỉ xuất hiện ở dòng 対応媒体 và ở メリット 03 (EC向け動画に対応), không đi kèm chữ \"liên tục\". Câu của trang gộp bốn kênh vào cùng một vế \"liên tục\", rộng hơn raw một chút nhưng không tạo lời hứa sai về bản chất dịch vụ.", action: "Không cần sửa; nếu muốn chặt chẽ: \"sản xuất liên tục cho các kênh SNS; danh sách kênh hỗ trợ gồm cả website EC\"."}
  - {id: 4, reviewer: grounding, class: dismiss, claim: "\"Lợi ích được hứa hẹn: giảm tải công việc thường nhật, hỗ trợ nhiều kênh và làm dữ liệu doanh thu/lượt truy cập dễ nắm bắt hơn. (Nguồn: hai mục sáu lợi ích.)\"", evidence: "PHÁT HIỆN MỚI, mức nhẹ. Cả ba lợi ích được nêu tên đều lấy từ phần EC: 01 商品登録を効率化…作業負担を軽減, 03 複数モールにも対応, 05 データを整理・可視化. Phần video sáu lợi ích không có mục nào về dữ liệu doanh thu/lượt truy cập (chỉ 04 SNS動画に対応 đỡ được vế \"nhiều kênh\"). Chú nguồn \"hai mục sáu lợi ích\" do đó rộng hơn thực tế. Vế phủ định — \"Tệp không cung cấp số liệu trước–sau, khách hàng mẫu hay mức tăng doanh thu\" — đúng hoàn toàn với raw.", action: "Không cần sửa; nếu muốn chính xác, đổi chú nguồn thành \"chủ yếu từ mục sáu lợi ích phần EC (01, 03, 05) và mục 04 phần video\"."}
  - {id: 5, reviewer: grounding, class: dismiss, claim: "\"(Nguồn: các câu chứa 一貫して và mục lợi ích 06 của mỗi phần.)\" — luận điểm \"Hỗ trợ xuyên suốt\"", evidence: "GIỮ NGUYÊN TỪ LƯỢT TRƯỚC. 一貫して xuất hiện đúng hai lần trong raw: 「企画・構成から編集まで一貫してサポート」 (video) và 「EC運営から販促まで一貫して支援」 (EC). Lợi ích 06 phần EC là 販促まで一貫して支援 (có 一貫して); lợi ích 06 phần video là 販促施策と連携 (không có 一貫して, nhưng vẫn đỡ đúng vế \"nối với hoạt động marketing\"). Nội dung luận điểm khớp raw, chỉ con trỏ trích dẫn hơi rộng.", action: Không cần sửa; có thể chỉnh chú nguồn phần video sang mục giải pháp số 1 (企画・構成から編集まで一貫してサポート).}
  - {id: 6, reviewer: grounding, class: dismiss, claim: Cạnh uses_concept → concepts/marketing/ho-tro-mot-dau-moi (Hỗ trợ một đầu mối), evidence: "PHÁT HIỆN MỚI, kiểm tra loại cạnh. raw/Profile.md KHÔNG chứa cụm 一気通貫 — chỉ có 一貫して và các cụm まとめてサポート / まとめて対応. Tuy vậy trang không hề khẳng định tệp dùng thuật ngữ đó: mục Related concepts viết dè dặt \"liên hệ với cách giới thiệu hỗ trợ xuyên suốt nhiều khâu; chưa đủ căn cứ xác định khâu nào tự làm hay thuê lại\". Loại cạnh uses_concept (không phải defines/introduces_concept) phù hợp với quan hệ thực tế.", action: "Không cần sửa. Lưu ý cho lần rà sau: trang khái niệm ho-tro-mot-dau-moi liệt kê source này trong Key sources — cân nhắc hạ xuống mục ví dụ minh họa vì tệp không dùng thuật ngữ và không liệt kê khâu tự làm/thuê lại."}
  - {id: 7, reviewer: grounding, class: dismiss, claim: "Notes: \"tên WA CRAFT và loại hình công ty TNHH lấy từ [[sources/ho-so-cong-ty-wa-craft]], nơi có mã số doanh nghiệp và giấy đăng ký\"", evidence: "PHÁT HIỆN MỚI, mức nhẹ. Trích dẫn chéo ĐÚNG: wiki/sources/ho-so-cong-ty-wa-craft.md nêu CÔNG TY TNHH WA CRAFT, mã số doanh nghiệp 0402324942, Sở KH&ĐT Đà Nẵng, và ghi rõ tên đăng ký viết rời in hoa không dấu cộng. Hai dư nhỏ: (a) thân bài trang này thực ra không dùng chuỗi \"công ty TNHH\" ở đâu khác (Summary và frontmatter chỉ ghi \"WA CRAFT\"), nên câu Notes đang khai nguồn cho một chi tiết trang không phát biểu; (b) nguồn của trang kia là raw/wa-craft-about-us.docx — hồ sơ soạn để đăng web (HP掲載用), không phải bản scan giấy chứng nhận đăng ký doanh nghiệp, nên chữ \"giấy đăng ký\" hơi mạnh hơn thứ thực sự có.", action: "Không cần sửa; nếu muốn gọn và chính xác, rút còn \"tên WA CRAFT lấy từ [[sources/ho-so-cong-ty-wa-craft]], nơi có mã số doanh nghiệp và cơ quan đăng ký\"."}
  - {id: 8, reviewer: grounding, class: dismiss, claim: "GHI NHẬN ĐÃ GIẢI QUYẾT — ba mục id 2, id 3, id 4 của lượt trước (cụm \"CÔNG TY TNHH\" trong Summary + tên viết ba kiểu; chức danh Nhung không khai nguồn; vế \"là năm WA CRAFT hoạt động\" trong lời giải thích year)", evidence: "Kiểm chứng độc lập từng mục. (a) \"CÔNG TY TNHH\" đã bị bỏ khỏi Summary; đếm lại toàn bộ thân bài chỉ còn một cách viết WA CRAFT, frontmatter company đổi thành \"WA CRAFT\" — hai dạng \"WaCraft\"/\"Wa+Craft\" chỉ còn trong Notes với tư cách di sản bị khai tử, khớp căn cứ pháp lý nêu ở Notes của people/nomoto. (b) Mục People nay ghi rõ \"Chức danh của Nhung (nhân viên team marketing) cũng không đến từ tệp này; xem [[people/nhung]]\"; trang đó xác nhận chức danh đến từ lời kể người dùng ngày 10/08/2026 — chuỗi dẫn nguồn khép kín. (c) Vế \"và là năm WA CRAFT hoạt động\" đã biến mất; phần thay thế khai year là giá trị tạm do schema bắt buộc — kiểm chứng _lumina/scripts/schemas.mjs dòng 284 ghi { key: 'year', type: 'number', required: true }, tức lời khai này đúng chứ không phải cái cớ. Mốc 2026 khớp date_added: 2026-09-06 và câu hỏi thời điểm soạn vẫn để treo ở Open questions.", action: Không cần sửa. Ghi lại để lưu vết đối chiếu giữa hai lượt chạy.}
---
# Profile — Hỗ trợ sản xuất video và vận hành thương mại điện tử

## Summary

Tài liệu tiếng Nhật của WA CRAFT, do Nhung soạn theo xác nhận của người dùng ngày 06/09/2026, giới thiệu hai nhóm dịch vụ: hỗ trợ sản xuất video và vận hành thương mại điện tử (EC). Cả hai phần đi từ khó khăn của khách hàng đến cách hỗ trợ, sáu lợi ích và danh sách kênh hoặc công việc nhận thực hiện. Điểm chung là hỗ trợ liên tục, nối công việc vận hành với nội dung phục vụ xúc tiến bán hàng. Đây là nội dung giới thiệu dịch vụ, không phải báo cáo kết quả triển khai.

## Key claims

- **Video — phạm vi dịch vụ được giới thiệu:** hỗ trợ từ lập ý tưởng, cấu trúc đến biên tập; làm rõ đặc điểm và cách dùng sản phẩm; sản xuất liên tục cho TikTok, Instagram, YouTube Shorts và website EC. Nội dung được thiết kế theo mục đích EC, mạng xã hội hoặc quảng cáo. **Độ tin cậy: chưa kiểm chứng năng lực thực tế.** (Nguồn: `raw/Profile.md`, phần 動画制作支援, các mục khó khăn và giải pháp.)
- **EC — phạm vi dịch vụ được giới thiệu:** đăng và cập nhật thông tin sản phẩm, xử lý ảnh, quản lý tồn kho, giá, đánh giá, thiết lập chiến dịch, tổng hợp dữ liệu và báo cáo, sản xuất video phục vụ xúc tiến bán hàng. Rakuten Ichiba, Amazon và Yahoo! Shopping được nêu như các kênh hỗ trợ. **Độ tin cậy: chưa kiểm chứng năng lực thực tế.** (Nguồn: phần EC Operations Support, các mục giải pháp và 対応業務.)
- **Lợi ích được hứa hẹn:** giảm tải công việc thường nhật, hỗ trợ nhiều kênh và làm dữ liệu doanh thu/lượt truy cập dễ nắm bắt hơn. Tệp không cung cấp số liệu trước–sau, khách hàng mẫu hay mức tăng doanh thu. **Độ tin cậy: chưa kiểm chứng hiệu quả thực tế.** (Nguồn: hai mục sáu lợi ích.)
- **Hỗ trợ xuyên suốt:** phần video nối lập kế hoạch với biên tập và hoạt động marketing; phần EC nối vận hành với sản xuất nội dung xúc tiến bán hàng. **Độ tin cậy: chưa kiểm chứng cách tổ chức thực hiện.** (Nguồn: các câu chứa 一貫して và mục lợi ích 06 của mỗi phần.)

## Evidence

- Phần video: bốn khó khăn, bốn nhóm giải pháp và sáu lợi ích; danh sách kênh cuối phần là TikTok / Instagram / YouTube Shorts / ECサイト.
- Phần EC: năm khó khăn, năm nhóm giải pháp và sáu lợi ích; danh sách cuối phần có bảy nhóm công việc, gồm cả thiết lập chiến dịch và video xúc tiến bán hàng.
- Cụm “企画・構成から編集まで一貫してサポート” mô tả hỗ trợ xuyên suốt từ ý tưởng, cấu trúc đến biên tập; “EC運営から販促まで一貫して支援” nối vận hành EC với xúc tiến bán hàng. Các câu này xác nhận cách định vị dịch vụ, không chứng minh kết quả đã đạt.

## Related concepts

- [[concepts/marketing/ho-tro-mot-dau-moi]] — liên hệ với cách giới thiệu hỗ trợ xuyên suốt nhiều khâu; chưa đủ căn cứ xác định khâu nào tự làm hay thuê lại.

## Related sources

Tệp không trích dẫn tài liệu khác.

## People

- [[people/nhung]] — người soạn; người dùng xác nhận ngày 06/09/2026. Tên người soạn và tên công ty **không** xuất hiện ở bất kỳ đâu trong tệp gốc — tệp chỉ tự xưng 当社 ("công ty chúng tôi"). Chức danh của Nhung (nhân viên team marketing) cũng không đến từ tệp này; xem [[people/nhung]].

## Open questions

- Tài liệu thuộc phiên bản nào và được soạn vào ngày/năm nào?
- Phạm vi video có bao gồm quay mới hay chỉ lập ý tưởng và biên tập từ tư liệu có sẵn? Tệp không nói rõ.
- Tần suất sản xuất, số lượng sản phẩm/kênh quản lý, giá, thời gian bàn giao và tiêu chí nghiệm thu là gì?
- Có ví dụ triển khai hoặc số liệu nào chứng minh các lợi ích giảm tải và hỗ trợ bán hàng không?

## Notes

- Nguồn nguyên bản: `raw/Profile.md`; giữ nguyên tệp.
- Tiêu đề wiki do người biên soạn đặt theo hai phần của tài liệu. Người soạn (Nhung) và công ty (WA CRAFT) được bổ sung từ xác nhận của người dùng ngày 06/09/2026, không phải từ nội dung tệp.
- **Ba thứ trang này biết mà tệp gốc không nói.** Tệp tự xưng 当社, không nêu tên công ty, không nêu loại hình pháp nhân, không nêu người soạn, không ghi năm. Vậy nên: (1) tên **WA CRAFT** và loại hình **công ty TNHH** lấy từ [[sources/ho-so-cong-ty-wa-craft]], nơi có mã số doanh nghiệp và giấy đăng ký — không lấy từ tệp này; (2) người soạn lấy từ lời bạn nói; (3) trường `year` bắt buộc phải có số nên tạm điền **2026**, là năm tệp vào wiki, **không** phải năm soạn đã xác minh. Câu hỏi về thời điểm soạn vẫn để treo.
- **Cách viết tên.** Wiki thống nhất viết **WA CRAFT** theo tên đăng ký (xem mục Notes ở [[people/nomoto]]). Các dạng "WaCraft", "Wa+Craft" còn sót ở trang khác là di sản cũ.
- **Đính chính tác giả trong cùng ngày.** Lượt nạp đầu ngày 06/09/2026 ghi tác giả là [[people/nomoto]]; sau đó bạn đính chính lại là Nhung. Trang này và các liên kết đã được sửa theo. Còn sót một chỗ chưa dọn được: đồ thị vẫn giữ cặp cạnh cũ nối tài liệu này với Nomoto, vì bộ công cụ hiện tại không có lệnh xóa cạnh và việc sửa tay tệp đồ thị bị cấm. Ai đọc thẳng đồ thị mà không mở trang sẽ thấy cả hai tên, và tệ hơn: cạnh Nomoto ghi độ tin cậy *cao* còn cạnh Nhung chỉ *trung bình*, tức cạnh sai lại mạnh hơn cạnh đúng. **Trang này là chỗ đúng.**
  **Việc cần làm (chưa ai làm được):** khi `wiki.mjs` có lệnh xóa cạnh hoặc chỉnh độ tin cậy của cạnh, xóa cặp `sources/profile-... ↔ people/nomoto` loại `authored_by`/`authored`, rồi nâng cặp `↔ people/nhung` lên mức trung bình–cao. Chủ ngữ: người bảo trì wiki, ở lượt chạy `/lumi-check` đầu tiên sau khi công cụ có lệnh đó.
