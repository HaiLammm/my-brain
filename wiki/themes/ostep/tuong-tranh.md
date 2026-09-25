---
id: themes/ostep/tuong-tranh
title: "Tương tranh (Concurrency)"
type: theme
created: 2026-08-14
updated: 2026-08-14
book: ostep
---

## Description

Các vấn đề nảy sinh khi làm nhiều việc cùng lúc trong cùng một chương trình hoặc trong chính OS: kết quả sai và bất định khi nhiều thread cùng thao tác trên dữ liệu chia sẻ, vì các thao tác tưởng là một bước (như tăng biến đếm) thực ra gồm nhiều lệnh không thực thi nguyên tử.

## Evidence

- [[chapters/ostep/gioi-thieu-ve-he-ieu-hanh]] — demo `threads.c`: hai thread cùng tăng counter cho kết quả sai khác nhau mỗi lần chạy; "Crux" về xây chương trình tương tranh đúng

## Related themes

- [[themes/ostep/ba-manh-ghep]]
- [[themes/ostep/ao-hoa]]

## Notes

Chủ đề này nối trực tiếp với mối quan tâm sẵn có của người đọc wiki về race condition (xem [[concepts/swe/race-condition-prevention]] ở lớp concept ngoài sách).
