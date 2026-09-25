---
id: chapters/ostep/gioi-thieu-ve-he-ieu-hanh
title: "Chương 2: Giới Thiệu Về Hệ Điều Hành"
type: chapter
created: 2026-08-14
updated: 2026-08-14
book: ostep
number: 2
---

## Summary

Chương nội dung đầu tiên của sách, trả lời câu hỏi "hệ điều hành là gì và làm gì". Xuất phát từ mô hình Von Neumann (processor fetch–decode–execute từng lệnh), chương chỉ ra rằng để hệ thống **dễ dùng**, cần một lớp phần mềm đứng giữa: hệ điều hành (OS), hoạt động như một **máy ảo (virtual machine)** và một **người quản lý tài nguyên (resource manager)**. Kỹ thuật trung tâm là **ảo hóa**: biến tài nguyên vật lý (CPU, bộ nhớ, đĩa) thành dạng ảo tổng quát, mạnh và dễ dùng hơn. Chương minh họa bằng ba demo code: `cpu.c` (bốn tiến trình chạy "cùng lúc" trên một CPU — ảo hóa CPU), `mem.c` (hai tiến trình cùng thấy một địa chỉ nhưng độc lập nhau — ảo hóa bộ nhớ qua không gian địa chỉ ảo), `threads.c` (hai thread cùng tăng biến đếm cho kết quả sai và bất định — vấn đề tương tranh do thao tác không nguyên tử). Phần lưu trữ bền vững giới thiệu file system và system call `open`/`write`/`close`. Chương chốt bằng các mục tiêu thiết kế (trừu tượng hóa, hiệu năng, bảo vệ/cách ly, độ tin cậy) và một lược sử hệ điều hành: từ thư viện thủ tục + batch processing, đến system call (máy Atlas), multiprogramming thời minicomputer, UNIX, rồi PC và Linux.

## Key events

- Mô hình Von Neumann được giới thiệu: chương trình chạy = processor fetch–decode–execute hàng triệu lệnh mỗi giây
- "The Crux of the Problem" đầu tiên của sách: làm sao ảo hóa tài nguyên — tập trung vào *how*, gồm cơ chế (mechanism) và chính sách (policy)
- Demo `cpu.c`: chạy 4 bản sao chương trình trên 1 CPU, cả 4 "cùng chạy" — OS tạo ảo giác có vô số CPU ảo
- Demo `mem.c`: mỗi tiến trình có không gian địa chỉ ảo riêng, cùng in địa chỉ 0x200000 nhưng cập nhật độc lập
- Demo `threads.c`: hai thread cùng tăng counter 100.000 lần cho kết quả sai và mỗi lần chạy một khác — vì `counter++` gồm 3 lệnh không thực thi nguyên tử
- Lưu trữ bền vững: DRAM là bộ nhớ tạm; file system quản lý file trên đĩa qua system call, dùng journaling hoặc copy-on-write để chịu lỗi khi ghi
- Mục tiêu thiết kế OS: xây trừu tượng hóa, tối thiểu overhead, bảo vệ và cách ly tiến trình, độ tin cậy, cùng năng lượng/bảo mật/di động
- Lược sử: OS từng chỉ là thư viện (batch processing) → system call ra đời với máy Atlas → multiprogramming thời minicomputer → UNIX của Ken Thompson và Dennis Ritchie ở Bell Labs → PC (DOS, Mac OS 9 đi lùi) → Linux của Linus Torvalds; macOS/Windows hiện đại kế thừa lại di sản minicomputer

## Characters introduced

- [[characters/ostep/john-von-neumann]] — người tiên phong của hệ thống tính toán, mô hình thực thi mang tên ông
- [[characters/ostep/ken-thompson]] — đồng tác giả UNIX tại Bell Labs
- [[characters/ostep/dennis-ritchie]] — đồng tác giả UNIX tại Bell Labs
- [[characters/ostep/bill-joy]] — dẫn dắt nhóm Berkeley làm bản phân phối BSD, sau đồng sáng lập Sun Microsystems
- [[characters/ostep/linus-torvalds]] — hacker người Phần Lan viết Linux, phiên bản UNIX tự do không dùng code gốc

## Themes

- [[themes/ostep/ao-hoa]] — ảo hóa CPU và bộ nhớ: kỹ thuật trung tâm của OS
- [[themes/ostep/tuong-tranh]] — vấn đề tương tranh: thao tác không nguyên tử trên dữ liệu chia sẻ
- [[themes/ostep/luu-tru-ben-vung]] — file system và lưu dữ liệu an toàn qua system call
- [[themes/ostep/lich-su-he-ieu-hanh]] — tiến hóa của OS: thư viện → system call → multiprogramming → UNIX → PC → Linux

## Notes

Chương này đặt nền móng thuật ngữ cho cả sách: virtual machine, resource manager, system call, trap/kernel mode/user mode, mechanism vs policy, address space, journaling/copy-on-write. Hộp "Aside" về tầm quan trọng của UNIX nhắc thêm Multics, shell, pipe, ngôn ngữ C và văn hóa open-source; Steve Jobs được nhắc thoáng qua khi mang NeXTStep về Apple. Cuối chương có phần Homework: hai dạng bài tập (mô phỏng và code thật) — đúng tinh thần "làm rồi mới hiểu" của chương 1.
