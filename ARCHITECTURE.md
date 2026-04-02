# VISP Herramientas — Documentación de Arquitectura

> **Versión:** 1.5.0 · **Autor:** Ing. Jorge Mendoza · **Institución:** I.S.P. N° 65 Amelia Díaz, San Vicente, Prov. Santa Fe  
> **Producción:** https://higseg.ar · **Licencia:** MIT

---

## Tabla de contenidos

1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de directorios](#3-estructura-de-directorios)
4. [Arquitectura de la aplicación](#4-arquitectura-de-la-aplicación)
5. [Convenciones HTML](#5-convenciones-html)
6. [Convenciones CSS](#6-convenciones-css)
7. [Convenciones JavaScript](#7-convenciones-javascript)
8. [Herramienta: Iluminación](#8-herramienta-iluminación)
9. [Herramienta: Atenuación de Protectores Auditivos](#9-herramienta-atenuación-de-protectores-auditivos)
10. [API PHP: envío de correo](#10-api-php-envío-de-correo)
11. [Componentes compartidos](#11-componentes-compartidos)
12. [Generación de informes Word](#12-generación-de-informes-word)
13. [Persistencia de datos](#13-persistencia-de-datos)
14. [Seguridad](#14-seguridad)
15. [Git: flujo de trabajo](#15-git-flujo-de-trabajo)
16. [Desarrollo local](#16-desarrollo-local)
17. [Despliegue en producción](#17-despliegue-en-producción)
18. [Reglas para LLMs](#18-reglas-para-llms)

---

## 1. Descripción general

**VISP Herramientas** es una aplicación web de página múltiple (MPA) orientada a estudiantes y profesionales de higiene y seguridad laboral en Argentina. Permite realizar cálculos normativos, visualizar resultados y generar informes en formato Word (`.docx`).

### Herramientas disponibles

| Herramienta | Directorio | Descripción |
|---|---|---|
| Medición de Iluminación | `ilum/` | Calcula Emedio, uniformidad y cumplimiento según legislación argentina (Anexo IV Decreto 351/79) |
| Atenuación de Protectores Auditivos | `atenua/` | Evalúa la protección auditiva mediante tres métodos: Bandas de Octava, HML y SNR (IRAM 4126 / EN 352) |

### Principios de diseño

- **Sin framework front-end**: HTML + CSS + JavaScript vanilla. Sin React, Vue ni Angular.
- **Sin bundler ni transpilador**: los archivos se sirven directamente; no hay paso de build.
- **Sin base de datos**: los datos viven en `sessionStorage` del navegador durante la sesión.
- **Back-end mínimo**: un único endpoint PHP (`api/enviar_mail.php`) para el envío de correos. Todo el resto es estático.
- **Mobile-first responsive**: diseño adaptado a celulares (el flujo real de trabajo ocurre en campo con un teléfono).

---

## 2. Stack tecnológico

### Front-end

| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | — | Estructura de todas las páginas |
| CSS3 | — | Estilos, variables custom properties, flexbox |
| JavaScript ES2020 | — | Lógica de cálculo, DOM, sessionStorage |
| [KaTeX](https://katex.org/) | 0.16.11 (CDN) | Renderizado de fórmulas matemáticas |
| [Chart.js](https://www.chartjs.org/) | local (`ilum/scripts/chart.js`) | Gráfico de iluminación localizada vs. general |
| [JSZip](https://stuk.github.io/jszip/) | local (`lib/jszip.min.js`) | Manipulación de archivos `.docx` (ZIP) |
| [docxtemplater](https://docxtemplater.com/) | local (`lib/docxtemplater.min.js`) | Motor de plantillas para generar `.docx` |
| [FileSaver.js](https://github.com/eligrey/FileSaver.js/) | local (`lib/FileSaver.min.js`) | Descarga de archivos generados en el navegador |
| [Google Fonts — Montserrat](https://fonts.google.com/specimen/Montserrat) | CDN | Tipografía principal |
| Google Analytics (gtag.js) | CDN | Analítica de uso |

### Back-end

| Tecnología | Versión | Uso |
|---|---|---|
| PHP | ≥ 8.0 | Único endpoint: `api/enviar_mail.php` |
| [PHPMailer](https://github.com/PHPMailer/PHPMailer) | ^7.0 | Envío de correo vía SMTP |
| Composer | — | Gestión de dependencias PHP |

### Servidor

| Componente | Detalle |
|---|---|
| Web server | Nginx |
| Hosting | Oracle Cloud Infrastructure (OCI) |
| SMTP | OCI Email Delivery (puerto 587, STARTTLS) |

---

## 3. Estructura de directorios

```
app_v1.5/
│
├── index.html                  ← Página de inicio (selector de herramientas)
├── index.nginx-debian.html     ← Página de bienvenida de Nginx (ignorar)
├── composer.json               ← Dependencias PHP (PHPMailer)
├── composer.lock
├── .gitignore
├── LICENSE.md / LICENSE.html
├── README.md                   ← Historial de versiones público
├── ARCHITECTURE.md             ← Este archivo
│
├── api/
│   └── enviar_mail.php         ← Único endpoint PHP (envío de correo)
│
├── estilos/                    ← CSS GLOBAL (compartido por todas las páginas)
│   ├── colores.css             ← Variables CSS de color (custom properties)
│   ├── general.css             ← Estilos base: header, footer, botones, modales
│   └── styles_indice.css       ← Estilos específicos de la página index.html
│
├── scripts/                    ← JS GLOBAL (compartido por todas las páginas)
│   ├── script.js               ← Validación de inputs numéricos + toggleMenu()
│   └── footer.js               ← Inyecta el footer y el modal "Acerca de"
│
├── lib/                        ← Librerías JS de terceros (copiadas localmente)
│   ├── jszip.min.js
│   ├── docxtemplater.min.js
│   └── FileSaver.min.js
│
├── img/                        ← Imágenes globales
│   ├── Logo_Visp.webp
│   ├── logoISP65.webp
│   ├── favicon.webp
│   ├── luxometro.webp          ← Tarjeta de iluminación en index
│   ├── pa.webp                 ← Tarjeta de protectores en index
│   ├── calcular.svg            ← Ícono botón Calcular
│   ├── remove.svg              ← Ícono botón Borrar
│   ├── mail.svg                ← Ícono botón Mail
│   └── wa.webp                 ← Ícono WhatsApp
│
├── ilum/                       ← HERRAMIENTA: Medición de Iluminación
│   ├── index.html              ← Página informativa (descripción + fuentes normativas)
│   ├── puntosmedicion.html     ← Calculadora: índice del local + puntos mínimos
│   ├── mediciones.html         ← Calculadora principal: tabla de mediciones + resultados
│   ├── localizada.html         ← Verificación iluminación general vs. localizada
│   ├── tabla1.html             ← Tabla normativa (Anexo IV Decreto 351/79)
│   ├── tabla2.html             ← Tabla normativa (Anexo IV Decreto 351/79)
│   ├── test.html               ← Página de prueba (no enlazada en producción)
│   ├── README.md / README.html
│   │
│   ├── estilos/
│   │   ├── informacion.css     ← Estilos de index.html
│   │   ├── styles1.css         ← Estilos de puntosmedicion.html
│   │   ├── styles2.css         ← Estilos de mediciones.html
│   │   ├── styles3.css         ← Estilos de localizada.html
│   │   └── tablas.css          ← Estilos de tabla1.html y tabla2.html
│   │
│   ├── scripts/
│   │   ├── app.js              ← Lógica de cálculo (TODAS las páginas de ilum/)
│   │   ├── informe.js          ← Generación de informes Word + envío por mail
│   │   ├── grafico.js          ← Lógica del gráfico de localizada.html
│   │   └── chart.js            ← Librería Chart.js (copia local)
│   │
│   ├── plantillas/
│   │   ├── Informe_TomaMedicionesIluminacion.docx  ← Plantilla predeterminada
│   │   └── Referencia_Marcadores.docx              ← Guía de marcadores descargable
│   │
│   └── img/
│       ├── camara.svg
│       ├── compartir.svg
│       ├── croquis.svg
│       └── puntosMuestreo.webp ← (legacy; reemplazada por KaTeX en v1.5)
│
└── atenua/                     ← HERRAMIENTA: Atenuación de Protectores Auditivos
    ├── index.html              ← Página informativa + tabla de índice de protección
    ├── bandasoctava.html       ← Calculadora: Método Bandas de Octava
    ├── hml.html                ← Calculadora: Método HML
    ├── snr.html                ← Calculadora: Método SNR
    ├── README.md / README.html
    ├── LICENSE / LICENSE.html
    │
    ├── estilos/
    │   ├── informacion.css     ← Estilos de index.html
    │   ├── styles1.css         ← Estilos de bandasoctava.html
    │   ├── styles2.css         ← Estilos de hml.html
    │   └── styles3.css         ← Estilos de snr.html
    │
    ├── scripts/
    │   ├── app.js              ← Cálculo Bandas de Octava + sessionStorage Bo
    │   ├── bandasoctava.js     ← Generación de informe Word (Bandas de Octava)
    │   ├── apphml.js           ← Cálculo HML + sessionStorage HML
    │   ├── hml.js              ← Generación de informe Word (HML)
    │   ├── appsnr.js           ← Cálculo SNR + sessionStorage SNR
    │   └── snr.js              ← Generación de informe Word (SNR)
    │
    └── plantillas/
        ├── informe_bandasOctava.docx
        ├── Informe_atenuaHLM.docx
        └── Informe_atenuaSNR.docx
```

---

## 4. Arquitectura de la aplicación

### Patrón general: MPA con JS vanilla

Cada página HTML es un documento independiente. No hay enrutamiento del lado del cliente. La navegación se realiza con `<a href="">` estándar.

```
Navegador
    │
    ├─ GET /index.html              → Selector de herramientas
    ├─ GET /ilum/puntosmedicion.html → Paso 1 de iluminación
    ├─ GET /ilum/mediciones.html    → Paso 2 de iluminación
    ├─ GET /ilum/localizada.html    → Paso 3 de iluminación
    ├─ GET /atenua/bandasoctava.html → Calculadora Bo
    ├─ GET /atenua/hml.html         → Calculadora HML
    └─ GET /atenua/snr.html         → Calculadora SNR

    POST /api/enviar_mail.php       → Único endpoint dinámico (PHP)
```

### Carga de scripts en cada página

Cada página HTML carga sus dependencias en este orden:

```
1. CSS global:   /estilos/colores.css
2. CSS global:   /estilos/general.css
3. CSS local:    ./estilos/stylesN.css
4. Google Fonts  (CDN)
5. KaTeX CSS     (CDN, solo puntosmedicion.html)
6. script.js     (defer) — validación + menú hamburguesa
7. Librerías JS  (jszip, docxtemplater, FileSaver — solo páginas con informe)
8. KaTeX JS      (defer, CDN, solo puntosmedicion.html)
9. Google gtag   (async)
10. footer.js    (al final del <body>) — inyecta footer + modal
11. app.js local (al final del <body>) — lógica de cálculo
12. informe.js   (al final del <body>, solo mediciones.html)
```

> **Regla importante:** `footer.js` y los scripts de lógica van al **final del `<body>`**, no en el `<head>`. El único script en `<head>` es `script.js` (con `defer`) y las librerías de terceros.

### Flujo de datos (sin servidor)

```
Usuario ingresa datos
        │
        ▼
Validación en input (validarNumeroReal() — script.js)
        │
        ▼
Función calcular / leerTabla / calcularTodo*()
        │
        ├─► Resultados mostrados en el DOM
        │
        └─► Guardado en sessionStorage
                    │
                    ▼
        Al navegar entre páginas:
        DOMContentLoaded lee sessionStorage
        y restaura el estado previo
```

---

## 5. Convenciones HTML

### Estructura de cada página

Todas las páginas siguen esta estructura:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- meta charset y viewport siempre primero -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nombre de herramienta — Nombre de sección</title>

    <!-- CSS: primero global, después local -->
    <link rel="stylesheet" href="/estilos/colores.css">
    <link rel="stylesheet" href="/estilos/general.css">
    <link rel="stylesheet" href="./estilos/stylesN.css">

    <!-- Fuentes -->
    <link href="https://fonts.googleapis.com/..." rel="stylesheet">

    <!-- Scripts globales con defer -->
    <script defer src="/scripts/script.js"></script>

    <!-- Librerías (solo si la página genera informes) -->
    <script src="/lib/jszip.min.js"></script>
    <script src="/lib/docxtemplater.min.js"></script>
    <script src="/lib/FileSaver.min.js"></script>

    <!-- Google Analytics (async) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-EEXJXBJBQB"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-EEXJXBJBQB');
    </script>

    <!-- SEO -->
    <meta name="description" content="...">
    <link rel="canonical" href="https://higseg.ar/...">
</head>
<body>
    <header>...</header>

    <h2 class="section-title">TÍTULO DE SECCIÓN</h2>

    <main class="contenedor-principal">
        <div class="contenedor__izquierda">...</div>
        <div class="contenedor__derecha">...</div>
    </main>

    <!-- Al final del body: footer + scripts de lógica -->
    <script src="/scripts/footer.js"></script>
    <script src="./scripts/app.js"></script>
</body>
</html>
```

### Header con navegación

Todas las páginas internas tienen un header idéntico:

```html
<header>
    <a href="/index.html">
        <img src="/img/Logo_Visp.webp" class="logo" alt="Logo VISP">
    </a>
    <h1>NOMBRE DE LA HERRAMIENTA</h1>
    <nav>
        <ul class="menu">
            <li><a href="pagina1.html" class="active">Activa</a></li>
            <li><a href="pagina2.html">Otra</a></li>
        </ul>
        <!-- Menú hamburguesa para móvil -->
        <div class="menu-hamburguesa" onclick="toggleMenu()">
            <div></div><div></div><div></div><div></div>
        </div>
    </nav>
</header>
```

- La página activa lleva `class="active"` en su `<a>`.
- El menú hamburguesa tiene **4 divs** (para el ícono animado de 4 líneas).
- `toggleMenu()` está definido en `script.js`.

### Layout principal

El `<main class="contenedor-principal">` siempre usa flexbox con dos columnas:

```html
<main class="contenedor-principal">
    <div class="contenedor__izquierda">
        <!-- Inputs, tablas de datos de entrada -->
    </div>
    <div class="contenedor__derecha">
        <!-- Resultados, gráficos, botones de acción -->
    </div>
</main>
```

En móvil (`max-width: 768px`) las columnas se apilan verticalmente mediante media queries.

### Inputs numéricos

Todos los campos numéricos usan `type="text"` con validación manual (no `type="number"`) para soportar tanto punto como coma como separador decimal:

```html
<input type="text" oninput="validarNumeroReal(this)" id="miCampo" class="input-name" placeholder="0.0">
```

La función `validarNumeroReal(input)` está en `scripts/script.js`.

### Modales

Los modales se definen inline dentro del HTML de la página (no se inyectan dinámicamente, excepto el modal "Acerca de" de `footer.js`). Estructura estándar:

```html
<div id="modalNombre" class="modal">
    <div class="modal-content">
        <span class="close" id="cerrarModalNombre">×</span>
        <h2>Título del modal</h2>
        <!-- contenido -->
        <div class="modal-botones">
            <button class="button-draw" id="boton-accionModal">Acción</button>
            <button class="button-draw" id="boton-cancelarModal">Cancelar</button>
        </div>
    </div>
</div>
```

Los event listeners del modal se agregan siempre en `DOMContentLoaded` dentro del JS correspondiente, **nunca** con `onclick` inline en el botón que abre el modal.

### Etiquetas que NO se deben usar

- ❌ `<p1>`, `<p2>` — no son etiquetas HTML válidas. Usar `<span>`, `<p>`, o `<div>`.
- ❌ Atributos obsoletos como `fontsize="22"`, `width="20px"` en `<td>` — usar CSS.
- ❌ Bloques `<style>` inline dentro del `<body>` o `<head>` — todo CSS va en archivos externos.
- ❌ `<main>` duplicado — cada página debe tener exactamente un `<main>`.

### IDs únicos

Cada `id` debe ser único en el documento. Si un `<tr>` necesita un id para selección CSS/JS, y su `<input>` hijo también necesita uno, deben ser distintos:

```html
<!-- ✅ Correcto -->
<tr id="fila-dbC-snr">
    <td><input type="text" id="dbC_snr"></td>
</tr>

<!-- ❌ Incorrecto -->
<tr id="dbC_snr">
    <td><input type="text" id="dbC_snr"></td>
</tr>
```

---

## 6. Convenciones CSS

### Arquitectura de archivos CSS

Hay dos niveles:

**Nivel global** (`/estilos/`): cargado por TODAS las páginas.
- `colores.css` — solo variables CSS (custom properties). Sin ninguna regla de estilo.
- `general.css` — estilos base compartidos: reset, body, header, footer, botones, modales, menú, clases de índice de protección auditiva.
- `styles_indice.css` — estilos exclusivos de `index.html` (la portada).

**Nivel local** (`herramienta/estilos/`): cargado solo por las páginas de esa herramienta.
- `informacion.css` — estilos de la página de información de la herramienta.
- `styles1.css`, `styles2.css`, `styles3.css` — estilos de cada página funcional. El número corresponde a la página (1=puntosmedicion, 2=mediciones, 3=localizada en `ilum/`; 1=bandas, 2=hml, 3=snr en `atenua/`).

### Variables de color

**Todas** las referencias a colores deben usar variables CSS definidas en `colores.css`. Nunca escribir colores hardcodeados en reglas CSS:

```css
/* ✅ Correcto */
background-color: var(--color-input-fondo);
color: var(--color-resultado);

/* ❌ Incorrecto */
background-color: #e9e2f5;
color: rgb(35, 67, 207);
```

Variables disponibles:

| Variable | Uso |
|---|---|
| `--color-primario` | Azul claro (lightblue) |
| `--color-secundario` | Gris claro (fondos de contenedor) |
| `--color-body` | Fondo general de la página (#333) |
| `--color-header-fondo` | Fondo del header |
| `--color-header-texto` | Texto del header |
| `--color-footer-fondo` | Fondo del footer (#356292) |
| `--color-footer-texto` | Texto del footer |
| `--color-resaltado` | Hover / acento (coral) |
| `--color-borde` | Color de bordes (black) |
| `--color-input` | Color del texto en inputs editables |
| `--color-input-fondo` | Fondo de inputs editables |
| `--color-resultado` | Color del texto de resultados (azul) |
| `--color-no-editable` | Fondo de celdas de resultado (amarillo claro) |
| `--color-semitransparente` | Overlay de modales |
| `--color-cumple` | Verde (resultados que cumplen) |
| `--color-no-cumple` | Rojo (resultados que no cumplen) |
| `--color-titulo-principal` | Color del `h2.section-title` (antiquewhite) |

### Clases de índice de protección auditiva

Definidas en `general.css`. Se aplican/remueven con JS mediante `classList`:

| Clase CSS | Color de fondo | Significado |
|---|---|---|
| `.indice-sobreprotegido` | orange | LeqA' < 70 dB(A) |
| `.indice-buena` | lightgreen | 70 ≤ LeqA' < 80 dB(A) |
| `.indice-aceptable` | lightyellow | 80 ≤ LeqA' ≤ 85 dB(A) |
| `.indice-insuficiente` | red | LeqA' > 85 dB(A) |

### Font-weight

Usar siempre valores numéricos:

| Nombre informal | Valor correcto |
|---|---|
| Normal | `400` |
| Medium | `500` |
| SemiBold | `600` |
| Bold | `700` |

### Responsividad

Todas las páginas tienen un breakpoint en `max-width: 768px`. El patrón estándar es:

- En desktop: `contenedor-principal` en flexbox horizontal (dos columnas).
- En móvil: `flex-direction: column` (una columna, izquierda arriba, derecha abajo).
- El menú de navegación se oculta en móvil (`display: none`) y se muestra al hacer clic en el hamburguesa (clase `.activo` agregada por `toggleMenu()`).

---

## 7. Convenciones JavaScript

### Organización por responsabilidad

Cada módulo JS tiene una responsabilidad única:

| Archivo | Responsabilidad |
|---|---|
| `scripts/script.js` | Validación de inputs numéricos (`validarNumeroReal`) + toggle del menú hamburguesa (`toggleMenu`) |
| `scripts/footer.js` | Inyectar el HTML del footer y del modal "Acerca de" en el DOM; manejar la lógica de apertura/cierre del modal |
| `ilum/scripts/app.js` | Toda la lógica de cálculo de iluminación: índice del local, tabla de mediciones, localizada, sessionStorage, compresión de imágenes, compartir por WhatsApp/nativo |
| `ilum/scripts/informe.js` | Generación del informe Word de iluminación + modal de mail + función `enviarMail()` |
| `ilum/scripts/grafico.js` | Inicialización y actualización del gráfico Chart.js de localizada |
| `atenua/scripts/app.js` | Cálculo por Bandas de Octava + sessionStorage con prefijo `bo_` |
| `atenua/scripts/bandasoctava.js` | Generación del informe Word de Bandas de Octava |
| `atenua/scripts/apphml.js` | Cálculo HML + sessionStorage con prefijo `hml_` |
| `atenua/scripts/hml.js` | Generación del informe Word HML |
| `atenua/scripts/appsnr.js` | Cálculo SNR + sessionStorage con prefijo `snr_` |
| `atenua/scripts/snr.js` | Generación del informe Word SNR |

### Inicialización del DOM

Todo código que accede al DOM debe ir dentro de un listener `DOMContentLoaded` o al final del `<body>`. Los event listeners de modales y formularios siempre se registran en `DOMContentLoaded`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Registrar todos los event listeners aquí
    document.getElementById('miBoton').addEventListener('click', miFuncion);
    cargarDatosDesdeSessionStorage();
});
```

### Funciones llamadas desde el HTML

Algunos botones usan `onclick="funcion()"` directamente en el HTML (patrón legacy). Estas funciones **deben ser globales** (definidas en el scope del módulo, no dentro de un IIFE ni de `DOMContentLoaded`):

```javascript
// ✅ Accesible desde onclick en el HTML
function calcular() { ... }

// ❌ No accesible desde onclick en el HTML
document.addEventListener('DOMContentLoaded', () => {
    function calcular() { ... } // scope local, no se puede llamar desde HTML
});
```

### Clases CSS para estado visual

Los colores de estado dinámico (como el índice de protección) deben aplicarse mediante clases CSS, nunca mediante `style.backgroundColor` inline:

```javascript
// ✅ Correcto
const el = document.getElementById('indice-proteccionSNR');
el.classList.remove('indice-sobreprotegido', 'indice-buena', 'indice-aceptable', 'indice-insuficiente');
el.classList.add('indice-buena');

// ❌ Incorrecto
document.getElementById('indice-proteccionSNR').style.backgroundColor = 'lightgreen';
document.getElementById('indice-proteccionSNR').style.color = 'black';
```

### Validación numérica

La función `validarNumeroReal(input)` en `script.js` se encarga de:
- Eliminar caracteres no numéricos (permite dígitos, punto, coma y signo menos).
- Normalizar coma a punto como separador decimal.
- Permitir solo un separador decimal.
- Limitar a dos decimales.
- Permitir el signo menos solo al inicio.

---

## 8. Herramienta: Iluminación

### Flujo de uso (4 páginas)

```
index.html (info + fuentes normativas)
    │
    ▼
puntosmedicion.html ──────────────────────────────────────────────
    Inputs: largo, ancho, altura luminaria                        │
    Cálculo: índiceLocal = (ancho × largo) / (altura × (ancho+largo))
             indiceLocalAdoptado = min(ceil(indiceLocal), 4)       │
             numeroPuntos = (indiceLocalAdoptado + 2)²            │
    Persiste en sessionStorage: largo, ancho, luminaria,          │
                                fraseIndice, fraseResultado,      │
                                indiceLocalAdoptado               │
    ▼                                                             │
mediciones.html ──────────── sessionStorage ─────────────────────┘
    Inputs: lugar, operador, tabla (40 celdas m1..m40), nivel requerido
    Cálculo: Emedio = promedio de celdas no vacías
             Eminimo = valor mínimo
             Cumplimiento: Emedio ≥ nivelRequerido
             Uniformidad: Eminimo ≥ Emedio / 2
    Acciones: Generar Informe Word / Enviar por Mail / Compartir WhatsApp
    ▼
localizada.html
    Inputs: nivel general (lux), nivel localizada (lux)
    Verifica relación según tabla normativa del Decreto 351/79
    Muestra gráfico Chart.js con líneas de referencia
```

### Tabla de mediciones (`mediciones.html`)

La tabla se genera dinámicamente en JS (`app.js`, evento `DOMContentLoaded`):
- 10 filas × 4 columnas de datos = **40 celdas** editables (`contenteditable="true"`).
- IDs de celda: `m1` a `m40` (numeración continua por columnas).
- Las celdas de numeración (impares) son solo visuales; las de datos (pares) son editables.
- Al hacer clic en "Calcular" se leen todas las celdas no vacías con `querySelectorAll("#tabla tbody td:nth-child(even)")`.

### Compartir resultado

Hay dos mecanismos de compartir:

1. **WhatsApp** (`compartirWhatsApp()`): genera un mensaje de texto con los resultados y abre `https://api.whatsapp.com/send?text=...`. Funciona en cualquier dispositivo.

2. **Nativo** (`compartirNativo()`): usa la Web Share API (`navigator.share`) con el informe `.docx` y las fotos adjuntas. Disponible en móvil y PC con soporte para `navigator.share` con archivos.

### Fotos adjuntas

Los botones de cámara (`btn-foto-croquis`, `btn-foto-local`) Se muestran en móvil y desktop. Al seleccionar una imagen, se comprime con la función `comprimirImagen()` usando un canvas (máx. 1000px de ancho, calidad JPEG 0.75).

---

## 9. Herramienta: Atenuación de Protectores Auditivos

### Tres métodos independientes

Cada método es una página independiente con su propio par de scripts (`app*.js` para cálculo + `*.js` para informe).

#### Método Bandas de Octava (`bandasoctava.html`)

**Inputs:**
- Nombre del protector auditivo
- Atenuación media (dB) en 8 frecuencias: 63, 125, 250, 500, 1000, 2000, 4000, 8000 Hz
- Desviación estándar (dB) en las mismas 8 frecuencias
- Espectro medido (dB) en las mismas 8 frecuencias

**Cálculo (en `atenua/scripts/app.js`):**
```
Protección supuesta[i] = AtenuaciónMedia[i] - DesviaciónEstándar[i]
EspectroProtegido[i]   = EspectroMedido[i] - ProtecciónSupuesta[i]
lA[i]                  = EspectroProtegido[i] + PonderaciónA[i]
LeqA_medido            = 10 × log10( Σ 10^(lA_medido[i]/10) )
LeqA_atenuado          = 10 × log10( Σ 10^(lA_protegido[i]/10) )
```

Ponderación A usada: `[-26.0, -16.0, -9.0, -3.0, 0, 1.0, 1.0, -1.0]`

Checkbox "+4 dB": suma 4 dB al LeqA atenuado para representar el nivel probable en el oído (derating).

**Prefijo sessionStorage:** `bo_`

#### Método HML (`hml.html`)

**Inputs:** H, M, L (del fabricante), LeqA, LeqC (medidos en campo)

**Cálculo (en `atenua/scripts/apphml.js`):**
```
diferencia = LeqC - LeqA
if (diferencia ≤ 2):
    atenuación = M - ((H - M) / 4) × (diferencia - 2)
else:
    atenuación = M - ((M - L) / 8) × (diferencia - 2)
LeqA' = LeqA - atenuación  [+ 4 si checkbox activo]
```

**Prefijo sessionStorage:** `hml_`

#### Método SNR (`snr.html`)

**Inputs:** SNR (del fabricante), LeqC (medido en campo)

**Cálculo (en `atenua/scripts/appsnr.js`):**
```
LeqA' = LeqC - SNR  [+ 4 si checkbox activo]
```

**Prefijo sessionStorage:** `snr_`

### Índice de protección (los tres métodos)

El resultado LeqA' se clasifica y se muestra con la clase CSS correspondiente:

| Condición | Clase CSS | Significado |
|---|---|---|
| LeqA' < 70 dB(A) | `indice-sobreprotegido` | Sobreprotegido (riesgo de aislamiento) |
| 70 ≤ LeqA' < 80 dB(A) | `indice-buena` | Buena protección |
| 80 ≤ LeqA' ≤ 85 dB(A) | `indice-aceptable` | Aceptable |
| LeqA' > 85 dB(A) | `indice-insuficiente` | Insuficiente (trabajador desprotegido) |

---

## 10. API PHP: envío de correo

### Endpoint único

**Archivo:** `api/enviar_mail.php`  
**Método:** `POST`  
**Content-Type:** `application/json`  
**CORS:** Solo acepta origen `https://higseg.ar`

### Payload esperado (JSON)

```json
{
    "destinatario": "usuario@ejemplo.com",
    "lugar":        "Taller de Mecánica",
    "operador":     "Juan García",
    "fecha":        "25/03/2026",
    "hora":         "14:30",
    "emedio":       "320.5",
    "minimo":       "210.0",
    "ilumGeneral":  "CUMPLE con la legislación vigente",
    "uniformidad":  "CUMPLE con la legislación vigente",
    "requerido":    "300",
    "docx":         "<base64 del archivo .docx>",
    "fotoCroquis":  "<base64 de la foto, opcional>",
    "fotoLocal":    "<base64 de la foto, opcional>"
}
```

### Respuesta

```json
{ "ok": true }
// o en caso de error:
{ "ok": false, "error": "Mensaje de error genérico" }
```

### Rate limiting

Máximo **5 envíos por IP** en una ventana de **10 minutos**. Implementado con archivos JSON temporales en `sys_get_temp_dir()`. Si se supera, responde con HTTP 429.

### Credenciales SMTP

Las credenciales **nunca se hardcodean** en el código. Se leen de variables de entorno del servidor:

| Variable de entorno | Descripción |
|---|---|
| `SMTP_HOST` | Host del servidor SMTP |
| `SMTP_PORT` | Puerto (587) |
| `SMTP_USUARIO` | Usuario SMTP (OCID de OCI) |
| `SMTP_PASSWORD` | Contraseña SMTP |
| `MAIL_FROM` | Dirección remitente (`noreply@higseg.ar`) |

Configuración en Apache (VirtualHost o `.htaccess`):
```apache
SetEnv SMTP_HOST     smtp.email.us-phoenix-1.oci.oraclecloud.com
SetEnv SMTP_PORT     587
SetEnv SMTP_USUARIO  ocid1.user...@ocid1.tenancy...lb.com
SetEnv SMTP_PASSWORD tu_password_aqui
SetEnv MAIL_FROM     noreply@higseg.ar
```

Configuración en Nginx (`fastcgi_param` en el bloque PHP):
```nginx
fastcgi_param SMTP_HOST     smtp.email.us-phoenix-1.oci.oraclecloud.com;
fastcgi_param SMTP_PORT     587;
fastcgi_param SMTP_USUARIO  ocid1.user...;
fastcgi_param SMTP_PASSWORD tu_password_aqui;
fastcgi_param MAIL_FROM     noreply@higseg.ar;
```

---

## 11. Componentes compartidos

### `scripts/script.js`

Contiene dos funciones globales usadas por todas las páginas:

**`validarNumeroReal(input)`** — Se llama desde `oninput` en cada `<input>` numérico. Normaliza el valor: acepta negativos, permite punto o coma como decimal, limita a 2 decimales.

**`toggleMenu()`** — Alterna la clase `.activo` en `.menu` para mostrar/ocultar el menú hamburguesa en móvil. Se llama desde `onclick` en el `.menu-hamburguesa`.

### `scripts/footer.js`

Se incluye con `<script src="/scripts/footer.js"></script>` al final del `<body>` en **todas** las páginas. Este script:

1. Inyecta el HTML completo del footer usando `document.body.insertAdjacentHTML('beforeend', footerHTML)`.
2. Inyecta el HTML del modal "Acerca de".
3. Registra los event listeners del modal (abrir, cerrar con X, cerrar al hacer clic afuera).

Esto garantiza que cualquier cambio en el footer o en el modal "Acerca de" se aplica automáticamente a todas las páginas con una sola edición.

---

## 12. Generación de informes Word

### Tecnología

Se usa **docxtemplater** + **JSZip** para modificar archivos `.docx` directamente en el navegador, sin servidor.

Un archivo `.docx` es internamente un ZIP con XML. docxtemplater lee el XML, reemplaza los marcadores `{clave}` con los valores provistos, y genera un nuevo blob que se descarga con FileSaver.js.

### Flujo general

```javascript
// 1. Cargar la plantilla (fetch o FileReader)
const data = await fetch('./plantillas/Informe.docx').then(r => r.arrayBuffer());

// 2. Abrir el ZIP
const zip = new JSZip(data);

// 3. Crear el documento
const doc = new window.docxtemplater().loadZip(zip);

// 4. Proveer los valores de reemplazo
doc.setData({ lugar: "Taller", emedio: "320.5", m1: "350", ... });

// 5. Renderizar (sustituir marcadores)
doc.render();

// 6. Generar y descargar
const blob = doc.getZip().generate({ type: "blob" });
saveAs(blob, "Informe.docx");
```

### Marcadores disponibles en las plantillas

#### Iluminación (`Informe_TomaMedicionesIluminacion.docx`)

| Marcador | Contenido |
|---|---|
| `{lugar}` | Lugar de medición |
| `{operador}` | Nombre del operador |
| `{fecha}` | Fecha (dd/mm/aaaa) |
| `{hora}` | Hora (HH:MM, formato 24h) |
| `{fechaHora}` | Fecha y hora combinadas |
| `{nivelIluminacionRequerido}` / `{requerido}` | Nivel requerido en lux |
| `{nroMediciones}` | Cantidad de puntos medidos |
| `{emedio}` | Emedio calculado (lux) |
| `{minimo}` | Eminimo (lux) |
| `{ilumGeneral}` | Texto de resultado de iluminación general |
| `{uniformidad}` | Texto de resultado de uniformidad |
| `{largo}` / `{ancho}` / `{altura}` | Dimensiones del local (m) |
| `{numeroPuntos}` | Puntos mínimos requeridos |
| `{indiceLocalAdoptado}` | Índice del local adoptado |
| `{m1}` … `{m40}` | Valores individuales de cada punto medido |

#### Bandas de Octava (`informe_bandasOctava.docx`)

`{pa}`, `{sph}`, `{leqA}`, `{leqAo}`, `{indice}`, `{mf63}` a `{mf8000}`, `{ds63}` a `{ds8000}`, `{lf63}` a `{lf8000}`

#### HML (`Informe_atenuaHLM.docx`)

`{pa}`, `{sph}`, `{H}`, `{M}`, `{L}`, `{leqA}`, `{leqC}`, `{leqAo}`, `{indice}`

#### SNR (`Informe_atenuaSNR.docx`)

`{pa}`, `{sph}`, `{SNR}`, `{leqC}`, `{leqAo}`, `{indice}`

### Plantilla personalizada

El usuario puede subir su propio `.docx` con los mismos marcadores. La página ofrece un archivo de referencia descargable (`Referencia_Marcadores.docx`) con la lista completa de marcadores disponibles.

---

## 13. Persistencia de datos

Se usa `sessionStorage` (no `localStorage`) para persistir el estado entre páginas dentro de la misma sesión del navegador. Los datos se pierden al cerrar la pestaña.

### Convención de claves

Cada herramienta usa un **prefijo** para evitar colisiones:

| Prefijo | Herramienta |
|---|---|
| *(sin prefijo)* | Iluminación (puntosmedicion + mediciones) |
| `bo_` | Bandas de Octava |
| `hml_` | Método HML |
| `snr_` | Método SNR |

### Claves de iluminación (sin prefijo)

`largo`, `ancho`, `luminaria`, `fraseIndice`, `fraseResultado`, `indiceLocalAdoptado`, `nivelIluminacionRequerido`, `lugar`, `operador`, `tablaMediciones` (JSON), `nroMedicionesValue`, `emedioValue`, `minimoValue`, `ilumGeneralText`, `ilumGeneralColor`, `uniformidadText`, `uniformidadColor`

### Claves de Bandas de Octava (prefijo `bo_`)

`bo_nombreProtector`, `bo_lugarRuido`, `bo_cbox2`, `bo_indiceProteccion`, `bo_indiceProteccionClase`, `bo_leqMedido`, `bo_leqAtenuado`, `bo_filaAtenuacion`, `bo_filaDesviacion`, `bo_filaProteccion`, `bo_filaEspectroMedido`, `bo_filaEspectroProtegido`

### Claves de HML (prefijo `hml_`)

`hml_protectorAuditivo`, `hml_H`, `hml_M`, `hml_L`, `hml_lugarRuido`, `hml_dbA`, `hml_dbC`, `hml_cbox3`, `hml_dbA_protegido`, `hml_indiceProteccion`, `hml_indiceProteccionClase`

### Claves de SNR (prefijo `snr_`)

`snr_protectorAuditivo`, `snr_SNR`, `snr_lugarRuido`, `snr_dbC`, `snr_cbox3`, `snr_dbA_protegido`, `snr_indiceProteccion`, `snr_indiceProteccionClase`

---

## 14. Seguridad

### Credenciales

- **Nunca** se escriben credenciales en el código fuente.
- Las credenciales SMTP viven en variables de entorno del servidor (ver sección 10).
- El archivo `.gitignore` excluye `.env`, `*.env`, `config.local.php` y archivos de copia/backup.

### Archivos peligrosos en producción

- `test.php` / `phpinfo.php` / `debug.php` están en `.gitignore` y deben eliminarse del servidor si existen.
- La carpeta `vendor/` tampoco se versiona (se instala con `composer install` en el servidor).

### Rate limiting

`enviar_mail.php` implementa un límite de 5 solicitudes por IP cada 10 minutos para prevenir el abuso del endpoint de correo.

### CORS

El endpoint PHP solo acepta solicitudes desde `https://higseg.ar` mediante el header `Access-Control-Allow-Origin`.

### Exposición de errores

Los errores internos de PHPMailer se registran con `error_log()` pero **no se exponen** al cliente. El usuario solo recibe un mensaje genérico.

---

## 15. Git: flujo de trabajo

### Configuración inicial (ya hecha)

```bash
git init
git branch -m main
git config user.name "Jorge Mendoza"
git config user.email "jorge@higseg.ar"
```

### Conectar con GitHub / GitLab (cuando se desee)

```bash
git remote add origin https://github.com/usuario/visp-herramientas.git
git push -u origin main
```

### Rama principal

La rama principal es `main`. Es la única rama en uso actualmente.

### Flujo de trabajo recomendado

Para cambios pequeños (correcciones, ajustes de texto, etc.) se puede trabajar directamente en `main`:

```bash
# Ver estado del repositorio
git status

# Ver cambios actuales
git diff

# Agregar archivos modificados
git add archivo.html
git add estilos/styles2.css
# o agregar todo
git add -A

# Hacer commit
git commit -m "tipo: descripción breve del cambio"

# Subir al remoto (cuando haya un remoto configurado)
git push
```

Para cambios más grandes (nueva herramienta, refactor significativo), usar una rama:

```bash
# Crear y cambiar a una rama nueva
git checkout -b feature/nueva-herramienta

# ... hacer cambios y commits ...

# Volver a main y fusionar
git checkout main
git merge feature/nueva-herramienta

# Eliminar la rama cuando ya no se necesite
git branch -d feature/nueva-herramienta
```

### Convención de mensajes de commit

Usar el formato **Conventional Commits**:

```
tipo: descripción breve en minúsculas (máx. 72 caracteres)

Cuerpo opcional con más detalle (después de una línea en blanco)
```

**Tipos:**

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad o herramienta |
| `fix` | Corrección de un bug o error |
| `style` | Cambios de CSS / estética (sin cambio de lógica) |
| `refactor` | Reorganización de código sin cambiar comportamiento |
| `docs` | Cambios en documentación (README, ARCHITECTURE) |
| `chore` | Tareas de mantenimiento (.gitignore, dependencias) |
| `security` | Correcciones de seguridad |

**Ejemplos:**

```bash
git commit -m "feat: agregar herramienta de ruido en el ambiente"
git commit -m "fix: corregir cálculo de uniformidad cuando hay una sola medición"
git commit -m "style: ajustar estilos del footer en móvil"
git commit -m "security: mover credenciales SMTP a variables de entorno"
git commit -m "docs: actualizar ARCHITECTURE.md con sección de ruido"
git commit -m "chore: actualizar PHPMailer a v7.1"
```

### Lo que NO se versiona (`.gitignore`)

- `vendor/` — dependencias PHP de Composer
- `.env`, `*.env` — variables de entorno con credenciales
- `*.bak`, `*- copia*`, `*_copia*` — archivos de respaldo
- `test.php`, `debug.php`, `phpinfo.php` — archivos de debug
- `.DS_Store`, `Thumbs.db` — archivos de sistema operativo
- `.vscode/`, `.idea/` — configuración de editores
- `node_modules/` — dependencias Node (si se agregan en el futuro)

### Ver el historial

```bash
# Ver log compacto
git log --oneline

# Ver log con detalles
git log --stat

# Ver un commit específico
git show abc1234
```

---

## 16. Desarrollo local

### Requisitos

- Python 3 (para el servidor estático) **o** PHP 8+ (para también probar el endpoint de mail)
- Un navegador moderno (Chrome, Firefox, Edge)

### Opción A: Servidor Python (recomendado, sin instalación extra)

```bash
cd /ruta/a/app_v1.5
python3 -m http.server 8080
```

Luego abrir `http://localhost:8080` en el navegador.

**Limitación:** el endpoint `api/enviar_mail.php` no funcionará (requiere PHP). Todo lo demás (cálculos, informes Word, gráficos, KaTeX) funciona correctamente.

### Opción B: Servidor PHP built-in

```bash
cd /ruta/a/app_v1.5
composer install          # instalar PHPMailer
php -S localhost:8080
```

Para que el endpoint de mail funcione, también hay que configurar las variables de entorno antes de lanzar el servidor:

```bash
export SMTP_HOST=smtp.email.us-phoenix-1.oci.oraclecloud.com
export SMTP_PORT=587
export SMTP_USUARIO=ocid1.user...
export SMTP_PASSWORD=tu_password
export MAIL_FROM=noreply@higseg.ar
php -S localhost:8080
```

### Agregar una nueva página

1. Crear el archivo HTML en el directorio de la herramienta correspondiente (`ilum/` o `atenua/`).
2. Copiar la estructura base de una página existente del mismo tipo.
3. Agregar un link en el `<nav>` de **todas** las páginas de esa herramienta.
4. Crear el archivo CSS en `herramienta/estilos/stylesN.css`.
5. Crear el archivo JS en `herramienta/scripts/`.
6. Actualizar `README.md` con el cambio.
7. Hacer commit:
   ```bash
   git add -A
   git commit -m "feat: agregar página nuevapagina a ilum"
   ```

---

## 17. Despliegue en producción

### Servidor actual

- **Proveedor:** Oracle Cloud Infrastructure (OCI) — instancia ARM gratuita
- **OS:** Ubuntu/Debian
- **Web server:** Nginx
- **PHP:** vía PHP-FPM
- **Dominio:** higseg.ar

### Proceso de deploy (sin CI/CD)

```bash
# En el servidor de producción (via SSH)
cd /var/www/html

# Traer los últimos cambios
git pull origin main

# Reinstalar dependencias PHP si cambiaron
composer install --no-dev --optimize-autoloader
```

### Variables de entorno en producción (Nginx + PHP-FPM)

Agregar en `/etc/php/8.x/fpm/pool.d/www.conf`:

```ini
env[SMTP_HOST]     = smtp.email.us-phoenix-1.oci.oraclecloud.com
env[SMTP_PORT]     = 587
env[SMTP_USUARIO]  = ocid1.user...
env[SMTP_PASSWORD] = tu_password_aqui
env[MAIL_FROM]     = noreply@higseg.ar
```

Luego reiniciar PHP-FPM:

```bash
sudo systemctl restart php8.x-fpm
```

---

## 18. Reglas para LLMs

Esta sección es una guía explícita para modelos de lenguaje que trabajen en este repositorio.

### Entender el proyecto antes de modificar

- Este es un proyecto **HTML + CSS + JS vanilla sin framework ni bundler**. No hay npm, webpack, Babel, ni TypeScript. Los archivos se usan directamente como están.
- Hay **dos herramientas independientes**: `ilum/` y `atenua/`. Cada una tiene sus propios estilos, scripts y plantillas. Los cambios en una no afectan a la otra (excepto los archivos globales en `estilos/`, `scripts/` e `img/`).
- El **único back-end** es `api/enviar_mail.php`. Todo lo demás es front-end estático.

### Reglas de CSS

1. **No escribir colores hardcodeados**. Siempre usar variables CSS de `colores.css`. Si el color que necesitás no existe como variable, agregarlo a `colores.css` primero.
2. **No escribir bloques `<style>` inline** en los HTML. Todo CSS va en archivos `.css` externos.
3. **Los `font-weight` deben ser numéricos**: `400`, `500`, `600`, `700`. Nunca `SemiBold`, `Medium`, `Bold`.
4. Si el cambio visual aplica a **todas** las páginas → editar `general.css`. Si aplica a **una herramienta** → editar el CSS local de esa herramienta. Si aplica a **una sola página** → editar el `stylesN.css` de esa página.
5. Los colores de índice de protección auditiva deben usarse mediante las clases `.indice-sobreprotegido`, `.indice-buena`, `.indice-aceptable`, `.indice-insuficiente`. **No** usar `style.backgroundColor` en JS.

### Reglas de HTML

1. **Cada página tiene exactamente un `<main>`**. Nunca anidar dos `<main>`.
2. **Los IDs son únicos** en el documento. Si un `<tr>` y un `<input>` dentro de él necesitan IDs, deben ser distintos. Convención: el `<tr>` usa `id="fila-nombre"`, el `<input>` usa `id="nombre"`.
3. **No usar etiquetas inventadas** como `<p1>`, `<p2>`. Solo etiquetas HTML5 estándar.
4. **No usar atributos obsoletos** en línea (`fontsize`, `width` en `<td>`, etc.). Usar CSS.
5. **Todos los `<p>` deben cerrarse** con `</p>`. En particular los que contienen el índice de protección auditiva.
6. **Los títulos de página deben ser descriptivos**: `Herramienta — Sección`, por ejemplo `Atenuación — Método SNR`.

### Reglas de JavaScript

1. **No hardcodear colores** en JS. Usar `classList.add/remove` con las clases CSS definidas.
2. **Los event listeners de modales** van en `DOMContentLoaded`, no como `onclick` inline en el botón que abre el modal.
3. **Las funciones llamadas desde `onclick` en el HTML** (como `calcular()`, `borrarTodo()`) deben definirse en el scope global del módulo, no dentro de `DOMContentLoaded`.
4. **El estado visual que se persiste en `sessionStorage`** debe guardarse como clase CSS (`indice-proteccionClase`) y restaurarse con `element.className = storedClase`. No guardar ni restaurar colores inline.
5. **Usar los prefijos de sessionStorage** de cada herramienta: `bo_` para Bandas de Octava, `hml_` para HML, `snr_` para SNR, sin prefijo para iluminación.
6. Al hacer `querySelectorAll` para limpiar inputs en una función "borrar", **acotar el selector al contenedor de la herramienta** para no afectar elementos externos (como inputs del footer o modales).

### Reglas de seguridad

1. **Nunca escribir credenciales, contraseñas, tokens ni API keys** en ningún archivo del repositorio. Todo dato sensible va en variables de entorno del servidor.
2. **No crear archivos de debug** (`test.php`, `phpinfo.php`, `debug.php`) en el repositorio. Si se necesitan temporalmente, agregarlos a `.gitignore` primero.
3. No modificar el rate limiting de `enviar_mail.php` para hacerlo más permisivo sin una razón justificada.

### Reglas de Git

1. **Hacer commits atómicos**: un commit por cambio lógico. No mezclar 10 cosas en un solo commit.
2. **Usar Conventional Commits**: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`, `security:`.
3. **Nunca commitear** `vendor/`, `.env`, ni archivos de respaldo (`*.bak`, `*- copia*`).
4. Antes de hacer un commit significativo, actualizar `README.md` con la entrada del historial de versiones.

### Cómo agregar una nueva herramienta

1. Crear un directorio nuevo al mismo nivel que `ilum/` y `atenua/`.
2. Seguir la estructura de `atenua/` o `ilum/` como modelo.
3. El directorio debe tener: `index.html`, páginas funcionales, `estilos/`, `scripts/`, `plantillas/` (si genera informes).
4. Agregar un `<style>` al índice global (`index.html`) con una nueva tarjeta en `.contenedor-enlaces`.
5. Agregar el link en `footer.js` si corresponde.
6. Documentar en `README.md` y en este archivo.

### Cómo NO trabajar en este proyecto

- ❌ No instalar frameworks JS (React, Vue, Angular, Svelte, etc.).
- ❌ No introducir un bundler (webpack, Vite, Parcel, etc.) sin discutirlo antes.
- ❌ No convertir el proyecto a TypeScript sin consenso.
- ❌ No agregar dependencias de npm sin una razón muy justificada.
- ❌ No reescribir una herramienta completa para "mejorarla" sin que el usuario lo solicite explícitamente.
- ❌ No modificar `lib/` (las librerías de terceros copiadas localmente) salvo para actualizarlas.
- ❌ No cambiar la convención de `sessionStorage` sin actualizar todos los scripts que la usan.

---

*Documentación generada para VISP Herramientas v1.5.0 — Última actualización: 2026*