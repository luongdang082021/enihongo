"""Mini quiz trong bài Katakana (vi, en) chạy được và không lỗi JS. Cần: npm run build:local; python3 -m http.server 8123 --directory _site."""
import re
from playwright.sync_api import sync_playwright
BASE='http://localhost:8123'
VN=re.compile(r'[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]',re.I)
bad=[]
with sync_playwright() as pw:
    br=pw.chromium.launch()
    for tz,pre,slug,lessons in [('Asia/Ho_Chi_Minh','','/khoa-hoc/katakana/',['bai-03-hang-ka-sa','bai-10-am-ghep-truong-am','bai-11-am-ngat-mo-rong','bai-12-on-tap']),('America/New_York','/en','/en/courses/katakana/',['lesson-03-ka-sa-rows','lesson-10-combined-and-long','lesson-11-small-tsu-extended','lesson-12-review'])]:
        ctx=br.new_context(timezone_id=tz,locale='en-US'); pg=ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        for l in lessons:
            pg.goto(BASE+slug+l+'/')
            if l.endswith('ka-sa') or 'ka-sa' in l:
                pg.locator('[data-char="シ"]').click()
                pg.locator('[data-stroke="シ"]').click() if pg.locator('[data-stroke="シ"]').count() else None
            pg.locator('[data-act=start-quiz]').click()
            n=0
            while n<40:
                n+=1
                pg.wait_for_selector('.qcard, .res')
                if pg.locator('.res').count(): break
                q=pg.locator('.qcard')
                # answer by trying: choice -> click first option; type -> fill 'a'; match -> skip by clicking pairs
                if pg.locator('.opt').count():
                    pg.locator('.opt').first.click()
                elif pg.locator('.typeform input').count():
                    pg.locator('.typeform input').fill('a'); pg.locator('.typeform button[type=submit]').click()
                else:
                    # match: click each left/right in order
                    for _ in range(12):
                        cols=pg.locator('.match .col')
                        if cols.count()<2: break
                        left=cols.nth(0).locator('.mbtn:not(.done)'); 
                        if left.count()==0: break
                        left.first.click()
                        r=cols.nth(1).locator('.mbtn:not(.done)')
                        for i in range(r.count()):
                            r.nth(i).click()
                            if left.count()==0 or not pg.locator('.mbtn.sel').count(): break
                pg.keyboard.press('Enter')
                pg.wait_for_timeout(30)
            txt=pg.inner_text('main')
            real=[e for e in errs if 'ERR_TUNNEL' not in e and 'Failed to load resource' not in e]
            ok=pg.locator('.res').count()>0 and not real and not (pre=='/en' and VN.search(txt.replace('Tiếng Việt','')))
            print(('ok   ' if ok else 'FAIL ')+tz[:4]+' '+l, real[:2])
            if not ok: bad.append(l)
    br.close()

import sys; sys.exit(1 if bad else 0)
