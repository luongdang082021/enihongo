# Giáo trình và khung chương trình

Tóm tắt: giáo trình của enihongo do dự án tự biên soạn, bám khung năng lực công khai (JF Standard, CEFR) và mô tả bài thi chính thức (JLPT, JFT-Basic), không dùng lại nội dung sách in.

Trạng thái: nháp kế hoạch. D-015 đến D-017 hoãn; ưu tiên thấp hơn hai ngôn ngữ ([`../planning/i18n-plan.md`](../planning/i18n-plan.md)) và Katakana. Cập nhật: 2026-11-06.

## Nguyên tắc

1. **Tự biên soạn** (D-004): câu ví dụ, hội thoại, bài tập, thứ tự giảng và mẹo nhớ đều do dự án viết. Không sao chép hay phỏng theo sát giáo trình in như Minna no Nihongo, Genki, Marugoto, Tobira, Nihongo Sou Matome. Có thể tham khảo để so sánh phạm vi, nhưng không dùng lại câu, hội thoại, thứ tự bài hay cách đặt tên bài.
2. **Bám khung công khai**, không bám sách: dùng mục tiêu "làm được gì" (can-do) của JF Standard và CEFR để chọn nội dung và chủ đề. Khung này công khai và dùng để thiết kế chương trình.
3. **Dành cho người Việt**: giải thích bằng tiếng Việt, tận dụng từ Hán Việt khi học kanji và từ vựng Hán ngữ, nêu rõ chỗ người Việt hay sai (âm や/ら, trường âm, âm ngắt, trợ từ).
4. **Học ngắn, nhớ lâu**: mỗi bài khoảng 10 phút, có ôn ngắt quãng và kiểm tra cuối bài; mọi bài có thể luyện lại trong Dojo.
5. **Dữ liệu từ nguồn bên ngoài** chỉ dùng khi giấy phép cho phép và đã ghi nguồn (xem mục "Nguồn dữ liệu").

## Bản đồ khóa học và trình độ

Bảng đối chiếu để định hướng nội dung, không phải cam kết sẽ đưa người học đến một chứng chỉ.

| Khóa | Trình độ hướng tới | Liên hệ bài thi | Trạng thái |
|---|---|---|---|
| Nhập môn Hiragana | Điều kiện đầu vào cho A1 | Cần thiết cho mọi bài thi | Đã mở (13 bài) |
| Katakana | Điều kiện đầu vào cho A1 | Cần thiết cho mọi bài thi | Có kế hoạch ([`../planning/katakana-plan.md`](../planning/katakana-plan.md)) |
| Tiếng Nhật sơ cấp 1 | CEFR A1 | JLPT N5, JFT-Basic mức A1 | Chưa bắt đầu |
| Tiếng Nhật sơ cấp 2 | CEFR A2 | JLPT N4, JFT-Basic mức A2 | Chưa bắt đầu |
| Kanji cơ bản | Hỗ trợ A1 đến A2 | JLPT N5, N4 | Chưa bắt đầu |
| Giao tiếp và luyện JFT-Basic | A1 đến A2 | JFT-Basic | Chưa bắt đầu |
| Luyện nghe | A1 đến A2 | Mọi bài thi | Chưa bắt đầu |

"Tiếng Nhật sơ cấp 1 và 2" thay cho tên "Ngữ pháp và từ vựng sơ cấp (N5)" trong lưới khóa học hiện tại, vì phạm vi vượt qua N5. Việc đổi tên cần duyệt (D-015).

### Thông tin về bài thi (đã đối chiếu nguồn chính thức)

- **JFT-Basic** (Japan Foundation): đo tiếng Nhật cần cho sinh hoạt và làm việc ở Nhật, thi trên máy, khoảng 50 câu trong 60 phút, bốn phần: Chữ và từ vựng, Hội thoại và diễn đạt, Nghe hiểu, Đọc hiểu. Thang điểm 10 đến 250. Từ tháng 8 năm 2026, bài thi đánh giá cả A1 (145 đến 174), A2.1 (175 đến 199) và A2.2 tức A2 (200 đến 250); điểm dưới 145 không có mức. Câu hỏi hiển thị tiếng Anh, có bản dịch hiện khi bấm, trong đó có tiếng Việt. ([JFT-Basic](https://www.jpf.go.jp/jft-basic/e/about/index.html), [thông báo thay đổi](https://www.jpf.go.jp/jft-basic/e/notice/))
- **JLPT**: trang chính thức nêu mức CEFR tham khảo: N5 đạt từ 80 điểm tổng được ghi là A1, N4 đạt từ 90 điểm tổng được ghi là A2; chỉ hiện cho người đã đỗ, và chỉ là thông tin tham khảo. JLPT không đo nói và viết. ([JLPT: CEFR](https://www.jlpt.jp/e/about/cefr_reference.html))
- **JF Standard** là khung của Quỹ Nhật Bản, dựa trên CEFR, mô tả năng lực bằng các câu can-do. ([JF Standard](https://www.jfstandard.jpf.go.jp/summaryen/ja/render.do))

Cần đối chiếu lại các con số trên trước mỗi lần cập nhật trang JFT-Basic hoặc khóa luyện đề, vì thông tin bài thi thay đổi theo năm.

## Cấu trúc một khóa

Mỗi khóa gồm các **bài** nhỏ; mỗi bài khai báo trong front matter những gì dạy, để Dojo và công cụ kiểm tra dùng chung.

```yaml
course: hiragana
writing: hiragana         # hoặc katakana
cando: "Đọc và gõ được năm nguyên âm"   # mục tiêu làm được gì, một câu
chars: [...]              # chữ mới
words: [...]              # từ ví dụ, chỉ dùng chữ đã học
tags: [nguyen-am]         # nhãn chủ đề để Dojo trộn theo chủ đề
```

Các khóa sau (sơ cấp, kanji) mở rộng thêm: `grammar` (mẫu câu), `kanji` (chữ, âm Hán Việt, âm On/Kun), `dialogue` (hội thoại tự viết), `tasks` (bài tập).

## Khung đề xuất cho khóa sơ cấp

Chưa viết nội dung; đây là khung để duyệt trước khi bắt đầu.

- **Đơn vị bài**: 1 mục tiêu can-do, 8 đến 12 từ mới, 1 mẫu câu, 1 đoạn hội thoại ngắn tự viết, vài bài tập, mini quiz.
- **Chủ đề cho A1** (theo JF Standard, chỉ lấy tên chủ đề): giới thiệu bản thân; gia đình; số đếm, giờ, ngày tháng; mua sắm và giá tiền; đồ ăn thức uống; nhà và nơi ở; đi lại và chỉ đường; trường học và công việc; sở thích và thói quen; thời tiết và mùa.
- **Chủ đề cho A2**: kể việc đã làm; kế hoạch và lời mời; nhờ vả, xin phép; miêu tả người và vật; sức khỏe; nơi làm việc và quy định; thư từ và tin nhắn ngắn.
- **Số bài ước tính**: sơ cấp 1 khoảng 24 bài, sơ cấp 2 khoảng 24 bài. Chốt sau khi có mẫu 3 bài đầu và duyệt.
- **Chữ viết**: đầu khóa chỉ dùng kana kèm romaji; kanji xuất hiện dần theo khóa Kanji, luôn kèm cách đọc ở lần đầu.

## Khóa Kanji (hướng đi)

- Danh sách chữ lấy từ nguồn công khai và rõ giấy phép (ví dụ danh sách Kanji giáo dục lớp 1 của Bộ Giáo dục Nhật), không dùng danh sách chép từ sách luyện thi vì JLPT không còn công bố danh sách chính thức.
- Mỗi chữ: nghĩa tiếng Việt, **âm Hán Việt** làm cầu nối trí nhớ, âm On và Kun thường gặp, vài từ ví dụ, thứ tự nét (KanjiVG).
- Cần quyết định về nguồn dữ liệu nghĩa và âm đọc trước khi bắt đầu (xem bên dưới).

## Khóa Giao tiếp và luyện JFT-Basic (hướng đi)

- Bám bốn phần của bài thi, mỗi phần có bài luyện tự biên soạn; không sao chép đề thật.
- Hiện chưa có giải pháp cho phần nghe ngoài giọng đọc của thiết bị (chất lượng khác nhau). Cần quyết định về âm thanh trước khi mở khóa này.
- Mọi thông tin về thể thức thi phải ghi nguồn và ngày kiểm tra.

## Nguồn dữ liệu

| Loại | Nguồn ứng viên | Giấy phép | Tình trạng |
|---|---|---|---|
| Thứ tự nét kana, kanji | KanjiVG | CC BY-SA 3.0 | Đang dùng cho kana (D-011) |
| Phông chữ kana | Zen Maru Gothic | SIL OFL | Đang dùng |
| Nghĩa và âm đọc kanji, từ điển | EDRDG (JMdict, KANJIDIC) | CC BY-SA, cần đọc kỹ điều kiện | Chưa dùng, cần kiểm tra giấy phép trước |
| Câu ví dụ | Tự viết | Thuộc dự án | Mặc định |
| Câu ví dụ mở | Tatoeba | CC BY 2.0 FR phần lớn | Chưa dùng; nếu dùng phải lọc, ghi tác giả và tự dịch tiếng Việt |
| Âm thanh | Giọng đọc của thiết bị | Không có file | Đang dùng cho phát âm |

Quy tắc: không đưa dữ liệu mới vào repo khi chưa ghi vào bảng này và chưa có dòng quyết định trong [`../planning/decisions.md`](../planning/decisions.md). Dữ liệu CC BY-SA khi rút gọn hoặc biến đổi vẫn giữ giấy phép đó và phải ghi nguồn ở trang giới thiệu.

## Quy trình viết và duyệt

1. Viết theo [`lesson-template.md`](lesson-template.md) và [`content-guidelines.md`](content-guidelines.md).
2. `npm test` kiểm tra romaji từng chữ và từ, từ ví dụ chỉ dùng chữ đã học, mini quiz sinh được.
3. Người biết tiếng Nhật duyệt nội dung trước khi đặt `status: published`.
4. Sửa lỗi sau xuất bản ghi rõ chữ hoặc từ đã sửa trong commit.
5. Mỗi quý rà lại thông tin bài thi và khung năng lực (ngày kiểm tra ghi ở mục "Thông tin về bài thi").

## Quyết định cần chốt

| Mã | Câu hỏi | Đề xuất |
|---|---|---|
| D-015 | Giáo trình tự biên soạn bám JF Standard và CEFR, không dùng nội dung sách in; đổi tên khóa N5 thành "Tiếng Nhật sơ cấp 1 và 2" | Chốt như mô tả ở trên |
| D-016 | Nguồn dữ liệu nghĩa và âm đọc kanji (JMdict, KANJIDIC hay tự biên soạn) | Tự biên soạn bộ nhỏ cho khóa đầu; cân nhắc EDRDG sau khi đọc kỹ giấy phép |
| D-017 | Âm thanh cho khóa nghe và JFT: giọng thiết bị, file nhỏ tự thu, hay dịch vụ ngoài | Giọng thiết bị cho bài ngắn; bàn lại khi làm khóa nghe |
