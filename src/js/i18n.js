/* Chuỗi giao diện cho JavaScript. Ngôn ngữ lấy từ <html lang>; chỉ tải danh mục của ngôn ngữ đó. */
const forced = typeof globalThis !== 'undefined' && globalThis.ENIHONGO_LANG;
export const lang = forced || (typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'vi');
const cat = (lang === 'en' ? await import('./i18n/en.js') : await import('./i18n/vi.js')).default;

export const has = (k) => Object.prototype.hasOwnProperty.call(cat, k);
export function t(k, p) {
  const s = cat[k];
  if (s === undefined) return k;
  return p ? s.replace(/\{(\w+)\}/g, (m, n) => (n in p ? p[n] : m)) : s;
}
/* Nghĩa của từ theo ngôn ngữ trang; thiếu bản dịch thì dùng tiếng Việt. */
export const gloss = (w) => (lang === 'en' && w.en) || w.vi;
export const num = (n) => n.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN');
