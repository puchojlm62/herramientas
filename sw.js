/* Service Worker VispApp v1.5.2 
   Optimizado para funcionamiento Offline y GeneraciÃ³n de Informes
   Optimizado con Rutas Absolutas
*/

const CACHE_NAME = 'visp-app-v1.5.3-cache';

// Lista completa de recursos con rutas absolutas (empiezan con /)
const assetsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // Iconos de la PWA (Nuevos)
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/icon-180.png',
  
  // Estilos base
  '/estilos/colores.css',
  '/estilos/general.css',
  '/estilos/styles_indice.css',
  
  // Scripts base
  '/scripts/script.js',
  '/scripts/footer.js',
  
  // LibrerÃ­as externas
  '/lib/jszip.min.js',
  '/lib/docxtemplater.min.js',
  '/lib/FileSaver.min.js',
  
  // ImÃ¡genes e Iconos principales
  '/img/Logo_Visp.webp',
  '/img/logoISP65.webp',
  '/img/favicon.webp',
  '/img/luxometro.webp',
  '/img/instagram.webp',
  '/img/pa.webp',
  '/img/calcular.svg',
  '/img/remove.svg',
  '/img/mail.svg',
  '/img/wa.webp',

  // --- MÃ“DULO ILUMINACIÃ“N ---
  '/ilum/index.html',
  '/ilum/puntosmedicion.html',
  '/ilum/mediciones.html',
  '/ilum/localizada.html',
  '/ilum/tabla1.html',
  '/ilum/tabla2.html',
  '/ilum/estilos/informacion.css',
  '/ilum/estilos/styles1.css',
  '/ilum/estilos/styles2.css',
  '/ilum/estilos/styles3.css',
  '/ilum/estilos/tablas.css',
  '/ilum/scripts/app.js',
  '/ilum/scripts/informe.js',
  '/ilum/scripts/grafico.js',
  '/ilum/scripts/chart.js',
  '/ilum/img/camara.svg',
  '/ilum/img/compartir.svg',
  '/ilum/img/croquis.svg',
  '/ilum/img/puntosMuestreo.webp',
  '/ilum/plantillas/Informe_TomaMedicionesIluminacion.docx',
  '/ilum/plantillas/Referencia_Marcadores.docx',

  // --- MÃ“DULO ATENUACIÃ“N DE RUIDOS ---
  '/atenua/index.html',
  '/atenua/bandasoctava.html',
  '/atenua/hml.html',
  '/atenua/snr.html',
  '/atenua/estilos/informacion.css',
  '/atenua/estilos/styles1.css',
  '/atenua/estilos/styles2.css',
  '/atenua/estilos/styles3.css',
  '/atenua/scripts/app.js',
  '/atenua/scripts/bandasoctava.js',
  '/atenua/scripts/apphml.js',
  '/atenua/scripts/hml.js',
  '/atenua/scripts/appsnr.js',
  '/atenua/scripts/snr.js',
  '/atenua/scripts/informe_atenua.js',
  '/atenua/plantillas/informe_bandasOctava.docx',
  '/atenua/plantillas/Informe_atenuaHLM.docx',
  '/atenua/plantillas/Informe_atenuaSNR.docx'
];

// 1. InstalaciÃ³n
// 1. Instalación
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('VispApp: Cacheando archivos...');
      // Promise.allSettled en lugar de addAll
      // Si un archivo falla, el install continúa igual
      return Promise.allSettled(
        assetsToCache.map(url =>
          cache.add(url).catch(err =>
            console.warn('VispApp: No se pudo cachear:', url, err)
          )
        )
      );
    })
  );
});

// 2. ActivaciÃ³n (Limpieza de versiones viejas)
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Toma control inmediato de todas las pestañas
      clients.claim(),
      // Borra cachés viejos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              console.log('VispApp: Borrando caché antiguo...');
              return caches.delete(cache);
            }
          })
        );
      })
    ])
  );
});

// 3. Estrategia de Fetch (Cache First, luego Network)
self.addEventListener('fetch', event => {
  // Excluir la API de correos (PHPMailer requiere conexiÃ³n)
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
