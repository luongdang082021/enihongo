# Kế hoạch giai đoạn 5: khóa Katakana

Tóm tắt: mở khóa Katakana thứ hai, tái dùng khung trang và engine quiz; việc khó nhất là làm engine hiểu hai bộ chữ và viết nội dung cho từ mượn.

Trạng thái: kế hoạch đã duyệt, chưa bắt đầu viết mã; làm sau Dojo chung và hạ tầng hai ngôn ngữ ([`i18n-plan.md`](i18n-plan.md)), bài viết song ngữ ngay từ đầu. D-012 đến D-014 đã chốt (2026-11-06). Cập nhật: 2026-11-05.

## Mục tiêu

- Người đã học Hiragana học tiếp Katakana trong cùng site, cùng cách học (bài ngắn, flashcard ngắt quãng, mini quiz, thứ tự nét, phát âm).
- Mở khóa "Katakana" trên lưới khóa học, bỏ khỏi danh sách "Sắp ra mắt".
- Dojo chung: chọn Hiragana, Katakana, tổng hợp hoặc trộn theo bài và chủ đề (D-014).
- Vẫn trong ngân sách: trang bài dưới 100 KB gzip, Lighthouse 100 như hiện tại.

## Phạm vi nội dung

Dự kiến 12 bài, mỗi bài khoảng 10 phút. Tên bài là đề xuất.

| Bài | Chủ đề | Chữ | Điểm cần nhấn |
|---|---|---|---|
| 1 | Làm quen Katakana | Không có chữ mới | Katakana dùng cho từ mượn, tên nước ngoài, từ tượng thanh, nhấn mạnh; so sánh với Hiragana |
| 2 | Hàng ア | ア イ ウ エ オ | Năm nguyên âm, nét thẳng và góc cạnh |
| 3 | Hàng カ, サ | カ キ ク ケ コ, サ シ ス セ ソ | シ shi |
| 4 | Hàng タ, ナ | タ チ ツ テ ト, ナ ニ ヌ ネ ノ | チ chi, ツ tsu |
| 5 | Hàng ハ, マ | ハ ヒ フ ヘ ホ, マ ミ ム メ モ | フ fu |
| 6 | Hàng ヤ, ラ | ヤ ユ ヨ, ラ リ ル レ ロ | Chỉ 3 chữ hàng ヤ |
| 7 | ワ, ヲ, ン | ワ ヲ ン | ヲ hầu như chỉ gặp trong tên gọi cũ; ン là một nhịp |
| 8 | Chữ dễ nhầm | シ/ツ, ソ/ン, ノ/メ, ク/ワ, ナ/メ | Bài riêng về cặp giống nhau vì đây là chỗ người học vấp nhiều nhất |
| 9 | Âm đục và bán đục | ガ ザ ダ バ パ | Giống Hiragana, cùng dấu ゛ ゜ |
| 10 | Âm ghép và dấu kéo dài | キャ シュ チョ, ー | ー kéo dài nguyên âm, thay cho việc lặp nguyên âm của Hiragana |
| 11 | Âm ngắt và âm mở rộng | ッ, ファ ティ ウィ ジェ | Cách viết âm không có trong tiếng Nhật cổ để đọc từ mượn |
| 12 | Ôn tập và từ mượn thường gặp | Tất cả | Mini quiz dài, danh sách chữ hay nhầm |

Từ ví dụ là từ mượn tự chọn theo chủ đề quen thuộc (đồ ăn, đồ uống, địa danh, đồ vật). Chỉ dùng chữ đã học tới bài đó, như quy ước của khóa Hiragana ([`../content/content-guidelines.md`](../content/content-guidelines.md)).

## Thay đổi kỹ thuật

### 1. Engine quiz hiểu hai bộ chữ

Hiện `src/js/quiz-core.js` gắn cứng bảng Hiragana (`BASIC`, `DAKU`, `YOON`, bảng `R`, danh sách chữ dễ nhầm, hàm `isLong`).

- Tách dữ liệu chữ ra `src/js/kana-data.js`, mỗi bộ chữ có cùng cấu trúc: hàng cơ bản, đục, ghép, bảng romaji, cặp dễ nhầm.
- `parseMorae` nhận thêm `ャュョ`. `っ` thành `ッ`.
- Trường âm: Hiragana dùng nguyên âm lặp; Katakana dùng **ー**. `isLong`, `romajiOf` và các biến thể sai (`remLong`, `addLong`, `swapLong`) cần nhánh riêng cho Katakana.
- Âm mở rộng (ファ, ティ, ウィ, ジェ, ヴ...) thêm vào bảng `R` của Katakana; câu hỏi `size` mở rộng cho các cụm này.
- Bài học khai báo `writing: katakana` trong front matter; `buildLesson` chọn bảng theo đó.
- Câu hỏi `voice` (thêm ゛ ゜) dùng chung logic, đổi bảng chữ.
- Giữ nguyên hành vi Hiragana: bộ kiểm tra `npm test` phải còn đạt 1.500 bộ câu hỏi.

### 2. Dữ liệu khóa học theo từng khóa

- Tách `src/_data/lessons.json` thành `lessons/hiragana.json` và `lessons/katakana.json` (hoặc một tệp có khóa `course`).
- Layout bài học và trang danh sách bài đọc tên khóa, đường dẫn, mục lục từ dữ liệu khóa, bỏ chữ "Nhập môn Hiragana" gắn cứng trong `lesson.njk` và `hiragana/index.njk`.
- `courses.json`: đổi Katakana sang `status: open`, thêm `url` và `meta`. Trang "Sắp ra mắt" tự bỏ Katakana vì `soon.js` lọc theo trạng thái.
- Thêm `src/khoa-hoc/katakana/` với `katakana.json` (layout, tag) tương tự thư mục Hiragana.
- Front matter mỗi bài thêm `writing`, `tags` (xem [`../content/curriculum.md`](../content/curriculum.md)).
- Tiến độ lưu chung trong `enihongo:v1`, ID bài dạng `katakana-NN`; không đổi định dạng nên không cần chuyển dữ liệu cũ.

### 3. Thứ tự nét và phát âm

- `tools/build-strokes.mjs` thêm các chữ Katakana (KanjiVG có đủ, cùng giấy phép CC BY-SA). Dự kiến thêm khoảng 25 KB thô.
- Chia `strokes.json` thành hai tệp theo bộ chữ để trang Hiragana không phải tải phần Katakana.
- Phát âm dùng giọng đọc tiếng Nhật của thiết bị như hiện nay; không cần thêm gì.

### 4. Dojo chung (D-014)

Dojo là một tính năng chung ở `/luyen-tap/`, không tách riêng cho từng khóa. Người chơi chọn nội dung, hệ thống trộn câu hỏi.

- **Chọn nội dung**: ba cách, dùng chung một màn hình.
  1. *Chế độ nhanh*: Hiragana, Katakana, Tổng hợp (sau này thêm Kanji). Hiragana giữ nguyên 5 hiệp hiện có.
  2. *Theo khóa học*: mỗi khóa một ô "Cả khóa"; mở khóa ra để chọn từng bài nếu muốn. Chọn được nhiều khóa cùng lúc (ví dụ Hiragana và Katakana); các bài đã hoàn thành được chọn sẵn.
  3. *Theo chủ đề*: nhãn `tags` của bài (nguyên âm, âm đục, từ mượn đồ ăn...), cho phép trộn nhiều chủ đề.
- **Nguồn dữ liệu**: mỗi bài đã khai báo `chars`, `words`, `writing`, `tags` trong front matter. Eleventy sinh `data/dojo-pool.json` từ các bài, nên thêm bài mới là Dojo tự có nội dung mới. Dojo chỉ tải tệp này khi mở màn hình chọn.
- **Dạng câu hỏi**: lấy theo nội dung đã chọn. Chữ đơn dùng `k2r`, `r2k`, `type`, `match`, `odd`; từ dùng `wk2r`, `wr2k`, `wtype`, `fill`, `mora`; `voice` và `size` chỉ xuất hiện khi lựa chọn có âm đục hoặc âm ghép. Kanji (sau này) thêm dạng riêng.
- **Hiệp**: chế độ nhanh theo hiệp cố định; chế độ theo bài và chủ đề là một lượt 20 câu rút từ nhóm đã chọn, có thể chơi lại.
- **Điểm cao**: lưu theo "bộ nội dung" (tên chế độ hoặc mã băm danh sách bài đã chọn) trong `dojo` của `enihongo:v1`. Điểm của Hiragana Dojo hiện có giữ nguyên khóa `0` đến `4`.
- **Chữ cần ôn**: Dojo ghi chữ trả lời sai vào dữ liệu ôn tập (cùng nơi lưu flashcard) để ưu tiên ở lượt sau; thực hiện sau khi Dojo chung chạy ổn.
- **Tiến độ (2026-11-06)**: phần Hiragana đã làm (`dojo-mix.js`, `dojo-pool.json`, màn hình chọn bài). Khi có Katakana chỉ cần thêm bài vào kho và bổ sung lựa chọn theo `writing`; việc còn lại của engine là hiểu bảng chữ thứ hai.

### 5. Điều hướng, SEO, hiệu năng

- Trang `/luyen-tap/` có thể cần trang chọn game khi đã có hai Dojo; trước mắt thêm mục thứ hai trong menu hoặc thẻ ở trang chủ.
- Thêm Katakana vào JSON-LD `Course`, sitemap tự cập nhật.
- Font: bản cắt gọn của Zen Maru Gothic đã chứa U+30A0 đến U+30FF, không cần làm lại.
- Giữ `npm run size` dưới 100 KB; engine tải khi cần, nên trang bài Katakana có dung lượng gần bài Hiragana.

## Kiểm tra và nghiệm thu

- `tools/check-quiz.mjs` đọc cả hai khóa: romaji từng chữ và từng từ khớp bảng, từ ví dụ chỉ dùng chữ đã học (có bảng riêng cho Katakana), mô phỏng 300 lượt mỗi hiệp Dojo và 200 lượt mini quiz mỗi bài.
- Câu hỏi trường âm và âm ngắt của Katakana: đáp án luôn có trong lựa chọn, lựa chọn không trùng, romaji đáp án khớp cách viết.
- Lighthouse chạy trên một bài Katakana và Katakana Dojo, đạt từ 95 trở lên mỗi mục.
- Người biết tiếng Nhật duyệt chữ, romaji và nghĩa trước khi đặt `status: published` ([`../content/content-guidelines.md`](../content/content-guidelines.md)).

## Trình tự làm việc

1. (Xong) Chốt D-012 đến D-014.
2. Tách dữ liệu khóa học và layout dùng chung (không đổi nội dung hiển thị; `npm test` và `npm run size` phải giữ nguyên kết quả).
3. Tách `kana-data.js`, thêm Katakana vào engine, thêm kiểm tra.
4. Viết bài 1 đến 3 Katakana để duyệt phong cách và quy tắc, như cách làm của Hiragana.
5. Viết các bài còn lại; thêm dữ liệu nét.
6. Dojo chung (màn hình chọn nội dung, `dojo-pool.json`).
7. Mở khóa trên lưới khóa học, cập nhật sitemap và tài liệu, đo Lighthouse.

## Rủi ro

| Rủi ro | Cách giảm |
|---|---|
| Engine gắn cứng Hiragana, sửa dễ làm hỏng game hiện có | Làm bước 2 và 3 trước, giữ `npm test` làm lưới an toàn; kiểm tra Hiragana không đổi |
| Quy tắc ー và âm mở rộng sinh đáp án sai | Mô phỏng nhiều lượt; viết bảng ví dụ kiểm tra bằng tay |
| Từ mượn chọn không phù hợp hoặc sai nghĩa | Chỉ dùng từ quen thuộc, có người duyệt |
| Người học nhầm シ/ツ và ソ/ン | Có bài riêng về chữ dễ nhầm và câu hỏi nhắm vào các cặp này |
| Dung lượng tăng do thêm dữ liệu | Chia dữ liệu theo bộ chữ, tải khi cần |

## Quyết định đã chốt (2026-11-06)

| Mã | Nội dung |
|---|---|
| D-012 | Không khóa cứng Hiragana; có gợi ý "nên học Hiragana trước" ở đầu khóa Katakana |
| D-013 | Từ mượn theo chủ đề đồ ăn uống, địa danh, đồ vật hằng ngày; tránh tên thương hiệu |
| D-014 | Dojo là tính năng chung, chọn theo bộ chữ, theo bài hoặc theo chủ đề, có thể trộn |
