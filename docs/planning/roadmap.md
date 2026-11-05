# Lộ trình

Tóm tắt: bốn giai đoạn đi từ khung trang đến mở rộng; giai đoạn 0 (game) đã xong.

Trạng thái: đang dùng. Cập nhật: 2026-11-05.

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| 0. Game | Hiragana Dojo chạy độc lập, deploy lên GitHub Pages | Xong (2026-11-05) |
| 1. Khung trang | Thiết kế giao diện, trang chủ, lưới khóa học có thẻ khóa, pipeline build và deploy, chuyển Dojo về `/luyen-tap/hiragana-dojo` | Xong (2026-11-05) |
| 2. Khóa Hiragana | 13 bài và Dojo, flashcard, mini quiz, tiến độ học | Xong, trừ flashcard ngắt quãng (2026-11-05) |
| 3. Hoàn thiện | SEO, analytics nhẹ, PWA offline, đo hiệu năng | Đang làm: SEO, PWA và đo hiệu năng xong; analytics chờ D-010 |
| 4. Mở rộng | Thứ tự nét, âm thanh phát âm | Chưa bắt đầu |

## Giai đoạn 1: việc cần làm

- [x] Chốt cách dựng trang (xem D-005 trong [`decisions.md`](decisions.md))
- [x] Chốt đường dẫn gốc (D-006)
- [x] Hệ thống thiết kế: màu, font, khoảng cách, chế độ sáng và tối
- [x] Trang chủ và `/khoa-hoc/`
- [x] Thẻ khóa "Sắp ra mắt" cho 5 khóa chưa mở
- [x] Tự host font đã cắt gọn
- [x] Tách engine quiz thành module dùng chung (dữ liệu chữ và từ ra file riêng)
- [x] Đưa bộ kiểm tra mô phỏng câu hỏi vào `tools/`
- [x] Đo Lighthouse làm mốc ban đầu: bản local 2026-11-05 đạt 100 cả bốn mục (Performance, Accessibility, Best Practices, SEO) trên trang chủ, bài 8 và Dojo, CLS 0

## Giai đoạn 2: việc cần làm

- [x] Mẫu bài học ([`../content/lesson-template.md`](../content/lesson-template.md)) và 3 bài mẫu để duyệt phong cách
- [x] Viết nốt các bài còn lại theo [`../content/hiragana-course-outline.md`](../content/hiragana-course-outline.md)
- [ ] Flashcard lặp lại ngắt quãng, lưu bằng `localStorage` (hiện flashcard chỉ có Chưa nhớ / Đã nhớ trong một phiên, chưa lưu)
- [x] Mini quiz 10 câu cho mỗi bài
- [x] Tiến độ học và nút xuất/nhập JSON

## Giai đoạn 3: việc cần làm

- [x] Thẻ meta (canonical, Open Graph, Twitter Card), JSON-LD cho trang chủ và khóa Hiragana, sitemap, robots
- [x] Biểu tượng, manifest và service worker (ưu tiên mạng, dùng bản đã lưu khi mất mạng)
- [ ] Analytics không cookie (chờ D-010)
- [ ] Thẻ "Sắp ra mắt" dẫn đi đâu (chờ D-007)
- [ ] Đo lại Lighthouse trên bản deploy thật

## Giai đoạn 4

Xem [`growth-and-seo.md`](growth-and-seo.md) và [`performance-budget.md`](performance-budget.md). Thứ tự nét viết cần kiểm tra giấy phép nguồn dữ liệu trước khi dùng.
