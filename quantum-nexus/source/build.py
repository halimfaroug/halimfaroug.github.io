import json,sys,os
sys.path.insert(0,'/home/claude/qn')
from matter import LESSONS as M
from life import LESSONS as LF
from energy import LESSONS as EN
from earth import LESSONS as EA
for l in M: l['s']='matter'
for l in LF: l['s']='life'
for l in EN: l['s']='energy'
for l in EA: l['s']='earth'
LESSONS=M+LF+EN+EA
E=json.load(open('/home/claude/qn/elements.json'))
for l in LESSONS:
    for p,o,x in l['q']:
        assert len(o)==4 and len(set(o))==4,(l['id'],p)
ids=[l['id'] for l in LESSONS]; assert len(ids)==len(set(ids))
out='/home/claude/halimfaroug.github.io/quantum-nexus'
t=open('/home/claude/qn/app.template.html').read()
t=t.replace('__ELEMENTS__',json.dumps(E,ensure_ascii=False,separators=(',',':'))).replace('__LESSONS__',json.dumps(LESSONS,ensure_ascii=False,separators=(',',':')))
open(f'{out}/index.html','w').write(t)
json.dump({"name":"منصة العلوم التفاعلية · Quantum Nexus","short_name":"Quantum Nexus","lang":"ar","dir":"rtl","start_url":"./","scope":"./","display":"standalone","background_color":"#F3F1FF","theme_color":"#2B1B6B",
 "description":"أساسيات العلوم للمرحلة المتوسطة: الجدول الدوري التفاعلي ودروس وأسئلة مع التفسير.",
 "icons":[{"src":"icon.svg","sizes":"any","type":"image/svg+xml","purpose":"any"}]},open(f'{out}/manifest.webmanifest','w'),ensure_ascii=False,indent=1)
open(f'{out}/icon.svg','w').write("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='110' fill='#2B1B6B'/><g fill='none' stroke='#67E8F9' stroke-width='22'><ellipse cx='256' cy='256' rx='180' ry='72'/><ellipse cx='256' cy='256' rx='180' ry='72' transform='rotate(60 256 256)'/><ellipse cx='256' cy='256' rx='180' ry='72' transform='rotate(120 256 256)'/></g><circle cx='256' cy='256' r='38' fill='#FFD566'/></svg>")
VER=open('/home/claude/qn/version').read().strip() if os.path.exists('/home/claude/qn/version') else '1'
open(f'{out}/sw.js','w').write(f"""const CACHE='quantum-nexus-v{VER}';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('quantum-nexus-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))))}});
""")
print('built', len(t), sum(len(l['q']) for l in LESSONS))
