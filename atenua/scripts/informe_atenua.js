// ================================================================
// informe_atenua.js — VISP Herramientas (v1.5.3)
// Desarrollado por Jorge Mendoza
// Modal Mail + WhatsApp para /atenua (Bandas de Octava, HML, SNR)
// ================================================================

function mostrarEstadoAtenua() {
    const el = document.getElementById('estado-envio-atenua');
    if (el) el.style.display = 'block';
    document.body.style.cursor = 'wait';
}

function ocultarEstadoAtenua() {
    const el = document.getElementById('estado-envio-atenua');
    if (el) el.style.display = 'none';
    document.body.style.cursor = 'default';
}

function compartirWhatsAppAtenua() {
    const path = window.location.pathname;
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-AR');
    const hora  = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    // 1. Identificar IDs según la página
    let idLugar, idProtector;
    if (path.includes('bandasoctava')) {
        idLugar = "lugar-ruido";
        idProtector = "nombre-protector";
    } else {
        idLugar = "ruido";
        idProtector = "protector-auditivo";
    }

    const lugar = document.getElementById(idLugar)?.value.trim();
    const protector = document.getElementById(idProtector)?.value.trim();

    // 2. Validaciones de campos (Modelo Claudio)
    if (!lugar || !protector) {
        alert("Complete el Lugar y el Protector para enviar por WhatsApp.");
        if (!lugar) document.getElementById(idLugar).focus();
        else document.getElementById(idProtector).focus();
        return;
    }

    let titulo = '';
    let datosTecnicos = '';
    let indiceFinal = '';

    // 3. Captura de datos por método
    if (path.includes('bandasoctava')) {
        const leqM = document.querySelector('#filaRuidoMedido .leq-resultado input')?.value || '—';
        const leqA = document.querySelector('#filaRuidoAtenuado .leq-resultado input')?.value || '—';
        indiceFinal = document.getElementById('indice-proteccionBo')?.textContent.trim() || '—';
        titulo = "ATENUACION - BANDAS DE OCTAVA";
        datosTecnicos = "LeqA medido: " + leqM + " dB\nLeqA en el oido: " + leqA + " dB";
    } else if (path.includes('hml')) {
        const leqAo = document.querySelector('#filaRuidoAtenuadoHML .leq-resultado input')?.value || '—';
        indiceFinal = document.getElementById('indice-proteccionHML')?.textContent.trim() || '—';
        titulo = "ATENUACION - METODO HML";
        datosTecnicos = "LeqA en el oido: " + leqAo + " dB";
    } else {
        const leqAo = document.querySelector('#filaRuidoAtenuadoSNR .leq-resultado input')?.value || '—';
        indiceFinal = document.getElementById('indice-proteccionSNR')?.textContent.trim() || '—';
        titulo = "ATENUACION - METODO SNR";
        datosTecnicos = "LeqA en el oido: " + leqAo + " dB";
    }

    // 4. Construcción del mensaje (TEXTO PURO para evitar el error '')
    // Usamos asteriscos para negritas y guiones para separar.
    const mensaje = 
        "*" + titulo + "*\n" +
        "--------------------------------\n\n" +
        "Fecha: " + fecha + "\n" +
        "Hora: " + hora + "\n" +
        "Lugar: " + lugar + "\n" +
        "Protector: " + protector + "\n\n" +
        datosTecnicos + "\n" +
        "Indice de proteccion: *" + indiceFinal + "*\n\n" +
        "Calculado con VISP Herramientas\nhigseg.ar";

    // 5. Envío con codificación URI estándar
    const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}

function inicializarModalMailAtenua() {
    const modalMail = document.getElementById('modalMailAtenua');
    const botonMailAtenua = document.getElementById('boton-mail-atenua');
    const botonEnviar = document.getElementById('boton-enviarModalMailAtenua');
    const radioSubir = document.querySelector('input[name="plantillaMailAtenuaSeleccion"][value="subir"]');
    const uploadInput = document.getElementById('plantillaMailAtenuaUpload');

    if (!modalMail) return;

    if (botonMailAtenua) {
        botonMailAtenua.onclick = () => {
            if (!navigator.onLine) {
                alert('⚠️ Sin conexión — El mail requiere internet.');
                return;
            }
            modalMail.style.display = 'block';
        };
    }

    const cerrar = () => { modalMail.style.display = 'none'; };
    document.getElementById('cerrarModalMailAtenua')?.addEventListener('click', cerrar);
    document.getElementById('boton-cancelarModalMailAtenua')?.addEventListener('click', cerrar);
    window.addEventListener('click', (e) => { if (e.target === modalMail) cerrar(); });

    if (radioSubir) {
        radioSubir.addEventListener('change', function () {
            if (uploadInput) uploadInput.style.display = this.checked ? 'block' : 'none';
        });
    }

    if (botonEnviar) botonEnviar.onclick = enviarMailAtenua;
}

function obtenerValoresMailAtenua() {
    const path  = window.location.pathname;
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora  = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

    let valores = { fecha, hora, metodo: '', pa: '', lugar: '', indice: '', leqAo: '', extra: '', cuerpo: '' };

    if (path.includes('bandasoctava')) {
        valores.metodo = 'Bandas de Octava';
        valores.pa     = document.getElementById('nombre-protector')?.value.trim() || '';
        valores.lugar  = document.getElementById('lugar-ruido')?.value.trim() || '';
        valores.leqAo  = document.querySelector('#filaRuidoAtenuado .leq-resultado input')?.value || '';
        valores.indice = document.getElementById('indice-proteccionBo')?.textContent.trim() || '';
        valores.extra  = `LeqA medido: ${document.querySelector('#filaRuidoMedido .leq-resultado input')?.value || '—'} dB`;
    } else if (path.includes('hml')) {
        valores.metodo = 'HML';
        valores.pa     = document.getElementById('protector-auditivo')?.value.trim() || '';
        valores.lugar  = document.getElementById('ruido')?.value.trim() || '';
        valores.leqAo  = document.querySelector('#filaRuidoAtenuadoHML .leq-resultado input')?.value || '';
        valores.indice = document.getElementById('indice-proteccionHML')?.textContent.trim() || '';
        valores.extra  = `H: ${sessionStorage.getItem('hml_H') || '—'} / M: ${sessionStorage.getItem('hml_M') || '—'} / L: ${sessionStorage.getItem('hml_L') || '—'} dB`;
    } else if (path.includes('snr')) {
        valores.metodo = 'SNR';
        valores.pa     = document.getElementById('protector-auditivo')?.value.trim() || '';
        valores.lugar  = document.getElementById('ruido')?.value.trim() || '';
        valores.leqAo  = document.querySelector('#filaRuidoAtenuadoSNR .leq-resultado input')?.value || '';
        valores.indice = document.getElementById('indice-proteccionSNR')?.textContent.trim() || '';
        valores.extra  = `SNR: ${sessionStorage.getItem('snr_SNR') || '—'} dB`;
    }

    valores.cuerpo = `RESULTADO ATENUACIÓN AUDITIVA — MÉTODO ${valores.metodo.toUpperCase()}\n` +
                     `=======================================\n\n` +
                     `Fecha: ${valores.fecha}   Hora: ${valores.hora}\n` +
                     `Protector: ${valores.pa}\n` +
                     `Lugar/Sector: ${valores.lugar}\n\n` +
                     `${valores.extra}\n` +
                     `LeqA en el oído: ${valores.leqAo} dB\n\n` +
                     `Índice de protección: ${valores.indice}\n\n` +
                     `---\nEnviado desde VISP Herramientas — higseg.ar`;

    return valores;
}

function obtenerPlantillaMailAtenua() {
    const path = window.location.pathname;
    const seleccion = document.querySelector('input[name="plantillaMailAtenuaSeleccion"]:checked')?.value;
    if (seleccion === 'subir') {
        const file = document.getElementById('plantillaMailAtenuaUpload')?.files[0];
        return file ? file.arrayBuffer() : null;
    }
    let pPath = './plantillas/informe_bandasOctava.docx';
    if (path.includes('hml')) pPath = './plantillas/Informe_atenuaHLM.docx';
    if (path.includes('snr')) pPath = './plantillas/Informe_atenuaSNR.docx';
    return fetch(pPath).then(res => res.arrayBuffer());
}

async function enviarMailAtenua() {
    const email = document.getElementById('mailDestinatarioAtenua')?.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Email inválido.'); return; }

    const pPromise = obtenerPlantillaMailAtenua();
    if (!pPromise) { alert('Subí una plantilla.'); return; }

    document.getElementById('modalMailAtenua').style.display = 'none';
    mostrarEstadoAtenua();

    try {
        const pData = await pPromise;
        const zip = new JSZip(pData);
        const doc = new window.docxtemplater().loadZip(zip);
        const v = obtenerValoresMailAtenua();

        doc.setData({
            pa: v.pa, sph: v.lugar, leqAo: v.leqAo, indice: v.indice,
            H: sessionStorage.getItem('hml_H') || '', M: sessionStorage.getItem('hml_M') || '', L: sessionStorage.getItem('hml_L') || '',
            leqA: sessionStorage.getItem('hml_dbA') || '', leqC: sessionStorage.getItem('hml_dbC') || sessionStorage.getItem('snr_dbC') || '',
            SNR: sessionStorage.getItem('snr_SNR') || '',
            leqA_medido: document.querySelector('#filaRuidoMedido .leq-resultado input')?.value || ''
        });
        doc.render();

        const docxBase64 = doc.getZip().generate({ type: 'base64' });
        const nombreDoc = `Informe_Atenuacion_${v.metodo.replace(/ /g, '_')}_${v.lugar || 'VISP'}.docx`;

        const resp = await fetch('/api/enviar_mail.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destinatario: email,
                lugar: v.lugar,
                operador: v.pa,
                asunto: `Atenuación Auditiva (${v.metodo}) — ${v.lugar || 'VISP'}`,
                cuerpo: v.cuerpo,
                docx: docxBase64,
                nombreDocx: nombreDoc,
                website: ''
            })
        });

        const res = await resp.json();
        ocultarEstadoAtenua();
        alert(res.ok ? '✅ Mail enviado!' : '❌ Error al enviar.');
    } catch (e) {
        ocultarEstadoAtenua();
        alert('❌ Error en el proceso.');
    }
}

document.addEventListener('DOMContentLoaded', inicializarModalMailAtenua);