---
name: perf-audit
description: Đo kích thước và hiệu năng trang của enihongo so với ngân sách trong docs/planning/performance-budget.md. Dùng sau khi thêm trang, font, thư viện hoặc hình ảnh, hoặc khi người dùng nói trang chậm hoặc nặng.
---

# Kiểm tra hiệu năng

## Các bước

1. Đọc `docs/planning/performance-budget.md` để lấy ngưỡng.
2. Đo kích thước từng file sau nén gzip:
   ```bash
   for f in $(find . -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.woff2' | grep -v node_modules); do
     printf '%8d  %s\n' "$(gzip -9 -c "$f" | wc -c)" "$f"
   done | sort -rn | head -20
   ```
3. Chạy Lighthouse bản di động nếu có thể (ví dụ `npx lighthouse <url> --form-factor=mobile --only-categories=performance`).
4. So với ngưỡng, báo cáo từng hạng mục: đạt, vượt, hoặc chưa đo được.

## Khi vượt ngân sách

- Font: cắt gọn bằng `pyftsubset` (hiragana `U+3040-309F`, katakana `U+30A0-30FF`, Latin `U+0020-007E`, `--flavor=woff2`), giảm số weight, kiểm tra giấy phép và giữ kèm file license.
- Script: chia theo trang, dùng `import()` cho phần chỉ cần ở một trang.
- Hình: chuyển sang SVG hoặc CSS; không dùng ảnh bitmap.
- Báo cáo mức vượt và đề xuất, không tự bỏ tính năng.

## Lưu ý

- Số liệu đo trên máy khác nhau; ghi rõ cách đo và ngày đo.
- Nếu không có mạng hoặc không chạy được Lighthouse, nói rõ và chỉ báo kích thước file.
