"""Kiểm tra chọn ngôn ngữ theo vị trí bằng Playwright (Python). Cần: npm run build:local, rồi
python3 -m http.server 8123 --directory _site, rồi python3 tools/e2e-i18n.py. Không chạy trong npm test."""
import re, sys
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8123'
VN_RE = re.compile(r'[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]', re.I)
fails = []

def check(name, cond, extra=''):
    print(('ok   ' if cond else 'FAIL ') + name + (' ' + str(extra) if extra and not cond else ''))
    if not cond: fails.append(name)

def path(p): return re.sub(r'^https?://[^/]+', '', p.url).split('?')[0]

with sync_playwright() as pw:
    br = pw.chromium.launch()
    def page(tz, locale='en-US', ua=None, storage=None):
        ctx = br.new_context(timezone_id=tz, locale=locale, user_agent=ua)
        pg = ctx.new_page()
        navs = []
        pg.on('framenavigated', lambda f: navs.append(f.url) if f == pg.main_frame else None)
        if storage:
            pg.goto(BASE + '/404.html')
            pg.evaluate("v=>localStorage.setItem('enihongo:lang',v)", storage)
        pg._navs = navs
        return pg

    pg = page('Asia/Ho_Chi_Minh')
    pg.goto(BASE + '/'); check('VN, trang chủ giữ tiếng Việt', path(pg) == '/' and pg.evaluate('document.documentElement.lang') == 'vi')

    pg = page('Asia/Saigon', 'en-US')
    pg.goto(BASE + '/'); check('Asia/Saigon cũng là Việt Nam', path(pg) == '/')

    pg = page('America/New_York', 'vi-VN')
    pg.goto(BASE + '/'); check('múi giờ Mỹ + trình duyệt vi: sang tiếng Anh', path(pg) == '/en/', path(pg))
    check('không vòng chuyển hướng', len([u for u in pg._navs if u.endswith('/') or u.endswith('/en/')]) <= 3, pg._navs)

    pg = page('Asia/Ho_Chi_Minh')
    pg.goto(BASE + '/en/'); check('VN mở /en/: sang tiếng Việt', path(pg) == '/', path(pg))

    pg = page('America/New_York')
    pg.goto(BASE + '/khoa-hoc/')
    check('trang con không bị chuyển hướng', path(pg) == '/khoa-hoc/', path(pg))
    check('có banner gợi ý', pg.locator('.lang-banner').count() == 1)
    pg.locator('.lang-banner a').click(); pg.wait_for_load_state()
    check('bấm banner sang /en/courses/', path(pg) == '/en/courses/', path(pg))
    check('đã lưu lựa chọn en', pg.evaluate("localStorage.getItem('enihongo:lang')") == 'en')

    pg = page('America/New_York')
    pg.goto(BASE + '/khoa-hoc/')
    pg.locator('.lang-banner button').click()
    check('đóng banner', pg.locator('.lang-banner').count() == 0)

    pg = page('America/New_York', storage='vi')
    pg.goto(BASE + '/'); check('lựa chọn đã lưu vi thắng vị trí Mỹ', path(pg) == '/', path(pg))

    pg = page('Asia/Ho_Chi_Minh', storage='en')
    pg.goto(BASE + '/'); check('lựa chọn đã lưu en thắng vị trí VN', path(pg) == '/en/', path(pg))

    pg = page('Asia/Ho_Chi_Minh')
    pg.goto(BASE + '/?lang=en'); check('?lang=en ghi đè vị trí', path(pg) == '/en/', path(pg))

    pg = page('America/New_York', ua='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
    pg.goto(BASE + '/'); check('bot không bị chuyển hướng', path(pg) == '/', path(pg))
    check('bot không có banner', pg.locator('.lang-banner').count() == 0)

    pg = page('Asia/Ho_Chi_Minh')
    pg.goto(BASE + '/en/about/')
    pg.locator('a[data-lang-switch]').first.click(); pg.wait_for_load_state()
    check('nút chuyển ngôn ngữ từ /en/about/ sang /gioi-thieu/', path(pg) == '/gioi-thieu/', path(pg))

    # Dojo tiếng Anh
    pg = page('America/New_York')
    pg.goto(BASE + '/en/practice/')
    pg.locator('#ladder .rung').first.click()
    pg.wait_for_selector('.qcard')
    text = pg.inner_text('main')
    check('Dojo tiếng Anh không lẫn tiếng Việt', not VN_RE.search(text), VN_RE.findall(text)[:5])
    pg.goto(BASE + '/en/practice/')
    pg.locator('[data-tab=custom]').click(); pg.wait_for_selector('.picklist input')
    names = pg.inner_text('#picklist')
    check('danh sách khóa tiếng Anh', 'Hiragana Basics' in names and 'letters' in names, names)

    for p in ['/en/', '/en/courses/', '/en/courses/hiragana/', '/en/courses/katakana/', '/en/about/', '/en/practice/']:
        pg = page('America/New_York'); pg.goto(BASE + p)
        t = pg.inner_text('body')
        check(f'{p} không lẫn tiếng Việt', not VN_RE.search(t.replace('Tiếng Việt', '')), VN_RE.findall(t.replace('Tiếng Việt', ''))[:5])
    br.close()

print('\n%d lỗi' % len(fails)); sys.exit(1 if fails else 0)
