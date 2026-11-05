# Mẫu bài học

Tóm tắt: khuôn chuẩn cho mọi bài trong khóa; dữ liệu dạng front matter để sau này dựng trang tự động.

Trạng thái: nháp. Cập nhật: 2026-11-05.

## Front matter

```yaml
id: hiragana-03
course: hiragana
order: 3
slug: bai-03-hang-ka-sa
title: Hàng か và さ
duration_min: 10
objectives:
  - Đọc và nhận ra 10 chữ か き く け こ さ し す せ そ
  - Biết し đọc là shi
chars: [か, き, く, け, こ, さ, し, す, せ, そ]
words:
  - { kana: かさ, romaji: kasa, vi: cái ô }
quiz: 10
status: draft   # draft | reviewed | published
```

## Cấu trúc bài (theo thứ tự)

1. **Mục tiêu**: 2 đến 3 gạch đầu dòng, nói người học làm được gì sau bài.
2. **Bảng chữ**: mỗi chữ có hiragana, romaji, mẹo nhớ bằng tiếng Việt. Mẹo nhớ tự biên soạn.
3. **Lưu ý**: các chữ dễ nhầm hoặc đọc đặc biệt (xem [`content-guidelines.md`](content-guidelines.md)).
4. **Từ ví dụ**: 3 đến 5 từ chỉ dùng chữ đã học, có nghĩa tiếng Việt.
5. **Flashcard**: chữ ↔ romaji, trộn ngẫu nhiên.
6. **Mini quiz**: 10 câu, dùng engine quiz của Dojo.
7. **Hoàn thành**: đánh dấu tiến độ, gợi ý bài tiếp theo.

## Danh sách kiểm tra trước khi xuất bản

- [ ] Chữ, romaji và nghĩa đã đối chiếu với nguồn đáng tin
- [ ] Không có chữ chưa học trong từ ví dụ
- [ ] Văn phong theo [`content-guidelines.md`](content-guidelines.md)
- [ ] Đo kích thước trang trong ngân sách ([`../planning/performance-budget.md`](../planning/performance-budget.md))
- [ ] Đã duyệt bởi người biết tiếng Nhật
