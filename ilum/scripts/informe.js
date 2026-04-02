// ================================================================
// informe.js — VISP Herramientas
// ================================================================

// ================================================================
// 1. MODAL GENERAR INFORME (descarga Word)
// ================================================================

function informeResultado() {
    const modalPlantilla = document.getElementById('modalPlantilla');
    const botonGenerarInformeModal = document.getElementById('boton-generarInformeModal');
    const botonCancelarInformeModal = document.getElementById('boton-cancelarInformeModal');

    window.abrirModalPlantilla = function() {
        modalPlantilla.style.display = "block";
    }

    function cerrarModal() {
        modalPlantilla.style.display = "none";
    }

    botonCancelarInformeModal.onclick = function() {
        cerrarModal();
    }

    botonGenerarInformeModal.onclick = function() {
        cerrarModal();
        generarInformeDesdeModal();
    };
}

function generarInformeDesdeModal() {
    const plantillaSeleccionada = document.querySelector('input[name="plantillaModalSeleccion"]:checked').value;
    let plantillaPromise;

    if (plantillaSeleccionada === 'default') {
        plantillaPromise = fetch("./plantillas/Informe_TomaMedicionesIluminacion.docx")
            .then(response => {
                if (!response.ok) throw new Error(`Error al cargar la plantilla: ${response.status} ${response.statusText}`);
                return response.arrayBuffer();
            });
    } else if (plantillaSeleccionada === 'subir') {
        const plantillaUploadInput = document.getElementById('plantillaModalUpload');
        const archivoPlantilla = plantillaUploadInput.files[0];
        if (!archivoPlantilla) {
            alert("Por favor, seleccioná un archivo de plantilla.");
            return;
        }
        plantillaPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(`Error al leer el archivo: ${e}`);
            reader.readAsArrayBuffer(archivoPlantilla);
        });
    } else {
        alert("Opción de plantilla no válida.");
        return;
    }

    plantillaPromise.then(data => {
        let zip;
        try {
            zip = new JSZip(data);
        } catch (error) {
            console.error("Error al cargar el ZIP:", error);
            alert("Error al procesar la plantilla Word.");
            return;
        }

        let doc = new window.docxtemplater().loadZip(zip);
        const valores = obtenerValoresInforme();
        doc.setData(valores);

        try {
            doc.render();
            const lugar = valores.lugar || "Informe";
            let out = doc.getZip().generate({ type: "blob" });
            saveAs(out, `Informe_Iluminacion_${lugar}.docx`);
        } catch (error) {
            console.error("Error generando el documento:", error);
            alert("Hubo un error al generar el informe.");
        }
    }).catch(error => {
        console.error("Error cargando la plantilla:", error);
        alert("No se pudo cargar la plantilla del informe.");
    });
}

// Event listeners para el Modal de informe Word
document.addEventListener('DOMContentLoaded', () => {
    const modalPlantilla = document.getElementById('modalPlantilla');
    const botonInformeBo = document.getElementById('boton-informeBo');
    const spanCerrarModalPlantilla = document.getElementById('cerrarModalPlantilla');
    const botonGenerarInformeModal = document.getElementById('boton-generarInformeModal');
    const botonCancelarInformeModal = document.getElementById('boton-cancelarInformeModal');
    const radioSubirPlantillaModal = document.querySelector('input[name="plantillaModalSeleccion"][value="subir"]');
    const plantillaModalUploadInput = document.getElementById('plantillaModalUpload');

    botonInformeBo.onclick = function() {
        if (typeof validarCamposInforme === "function" && !validarCamposInforme()) return;
        abrirModalPlantilla();
    };

    spanCerrarModalPlantilla.onclick = function() {
        modalPlantilla.style.display = "none";
    };

    botonCancelarInformeModal.onclick = function() {
        modalPlantilla.style.display = "none";
    };

    botonGenerarInformeModal.onclick = generarInformeDesdeModal;

    window.onclick = function(event) {
        if (event.target == modalPlantilla) {
            modalPlantilla.style.display = "none";
        }
    }

    radioSubirPlantillaModal.addEventListener('change', function() {
        plantillaModalUploadInput.style.display = this.checked ? 'block' : 'none';
    });
});

// Inicializar modal de informe
informeResultado();

// ================================================================
// 2. MODAL MAIL
// ================================================================

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
            if (typeof validarCamposInforme === "function" && !validarCamposInforme()) return;
            modalMail.style.display = "block";
        };
    }

    if (spanCerrarModalMail) {
        spanCerrarModalMail.onclick = function() {
            modalMail.style.display = "none";
        };
    }

    if (botonCancelarModalMail) {
        botonCancelarModalMail.onclick = function() {
            modalMail.style.display = "none";
        };
    }

    window.addEventListener('click', function(event) {
        if (event.target == modalMail) {
            modalMail.style.display = "none";
        }
    });

    if (radioSubirPlantillaMailModal) {
        radioSubirPlantillaMailModal.addEventListener('change', function() {
            if (plantillaMailUploadInput) plantillaMailUploadInput.style.display = this.checked ? 'block' : 'none';
        });
        const radioDefaultMail = document.querySelector('input[name="plantillaMailSeleccion"][value="default"]');
        if (radioDefaultMail) {
            radioDefaultMail.addEventListener('change', function() {
                if (plantillaMailUploadInput) plantillaMailUploadInput.style.display = 'none';
            });
        }
    }

    if (botonEnviarModalMail) {
        botonEnviarModalMail.onclick = function() {
            enviarMail();
        };
    }
}

// Inicializar modal de mail
document.addEventListener('DOMContentLoaded', () => {
    inicializarModalMail();
});

// ================================================================
// 3. FUNCIÓN PRINCIPAL DE ENVÍO POR MAIL
// ================================================================

async function enviarMail() {
    const emailInput = document.getElementById('mailDestinatario');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        alert("Debe ingresar una dirección de correo destinataria.");
        if (emailInput) emailInput.focus();
        return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert("La dirección de correo no es válida.");
        if (emailInput) emailInput.focus();
        return;
    }

    const plantillaSeleccionada = document.querySelector('input[name="plantillaMailSeleccion"]:checked').value;
    let plantillaPromise;

    if (plantillaSeleccionada === 'default') {
        plantillaPromise = fetch("./plantillas/Informe_TomaMedicionesIluminacion.docx")
            .then(response => {
                if (!response.ok) throw new Error(`Error al cargar plantilla: ${response.status}`);
                return response.arrayBuffer();
            });
    } else if (plantillaSeleccionada === 'subir') {
        const plantillaUploadInput = document.getElementById('plantillaMailUpload');
        const archivoPlantilla = plantillaUploadInput.files[0];
        if (!archivoPlantilla) {
            alert("Por favor, seleccioná un archivo de plantilla.");
            return;
        }
        plantillaPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(`Error al leer plantilla: ${e}`);
            reader.readAsArrayBuffer(archivoPlantilla);
        });
    }

    document.getElementById('modalMail').style.display = "none";
    mostrarEstado();

    try {
        const data = await plantillaPromise;
        const zip = new JSZip(data);
        let doc = new window.docxtemplater().loadZip(zip);

        const valores = obtenerValoresInforme();
        doc.setData(valores);
        doc.render();

        const docxBase64 = doc.getZip().generate({ type: "base64" });

        // Fotos
        let fotoCroquisBase64 = null;
        let fotoLocalBase64 = null;

        if (typeof fotoCroquis !== 'undefined' && fotoCroquis) {
            fotoCroquisBase64 = await fileToBase64(fotoCroquis);
        }
        if (typeof fotoLocal !== 'undefined' && fotoLocal) {
            fotoLocalBase64 = await fileToBase64(fotoLocal);
        }

        // Enviar al servidor PHP
        const response = await fetch('/api/enviar_mail.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destinatario:  email,
                lugar:         valores.lugar,
                operador:      valores.operador,
                fecha:         valores.fecha,
                hora:          valores.hora,
                emedio:        valores.emedio,
                minimo:        valores.minimo,
                ilumGeneral:   valores.ilumGeneral,
                uniformidad:   valores.uniformidad,
                requerido:     valores.nivelIluminacionRequerido,
                docx:          docxBase64,
                fotoCroquis:   fotoCroquisBase64,
                fotoLocal:     fotoLocalBase64,
                website:       "" // honeypot — requerido por enviar_mail.php
            })
        });

        const resultado = await response.json();
        ocultarEstado();

        if (resultado.ok) {
            alert("Mail enviado correctamente a " + email);
        } else {
            alert("Error al enviar el mail: " + (resultado.error || "error desconocido"));
        }

    } catch (error) {
        ocultarEstado();
        console.error("Error enviando mail:", error);
        alert("Hubo un error al generar o enviar el informe.");
    }
}

// ================================================================
// 4. FUNCIÓN CENTRALIZADA DE VALORES DEL INFORME
// ================================================================

function obtenerValoresInforme() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-AR", {day:"2-digit", month:"2-digit", year:"numeric"});
    const hora  = ahora.toLocaleTimeString("es-AR", {hour:"2-digit", minute:"2-digit", hour12:false});

    const valores = {
        lugar:                     document.getElementById("lugar")?.value.trim() || "",
        operador:                  document.getElementById("operador")?.value.trim() || "",
        fecha,
        hora,
        fechaHora:                 fecha + " " + hora,
        nivelIluminacionRequerido: document.getElementById("nivel-iluminacion-requerido")?.value || "",
        requerido:                 document.getElementById("nivel-iluminacion-requerido")?.value || "",
        nroMediciones:             document.getElementById("nroMediciones")?.textContent || "",
        emedio:                    document.getElementById("emedio")?.textContent || "",
        minimo:                    document.getElementById("minimo")?.textContent || "",
        ilumGeneral:               document.getElementById("ilum-general")?.textContent || "",
        uniformidad:               document.getElementById("uniformidad")?.textContent || "",
        altura:                    sessionStorage.getItem('luminaria') || "",
        largo:                     sessionStorage.getItem('largo') || "",
        ancho:                     sessionStorage.getItem('ancho') || "",
        numeroPuntos:              sessionStorage.getItem('fraseResultado')?.split(':')[1]?.trim() || "",
        indiceLocalAdoptado:       sessionStorage.getItem('indiceLocalAdoptado') || ""
    };

    // Puntos individuales de medición m1..m40
    for (let i = 1; i <= 40; i++) {
        const celda = document.getElementById(`m${i}`);
        valores[`m${i}`] = celda ? celda.textContent.trim() : "";
    }

    return valores;
}

// ================================================================
// 5. UTILIDADES
// ================================================================

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result.split(',')[1]);
        reader.onerror = e => reject(e);
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
