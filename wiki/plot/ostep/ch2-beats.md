---
id: plot/ostep/ch2-beats
title: "Plot beats — Ch2 Giới Thiệu Về Hệ Điều Hành"
type: plot
created: 2026-08-14
updated: 2026-08-14
book: ostep
up_to_chapter: 2
---

## Beats

1. Chương mở bằng mô hình Von Neumann: chương trình chạy là processor fetch–decode–execute hàng triệu lệnh mỗi giây, và OS là lớp phần mềm làm cho việc đó dễ dùng
2. Ảo hóa CPU: demo `cpu.c` chạy bốn tiến trình "cùng lúc" trên một CPU — OS tạo ảo giác có vô số CPU ảo
3. Ảo hóa bộ nhớ: demo `mem.c` — hai tiến trình cùng in địa chỉ 0x200000 nhưng cập nhật độc lập, vì mỗi tiến trình có không gian địa chỉ ảo riêng
4. Tương tranh: demo `threads.c` — hai thread cùng tăng biến đếm cho kết quả sai và bất định, vì `counter++` gồm ba lệnh không nguyên tử
5. Lưu trữ bền vững: file system quản lý dữ liệu trên đĩa qua system call `open`/`write`/`close`, dùng journaling hoặc copy-on-write để chịu lỗi
6. Mục tiêu thiết kế OS: trừu tượng hóa, hiệu năng (tối thiểu overhead), bảo vệ/cách ly tiến trình, độ tin cậy
7. Lược sử OS: thư viện + batch processing → system call (máy Atlas) → multiprogramming thời minicomputer → UNIX (Thompson & Ritchie) → PC (DOS đi lùi) → Linux (Torvalds), macOS/Windows kế thừa lại di sản minicomputer
