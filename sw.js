// صفحة «رحلات تعليمية» الرئيسية فقط: تعمل دون إنترنت.
// لا تتدخّل في طلبات التطبيقات (لكل تطبيق ملفه الخاص)، ولا تحذف إلا ذاكرتها هي (hub-).
const CACHE='hub-v1',PREFIX='hub-';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const ROOT=new URL('./',self.registration.scope).pathname;
const OWN=new Set(FILES.map(f=>new URL(f,self.registration.scope).pathname));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin||!OWN.has(u.pathname))return; // كل ما عدا ملفات الصفحة الرئيسية يمرّ كما هو
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match(ROOT))));
});
