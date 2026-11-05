# Nhật ký quyết định

Tóm tắt: các quyết định đã chốt và đang chờ chốt, theo thứ tự thời gian.

Trạng thái: đang dùng. Cập nhật: 2026-11-05.

Quy ước: không sửa quyết định cũ; nếu đổi hướng thì thêm dòng mới và ghi "thay thế D-xxx".

| Mã | Ngày | Quyết định | Trạng thái |
|---|---|---|---|
| D-001 | 2026-11-05 | Site là trang tĩnh, deploy bằng GitHub Pages từ nhánh `main`, thư mục gốc | Đã chốt |
| D-002 | 2026-11-05 | Bỏ bảng xếp hạng và backend ở giai đoạn này. Đề xuất cũ giữ ở [`archive/leaderboard-proposal.md`](archive/leaderboard-proposal.md) | Đã chốt |
| D-003 | 2026-11-05 | Chiến lược: miễn phí, chia sẻ rộng, phân cấp khóa học; chỉ mở khóa cơ bản, các khóa khác "Sắp ra mắt" | Đã chốt |
| D-004 | 2026-11-05 | Nội dung tự biên soạn, không sao chép giáo trình in | Đã chốt |
| D-005 | 2026-11-05 | Cách dựng trang: Eleventy 3 + GitHub Actions (không dùng HTML viết tay) | Đã chốt (2026-11-05) |
| D-006 | 2026-11-05 | Đường dẫn: giữ `luongdang082021.github.io/enihongo/`, chưa mua tên miền | Đã chốt (2026-11-05, theo giả định; đổi được sau bằng biến `PATH_PREFIX`) |
| D-007 | 2026-11-05 | Thẻ "Sắp ra mắt" không dẫn đi đâu (không link, không form) | Đã chốt (2026-11-05) |
| D-008 | 2026-11-05 | Giai đoạn 1: dựng khung và 3 bài mẫu (bài 1–3) để duyệt, rồi mới viết các bài còn lại | Đã chốt (2026-11-05) |
| D-009 | 2026-11-05 | Tiến độ học lưu bằng `localStorage`, có xuất/nhập JSON; không có tài khoản | Đã chốt (2026-11-06) |
| D-010 | 2026-11-05 | Analytics: Cloudflare Web Analytics (không cookie). Chỉ bật khi điền token vào `src/_data/site.json` (`cfBeaconToken`) | Đã chốt (2026-11-05); token đã điền |
| D-011 | 2026-11-05 | Thứ tự nét lấy từ KanjiVG (CC BY-SA 3.0): ghi nguồn ở trang giới thiệu và trong giao diện, dữ liệu rút gọn `src/data/strokes.json` giữ nguyên giấy phép CC BY-SA. Phát âm dùng giọng đọc của thiết bị, không có file âm thanh | Đã chốt (2026-11-06) |
| D-012 | 2026-11-05 | Katakana: không khóa cứng Hiragana trước; hiện gợi ý "nên học Hiragana trước" ở đầu khóa | Đã chốt (2026-11-06), xem [`katakana-plan.md`](katakana-plan.md) |
| D-013 | 2026-11-05 | Katakana: từ mượn theo chủ đề đồ ăn uống, địa danh, đồ vật hằng ngày; tránh tên thương hiệu | Đã chốt (2026-11-06) |
| D-014 | 2026-11-05 | Dojo là một tính năng chung (không tách theo từng khóa). Phạm vi chọn là **khóa học**, không đi vào từng bài: mặc định chọn toàn bộ nội dung của khóa; có thể chọn nhiều khóa để trộn (ví dụ Hiragana và Katakana). Điều chỉnh 2026-11-06: bỏ chọn theo bài và theo chủ đề | Đã chốt (2026-11-06), thiết kế trong [`katakana-plan.md`](katakana-plan.md) |
| D-015 | 2026-11-06 | Giáo trình tự biên soạn, bám JF Standard và CEFR, không dùng nội dung sách in; đổi tên khóa N5 thành "Tiếng Nhật sơ cấp 1 và 2" | Hoãn (pending), xem [`../content/curriculum.md`](../content/curriculum.md) |
| D-016 | 2026-11-06 | Nguồn dữ liệu nghĩa và âm đọc kanji | Hoãn (pending) |
| D-017 | 2026-11-06 | Âm thanh cho khóa nghe và luyện JFT-Basic | Hoãn (pending) |
| D-018 | 2026-11-06 | Hai ngôn ngữ Việt và Anh: tiếng Việt ở gốc, tiếng Anh dưới `/en/`, slug dịch, nút chuyển ngôn ngữ, mã bài và tiến độ dùng chung. Bổ sung: lần đầu chọn ngôn ngữ theo vị trí người dùng (Việt Nam thì tiếng Việt, nơi khác thì tiếng Anh; vị trí lấy từ múi giờ trình duyệt) | Đã chốt (2026-11-06); chi tiết áp dụng ở trang con chờ xác nhận, xem [`i18n-plan.md`](i18n-plan.md) |
| D-019 | 2026-11-06 | Người duyệt bản tiếng Anh | Chờ chốt |
| D-020 | 2026-11-06 | Tra IP bằng dịch vụ ngoài để xác định nước | Hoãn (pending), xác nhận 2026-11-06 |

## Ghi chú cho D-002

Nếu sau này cần bảng xếp hạng: dùng ID ngẫu nhiên và mã khôi phục thay cho device fingerprint (fingerprint không ổn định, dễ trùng và có thể là dữ liệu cá nhân cần xin đồng ý). Lưu ý này chỉ để tham khảo, không phải kế hoạch hiện tại.
