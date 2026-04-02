// ========================================
// VARIABLES GLOBALES
// ========================================
let largo = 0;
let ancho = 0;
let altura = 0;
let numeroPuntos = 0;
let indiceLocal = 0;
let indiceLocalAdoptado = 0;
let nivelIluminacionRequerido = 0;
let parrafo = "";
let fotoCroquis = null;
let fotoLocal = null;

// ========================================
// RUTINAS PARA MEDICIONES.HTML
// ========================================
document.addEventListener("DOMContentLoaded", function () {
    let tabla = document.getElementById("tabla");
    if (!tabla) return;

    let nivelIluminacionInput = document.querySelector("#nivel-iluminacion-requerido");
    let tbody = tabla.querySelector("tbody");
    let contador = 1;

    for (let i = 0; i < 10; i++) {
        let fila = document.createElement("tr");

        let celdaNum1 = document.createElement("td");
        celdaNum1.textContent = contador;
        fila.appendChild(celdaNum1);

        let celdaEditable1 = document.createElement("td");
        celdaEditable1.setAttribute("contenteditable", "true");
        celdaEditable1.setAttribute("id", `m${contador}`);
        fila.appendChild(celdaEditable1);

        let celdaNum2 = document.createElement("td");
        celdaNum2.textContent = contador + 10;
        fila.appendChild(celdaNum2);

        let celdaEditable2 = document.createElement("td");
        celdaEditable2.setAttribute("contenteditable", "true");
        celdaEditable2.setAttribute("id", `m${contador + 10}`);
        fila.appendChild(celdaEditable2);

        let celdaNum3 = document.createElement("td");
        celdaNum3.textContent = contador + 20;
        fila.appendChild(celdaNum3);

        let celdaEditable3 = document.createElement("td");
        celdaEditable3.setAttribute("contenteditable", "true");
        celdaEditable3.setAttribute("id", `m${contador + 20}`);
        fila.appendChild(celdaEditable3);

        let celdaNum4 = document.createElement("td");
        celdaNum4.textContent = contador + 30;
        fila.appendChild(celdaNum4);

        let celdaEditable4 = document.createElement("td");
        celdaEditable4.setAttribute("contenteditable", "true");
        celdaEditable4.setAttribute("id", `m${contador + 30}`);
        fila.appendChild(celdaEditable4);

        tbody.appendChild(fila);
        contador++;
    }

    // Recuperar tabla
    let datosGuardadosTabla = sessionStorage.getItem("tablaMediciones");
    if (datosGuardadosTabla) {
        let datosTabla = JSON.parse(datosGuardadosTabla);
        [...tabla.rows].forEach((fila, index) => {
            const celdasEditables = fila.querySelectorAll("td:nth-child(even)");
            if (datosTabla[index]) {
                celdasEditables.forEach((celda, i) => {
                    if (datosTabla[index][i]) celda.textContent = datosTabla[index][i];
                });
            }
        });
    }

    // Recuperar nivel iluminación
    let nivelIluminacionGuardado = sessionStorage.getItem("nivelIluminacionRequerido");
    if (nivelIluminacionGuardado !== null) {
        nivelIluminacionInput.value = nivelIluminacionGuardado;
    }

    // Recuperar lugar
    let lugarInput = document.getElementById("lugar");
    if (lugarInput) {
        let lugarGuardado = sessionStorage.getItem("lugar");
        if (lugarGuardado !== null) lugarInput.value = lugarGuardado;
        lugarInput.addEventListener("input", function () {
            sessionStorage.setItem("lugar", lugarInput.value);
        });
    }

    // Recuperar operador
    let operadorInput = document.getElementById("operador");
    if (operadorInput) {
        let operadorGuardado = sessionStorage.getItem("operador");
        if (operadorGuardado !== null) operadorInput.value = operadorGuardado;
        operadorInput.addEventListener("input", function () {
            sessionStorage.setItem("operador", operadorInput.value);
        });
    }

    // Recuperar resultados calculados
    let nroMedicionesGuardado    = sessionStorage.getItem("nroMedicionesValue");
    let emedioGuardado           = sessionStorage.getItem("emedioValue");
    let minimoGuardado           = sessionStorage.getItem("minimoValue");
    let ilumGeneralTextGuardado  = sessionStorage.getItem("ilumGeneralText");
    let uniformidadTextGuardado  = sessionStorage.getItem("uniformidadText");
    let ilumGeneralColorGuardado = sessionStorage.getItem("ilumGeneralColor");
    let uniformidadColorGuardado = sessionStorage.getItem("uniformidadColor");

    if (nroMedicionesGuardado !== null)    document.getElementById("nroMediciones").textContent = nroMedicionesGuardado;
    if (emedioGuardado !== null)           document.getElementById("emedio").textContent = emedioGuardado;
    if (minimoGuardado !== null)           document.getElementById("minimo").textContent = minimoGuardado;
    if (ilumGeneralTextGuardado !== null)  document.getElementById("ilum-general").textContent = ilumGeneralTextGuardado;
    if (uniformidadTextGuardado !== null)  document.getElementById("uniformidad").textContent = uniformidadTextGuardado;
    if (ilumGeneralColorGuardado !== null) document.getElementById("ilum-general").style.color = ilumGeneralColorGuardado;
    if (uniformidadColorGuardado !== null) document.getElementById("uniformidad").style.color = uniformidadColorGuardado;

    // Guardar tabla al escribir
    tabla.addEventListener("input", function () {
        let datosAGuardar = {};
        [...tabla.rows].forEach((fila, index) => {
            const celdasEditables = fila.querySelectorAll("td:nth-child(even)");
            let valoresFila = Array.from(celdasEditables).map(celda => celda.textContent.trim());
            if (valoresFila.some(valor => valor !== "")) {
                datosAGuardar[index] = valoresFila;
            }
        });
        sessionStorage.setItem("tablaMediciones", JSON.stringify(datosAGuardar));
    });

    nivelIluminacionInput.addEventListener("input", function () {
        sessionStorage.setItem("nivelIluminacionRequerido", nivelIluminacionInput.value);
    });

    // Listeners fotos
    const fotoCroquisInput = document.getElementById('fotoCroquis');
    const fotoLocalInput = document.getElementById('fotoLocal');
    const btnCroquis = document.getElementById('btn-foto-croquis');
    const btnLocal = document.getElementById('btn-foto-local');

    if (fotoCroquisInput) {
        fotoCroquisInput.addEventListener('change', async function(e) {
            if (e.target.files[0]) {
                fotoCroquis = await comprimirImagen(e.target.files[0]);
                if (btnCroquis) btnCroquis.style.opacity = '0.4';
            }
        });
    }

    if (fotoLocalInput) {
        fotoLocalInput.addEventListener('change', async function(e) {
            if (e.target.files[0]) {
                fotoLocal = await comprimirImagen(e.target.files[0]);
                if (btnLocal) btnLocal.style.opacity = '0.4';
            }
        });
    }

}); // fin DOMContentLoaded mediciones

// ========================================
// BORRAR TABLA
// ========================================
function borrarTabla() {
    sessionStorage.removeItem("tablaMediciones");
    sessionStorage.removeItem("nivelIluminacionRequerido");
    sessionStorage.removeItem("nroMedicionesValue");
    sessionStorage.removeItem("emedioValue");
    sessionStorage.removeItem("minimoValue");
    sessionStorage.removeItem("ilumGeneralText");
    sessionStorage.removeItem("uniformidadText");
    sessionStorage.removeItem("ilumGeneralColor");
    sessionStorage.removeItem("uniformidadColor");
    sessionStorage.removeItem("lugar");
    sessionStorage.removeItem("operador");

    let operadorInput = document.getElementById("operador");
    if (operadorInput) operadorInput.value = "";

    document.querySelectorAll("#tabla tbody td:nth-child(even)").forEach(celda => {
        celda.textContent = "";
    });

    let nivelIluminacionInput = document.querySelector("#nivel-iluminacion-requerido");
    if (nivelIluminacionInput) nivelIluminacionInput.value = "";

    let lugarInput = document.getElementById("lugar");
    if (lugarInput) lugarInput.value = "";

    document.getElementById("nroMediciones").textContent = "-";
    document.getElementById("emedio").textContent = "-";
    document.getElementById("minimo").textContent = "-";
    document.getElementById("ilum-general").textContent = "";
    document.getElementById("uniformidad").textContent = "";

    // Ocultar sección ENVIAR al borrar
    const seccionEnviar = document.getElementById("seccion-enviar");
    if (seccionEnviar) seccionEnviar.style.display = "none";

    fotoCroquis = null;
    fotoLocal = null;

    // Resetear opacidad botones cámara
    const btnCroquis = document.getElementById('btn-foto-croquis');
    const btnLocal = document.getElementById('btn-foto-local');
    if (btnCroquis) btnCroquis.style.opacity = '1';
    if (btnLocal) btnLocal.style.opacity = '1';
}

// ========================================
// RUTINAS PARA INDEX.HTML
// ========================================
document.addEventListener("DOMContentLoaded", function () {
    const inputs = ["largo", "ancho", "luminaria"];
    inputs.forEach(id => {
        const inputElement = document.getElementById(id);
        if (!inputElement) return;
        const storedValue = sessionStorage.getItem(id);
        if (storedValue) inputElement.value = storedValue;
        inputElement.addEventListener("input", function () {
            sessionStorage.setItem(id, this.value);
        });
    });

    window.borrarTodo = function () {
        inputs.forEach(id => {
            sessionStorage.removeItem(id);
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        sessionStorage.removeItem("fraseIndice");
        sessionStorage.removeItem("fraseResultado");
        const indice = document.getElementById('indice');
        const resultado = document.getElementById('resultado');
        if (indice) indice.innerHTML = "";
        if (resultado) resultado.innerHTML = "";
    };
}); // fin DOMContentLoaded index

function borrarTodo() {
    const largo = document.querySelector('#largo');
    const ancho = document.querySelector('#ancho');
    const luminaria = document.querySelector('#luminaria');
    if (largo) largo.value = '';
    if (ancho) ancho.value = '';
    if (luminaria) luminaria.value = '';
    limpiarCajasResultados();
}

// ========================================
// CALCULAR ÍNDICE LOCAL (index.html)
// ========================================
function calcular() {
    largo = parseFloat(document.getElementById('largo').value);
    if (isNaN(largo) || largo <= 0) {
        limpiarCajasResultados();
        alert('La expresión ingresada en Largo no es válida o es menor o igual a 0. Vuelva a ingresar el valor');
        return;
    }
    ancho = parseFloat(document.getElementById('ancho').value);
    if (isNaN(ancho) || ancho <= 0) {
        limpiarCajasResultados();
        alert('La expresión ingresada en ancho no es válida o es menor o igual a 0. Vuelva a ingresar el valor');
        return;
    }
    altura = parseFloat(document.getElementById('luminaria').value);
    if (isNaN(altura) || altura <= 0) {
        limpiarCajasResultados();
        alert('La expresión ingresada en Altura de las luminarias no es válida o es menor o igual a 0. Vuelva a ingresar el valor');
        return;
    }

    indiceLocal = ancho * largo / (altura * (ancho + largo));
    indiceLocalAdoptado = indiceLocal <= 3 ? Math.trunc(indiceLocal) + 1 : 4;
    numeroPuntos = (indiceLocalAdoptado + 2) * (indiceLocalAdoptado + 2);

    let fraseIndice = `El índice del local es: ${indiceLocalAdoptado}`;
    let fraseResultado = `Puntos mínimos de medición: ${numeroPuntos}`;

    document.getElementById('indice').innerHTML = fraseIndice;
    document.getElementById('resultado').innerHTML = fraseResultado;

    sessionStorage.setItem("fraseIndice", fraseIndice);
    sessionStorage.setItem("fraseResultado", fraseResultado);
    sessionStorage.setItem("indiceLocalAdoptado", indiceLocalAdoptado);
}

document.addEventListener("DOMContentLoaded", function () {
    const fraseIndiceGuardada = sessionStorage.getItem("fraseIndice");
    const fraseResultadoGuardada = sessionStorage.getItem("fraseResultado");
    if (fraseIndiceGuardada && fraseResultadoGuardada) {
        const indice = document.getElementById('indice');
        const resultado = document.getElementById('resultado');
        if (indice) indice.innerHTML = fraseIndiceGuardada;
        if (resultado) resultado.innerHTML = fraseResultadoGuardada;
    }
    const inputs = ["largo", "ancho", "luminaria"];
    inputs.forEach(id => {
        const inputElement = document.getElementById(id);
        if (!inputElement) return;
        const storedValue = sessionStorage.getItem(id);
        if (storedValue) inputElement.value = storedValue;
        inputElement.addEventListener("input", function () {
            sessionStorage.setItem(id, this.value);
        });
    });
});

function limpiarCajasResultados() {
    let parrafoIndice = document.getElementById('indice');
    let parrafoResultado = document.getElementById('resultado');
    if (parrafoIndice) parrafoIndice.innerHTML = `El índice del local es: `;
    if (parrafoResultado) parrafoResultado.innerHTML = `Puntos mínimos de medición: `;
}

// ========================================
// LEER TABLA Y CALCULAR (mediciones.html)
// ========================================
function leerTabla() {
    let mediciones = [];
    let celdas = document.querySelectorAll("#tabla tbody td:nth-child(even)");

    for (let celda of celdas) {
        let valor = celda.textContent.trim();
        if (valor === "") continue;
        if (isNaN(valor) || parseFloat(valor) <= 0) {
            alert("Error: Todas las celdas con valores deben contener un número real mayor a 0.");
            celda.textContent = "";
            celda.focus();
            document.getElementById("nroMediciones").textContent = "";
            document.getElementById("emedio").textContent = "";
            document.getElementById("minimo").textContent = "";
            return;
        }
        mediciones.push(parseFloat(valor));
    }

    let nroMediciones = mediciones.length;
    let emedio = nroMediciones > 0 ? (mediciones.reduce((a, b) => a + b, 0) / nroMediciones).toFixed(1) : "0.0";
    let minimo = nroMediciones > 0 ? Math.min(...mediciones).toFixed(1) : "0.0";

    document.getElementById("nroMediciones").textContent = nroMediciones;
    document.getElementById("emedio").textContent = emedio;
    document.getElementById("minimo").textContent = minimo;

    sessionStorage.setItem("nroMedicionesValue", nroMediciones);
    sessionStorage.setItem("emedioValue", emedio);
    sessionStorage.setItem("minimoValue", minimo);

    if (nroMediciones <= 0) {
        alert("Ingrese en la tabla los valores medidos");
        return;
    }

    nivelIluminacionRequerido = parseFloat(document.getElementById('nivel-iluminacion-requerido').value);
    if (isNaN(nivelIluminacionRequerido) || nivelIluminacionRequerido <= 0) {
        alert("Debe ingresar un valor de iluminación requerido para chequear el cumplimiento de la legislación");
        return;
    }

    parrafo = document.getElementById("ilum-general");
    if (emedio < nivelIluminacionRequerido) {
        parrafo.style.color = "red";
        parrafo.textContent = "El nivel de iluminación general NO CUMPLE con la legislación vigente";
    } else {
        parrafo.style.color = "green";
        parrafo.textContent = "El nivel de iluminación general CUMPLE con la legislación vigente";
    }
    sessionStorage.setItem("ilumGeneralText", parrafo.textContent);
    sessionStorage.setItem("ilumGeneralColor", parrafo.style.color);

    parrafo = document.getElementById("uniformidad");
    if (minimo < emedio / 2) {
        parrafo.style.color = "red";
        parrafo.textContent = "El nivel de uniformidad NO CUMPLE con la legislación vigente";
    } else {
        parrafo.style.color = "green";
        parrafo.textContent = "El nivel de uniformidad CUMPLE con la legislación vigente";
    }
    sessionStorage.setItem("uniformidadText", parrafo.textContent);
    sessionStorage.setItem("uniformidadColor", parrafo.style.color);

    // Mostrar sección ENVIAR al calcular
    mostrarSeccionEnviar();
}

// ========================================
// MOSTRAR SECCIÓN ENVIAR
// ========================================
function mostrarSeccionEnviar() {
    const seccionEnviar = document.getElementById("seccion-enviar");
    if (seccionEnviar) seccionEnviar.style.display = "block";
}

// ========================================
// WHATSAPP
// ========================================
function compartirWhatsApp() {
    const lugar = document.getElementById("lugar")?.value.trim();
    const operador = document.getElementById("operador")?.value.trim();

    if (!lugar && !operador) {
        alert("Para enviar por WhatsApp debe completar el Lugar de medición y el Operador.");
        document.getElementById("lugar").focus();
        return;
    }
    if (!lugar) {
        alert("Debe completar el Lugar de medición para enviar por WhatsApp.");
        document.getElementById("lugar").focus();
        return;
    }
    if (!operador) {
        alert("Debe completar el nombre del Operador para enviar por WhatsApp.");
        document.getElementById("operador").focus();
        return;
    }

    const emedio = document.getElementById("emedio").textContent;
    const minimo = document.getElementById("minimo").textContent;
    const uniformidad = document.getElementById("uniformidad").textContent;
    const ilumGeneral = document.getElementById("ilum-general").textContent;
    const requerido = document.getElementById("nivel-iluminacion-requerido").value;

    // Construir tabla de puntos medidos
    let tablaMediciones = "";
    let hayValores = false;
    let filas = [];

    for (let i = 1; i <= 40; i++) {
        const valor = document.getElementById(`m${i}`)?.textContent.trim() || "";
        if (valor !== "") {
            filas.push(`${i}: ${valor}`);
            hayValores = true;
        }
    }

    if (hayValores) {
        tablaMediciones = "\nPuntos medidos (lux):\n";
        for (let i = 0; i < filas.length; i += 4) {
            tablaMediciones += filas.slice(i, i + 4).join("   ") + "\n";
        }
    }

    const mensaje =
        "📊RESULTADO MEDICION DE ILUMINACIÓN\n" +
        "================================\n\n" +
        "Lugar: " + lugar + "\n" +
        "Operador: " + operador + "\n" +
        tablaMediciones +
        "\nNivel requerido: " + requerido + " lux\n" +
        "Valor promedio: " + emedio + " lux\n" +
        "Valor mínimo: " + minimo + " lux\n\n" +

        "📈 RESUMEN\n" +
        "Iluminacion general: " + ilumGeneral + "\n" +
        "Uniformidad: " + uniformidad;

    const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}

// ========================================
// MAIL — pendiente implementar con SMTP Zoho
// ========================================
// function enviarMail() {
//     const lugar = document.getElementById("lugar")?.value.trim();
//     const operador = document.getElementById("operador")?.value.trim();
//     const emedio = document.getElementById("emedio").textContent;
//     const minimo = document.getElementById("minimo").textContent;
//     const uniformidad = document.getElementById("uniformidad").textContent;
//     const ilumGeneral = document.getElementById("ilum-general").textContent;
//     const requerido = document.getElementById("nivel-iluminacion-requerido").value;
//
//     const destinatario = prompt("Ingrese la dirección de correo destinataria:");
//     if (!destinatario) return;
//
//     // TODO: enviar datos a /api/enviar_mail.php con fetch()
//     // fetch('/api/enviar_mail.php', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ destinatario, lugar, operador, emedio, minimo,
//     //                           ilumGeneral, uniformidad, requerido })
//     // });
// }

// ========================================
// COMPRESIÓN DE IMÁGENES
// ========================================
function comprimirImagen(file, maxWidth = 1000, calidad = 0.75) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const escala = Math.min(1, maxWidth / img.width);
                canvas.width = img.width * escala;
                canvas.height = img.height * escala;
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                }, 'image/jpeg', calidad);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ========================================
// COMPARTIR NATIVO CON DOCX + FOTOS
// ========================================
async function compartirNativo() {
    const lugar = document.getElementById("lugar")?.value.trim();
    const operador = document.getElementById("operador")?.value.trim();

    if (!lugar) { alert("Debe completar el Lugar de medición."); return; }
    if (!operador) { alert("Debe completar el nombre del Operador."); return; }

    const emedio = document.getElementById("emedio").textContent;
    const minimo = document.getElementById("minimo").textContent;
    const uniformidad = document.getElementById("uniformidad").textContent;
    const ilumGeneral = document.getElementById("ilum-general").textContent;
    const requerido = document.getElementById("nivel-iluminacion-requerido").value;

    const textoResumen =
        `Resultado Medicion de Iluminacion\n\n` +
        `Lugar: ${lugar}\nOperador: ${operador}\n` +
        `Nivel requerido: ${requerido} lux\n` +
        `Emedio: ${emedio} lux\nEminimo: ${minimo} lux\n\n` +
        `Iluminacion general: ${ilumGeneral}\nUniformidad: ${uniformidad}`;

    let docxBlob = null;
    try {
        const response = await fetch("./plantillas/Informe_TomaMedicionesIluminacion.docx");
        const data = await response.arrayBuffer();
        const zip = new JSZip(data);
        let doc = new window.docxtemplater().loadZip(zip);
        let valores = {
            lugar, operador,
            fecha: new Date().toLocaleDateString("es-AR", {day:"2-digit", month:"2-digit", year:"numeric"}),
            hora: new Date().toLocaleTimeString("es-AR", {hour:"2-digit", minute:"2-digit", hour12:false}),
            fechaHora: new Date().toLocaleDateString("es-AR", {day:"2-digit", month:"2-digit", year:"numeric"}) + " " + new Date().toLocaleTimeString("es-AR", {hour:"2-digit", minute:"2-digit", hour12:false}),
            nivelIluminacionRequerido: requerido, requerido,
            nroMediciones: document.getElementById("nroMediciones").textContent,
            emedio, minimo,
            ilumGeneral: document.getElementById("ilum-general").textContent,
            uniformidad: document.getElementById("uniformidad").textContent,
            altura: sessionStorage.getItem('luminaria') || "",
            largo: sessionStorage.getItem('largo') || "",
            ancho: sessionStorage.getItem('ancho') || "",
            numeroPuntos: sessionStorage.getItem('fraseResultado') ? sessionStorage.getItem('fraseResultado').split(':')[1].trim() : "",
            indiceLocalAdoptado: sessionStorage.getItem('indiceLocalAdoptado') || ""
        };
        for (let i = 1; i <= 40; i++) {
            const celda = document.getElementById(`m${i}`);
            valores[`m${i}`] = celda ? celda.textContent.trim() : "";
        }
        doc.setData(valores);
        doc.render();
        docxBlob = doc.getZip().generate({ type: "blob" });
    } catch(e) {
        console.error("Error generando DOCX:", e);
    }

    const archivos = [];
    if (docxBlob) archivos.push(new File([docxBlob], "Informe_Iluminacion.docx",
        { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    if (fotoCroquis) archivos.push(fotoCroquis);
    if (fotoLocal) archivos.push(fotoLocal);

    try {
        await navigator.share({
            title: 'Informe de Iluminación',
            text: textoResumen,
            files: archivos.length > 0 ? archivos : undefined
        });
    } catch(e) {
        console.error("Error al compartir:", e);
    }
}

// ========================================
// LOCALIZADA.HTML
// ========================================
function evaluar() {
    actualizarGrafico(
        parseFloat(document.getElementById('nivel-iluminacion-general').value),
        parseFloat(document.getElementById('nivel-iluminacion-localizada').value)
    );
}

function resetear() {
    document.getElementById('nivel-iluminacion-general').value = '';
    document.getElementById('nivel-iluminacion-localizada').value = '';
    actualizarGrafico(0, 0);
}

// ========================================
// VALIDACIÓN CAMPOS PARA INFORME
// ========================================
function validarCamposInforme() {
    const lugar = document.getElementById("lugar")?.value.trim();
    const operador = document.getElementById("operador")?.value.trim();

    if (!lugar && !operador) {
        alert("Para generar el informe debe completar el Lugar de medición y el Operador.");
        document.getElementById("lugar").focus();
        return false;
    }
    if (!lugar) {
        alert("Debe completar el Lugar de medición para generar el informe.");
        document.getElementById("lugar").focus();
        return false;
    }
    if (!operador) {
        alert("Debe completar el nombre del Operador para generar el informe.");
        document.getElementById("operador").focus();
        return false;
    }
    return true;
}
