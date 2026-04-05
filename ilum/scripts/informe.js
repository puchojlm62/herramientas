// ================================================================
// informe.js — VISP Herramientas (v1.5.2)
// Desarrollado por Jorge Mendoza
// Adaptado para enviar_mail.php Universal
// ================================================================

function inicializarModalInforme() {
    const modalPlantilla = document.getElementById('modalPlantilla');
    const botonInformeBo = document.getElementById('boton-informeBo');
    const botonGenerarInformeModal = document.getElementById('boton-generarInformeModal');
    const botonCancelarInformeModal = document.getElementById('boton-cancelarInformeModal');
    const spanCerrarModalPlantilla = document.getElementById('cerrarModalPlantilla');
    const radioSubirPlantillaModal = document.querySelector('input[name="plantillaModalSeleccion"][value="subir"]');
    const plantillaModalUploadInput = document.getElementById('plantillaModalUpload');

    if (!modalPlantilla) return;

    if (botonInformeBo) {
        botonInformeBo.onclick = function() {
            if (typeof validarCamposInforme === "function" && !validarCamposInforme()) return;
            modalPlantilla.style.display = "block";
        };
    }

    const cerrar = () => { modalPlantilla.style.display = "none"; };
    if (spanCerrarModalPlantilla) spanCerrarModalPlantilla.onclick = cerrar;
    if (botonCancelarInformeModal) botonCancelarInformeModal.onclick = cerrar;
    
    window.addEventListener('click', (event) => {
        if (event.target == modalPlantilla) cerrar();
    });

    if (radioSubirPlantillaModal) {
        radioSubirPlantillaModal.addEventListener('change', function() {
            plantillaModalUploadInput.style.display = this.checked ? 'block' : 'none';
        });
    }

    if (botonGenerarInformeModal) {
        botonGenerarInformeModal.onclick = function() {
            cerrar();
            generarInformeDesdeModal();
        };
    }
}

function generarInformeDesdeModal() {
    const seleccion = document.querySelector('input[name="plantillaModalSeleccion"]:checked');
    if (!seleccion) return;

    const plantillaSeleccionada = seleccion.value;
    let plantillaPromise;

    if (plantillaSeleccionada === 'default') {
        plantillaPromise = fetch("./plantillas/Informe_TomaMedicionesIluminacion.docx")
            .then(response => {
                if (!response.ok) throw new Error("No se encontró la plantilla.");
                return response.arrayBuffer();
            });
    } else {
        const fileInput = document.getElementById('plantillaModalUpload');
        const archivo = fileInput.files[0];
        if (!archivo) { alert("Seleccioná un archivo .docx"); return; }
        plantillaPromise = archivo.arrayBuffer();
    }

    plantillaPromise.then(data => {
        const zip = new JSZip(data);
        const doc = new window.docxtemplater().loadZip(zip);
        const valores = obtenerValoresInforme();
        
        doc.setData(valores);
        doc.render();

        const out = doc.getZip().generate({ type: "blob" });
        const nombreArchivo = `Informe_Iluminacion_${valores.lugar || 'VISP'}.docx`;
        saveAs(out, nombreArchivo);
    }).catch(err => { console.error(err); alert("Error al procesar el Word."); });
}

function inicializarModalMail() {
    const modalMail = document.getElementById('modalMail');
    const botonMailSeccion = document.getElementById('boton-mail-seccion');
    const spanCerrarModalMail = document.getElementById('cerrarModalMail');
    const botonCancelarModalMail = document.getElementById('boton-cancelarModalMail');
    const botonEnviarModalMail = document.getElementById('boton-enviarModalMail');
    const radioSubirPlantillaMailModal = document.querySelector('input[name="plantillaMailSeleccion"][value="subir"]');
    const plantillaMailUploadInput = document.getElementById('plantillaMailUpload');

    if (!modalMail) return;

    if (botonMailSeccion) {
        botonMailSeccion.onclick = function() {
            if (!navigator.onLine) {
                alert("⚠️ Sin conexión — El mail requiere internet.");
                return;
            }
            if (typeof validarCamposInforme === "function" && !validarCamposInforme()) return;
            modalMail.style.display = "block";
        };
    }

    const cerrarMail = () => { modalMail.style.display = "none"; };
    if (spanCerrarModalMail) spanCerrarModalMail.onclick = cerrarMail;
    if (botonCancelarModalMail) botonCancelarModalMail.onclick = cerrarMail;

    if (radioSubirPlantillaMailModal) {
        radioSubirPlantillaMailModal.addEventListener('change', function() {
            plantillaMailUploadInput.style.display = this.checked ? 'block' : 'none';
        });
    }

    if (botonEnviarModalMail) {
        botonEnviarModalMail.onclick = enviarMail;
    }
}

async function enviarMail() {
    const emailInput = document.getElementById('mailDestinatario');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Ingresá un correo válido.");
        return;
    }

    const seleccion = document.querySelector('input[name="plantillaMailSeleccion"]:checked');
    if (!seleccion) return;
    const plantillaSeleccionada = seleccion.value;
    let plantillaPromise;

    if (plantillaSeleccionada === 'default') {
        plantillaPromise = fetch("./plantillas/Informe_TomaMedicionesIluminacion.docx").then(res => res.arrayBuffer());
    } else {
        const file = document.getElementById('plantillaMailUpload').files[0];
        if (!file) { alert("Subí una plantilla."); return; }
        plantillaPromise = file.arrayBuffer();
    }

    document.getElementById('modalMail').style.display = "none";
    mostrarEstado();

    try {
        const data = await plantillaPromise;
        const zip = new JSZip(data);
        const doc = new window.docxtemplater().loadZip(zip);
        const v = obtenerValoresInforme();
        doc.setData(v);
        doc.render();

        const docxBase64 = doc.getZip().generate({ type: "base64" });

        // Fotos
        let fotoCroquisBase64 = null;
        let fotoLocalBase64 = null;
        if (typeof fotoCroquis !== 'undefined' && fotoCroquis) fotoCroquisBase64 = await fileToBase64(fotoCroquis);
        if (typeof fotoLocal !== 'undefined' && fotoLocal) fotoLocalBase64 = await fileToBase64(fotoLocal);

        // Armamos el cuerpo del mail aquí para el PHP
        const cuerpoMail = 
            `RESULTADO MEDICION DE ILUMINACIÓN\n` +
            `================================\n\n` +
            `Fecha: ${v.fecha}   Hora: ${v.hora}\n` +
            `Lugar: ${v.lugar}\n` +
            `Operador: ${v.operador}\n\n` +
            `Nivel requerido: ${v.requerido} lux\n` +
            `Emedio: ${v.emedio} lux\n` +
            `Eminimo: ${v.minimo} lux\n\n` +
            `Iluminacion general: ${v.ilumGeneral}\n` +
            `Uniformidad: ${v.uniformidad}\n\n` +
            `---\nEnviado desde VISP Herramientas — higseg.ar`;

        const response = await fetch('/api/enviar_mail.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destinatario: email,
                lugar: v.lugar,
                asunto: `Medición de Iluminación — ${v.lugar || 'VISP'}`,
                cuerpo: cuerpoMail,
                docx: docxBase64,
                nombreDocx: `Informe_Iluminacion_${v.lugar || 'VISP'}.docx`,
                fotoCroquis: fotoCroquisBase64,
                fotoLocal: fotoLocalBase64,
                website: "" // Honeypot
            })
        });

        const resultado = await response.json();
        ocultarEstado();

        if (resultado.ok) {
            alert("✅ Mail enviado con éxito!");
        } else {
            alert("❌ Error al enviar el mail.");
        }

    } catch (error) {
        ocultarEstado();
        alert("❌ Error al generar el informe.");
    }
}

function obtenerValoresInforme() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-AR", {day:"2-digit", month:"2-digit", year:"numeric"});
    const hora  = ahora.toLocaleTimeString("es-AR", {hour:"2-digit", minute:"2-digit", hour12:false});

    const valores = {
        lugar:       document.getElementById("lugar")?.value.trim() || "",
        operador:    document.getElementById("operador")?.value.trim() || "",
        fecha,
        hora,
        emedio:      document.getElementById("emedio")?.textContent || "",
        minimo:      document.getElementById("minimo")?.textContent || "",
        ilumGeneral: document.getElementById("ilum-general")?.textContent || "",
        uniformidad: document.getElementById("uniformidad")?.textContent || "",
        requerido:   document.getElementById("nivel-iluminacion-requerido")?.value || ""
    };

    for (let i = 1; i <= 40; i++) {
        const celda = document.getElementById(`m${i}`);
        let valorCelda = celda ? celda.textContent.trim() : "";
        if (valorCelda !== "" && !isNaN(valorCelda)) {
            valores[`m${i}`] = Math.round(parseFloat(valorCelda));
        } else {
            valores[`m${i}`] = valorCelda;
        }
    }
    return valores;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function mostrarEstado() {
    const el = document.getElementById("estado-envio");
    if (el) el.style.display = "block";
    document.body.style.cursor = "wait";
}

function ocultarEstado() {
    const el = document.getElementById("estado-envio");
    if (el) el.style.display = "none";
    document.body.style.cursor = "default";
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarModalInforme();
    inicializarModalMail();
});