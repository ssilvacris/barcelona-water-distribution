// Define a versão do cache
const CACHE_NAME = 'barcelona-water-v1';
const urlsToCache = [
  '/barcelona-water-distribution/',
  '/barcelona-water-distribution/index.html',
];

// Instala o service worker e faz cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto:', CACHE_NAME);
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Alguns arquivos não puderam ser cacheados:', err);
        // Continua mesmo se alguns arquivos falharem
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Ativa o service worker e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

// Estratégia: tenta rede primeiro, se falhar usa cache
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a resposta for válida, copia e armazena em cache
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(error => {
        console.log('Erro na requisição:', event.request.url, error);
        
        // Se a rede falhar, tenta pegar do cache
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          
          // Retorna página offline customizada se houver
          return new Response('Offline - Conteúdo não disponível no momento', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

console.log('Service Worker carregado com sucesso!');
