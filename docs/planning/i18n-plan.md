# Kế hoạch hỗ trợ hai ngôn ngữ Việt và Anh

Tóm tắt: site có hai ngôn ngữ chính, tiếng Việt (mặc định, giữ nguyên URL hiện có) và tiếng Anh (dưới `/en/`); làm hạ tầng trước khi viết thêm khóa mới để không phải dịch lại về sau.

Trạng thái: nháp kế hoạch, quyết định D-018 chờ chốt. Ưu tiên cao hơn khóa Katakana (nội dung) và giáo trình sơ cấp. Cập nhật: 2026-11-06.

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
| Chọn ngôn ngữ | Nút chuyển ở đầu trang, nhớ lựa chọn trong `localStorage`; không tự chuyển hướng theo trình duyệt, chỉ hiện gợi ý một dòng nếu ngôn ngữ trình duyệt khác trang đang xem | Tránh nhảy trang bất ngờ, không ảnh hưởng bot tìm kiếm |
| Mã bài và tiến độ | `hiragana-02` không đổi theo ngôn ngữ | Tiến độ và điểm cao dùng chung |
| Nội dung bài | Mỗi ngôn ngữ một tệp `.md` riêng, chung `translationKey`; dữ liệu chữ (`chars.k`, `chars.r`) và từ (`kana`, `romaji`) viết một lần, văn bản giải thích viết riêng | Văn bản không dịch từng chữ được (xem mục "Nội dung") |

## Phạm vi công việc

### 1. Hạ tầng Eleventy

- `src/_data/i18n/vi.json` và `en.json`: toàn bộ chuỗi giao diện (menu, nút, nhãn, thông báo, chân trang). Template dùng `{{ t.nav.courses }}` thay cho chữ gắn cứng.
- Cấu trúc nguồn: `src/vi/` và `src/en/` dùng chung layout; `permalink` tính từ ngôn ngữ và slug.
- `_data/site.json` có tên và mô tả theo ngôn ngữ; `<html lang>` đúng ngôn ngữ trang.
- Thẻ `hreflang` cho từng cặp trang, `x-default` trỏ về tiếng Việt; `canonical` trỏ về chính trang đó.
- `sitemap.xml` liệt kê cả hai ngôn ngữ kèm `xhtml:link` thay thế; `manifest.webmanifest` theo ngôn ngữ (hoặc bản chung).
- Trang 404: một trang, hiện cả hai ngôn ngữ.
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

1. Chốt D-018.
2. Dựng hạ tầng: cấu trúc `vi` và `en`, `permalink`, layout đọc chuỗi từ danh mục, nút chuyển ngôn ngữ, `hreflang`. Trang tiếng Việt phải giữ nguyên URL và nội dung (so sánh đầu ra trước và sau).
3. Tách chuỗi giao diện trong HTML và JavaScript sang danh mục tiếng Việt; chưa thêm tiếng Anh, chạy `npm test` để chắc không đổi hành vi.
4. Thêm danh mục tiếng Anh và trang tiếng Anh cho phần giao diện (trang chủ, khóa học, giới thiệu, Dojo).
5. Viết bản tiếng Anh cho bài 1 đến 3 để duyệt văn phong; sau đó các bài còn lại.
6. Cập nhật kiểm tra, sitemap, Lighthouse cho hai ngôn ngữ.
7. Từ lúc này mọi khóa mới (Katakana, sơ cấp) viết song ngữ ngay từ đầu.

## Rủi ro

| Rủi ro | Cách giảm |
|---|---|
| Đổi cấu trúc thư mục làm hỏng URL tiếng Việt đã chia sẻ | Giữ nguyên đường dẫn tiếng Việt, so sánh danh sách URL trước và sau khi dựng |
| Bản tiếng Anh chất lượng thấp do dịch sát | Viết lại phần so sánh âm và mẹo nhớ; có người duyệt |
| Chuỗi bị bỏ sót trong mã, trang lẫn hai ngôn ngữ | Kiểm tra tự động tìm ký tự có dấu tiếng Việt trong mã nguồn JavaScript và template ngoài danh mục chuỗi |
| Khối lượng nội dung tăng gấp đôi | Dữ liệu chữ và từ dùng chung; chỉ văn bản giải thích viết hai lần |
| Quá tải bảo trì khi thêm khóa | Quy trình song ngữ ngay từ đầu, bài thiếu bản dịch ở trạng thái `draft` |

## Quyết định đang chờ

| Mã | Câu hỏi | Đề xuất |
|---|---|---|
| D-018 | Cấu trúc URL và cách chọn ngôn ngữ như bảng "Quyết định thiết kế đề xuất" | Chốt như đề xuất |
| D-019 | Ai duyệt bản tiếng Anh | Chọn người trước khi bắt đầu bước 5 |
