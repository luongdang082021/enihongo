import i18n from './i18n.js';
import routes from './routes.json' with { type: 'json' };

export default {
  t: (d) => i18n[d.lang || 'vi'],
  // Cặp URL theo ngôn ngữ của trang (dùng cho hreflang và nút chuyển ngôn ngữ).
  alt: (d) => {
    if (d.route && routes[d.route]) return routes[d.route];
    if (d.lessonId && typeof d.course === 'string' && d.lessons && d.lessons[d.course]) {
      const l = d.lessons[d.course][d.n - 1];
      const c = d.courses.find((x) => x.id === d.course);
      if (l && c && c.enLessons) {
        return { vi: `/khoa-hoc/${d.course}/${l.slug}/`, en: `/en/courses/${d.course}/${(l.en && l.en.slug) || l.slug}/` };
      }
      return null;
    }
    if (d.course && typeof d.course === 'object') {
      return { vi: `/khoa-hoc/${d.course.id}/`, en: `/en/courses/${d.course.id}/` };
    }
    return null;
  }
};
