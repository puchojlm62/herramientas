// =============================================================
// /scripts/footer.js
// Footer y modal "Acerca de" centralizados para VISP Herramientas
// Incluir en todas las páginas con:
//   <script src="/scripts/footer.js"></script>
// =============================================================

(function () {

  // ── HTML del footer ──────────────────────────────────────────
  const footerHTML = `
    <footer>
      <div class="footer-container">
        <div class="footer-column footer-left">
          <a href="https://isp65-sfe.infd.edu.ar/sitio/" target="_blank">
            <img src="/img/logoISP65.webp" class="logo" alt="Logo ISP 65">
          </a>
        </div>
        <div class="footer-column footer-center">
          <p>© 2026 VISP Herramientas | <a href="#" id="openModal">Acerca de</a></p>
          <p class="footer-legal">Uso libre. Los resultados son orientativos y no implican responsabilidad del desarrollador.</p>
        </div>
        <div class="footer-column footer-right">
          <p>I.S.P. N° 65 Amelia Díaz</p>
          <p>San Vicente, Prov. Santa Fe</p>
          <div class="social-icons">
            <a href="https://api.whatsapp.com/send?phone=543492676823" target="_blank">
              <img src="/img/wa.webp" alt="WhatsApp">
            </a>
            <a href="https://www.instagram.com/isp65sanvicente?igsh=MTJhbjB4ZnZxbW1qZA==" target="_blank">
              <img src="/img/instagram.webp" alt="Instagram">
            </a>
          </div>
        </div>
      </div>
    </footer>`;

  // ── HTML del modal "Acerca de" ────────────────────────────────
  const modalHTML = `
    <div id="modalAcerca" class="modal">
      <div class="modal-content modal-acerca-content">
        <span class="close" id="cerrarModalAcerca">×</span>

        <h2>Acerca de VISP Herramientas</h2>
        <p class="text__modal">
          Aplicación web de código abierto para cálculos de higiene y seguridad laboral
          bajo normativa argentina.
          Desarrollado por <strong>Ing. Jorge Mendoza</strong> — Versión 1.5 · 2026.
          <a href="/LICENSE.html" target="_blank">Licencia MIT.</a>
        </p>

        <hr class="modal-separador">

        <h3 class="modal-subtitulo">⚖️ Aviso Legal</h3>
        <p class="text__modal">
          VISP Herramientas es una aplicación de uso libre desarrollada con fines educativos
          y de apoyo profesional. Los resultados obtenidos son <strong>orientativos</strong>;
          su interpretación, aplicación y las decisiones que de ellos se deriven son
          responsabilidad exclusiva del usuario.
        </p>
        <p class="text__modal">
          El desarrollador no asume responsabilidad alguna por el uso de los resultados
          ni por errores derivados de datos incorrectamente ingresados.
          Desarrollado bajo licencia MIT — uso libre sin garantías.
        </p>

        <hr class="modal-separador">

        <h3 class="modal-subtitulo">🔒 Privacidad y envío de correos</h3>
        <p class="text__modal">
          Cuando utilizás la función de envío de informe por correo electrónico, el mensaje
          se procesa a través del servicio <strong>OCI Email Delivery de Oracle Cloud</strong>
          y se entrega a la dirección que el usuario ingrese en el momento del envío.
        </p>
        <p class="text__modal">
          <strong>El desarrollador no tiene acceso a los correos enviados, ni a su contenido,
          ni a las direcciones ingresadas.</strong> No se almacena ningún dato personal
          derivado del uso de esta función.
        </p>

        <hr class="modal-separador">

        <h3 class="modal-subtitulo">❓ Ayuda rápida</h3>
        <p class="text__modal">La aplicación está pensada para profesionales y estudiantes que ya conocen la normativa. Cada herramienta sigue el flujo de la medición real:</p>
        <ul class="modal-lista">
          <li>
            <strong>Iluminación</strong> — ingresá los puntos de medición; la aplicación
            calcula E<sub>medio</sub>, uniformidad y cumplimiento.
            Podés adjuntar hasta 2 fotos a elección y enviar el informe por correo.
          </li>
          <li>
            <strong>Atenuación de protectores auditivos</strong> — ingresá el espectro de ruido o (dBC/dBA) y datos del protector según IRAM 4126 / EN 352.
	          La aplicación calcula la atenuación por 3 métodos: Bandas de octava, HML o SNR.
          </li>
        </ul>
        <p class="text__modal" style="font-size:0.85rem; color:#666;">
          Los campos con fondo claro son editables.
        </p>

      </div>
    </div>`;

  // ── Inyectar footer antes de </body> ─────────────────────────
  document.body.insertAdjacentHTML('beforeend', footerHTML);
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // ── Lógica del modal ─────────────────────────────────────────
  function initModal() {
    const modal     = document.getElementById('modalAcerca');
    const btnAbrir  = document.getElementById('openModal');
    const btnCerrar = document.getElementById('cerrarModalAcerca');

    if (!modal || !btnAbrir) return;

    btnAbrir.addEventListener('click', function (e) {
      e.preventDefault();
      modal.style.display = 'block';
    });

    btnCerrar.addEventListener('click', function () {
      modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModal);
  } else {
    initModal();
  }

})();