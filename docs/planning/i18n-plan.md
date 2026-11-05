# Kế hoạch hỗ trợ hai ngôn ngữ Việt và Anh

Tóm tắt: site có hai ngôn ngữ chính, tiếng Việt (mặc định, giữ nguyên URL hiện có) và tiếng Anh (dưới `/en/`); làm hạ tầng trước khi viết thêm khóa mới để không phải dịch lại về sau.

Trạng thái: hạ tầng và giao diện tiếng Anh đã làm (xem "Tiến độ triển khai"); bài học tiếng Anh chờ D-019. D-018 đã chốt (2026-11-06) kèm bổ sung chọn ngôn ngữ theo vị trí; một chi tiết (trang con) cần bạn xác nhận. Ưu tiên cao hơn khóa Katakana (nội dung) và giáo trình sơ cấp. Cập nhật: 2026-11-06.

## Mục tiêu

- Người đọc chọn Việt hoặc Anh ở mọi trang; toàn bộ giao diện, bài học, giải thích đáp án và trang giới thiệu có cả hai bản.
- Không làm hỏng URL tiếng Việt đang chạy và không làm tăng đáng kể dung lượng trang (mỗi trang chỉ tải một ngôn ngữ).
- Tiến độ học dùng chung: đổi ngôn ngữ không mất tiến độ.
- Thêm ngôn ngữ thứ ba sau này không cần đổi kiến trúc.

## Quyết định thiết kế đề xuất (D-018)

| Hạng mục | Đề xuất | Lý do |
|---|---|---|
| Ngôn ngữ mặc định | Tiếng Việt, ở gốc `/enihongo/` | Giữ nguyên mọi đường dẫn đã chia sẻ và đã được lập chỉ mục |
| Tiếng Anh | Dưới `/enihongo/en/` | Một cây thư mục riêng, dễ dựng và dễ cache |
| Slug | Dịch theo ngôn ngữ: `/khoa-hoc/hiragana/bai-02-hang-a/` và `/en/courses/hiragana/lesson-02-a-row/` | Tốt cho SEO và người đọc; ánh xạ qua `translationKey` |
| Chọn ngôn ngữ | Nút chuyển ở đầu trang, nhớ lựa chọn trong `localStorage`. Lần đầu (chưa có lựa chọn) chọn theo vị trí người dùng: Việt Nam thì tiếng Việt, nơi khác thì tiếng Anh. Xem mục "Chọn ngôn ngữ theo vị trí" | Đúng yêu cầu: mặc định theo vị trí, người dùng luôn tự đổi được |
| Mã bài và tiến độ | `hiragana-02` không đổi theo ngôn ngữ | Tiến độ và điểm cao dùng chung |
| Nội dung bài | Mỗi ngôn ngữ một tệp `.md` riêng, chung `translationKey`; dữ liệu chữ (`chars.k`, `chars.r`) và từ (`kana`, `romaji`) viết một lần, văn bản giải thích viết riêng | Văn bản không dịch từng chữ được (xem mục "Nội dung") |

## Chọn ngôn ngữ theo vị trí

Yêu cầu (2026-11-06): người dùng ở Việt Nam thấy tiếng Việt, mọi nơi khác thấy tiếng Anh.

**Thứ tự ưu tiên khi quyết định ngôn ngữ**

1. Lựa chọn rõ ràng của người dùng (nút chuyển ngôn ngữ), lưu trong `localStorage` khóa `enihongo:lang`.
2. Tham số `?lang=vi` hoặc `?lang=en` trong liên kết (dùng khi chia sẻ).
3. Vị trí của người dùng (bên dưới).
4. Không xác định được thì dùng tiếng Việt.

**Cách xác định vị trí.** Site tĩnh không có máy chủ nên không đọc được địa chỉ IP. Dùng tín hiệu có sẵn ở trình duyệt, không gọi dịch vụ ngoài:

- Múi giờ: `Intl.DateTimeFormat().resolvedOptions().timeZone` là `Asia/Ho_Chi_Minh` hoặc `Asia/Saigon` thì coi là Việt Nam.
- Nếu không đọc được múi giờ: `navigator.languages` có `vi` thì coi là Việt Nam, ngược lại tiếng Anh.
- Không lưu vị trí, chỉ lưu ngôn ngữ được chọn; không gửi gì đi đâu.

**Vì sao không tra IP.** Tra IP chính xác hơn nhưng cần gọi dịch vụ bên thứ ba: gửi địa chỉ IP của người học ra ngoài (phải công bố ở trang giới thiệu), thêm một lần gọi mạng và một điểm có thể lỗi trước khi hiện được trang. Đề xuất để dành, hỏi lại nếu thấy múi giờ sai nhiều (D-020).

**Giới hạn đã biết.** Người Việt đang ở nước ngoài hoặc dùng VPN và đặt múi giờ nơi khác sẽ thấy tiếng Anh lần đầu; người nước ngoài dùng múi giờ Việt Nam sẽ thấy tiếng Việt. Nút chuyển ngôn ngữ phải thấy rõ ở đầu mọi trang, và lựa chọn được nhớ nên chỉ phải đổi một lần.

**Khi nào áp dụng.**

- Trang chủ (`/` và `/en/`), lần đầu chưa có lựa chọn: một đoạn script nhỏ chạy ngay đầu trang (trước khi vẽ nội dung, để không nháy) chuyển hướng bằng `location.replace` tới bản đúng ngôn ngữ.
- Trang con (bài học, khóa học, Dojo): giữ ngôn ngữ của đường dẫn, và hiện một dòng gợi ý "Xem bằng tiếng Anh?" (hoặc ngược lại) nếu lệch với vị trí. Lý do: liên kết được chia sẻ và kết quả tìm kiếm cần mở đúng ngôn ngữ đã ghi trong liên kết. **Cần bạn xác nhận**: nếu muốn chuyển hướng cả trang con thì đổi thành luôn chuyển, chấp nhận rủi ro bên dưới.
- Bot tìm kiếm (user agent chứa `bot`, `crawl`, `spider`...) không bị chuyển hướng; hai bản ngôn ngữ đều đọc được không cần JavaScript và có `hreflang`, `x-default` trỏ về tiếng Việt.

**Rủi ro SEO nếu chuyển hướng theo vị trí.** Trình thu thập của công cụ tìm kiếm thường chạy từ múi giờ nước ngoài; nếu bị chuyển hướng, bản tiếng Việt có thể mất khỏi chỉ mục. Biện pháp: bỏ qua chuyển hướng với bot, chỉ chuyển ở trang chủ, giữ `hreflang` hai chiều.

**Kiểm tra.** Playwright đặt `timezoneId` và `locale` cho bốn trường hợp (Việt Nam; Mỹ; múi giờ lạ kèm ngôn ngữ `vi`; đã có lựa chọn lưu sẵn trái với vị trí) và xác nhận ngôn ngữ cuối cùng, không có vòng chuyển hướng, bot không bị chuyển, nút chuyển ngôn ngữ ghi đè được.

## Phạm vi công việc

### 1. Hạ tầng Eleventy

- `src/_data/i18n/vi.json` và `en.json`: toàn bộ chuỗi giao diện (menu, nút, nhãn, thông báo, chân trang). Template dùng `{{ t.nav.courses }}` thay cho chữ gắn cứng.
- Cấu trúc nguồn: `src/vi/` và `src/en/` dùng chung layout; `permalink` tính từ ngôn ngữ và slug.
- `_data/site.json` có tên và mô tả theo ngôn ngữ; `<html lang>` đúng ngôn ngữ trang.
- Thẻ `hreflang` cho từng cặp trang, `x-default` trỏ về tiếng Việt; `canonical` trỏ về chính trang đó.
- `sitemap.xml` liệt kê cả hai ngôn ngữ kèm `xhtml:link` thay thế; `manifest.webmanifest` theo ngôn ngữ (hoặc bản chung).
- Trang 404: một trang, hiện cả hai ngôn ngữ.
- Script chọn ngôn ngữ theo vị trí (xem mục trên) nhúng ở `<head>` của trang chủ, kích thước khoảng 1 KB.
- Service worker: không đổi, cache theo URL.

### 2. Chuỗi trong JavaScript

Quiz và flashcard hiện chứa nhiều câu tiếng Việt trong mã (`quiz-core.js`: nhãn dạng câu hỏi, lời giải thích, ghi chú chữ đặc biệt; `quiz-ui.js`: phản hồi, màn kết quả; `lesson.js`, `dojo.js`, `course.js`).

- Tách thành danh mục chuỗi `src/js/i18n/vi.js` và `en.js`, hàm `t(key, params)`; ngôn ngữ đọc từ `<html lang>`.
- Chỉ tải danh mục của ngôn ngữ hiện tại.
- Lời giải thích có chèn dữ liệu (chữ, romaji) dùng mẫu có tham số, không ghép chuỗi cứng.
- Định dạng số và ngày dùng `toLocaleString` theo ngôn ngữ trang.
- Câu hỏi "Chữ này đọc là gì" và các dạng khác giữ logic, chỉ đổi lời hỏi.

### 3. Nội dung bài học

Dịch máy từng chữ không dùng được vì phần lớn lời giải thích phụ thuộc người đọc:

- **So sánh âm với tiếng Việt** ("đọc như a trong ba", "gần giống ê") không áp dụng cho người đọc tiếng Anh. Bản tiếng Anh dùng so sánh với tiếng Anh (hoặc mô tả vị trí miệng), viết lại, không dịch.
- **Mẹo nhớ hình chữ** viết lại theo hình ảnh quen với người đọc tiếng Anh; không dịch nguyên văn.
- **Ghi chú riêng cho người Việt** (âm や/ら, nhầm "r" và "l", Hán Việt khi sang kanji) chỉ có trong bản tiếng Việt; bản tiếng Anh có ghi chú riêng cho người nói tiếng Anh nếu cần.
- **Nghĩa từ**: thêm trường `en` cạnh `vi` cho từng từ; bản tiếng Anh dùng `en`.
- **Quy ước romaji** (Hepburn, cách viết trường âm và âm ngắt) giữ nguyên ở cả hai ngôn ngữ; có thể thêm một dòng giải thích cho người nói tiếng Anh về cách đọc `ou`, `ei`.
- Người biết tiếng Anh tốt và hiểu tiếng Nhật duyệt bản tiếng Anh trước khi `published`, như quy trình hiện có.

### 4. Công cụ kiểm tra

- `npm test` thêm kiểm tra: hai danh mục chuỗi có cùng tập khóa; mọi bài tiếng Việt có bài tiếng Anh cùng `translationKey` (bài chưa dịch phải ghi `status: draft` và bị loại khỏi sitemap); chữ, romaji và từ giống nhau giữa hai bản; liên kết `hreflang` hai chiều.
- `npm run size` và Lighthouse chạy cho cả hai ngôn ngữ; ngân sách như cũ.

### 5. Tài liệu và quy ước

- [`../content/content-guidelines.md`](../content/content-guidelines.md): thêm mục viết bản tiếng Anh (giọng văn, không dịch sát, thuật ngữ nhất quán).
- [`../context/glossary.md`](../context/glossary.md): bảng thuật ngữ Việt và Anh (mora, âm ngắt, trường âm...).
- [`../agents/agent-guidelines.md`](../agents/agent-guidelines.md): mọi thay đổi giao diện phải cập nhật cả hai danh mục chuỗi.

## Trình tự làm việc

1. (Xong) Chốt D-018.
2. Dựng hạ tầng: cấu trúc `vi` và `en`, `permalink`, layout đọc chuỗi từ danh mục, nút chuyển ngôn ngữ, `hreflang`. Trang tiếng Việt phải giữ nguyên URL và nội dung (so sánh đầu ra trước và sau).
3. Tách chuỗi giao diện trong HTML và JavaScript sang danh mục tiếng Việt; chưa thêm tiếng Anh, chạy `npm test` để chắc không đổi hành vi.
4. Thêm danh mục tiếng Anh và trang tiếng Anh cho phần giao diện (trang chủ, khóa học, giới thiệu, Dojo).
5. Viết bản tiếng Anh cho bài 1 đến 3 để duyệt văn phong; sau đó các bài còn lại.
6. Script chọn ngôn ngữ theo vị trí và gợi ý ở trang con; kiểm tra bằng Playwright với bốn trường hợp múi giờ và ngôn ngữ.
7. Cập nhật kiểm tra, sitemap, Lighthouse cho hai ngôn ngữ.
8. Từ lúc này mọi khóa mới (Katakana, sơ cấp) viết song ngữ ngay từ đầu.

## Tiến độ triển khai (cập nhật 2026-11-06)

| Bước | Trạng thái | Ghi chú |
|---|---|---|
| 2. Hạ tầng | Xong | Chuỗi trang ở `src/_data/i18n.js` (đối tượng JS, không phải JSON, để dùng chung cho hai ngôn ngữ trong một tệp); `src/_data/routes.json` ánh xạ URL; thân trang dùng chung ở `src/_includes/pages/*.njk`, trang tiếng Anh nằm ở `src/en/` với `lang: en` từ `src/en/en.json`. Lọc `route` và `l10n`. Đầu ra tiếng Việt chỉ khác ở `hreflang` và nút chuyển ngôn ngữ |
| 3. Tách chuỗi JS | Xong | `src/js/i18n/{vi,en}.js`, `src/js/i18n.js` (`t`, `gloss`, `num`). Snapshot quiz tiếng Việt có seed trùng khớp trước và sau |
| 4. Trang tiếng Anh | Xong phần giao diện | Trang chủ, khóa học, Hiragana, giới thiệu, Dojo, "sắp ra mắt". Danh sách bài tiếng Anh vẫn trỏ về bài tiếng Việt, kèm ghi chú |
| 5. Bài học tiếng Anh | Chưa làm | Chờ D-019. Nghĩa từ tiếng Anh (`en`) đã có cho mọi từ trong bài |
| 6. Chọn theo vị trí | Xong | `src/_includes/partials/lang-script.njk`; kiểm tra `tools/e2e-i18n.py` |
| 7. Kiểm tra và đo | Một phần | `tools/check-i18n.mjs` nằm trong `npm test`; Lighthouse 100/100/96/100 (best-practices 96 do beacon bị chặn trong sandbox) cho `/`, `/en/`; `/en/practice/` hiệu năng 98 |

Điểm khác với kế hoạch ban đầu:

- Chuyển hướng tự động chỉ ở trang chủ (`/` và `/en/`); trang con chỉ hiện banner gợi ý (đề xuất của kế hoạch, chờ bạn xác nhận nếu muốn chuyển hướng cả trang con).
- Bot (user agent chứa `bot`, `crawl`, `spider`, `slurp`, `lighthouse`, `preview`) không bị chuyển hướng.
- Chưa có kiểm tra tự động tìm chữ có dấu tiếng Việt còn sót trong template và JavaScript ngoài danh mục (rủi ro ở bảng dưới); hiện kiểm tra bằng `tools/check-i18n.mjs` (danh mục, dữ liệu, câu hỏi) và `tools/e2e-i18n.py` (trang tiếng Anh).
- Bài học (`lesson.njk`) vẫn chỉ có tiếng Việt, nên trang bài không có `hreflang`; nút chuyển ngôn ngữ ở bài dẫn về trang chủ bản kia.

## Rủi ro

| Rủi ro | Cách giảm |
|---|---|
| Đổi cấu trúc thư mục làm hỏng URL tiếng Việt đã chia sẻ | Giữ nguyên đường dẫn tiếng Việt, so sánh danh sách URL trước và sau khi dựng |
| Bản tiếng Anh chất lượng thấp do dịch sát | Viết lại phần so sánh âm và mẹo nhớ; có người duyệt |
| Chuỗi bị bỏ sót trong mã, trang lẫn hai ngôn ngữ | Kiểm tra tự động tìm ký tự có dấu tiếng Việt trong mã nguồn JavaScript và template ngoài danh mục chuỗi |
| Khối lượng nội dung tăng gấp đôi | Dữ liệu chữ và từ dùng chung; chỉ văn bản giải thích viết hai lần |
| Quá tải bảo trì khi thêm khóa | Quy trình song ngữ ngay từ đầu, bài thiếu bản dịch ở trạng thái `draft` |

## Quyết định

| Mã | Câu hỏi | Đề xuất |
|---|---|---|
| D-018 | Cấu trúc URL và cách chọn ngôn ngữ như bảng "Quyết định thiết kế đề xuất", gồm chọn theo vị trí | Đã chốt (2026-11-06) |
| D-020 | Tra IP để xác định nước thay cho múi giờ | Hoãn, xem lại nếu múi giờ sai nhiều |
| D-019 | Ai duyệt bản tiếng Anh | Chờ chốt, cần có trước bước 5 |
