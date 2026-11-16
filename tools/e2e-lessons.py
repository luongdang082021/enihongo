"""Mini quiz trong bài Hiragana và Katakana (vi, en) chạy được và không lỗi JS. Cần: npm run build:local; python3 -m http.server 8123 --directory _site."""
import re
from playwright.sync_api import sync_playwright
BASE='http://localhost:8123'
VN=re.compile(r'[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]',re.I)
bad=[]
with sync_playwright() as pw:
    br=pw.chromium.launch()
    for tz,pre,slug,lessons in [('Asia/Ho_Chi_Minh','','/khoa-hoc/hiragana/',['bai-02-hang-a','bai-08-am-duc','bai-10-truong-am','bai-12-nhung-tu-dau-tien','bai-13-on-tap']),('America/New_York','/en','/en/courses/hiragana/',['lesson-02-a-row','lesson-08-voiced-sounds','lesson-10-long-vowels','lesson-12-first-words','lesson-13-review']),('Asia/Ho_Chi_Minh','','/khoa-hoc/katakana/',['bai-03-hang-ka-sa','bai-10-am-ghep-truong-am','bai-11-am-ngat-mo-rong','bai-12-on-tap']),('America/New_York','/en','/en/courses/katakana/',['lesson-03-ka-sa-rows','lesson-10-combined-and-long','lesson-11-small-tsu-extended','lesson-12-review']),('Asia/Ho_Chi_Minh','','/khoa-hoc/so-cap-1/',['bai-01-chao-hoi','bai-03-lop-hoc','bai-10-nha-cua','bai-18-on-tap']),('America/New_York','/en','/en/courses/so-cap-1/',['lesson-01-greetings','lesson-03-classroom','lesson-10-house','lesson-18-review'])]:
        ctx=br.new_context(timezone_id=tz,locale='en-US'); pg=ctx.new_page(); pg.set_default_timeout(4000); ctx.route('**/*cloudflare*',lambda r:r.abort())
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
                pg.wait_for_timeout(20); pg.wait_for_selector('.qcard:visible, .res:not([hidden])')
                if pg.locator('.res:not([hidden])').count(): break
                q=pg.locator('.qcard')
                # answer by trying: choice -> click first option; type -> fill 'a'; match -> skip by clicking pairs
                if pg.locator('.opt').count():
                    pg.locator('.opt').first.click()
                elif pg.locator('.tile').count():
                    pg.locator('[data-skip]').click()
                elif pg.locator('.typeform input').count():
                    pg.locator('.typeform input').fill('a'); pg.locator('.typeform button[type=submit]').click()
                else:
                    # match: ghép bằng JS (nhanh), mỗi bên trái thử lần lượt các bên phải
                    pg.evaluate('''()=>{const c=document.querySelectorAll('.match .col');if(c.length<2)return;
                      for(const L of c[0].querySelectorAll('.mbtn')){if(L.classList.contains('done'))continue;
                        for(const R of c[1].querySelectorAll('.mbtn')){if(R.classList.contains('done'))continue;L.click();R.click();if(L.classList.contains('done'))break}}}''')
                pg.keyboard.press('Enter')
                pg.wait_for_timeout(30)
            txt=pg.inner_text('main')
            real=[e for e in errs if 'ERR_TUNNEL' not in e and 'Failed to load resource' not in e]
            ok=pg.locator('.res:not([hidden])').count()>0 and not real and not (pre=='/en' and VN.search(txt.replace('Tiếng Việt','')))
            print(('ok   ' if ok else 'FAIL ')+tz[:4]+' '+l, real[:2])
            if not ok: bad.append(l)
    br.close()

import sys; sys.exit(1 if bad else 0)
