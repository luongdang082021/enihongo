import i18n from './i18n.js';
import routes from './routes.json' with { type: 'json' };

export default {
  t: (d) => i18n[d.lang || 'vi'],
  // Cặp URL theo ngôn ngữ của trang (dùng cho hreflang và nút chuyển ngôn ngữ).
  alt: (d) => {
    if (d.route && routes[d.route]) return routes[d.route];
    if (d.course && typeof d.course === 'object') {
      return { vi: `/khoa-hoc/${d.course.id}/`, en: `/en/courses/${d.course.id}/` };
    }
    return null;
  }
};
