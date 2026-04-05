/* Service Worker VispApp v1.5.2 
   Optimizado para funcionamiento Offline y Generación de Informes
   Optimizado con Rutas Absolutas
*/

const CACHE_NAME = 'visp-app-v1.5.2-cache';

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
  
  // Librerías externas
  '/lib/jszip.min.js',
  '/lib/docxtemplater.min.js',
  '/lib/FileSaver.min.js',
  
  // Imágenes e Iconos principales
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

  // --- MÓDULO ILUMINACIÓN ---
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

  // --- MÓDULO ATENUACIÓN DE RUIDOS ---
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

// 1. Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('VispApp: Cacheando archivos con rutas absolutas...');
        return cache.addAll(assetsToCache);
      })
  );
});

// 2. Activación (Limpieza de versiones viejas)
self.addEventListener('activate', event => {
  event.waitUntil(
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
  );
});

// 3. Estrategia de Fetch (Cache First, luego Network)
self.addEventListener('fetch', event => {
  // Excluir la API de correos (PHPMailer requiere conexión)
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