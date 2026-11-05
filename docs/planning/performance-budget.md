# Ngân sách hiệu năng

Tóm tắt: mục tiêu một trang bài học dưới khoảng 100 KB sau nén, đo bằng Lighthouse.

Trạng thái: nháp, các ngưỡng là mục tiêu ban đầu và có thể chỉnh sau khi đo thực tế. Cập nhật: 2026-11-05.

## Ngưỡng

| Hạng mục | Mục tiêu |
|---|---|
| HTML + CSS + JS một trang bài học | Khoảng 100 KB sau nén trở xuống (chưa gồm font) |
| JS tải ban đầu | Chỉ code của trang đó; engine quiz tải khi cần |
| Font | Tự host, chỉ ký tự cần dùng, tối đa 2 weight |
| Ảnh bitmap | Không dùng; dùng SVG hoặc CSS |
| Lighthouse (di động) | Mục tiêu Performance ≥ 90, đặt mốc sau lần đo đầu tiên |

## Biện pháp

1. **Font.** Hiện game tải Zen Maru Gothic và Be Vietnam Pro từ Google Fonts. Kế hoạch: tự host bản chỉ có hiragana, katakana và ký tự Latin cần thiết (cắt bằng `pyftsubset`, xuất `woff2`), `font-display: swap`, preload một weight. Chữ giao diện dùng font hệ thống. Kiểm tra giấy phép của font (OFL) và giữ kèm file license.
2. **Không framework nặng.** JavaScript thuần; chia code theo trang; dùng `import()` cho engine quiz.
3. **SVG.** Mọi hình là SVG nhỏ hoặc CSS. Thứ tự nét tải theo từng chữ khi cần.
4. **Cache.** GitHub Pages đặt cache ngắn và không cho chỉnh header, nên file CSS và JS có hash trong tên để cache lâu an toàn.
5. **PWA.** Đã làm: service worker ưu tiên mạng, chỉ dùng bản đã lưu khi mất mạng. Không dùng cache-first vì các module JS import không có hash trong tên, cache-first sẽ giữ bản cũ.
6. **DOM gọn.** Danh sách dài dùng `content-visibility: auto`.
7. **Giữ ngân sách trong CI.** Có thể thêm Lighthouse CI hoặc một script kiểm tra kích thước file sau build.

## Cách đo

Xem skill [`../skills/perf-audit/SKILL.md`](../skills/perf-audit/SKILL.md).
