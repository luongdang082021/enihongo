import fs from 'node:fs';

const courses = JSON.parse(fs.readFileSync(new URL('./courses.json', import.meta.url), 'utf8'));

// Các khóa chưa mở: dùng để sinh trang "Sắp ra mắt" cho từng URL.
export default courses.filter((c) => c.status === 'soon');
