# Lộ trình

Tóm tắt: bốn giai đoạn đi từ khung trang đến mở rộng; giai đoạn 0 (game) đã xong.

Trạng thái: đang dùng. Cập nhật: 2026-11-05.

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| 0. Game | Hiragana Dojo chạy độc lập, deploy lên GitHub Pages | Xong (2026-11-05) |
| 1. Khung trang | Thiết kế giao diện, trang chủ, lưới khóa học có thẻ khóa, pipeline build và deploy, chuyển Dojo về `/luyen-tap/hiragana-dojo` | Xong (2026-11-05) |
| 2. Khóa Hiragana | 13 bài và Dojo, flashcard, mini quiz, tiến độ học | Xong (2026-11-05) |
| 3. Hoàn thiện | SEO, analytics nhẹ, PWA offline, đo hiệu năng | Đang làm: SEO, PWA và đo hiệu năng xong; analytics đã bật |
| 4. Thứ tự nét và phát âm | Thứ tự nét (KanjiVG), phát âm bằng giọng thiết bị | Đã làm cho chữ đơn của Hiragana (2026-11-05) |
| 5. Katakana | Khóa Katakana và Katakana Dojo | Kế hoạch: [`katakana-plan.md`](katakana-plan.md) |

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
- [x] Flashcard lặp lại ngắt quãng (Leitner 5 hộp: chờ 0, 1, 3, 7, 16 ngày), lưu bằng `localStorage` trong `cards` của `enihongo:v1`
- [x] Mini quiz 10 câu cho mỗi bài
- [x] Tiến độ học và nút xuất/nhập JSON

## Giai đoạn 3: việc cần làm

- [x] Thẻ meta (canonical, Open Graph, Twitter Card), JSON-LD cho trang chủ và khóa Hiragana, sitemap, robots
- [x] Biểu tượng, manifest và service worker (ưu tiên mạng, dùng bản đã lưu khi mất mạng)
- [x] Mã nhúng Cloudflare Web Analytics (D-010), tự tắt khi chưa có token.  Token đã điền (2026-11-05)
- [x] Thẻ "Sắp ra mắt" không dẫn đi đâu (D-007)
- [ ] Đo lại Lighthouse trên bản deploy thật

## Giai đoạn 4: việc cần làm

- [x] Kiểm tra giấy phép dữ liệu nét: KanjiVG là CC BY-SA 3.0, dùng được nếu ghi nguồn và giữ giấy phép cho dữ liệu rút gọn (D-011)
- [x] `tools/build-strokes.mjs` tạo `src/data/strokes.json` (73 chữ, 22 KB, khoảng 7 KB gzip), chỉ tải khi bấm "Nét viết"
- [x] Nút "Nét viết" (vẽ từng nét, có số thứ tự) và "Nghe" trong bài học
- [ ] Thứ tự nét cho chữ ghép (きゃ...): hiện chưa có, chỉ chữ đơn
- [ ] Đo giọng đọc trên Android và iOS thật; nếu thiết bị thiếu giọng Nhật thì nút Nghe tự ẩn

Xem thêm [`growth-and-seo.md`](growth-and-seo.md) và [`performance-budget.md`](performance-budget.md).

## Giai đoạn 5: Katakana

Xem [`katakana-plan.md`](katakana-plan.md).
