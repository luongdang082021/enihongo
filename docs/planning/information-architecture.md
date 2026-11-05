# Cấu trúc site

Tóm tắt: ba cấp khóa học → bài học → hoạt động; chỉ khóa Nhập môn Hiragana mở.

Trạng thái: nháp, chờ chốt D-005 và D-006. Cập nhật: 2026-11-05.

## Sơ đồ trang

| URL | Nội dung |
|---|---|
| `/` | Giới thiệu ngắn, nút "Bắt đầu học", danh sách khóa |
| `/khoa-hoc/` | Lưới các khóa: khóa mở và khóa khóa |
| `/khoa-hoc/hiragana/` | Danh sách bài của khóa, kèm tiến độ |
| `/khoa-hoc/hiragana/bai-xx` | Một bài học |
| `/luyen-tap/` | Dojo chung: 5 hiệp Hiragana hoặc tự chọn bài và chủ đề (`?bai=hiragana-03` chọn sẵn bài). `/luyen-tap/hiragana-dojo/` chuyển hướng về đây |
| `/gioi-thieu` | Mục đích dự án, cách đóng góp |

Mã nguồn các trang nằm trong `src/` (Eleventy). `index.html` ở gốc repo là bản game cũ, giữ tới khi Pages chuyển sang GitHub Actions; sau đó xóa. Trang chủ mới là `src/index.njk`, game ở `/luyen-tap/hiragana-dojo/`.

## Các cấp

- **Khóa**: có `id`, tên, mô tả, trạng thái (`open` hoặc `coming-soon`), danh sách bài.
- **Bài**: khoảng 10 phút, theo [`../content/lesson-template.md`](../content/lesson-template.md).
- **Hoạt động**: học (bảng chữ, mẹo nhớ), flashcard, mini quiz, luyện tập (Dojo).

## Khóa học

| Khóa | Trạng thái | Ghi chú |
|---|---|---|
| Nhập môn Hiragana | Mở | 14 bài, xem dàn bài |
| Katakana | Sắp ra mắt | Khóa kế tiếp hợp lý nhất |
| Ngữ pháp và từ vựng sơ cấp (N5) | Sắp ra mắt | Nội dung tự biên soạn |
| Kanji cơ bản | Sắp ra mắt | |
| Giao tiếp và luyện JFT-Basic | Sắp ra mắt | |
| Luyện nghe | Sắp ra mắt | Cần giải pháp âm thanh nhẹ |

Chi tiết các khóa khóa: [`../content/coming-soon-courses.md`](../content/coming-soon-courses.md).

## Thẻ khóa "Sắp ra mắt"

- Làm mờ, có biểu tượng khóa và nhãn "Sắp ra mắt", không bấm vào được.
- Trang tĩnh không có form đăng ký, nên có thể thêm link sang repo GitHub (Star/Watch) hoặc một Google Form (xem D-007).
- Không trả HTTP 404 cho URL của khóa khóa nếu đã được chia sẻ; hiển thị trang "Sắp ra mắt".

## Điều hướng và tiến độ

- Dùng URL thật cho từng bài (không dùng hash routing) để chia sẻ và SEO.
- Tiến độ lưu bằng `localStorage`, có nút xuất/nhập JSON. Không có tài khoản.
- Các bài trong một khóa đều mở, thứ tự chỉ mang tính gợi ý.
