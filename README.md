<h1 align="center"> CALCULADORAS PARA HIGIENE</h1>
<p align="left">
   <img src="https://img.shields.io/badge/STATUS-EN DESARROLLO-blue">
   <img src="https://img.shields.io/badge/VERSI%C3%93N-1.5.0-blue">
</p>

# Objetivo
  Desarrollar diferentes calculadoras para usarlas en determinaciones de higiene en el ambiente laboral bajo normativa argentina.

# Descripción del Proyecto
  Esta aplicación utiliza HTML, CSS y JavaScript con un diseño intuitivo y responsivo. Permite realizar cálculos higiénicos, visualizar resultados y generar informes en formato Word (.docx) con plantilla predeterminada o personalizada por el usuario.

# Herramientas disponibles
- **Medición de Iluminación** — Cálculo de Emedio, uniformidad y cumplimiento según legislación vigente
- **Atenuación de Protectores Auditivos** — Métodos SNR, HML y Bandas de Octava

# Desarrollador
  Ingeniero Jorge Mendoza  
  I.S.P. N° 65 Amelia Díaz — San Vicente, Prov. Santa Fe

---

# Historial de versiones

## v1.5.0 - 2026
- Reemplazada imagen estática de fórmulas en Puntos de medición por renderizado dinámico con **KaTeX**
- Corregidas etiquetas HTML inválidas `<p1>` / `<p2>` por `<span>` en Puntos de medición
- Eliminado archivo `test.php` (exponía información sensible del servidor en producción)
- Eliminados archivos CSS de respaldo huérfanos (`styles2 - copia.css`, `styles2 - copia (2).css`)
- **Seguridad**: credenciales SMTP movidas a variables de entorno del servidor (ya no hardcodeadas en el código)
- **Seguridad**: agregado rate limiting básico por IP en `enviar_mail.php` (máx. 5 envíos cada 10 minutos)
- Corregido `<main>` duplicado (HTML inválido) en `bandasoctava.html`, `hml.html` y `snr.html`
- Corregido ID duplicado `dbC_snr` en `snr.html` (el `<tr>` ahora usa `id="fila-dbC-snr"`)
- Corregidos IDs duplicados `dbA` / `dbC` en `hml.html` (los `<tr>` ahora usan `id="fila-dbA"` / `id="fila-dbC"`)
- Eliminado bloque `<style>` inline en `snr.html` que duplicaba y sobreescribía reglas de `general.css`
- Títulos de página diferenciados: `Atenuación — Método SNR`, `Atenuación — Método HML`, `Atenuación — Bandas de Octava`
- Reemplazados colores hardcodeados en JS (`"orange"`, `"lightgreen"`, etc.) por clases CSS semánticas (`indice-sobreprotegido`, `indice-buena`, `indice-aceptable`, `indice-insuficiente`)
- El estado del índice de protección ahora se persiste en `sessionStorage` mediante la clase CSS en lugar del color inline
- Corregida tipografía CSS: `font-weight: SemiBold` / `Medium` reemplazados por valores numéricos válidos
- Conectado botón **Mail** en Mediciones (el `onclick` estaba vacío)
- Unificada indentación y formato en `general.css` y `styles1.css` de iluminación

## v1.3.0 - 2026
- Agregado botón **Compartir por WhatsApp** en Medición de Iluminación: permite enviar el resultado directamente desde el celular al finalizar el cálculo
- Agregado link de descarga **Referencia de marcadores** en el modal de generación de informe: guía completa de marcadores disponibles para plantillas personalizadas, incluyendo valores calculados intermedios
- El botón de compartir se muestra automáticamente al calcular y se oculta al borrar los datos
- Agregados campos **Lugar de medición** y **Operador** en Mediciones: se incorporan al informe descargable
- Corregido formato de hora en informe: ahora usa formato 24h (`21:58` en lugar de `09:58 p. m.`)
- Mejoras visuales en layout desktop y móvil: corregidas superposiciones entre inputs y tabla, y separación correcta respecto al footer


## v1.2.0 - 2025
- Generación de informes Word con plantilla predeterminada o plantilla personalizada subida por el usuario
- Soporte para placeholders de valores calculados intermedios en plantillas personalizadas
- Persistencia de datos con sessionStorage para evitar pérdida de datos al navegar entre páginas

## v1.1.0 - 2025
- Incorporación de herramienta de Atenuación de Protectores Auditivos (métodos SNR, HML y Bandas de Octava)

## v1.0.0 - 2025
- Versión inicial: herramienta de Medición de Iluminación