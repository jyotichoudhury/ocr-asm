const staticAssets = [
    './',
    './stylek.css',
    './main.js',
    './manifest.json'
]

self.addEventListener('install', async event=>{
    console.log('SW installed');

    const cache = await caches.open('ocr-static');

    cache.addAll(staticAssets);
});

/*self.addEventListener('fetch', event=> {
    console.log('fetch');
    const req = event.request;
    event.respondWith(cacheFirst(req));

});

async function cacheFirst(req){
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}*/


