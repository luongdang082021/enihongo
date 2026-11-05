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

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    pathPrefix: PREFIX,
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html']
  };
}
