import fs from 'node:fs';
import crypto from 'node:crypto';

// GitHub Pages phục vụ site ở /enihongo/. Khi chạy local dùng PATH_PREFIX=/ (xem package.json).
const PREFIX = process.env.PATH_PREFIX || '/enihongo/';

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'src/css': 'css',
    'src/js': 'js',
    'src/fonts': 'fonts',
    'src/icons': 'icons',
    'src/data': 'data'
  });

  // Gắn ?v=<hash nội dung> vào CSS/JS để trình duyệt tải lại khi file đổi.
  eleventyConfig.addFilter('asset', (p) => {
    let v = '';
    try {
      v = '?v=' + crypto.createHash('md5').update(fs.readFileSync('src' + p)).digest('hex').slice(0, 8);
    } catch (e) {
      // file không tồn tại: bỏ qua hash
    }
    return PREFIX + p.replace(/^\//, '') + v;
  });

  // Kho nội dung cho Dojo: sinh từ front matter của các bài, nên thêm bài mới là Dojo tự có nội dung.
  eleventyConfig.addFilter('dojoPool', (items, tags, courses) => {
    const lessons = items
      .map((i) => i.data)
      .filter((d) => (d.chars && d.chars.length) || (d.words && d.words.length))
      .sort((a, b) => a.n - b.n)
      .map((d) => ({
        id: d.lessonId,
        course: d.course,
        n: d.n,
        title: d.title,
        writing: d.writing,
        tags: d.tags || [],
        chars: (d.chars || []).map((c) => ({ k: c.k, r: c.r })),
        words: (d.words || []).filter((w) => w.quiz !== false).map((w) => ({ kana: w.kana, romaji: w.romaji, vi: w.vi }))
      }));
    const used = new Set(lessons.map((l) => l.course));
    const cs = courses.filter((c) => used.has(c.id)).map((c) => ({ id: c.id, name: c.name }));
    return JSON.stringify({ tags, courses: cs, lessons });
  });

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    pathPrefix: PREFIX,
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html']
  };
}
