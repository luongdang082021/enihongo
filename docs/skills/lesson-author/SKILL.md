---
name: lesson-author
description: Viết hoặc sửa một bài học trong khóa Nhập môn Hiragana của enihongo, theo mẫu bài, quy ước nội dung và dàn bài khóa. Dùng khi người dùng yêu cầu thêm, viết lại hoặc kiểm tra một bài học.
---

# Viết một bài học

## Đầu vào cần có

- Số bài (xem `docs/content/hiragana-course-outline.md`).
- Nếu thiếu: hỏi người dùng hoặc lấy từ dàn bài.

## Các bước

1. Đọc `docs/content/lesson-template.md`, `docs/content/content-guidelines.md` và dòng của bài trong `docs/content/hiragana-course-outline.md`.
2. Soạn front matter theo mẫu (`id`, `slug`, `chars`, `words`, `quiz`, `status: draft`).
3. Viết bảng chữ: mỗi chữ có hiragana, romaji Hepburn, mẹo nhớ tiếng Việt tự biên soạn.
4. Viết phần lưu ý cho chữ dễ nhầm hoặc đọc đặc biệt.
5. Chọn 3 đến 5 từ ví dụ chỉ dùng chữ đã học tới bài này; ghi nghĩa tiếng Việt.
6. Soạn 10 câu mini quiz bằng các dạng câu hỏi trong `docs/product/hiragana-dojo-spec.md`.
7. Chạy danh sách kiểm tra cuối `lesson-template.md`.

## Quy tắc cứng

- Chỉ hiragana; không dùng kanji hay katakana.
- Không sao chép giáo trình in.
- Không đặt `status: published` khi chưa có người biết tiếng Nhật duyệt.
- Nếu không chắc về một chữ, từ hoặc nghĩa, ghi rõ chỗ cần xác minh thay vì đoán.
