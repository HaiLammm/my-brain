# Kế hoạch Phát triển Dự án — Công cụ Tự động hóa Bán hàng

> **Loại tài liệu:** BẢN THẢO SƠ BỘ — Bản trình bày dễ hiểu (dành cho người đọc không chuyên kỹ thuật)
> **Kỳ triển khai:** 18/06/2026 → 02/07/2026 (khoảng 2 tuần)
> **Người lập:** Project Manager · **Ngày lập:** 22/06/2026
> **Trạng thái:** Chờ rà soát & phê duyệt

---

## Tóm tắt trong 1 phút

Chúng ta đang xây một **công cụ tự động** giúp gửi thư chào hàng tới hàng nghìn công ty Nhật Bản mỗi ngày — công việc trước đây cần **30 nhân viên làm thủ công**, nay chỉ cần khoảng **5 người vận hành**, mà vẫn đạt **~12.000 lượt gửi/ngày**.

Điểm đặc biệt: công cụ có **"lá chắn pháp lý" tự động** — nhận diện và loại bỏ những website Nhật cấm chào hàng, giúp công ty **tránh rủi ro bị phạt theo luật**.

Toàn bộ công cụ dự kiến hoàn thiện trong **2 tuần (18/06 → 02/07/2026)**.

---

## 1. Vì sao chúng ta làm dự án này?

**Vấn đề hiện tại:** Việc tiếp cận khách hàng Nhật bằng cách điền tay biểu mẫu liên hệ trên từng website là rất tốn người và tốn thời gian — cần tới 30 nhân viên làm liên tục.

**Giải pháp:** Một công cụ tự động làm thay phần lớn công việc lặp đi lặp lại đó, để con người chỉ tập trung vào những việc cần phán đoán.

**Lợi ích mang lại:**

| Tiêu chí | Trước đây (làm thủ công) | Với công cụ mới |
|----------|--------------------------|-----------------|
| Nhân sự cần thiết | ~30 người | **~5 người** |
| Sản lượng mỗi ngày | Phụ thuộc sức người | **~12.000 lượt gửi** |
| Rủi ro pháp lý | Dựa vào con người kiểm tra | **Lá chắn tự động, ghi nhận đầy đủ** |
| Quyền sở hữu | Phụ thuộc công cụ thuê ngoài | **Công ty sở hữu hoàn toàn** |

> Đây là công cụ **dùng nội bộ**, phục vụ riêng đội ngũ bán hàng cho thị trường Nhật — không phải sản phẩm bán ra ngoài.

---

## 2. Công cụ này hoạt động như thế nào?

Hãy hình dung như một **dây chuyền tự động gồm 6 bước**, giống một bưu điện thông minh xử lý thư hàng loạt:

| Bước | Tên gọi dễ hiểu | Công cụ làm gì |
|------|-----------------|----------------|
| 1 | **Nhập danh sách** | Đưa danh sách công ty cần liên hệ vào hệ thống (từ file, Google Sheets, hoặc tự tìm) |
| 2 | **Dò tìm biểu mẫu** | Tự vào website từng công ty, tìm trang "liên hệ" có biểu mẫu |
| 3 | **Lá chắn pháp lý** | Kiểm tra website đó có **cấm chào hàng** không — nếu có thì dừng lại ngay |
| 4 | **Đọc hiểu biểu mẫu** | Dùng trí tuệ nhân tạo (AI) hiểu biểu mẫu cần điền những thông tin gì |
| 5 | **Tự điền & gửi** | Tự điền nội dung và bấm gửi thay con người (kể cả xử lý mã xác thực chống robot) |
| 6 | **Kiểm tra kết quả** | Xác nhận thư đã gửi thành công hay chưa |

**Con người chỉ cần can thiệp khi:** có trường hợp khó (ví dụ mã xác thực phức tạp) hoặc cần xem lại một website nghi ngờ bị cấm.

---

## 3. Điểm đặc biệt nhất — "Lá chắn pháp lý" tự động

Đây là tính năng quan trọng nhất, cần được hiểu rõ:

- Ở Nhật, **nhiều website ghi rõ "không tiếp nhận chào hàng"** (theo luật chống chèo kéo thương mại).
- Nếu gửi thư chào hàng tới những nơi này, công ty **có thể bị phạt tiền thật**.
- Công cụ sẽ **tự động phát hiện và loại bỏ** các website đó **trước khi gửi bất cứ thứ gì** — không có ngoại lệ, không thể tắt.
- Mỗi lần phát hiện đều được **chụp màn hình và ghi lại làm bằng chứng**, không bao giờ chỉnh sửa (phục vụ đối chiếu pháp lý sau này).

**Nguyên tắc vàng:** Thà cẩn thận quá (tạm dừng một website an toàn để kiểm tra lại) còn hơn để lọt một website cấm. Mục tiêu: **bỏ sót dưới 1%** — đây là con số được theo dõi nghiêm ngặt nhất của cả dự án.

---

## 4. Các hạng mục sẽ hoàn thành

Toàn bộ công cụ gồm **7 nhóm tính năng**. Bảng dưới mô tả công dụng của từng nhóm (không đi vào kỹ thuật):

| # | Nhóm tính năng | Công dụng đối với công việc |
|---|----------------|------------------------------|
| 1 | **Nền tảng & Đăng nhập** | Khung hệ thống, đăng nhập an toàn, phân quyền ai được làm gì |
| 2 | **Quản lý danh sách khách hàng** | Nhập, tìm kiếm, theo dõi trạng thái các công ty cần liên hệ; lưu thông tin người gửi |
| 3 | **Dò tìm & Lá chắn pháp lý** | Tự tìm biểu mẫu liên hệ + chặn website cấm chào hàng |
| 4 | **Đọc hiểu biểu mẫu** | AI tự hiểu mỗi biểu mẫu cần điền gì, kể cả biểu mẫu lạ |
| 5 | **Tự động điền & gửi** *(phần lõi)* | Điền và gửi thay con người, xử lý mã xác thực, kiểm tra kết quả |
| 6 | **Màn hình giám sát** | Theo dõi mọi hoạt động theo thời gian thực, xem báo cáo số liệu, cảnh báo sự cố |
| 7 | **Tìm khách hàng tiềm năng mới** | AI tự tìm thêm công ty mới để bổ sung vào danh sách |

---

## 5. Lộ trình & thời gian (18/06 → 02/07/2026)

Khoảng **2 tuần làm việc**, chia thành **3 chặng**, mỗi chặng kết thúc bằng một **cột mốc** rõ ràng có thể kiểm chứng:

### Chặng 1 — Dựng nền móng · 18–19/06 (2 ngày)
Dựng khung hệ thống chạy được, đăng nhập, phân quyền.
> **Cột mốc M1:** Hệ thống khởi động được, đăng nhập được.

### Chặng 2 — Đưa dữ liệu & bật lá chắn · 22–26/06 (5 ngày)
Quản lý danh sách khách hàng; dò tìm biểu mẫu; **bật lá chắn pháp lý**; bắt đầu phần đọc hiểu biểu mẫu và tìm khách hàng mới.
> **Cột mốc M2:** Nhập được khách hàng; tự tìm biểu mẫu; lá chắn pháp lý đạt mục tiêu bỏ sót dưới 1%.

### Chặng 3 — Hoàn thiện gửi tự động & giám sát · 29/06–02/07 (4 ngày)
Hoàn thiện phần **tự động điền & gửi** (phần khó nhất), màn hình giám sát, tìm khách hàng mới; chạy thử với website thật và rà soát an toàn lần cuối.
> **Cột mốc M3:** Công cụ chạy trọn vẹn từ đầu đến cuối; sẵn sàng nghiệm thu.

### Bảng lịch trực quan

Ký hiệu: ● = làm chính · ○ = bắt đầu hoặc hoàn tất · — = chưa/đã xong

| Nhóm tính năng | Chặng 1 (18–19/6) | Chặng 2 (22–26/6) | Chặng 3 (29/6–2/7) |
|----------------|:---:|:---:|:---:|
| 1 — Nền tảng & Đăng nhập | ● | ○ | — |
| 2 — Quản lý khách hàng | — | ● | — |
| 3 — Dò tìm & Lá chắn pháp lý | — | ● | ○ |
| 4 — Đọc hiểu biểu mẫu | — | ○ | ● |
| 5 — Tự động điền & gửi | — | — | ● |
| 6 — Màn hình giám sát | — | — | ● |
| 7 — Tìm khách hàng mới | — | ○ | ● |
| Chạy thử & rà soát an toàn | — | — | ● |

---

## 6. Cần bao nhiêu người và công sức?

- **Tổng khối lượng công việc:** khoảng **70 ngày-công** (1 ngày-công = 1 người làm việc trong 1 ngày).
- Nếu làm theo cách truyền thống, khối lượng này tương đương một **đội khoảng 6–7 người làm trong 2 tuần**.
- Dự án áp dụng **cách làm hiện đại có AI hỗ trợ**: nhiều phần việc được làm **song song** cùng lúc và có AI tăng tốc, nên chỉ cần **2–3 người điều phối** là đủ nén vào khung 2 tuần.

> **Lưu ý quan trọng:** Khung 2 tuần là **khá gấp** cho khối lượng này. Việc bám đúng tiến độ phụ thuộc vào cách làm song song + AI hỗ trợ nói trên. Đây là điểm nên trao đổi và thống nhất kỳ vọng từ đầu.

---

## 7. Thế nào là thành công?

Dự án có các mục tiêu **đo được rõ ràng**:

| Mục tiêu | Con số cần đạt |
|----------|----------------|
| Sản lượng mỗi ngày | ~12.000 lượt gửi với 5 người vận hành |
| **Độ chính xác của lá chắn pháp lý** | **Bỏ sót dưới 1%** (quan trọng nhất) |
| Tỷ lệ gửi thành công | Từ 80% trở lên |
| Thời gian đào tạo người mới | Thành thạo trong 1 ngày |
| Độ ổn định trong giờ làm việc | Hoạt động trên 99% thời gian (giờ hành chính Nhật) |

---

## 8. Rủi ro & những điều cần lưu ý

| Rủi ro / Vấn đề | Ý nghĩa | Cách xử lý |
|-----------------|---------|------------|
| **Thời gian gấp** (2 tuần cho 7 nhóm tính năng) | Có thể trễ nếu tiến độ không đạt | Làm song song + AI hỗ trợ; ưu tiên phần lõi (gửi tự động) |
| **Phần "tự động điền & gửi" là khó nhất** | Cần chạy thử kỹ với website thật | Đã dành riêng chặng cuối + thời gian dự phòng để xử lý |
| **Chưa biết tỷ lệ website Nhật có mã xác thực** | Ảnh hưởng chi phí và tốc độ | Theo dõi thực tế và điều chỉnh trong quá trình chạy |
| **An toàn dữ liệu trước khi vận hành thật** | Cần khóa chặt thông tin nhạy cảm trước khi go-live | Đưa vào hạng mục rà soát an toàn ở chặng cuối |
| **Vấn đề pháp lý dữ liệu cá nhân** | Cần chắc chắn chỉ xử lý thông tin cấp công ty | Xác nhận với bộ phận pháp lý nếu có email cá nhân |

---

## 9. Bước tiếp theo

1. **Rà soát bản kế hoạch này** và thống nhất kỳ vọng về tiến độ, nguồn lực.
2. **Xác nhận một vài giả định** (tỷ lệ mã xác thực, mục tiêu tỷ lệ thành công, vấn đề pháp lý dữ liệu).
3. **Bắt đầu Chặng 1** ngày 18/06.

---

> *Đây là bản thảo sơ bộ. Các con số về thời gian và nguồn lực là cơ sở để cùng thảo luận, sẽ được điều chỉnh sau buổi rà soát.*
