---
id: sources/good-regulator-theorem
title: Every Good Regulator of a System Must Be a Model of That System
type: source
created: 2026-08-08
updated: 2026-08-08
authors:
  - Roger C. Conant
  - W. Ross Ashby
year: 1970
importance: 4
provenance: replayable
confidence: unverified
source_type: paper
tags:
  - cybernetics
  - regulation
  - modeling
  - systems-thinking
urls:
  - "https://pespmc1.vub.ac.be/books/Conant_Ashby.pdf"
  - "https://en.wikipedia.org/wiki/Good_regulator_theorem"
raw_paths:
  - raw/download/web/c437346ab223db0d.pdf
  - raw/discovered/dieu-khien-hoc-tu-duy-he-thong/wikipedia-good-regulator.json
external_ids:
  url: "https://pespmc1.vub.ac.be/books/Conant_Ashby.pdf"
sources:
  - {provider: pdf, fetched_at: "2026-08-08T08:56:07Z", url: "https://pespmc1.vub.ac.be/books/Conant_Ashby.pdf"}
ingest_status: finalized
verify_status: passed
findings: []
---

## Summary

Bài báo 9 trang trên *International Journal of Systems Science* (1970, vol. 1, No. 2, tr. 89–97) chứng minh định lý trung tâm của điều khiển học về mô hình hóa: mọi bộ điều tiết vừa tối ưu vừa đơn giản tối đa *phải* là mô hình của hệ nó điều tiết. Việc làm mô hình — trước đó chỉ được xem là một lựa chọn trong nhiều cách — trở thành *bắt buộc*: thành công trong điều tiết hàm ý một mô hình đủ giống đã được xây, dù tường minh hay hình thành dần khi bộ điều tiết được cải thiện. Chứng minh dựa trên khung 5 biến của Sommerhoff (D, S, R, Z, G), tiêu chí thành công là entropy H(Z) cực tiểu, và một bổ đề về tính chất của hàm entropy. Hệ quả được các tác giả nhấn mạnh: não, với tư cách bộ điều tiết cho sự sinh tồn, *phải* mô hình hóa môi trường của nó — nền tảng cho một "thần kinh học lý thuyết".

## Key claims

- [Cao] Định lý: bộ điều tiết tối ưu đơn giản nhất R của hệ bị điều tiết (reguland) S sinh các sự kiện R liên hệ với các sự kiện S qua một ánh xạ h: S → R — "bộ điều tiết tốt nhất của một hệ là bộ điều tiết là mô hình của hệ đó, theo nghĩa hành động của nó chỉ là hành động của hệ nhìn qua ánh xạ h" (§4, Theorem).
- [Cao] Không phải mọi bộ điều tiết tối ưu đều là mô hình — nhưng những cái không phải mô hình đều "phức tạp không cần thiết" (unnecessarily complex); và việc tìm bộ điều tiết tốt nhất thực chất là tìm trong các ánh xạ từ S vào R (§4, nhận xét 1–2).
- [Cao] Khung hình thức: 5 tập của Sommerhoff — Z (mọi kết cục), G ⊂ Z (kết cục "tốt"), R (sự kiện trong bộ điều tiết), S (sự kiện phần còn lại của hệ), D (nhiễu sơ cấp); "điều tiết thành công" định nghĩa là H(Z) cực tiểu, đo entropy áp dụng được cả khi kết cục chỉ phân loại được chứ không đo được (§2).
- [Cao] Điều tiết theo sai số là phương pháp "nguyên thủy và chứng minh được là hạ đẳng" (primitive and demonstrably inferior): dòng thông tin từ D qua S bị bảo toàn nên entropy của Z không thể về 0; chỉ điều tiết theo *nguyên nhân* (lấy thông tin thẳng từ D) mới có thể hoàn hảo về nguyên tắc — ví dụ con bò: phản xạ theo sai số chỉ là dự phòng, hệ thần kinh thường cảm nhận nguyên nhân ở da và điều tiết *trước khi* sai số xảy ra (§3).
- [Cao] Khái niệm "model" và "isomorphism" không có ranh giới tự nhiên (từ mô hình Chartres thu nhỏ tới bản đồ tàu điện ngầm chỉ giữ điểm nối); bài báo điểm qua các định nghĩa homo-/isomorphism của máy (Hartmanis–Stearns, dạng Black Box) để chốt dạng dùng trong định lý (§4).
- [Cao] Nếu thống kê p(S) thay đổi chậm theo thời gian, định lý vẫn đúng trong từng giai đoạn p(S) gần như hằng định; bộ điều tiết tốt nhất khi đó là *mô hình biến thiên theo thời gian* của reguland biến thiên theo thời gian (§4, nhận xét 4).
- [Cao] Hệ quả cho não: "There can no longer be question about *whether* the brain models its environment: it must" — mở đường đo *hiệu suất* mô hình hóa của não thay vì tranh cãi có/không (§5).
- [Trung bình] Trạng thái nêu trong tóm tắt ("must be isomorphic with the system") mạnh hơn nội dung định lý (chỉ cho một ánh xạ h, tức đồng cấu — mô hình có thể mất thông tin); chính văn thừa nhận ở cấu hình điều tiết theo sai số (fig. 2) quan hệ mô hình là "mapped versions", còn ở cấu hình fig. 1 mới là homo-/isomorphism (§4, nhận xét 3; metadata Wikipedia cũng lưu ý điểm này).

## Evidence

- Chứng minh trọn vẹn trong §4: bổ đề — với mọi sⱼ, mọi rᵢ có xác suất dương phải cùng dẫn tới một zₖ (nếu không, dịch xác suất Δ giữa hai kết cục sẽ làm p(Z) mất cân bằng hơn và H(Z) *giảm*, mâu thuẫn với tính tối ưu); từ đó chọn được p(R|S) toàn 0/1, tức một ánh xạ h: S → R.
- Ví dụ người thợ săn bắn chim trĩ minh họa 5 biến D, S, R (biến trong não thợ săn), Z, G (§2).
- Ví dụ con bò và máy ghi nhiệt trong não: phân biệt điều tiết theo sai số (phải để nhiệt độ tụt trước) với điều tiết theo nguyên nhân (cảm nhận luồng khí lạnh ở da, hành động trước) (§3).
- Công trình nền được dẫn: Conant (1969) về dòng thông tin bảo toàn/mất mát; Ashby (1967) tái lập khung Sommerhoff bằng lý thuyết tập hợp; Sommerhoff (1950) *Analytical Biology*; Hartmanis & Stearns (1966) về cấu trúc đại số của máy tuần tự.

## Related concepts

- [[concepts/systems/dinh-ly-good-regulator]] — định lý mà bài báo phát biểu và chứng minh
- [[concepts/systems/dieu-tiet]] — khung D/S/R/Z/G và tiêu chí H(Z) cực tiểu là hình thức hóa trực tiếp của bài toán điều tiết
- [[concepts/systems/dieu-tiet-theo-sai-so]] — bị bài báo xếp hạng "nguyên thủy, hạ đẳng" so với điều tiết theo nguyên nhân
- [[concepts/systems/hop-den]] — dùng bộ máy homo-/isomorphism của máy (kể cả dạng Black Box) để định nghĩa "model"
- [[concepts/ml/entropy-thong-tin]] — H(Z) cực tiểu làm tiêu chí thành công; bổ đề dựa trên tính chất của hàm entropy

## Related sources

- [[sources/an-introduction-to-cybernetics]] — cùng khung điều tiết D→R→E và truyền thống Ashby; bài báo là bước phát triển trực tiếp của ý "bộ điều tiết tốt chặn dòng đa dạng" (S.10/6) dù không trích dẫn sách trực tiếp

## People

- [[people/roger-c-conant]] — đồng tác giả (tác giả đứng tên đầu), Department of Information Engineering, University of Illinois at Chicago
- [[people/w-ross-ashby]] — đồng tác giả; thời điểm này ở Biological Computers Laboratory, University of Illinois, Urbana
- Nhắc đến không lập trang: G. Sommerhoff (khung 5 biến, *Analytical Biology*), J. Hartmanis & R. E. Stearns, N. Bourbaki, J. Riguet

## Open questions

- Conant (1969) — bài về dòng thông tin bảo toàn/mất mát trong điều tiết, nền của §3 — chưa nạp; đáng tìm nếu muốn hiểu sâu phân loại error- vs cause-controlled.
- Sommerhoff (1950) *Analytical Biology* — khung directive correlation gốc — chưa nạp.
- Giới hạn của định lý (điều kiện "very broad conditions": p(S) tồn tại và gần hằng định, mọi p(R|S) tối ưu cho cùng p(Z)) hay bị bỏ qua khi định lý được trích dẫn phổ thông; các phê bình hiện đại về phạm vi áp dụng chưa được khảo (ứng viên cho `/lumi-verify --external`).
- Bản PDF Principia Cybernetica là bản gõ lại, có lỗi chế bản ("m this paper", "i(lea", "in fad", một công thức hiển thị "Error! Objects cannot be created…") — khi trích công thức chính xác cần đối chiếu bản in gốc.

## Notes

Bản PDF tải từ Principia Cybernetica Web; ghi chú cuối trang cho biết công trình được tài trợ một phần bởi Air Force Office of Scientific Research (Grant AF-OSR 70-1865) và thời điểm đăng Ashby đã chuyển về University College Cardiff.
