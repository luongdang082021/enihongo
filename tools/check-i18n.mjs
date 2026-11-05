// Kiểm tra song ngữ: danh mục chuỗi JS khớp khóa, nghĩa từ tiếng Anh đủ, câu hỏi tiếng Anh không lẫn tiếng Việt.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = new URL('..', import.meta.url).pathname;
let problems = 0;
const bad = (m) => { problems++; console.error('LỖI: ' + m); };

const vi = (await import(root + 'src/js/i18n/vi.js')).default;
const en = (await import(root + 'src/js/i18n/en.js')).default;
for (const k of Object.keys(vi)) if (!(k in en)) bad(`en.js thiếu khóa ${k}`);
for (const k of Object.keys(en)) if (!(k in vi)) bad(`vi.js thiếu khóa ${k}`);
const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join(',');
for (const k of Object.keys(vi)) if (k in en && ph(vi[k]) !== ph(en[k])) bad(`tham số khác nhau ở ${k}`);

// tiếng Anh không được còn dấu tiếng Việt (trừ chữ Nhật)
const VN = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
for (const [k, v] of Object.entries(en)) if (VN.test(v)) bad(`en.js còn tiếng Việt ở ${k}: ${v}`);

// nghĩa từ trong bài học
const dir = root + 'src/khoa-hoc/hiragana/';
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const d = matter(fs.readFileSync(dir + f, 'utf8')).data;
  for (const w of d.words || []) {
    if (!w.en) bad(`${f}: từ ${w.kana} thiếu en`);
    else if (VN.test(w.en)) bad(`${f}: ${w.kana} en chứa dấu tiếng Việt`);
  }
}

// dữ liệu khóa và bài
for (const f of ['courses', 'lessons']) {
  for (const x of JSON.parse(fs.readFileSync(`${root}src/_data/${f}.json`, 'utf8'))) {
    if (!x.en) bad(`${f}.json: ${x.id} thiếu en`);
    else for (const [k, v] of Object.entries(x.en)) if (VN.test(v)) bad(`${f}.json: ${x.id}.en.${k} có dấu tiếng Việt`);
  }
}
const pages = (await import(root + 'src/_data/i18n.js')).default;
const OWN_LANG = new Set(['switchTo', 'switchLabel']); // nhãn nút chuyển ngôn ngữ viết bằng ngôn ngữ đích
const walk = (a, b, p) => {
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!(k in a) || !(k in b)) bad(`i18n.js lệch khóa ${p}${k}`);
    else if (typeof a[k] === 'object') walk(a[k], b[k], p + k + '.');
    else if (typeof b[k] === 'string' && !OWN_LANG.has(k) && VN.test(b[k])) bad(`i18n.js en có dấu tiếng Việt ở ${p}${k}`);
  }
};
walk(pages.vi, pages.en, '');

// mô phỏng câu hỏi ở chế độ tiếng Anh
globalThis.ENIHONGO_LANG = 'en';
const core = await import(root + 'src/js/quiz-core.js');
const scan = (q, where) => {
  for (const f of ['prompt', 'explain', 'sum']) {
    const s = q[f] || '';
    if (VN.test(s)) bad(`${where}: ${f} có tiếng Việt: ${s.slice(0, 80)}`);
    if (/\{\w+\}/.test(s) || s === 'undefined' || /undefined/.test(s)) bad(`${where}: ${f} có tham số chưa thay: ${s.slice(0, 80)}`);
  }
  if (q.stage && q.stage.hint && VN.test(q.stage.hint)) bad(`${where}: hint có tiếng Việt`);
};
for (let r = 0; r < 5; r++) for (let i = 0; i < 40; i++) for (const q of core.build(r)) scan(q, `hiệp ${r + 1}`);
if (VN.test(JSON.stringify(core.ROUNDS.map((r) => [r.name, r.sub])))) bad('tên hiệp có tiếng Việt');

console.log(problems ? `${problems} vấn đề i18n.` : `Đạt: ${Object.keys(vi).length} khóa chuỗi JS, nghĩa từ tiếng Anh đầy đủ, câu hỏi tiếng Anh sạch tiếng Việt.`);
process.exit(problems ? 1 : 0);
