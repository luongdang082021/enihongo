# Tăng trưởng và SEO

Tóm tắt: mỗi bài có URL riêng và metadata đầy đủ, đo lường bằng công cụ nhẹ không cookie.

Trạng thái: nháp. Cập nhật: 2026-11-05.

## SEO cơ bản

- Mỗi trang có `<title>` riêng, `<meta name="description">`, `lang="vi"`, thẻ canonical.
- Open Graph và Twitter Card cho từng bài, kèm ảnh xem trước (SVG chuyển sang PNG khi build, nếu cần).
- `sitemap.xml` và `robots.txt`.
- URL thật cho từng bài (không dùng hash routing).
- Dữ liệu có cấu trúc: JSON-LD `WebSite` ở trang chủ và `Course` ở khóa Hiragana (đã làm). Ảnh xem trước dùng biểu tượng 512 px.

## Đo lường

- Dùng Cloudflare Web Analytics (không cookie), đã chốt ở D-010. Mã nhúng nằm trong `base.njk`, chỉ xuất hiện khi `cfBeaconToken` trong `src/_data/site.json` có giá trị. Lấy token: Cloudflare dashboard, Web Analytics, thêm site `luongdang082021.github.io` (chế độ không cần đổi DNS), sao chép token trong đoạn mã.
- Câu hỏi cần trả lời: bài nào được xem nhiều, bài nào bỏ dở, thiết bị nào phổ biến.
- Ghi rõ trong trang giới thiệu rằng site không dùng cookie theo dõi.

## Tên miền

- Mặc định: `luongdang082021.github.io/enihongo/`. Đường dẫn con này khiến mọi liên kết phải dùng đường dẫn tương đối hoặc có tiền tố gốc.
- Tên miền riêng: hosting vẫn miễn phí, chỉ tốn phí mua tên miền; bỏ vấn đề đường dẫn con. Xem D-006.

## Chia sẻ

- Nút chia sẻ dùng link thường, không nhúng script mạng xã hội.
- Thẻ "Sắp ra mắt" không dẫn đi đâu (D-007).
