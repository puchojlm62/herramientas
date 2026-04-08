// ================================================================
// apphml.js — VISP Herramientas (v1.5.4)
// Lógica de cálculo y persistencia para Método HML
// ================================================================

function calcularTodoHML() {
    // 1. Obtención de valores con selectores precisos según tu HTML
    const dbA_el = document.getElementById("dbA");
    const dbC_el = document.getElementById("dbC");
    const h_el   = document.querySelector("#filaH input");
    const m_el   = document.querySelector("#filaM input");
    const l_el   = document.querySelector("#filaL input");
    const cbox   = document.getElementById("cbox3");

    const dbA = parseFloat(dbA_el?.value);
    const dbC = parseFloat(dbC_el?.value);
    const H   = parseFloat(h_el?.value);
    const M   = parseFloat(m_el?.value);
    const L   = parseFloat(l_el?.value);

    // 2. Validación de campos vacíos o no numéricos
    if (isNaN(dbA) || isNaN(dbC) || isNaN(H) || isNaN(M) || isNaN(L)) {
        alert("Por favor, completá todos los valores numéricos antes de calcular.");
        return;
    }

    // 3. Lógica del Método HML (ISO 4869-2)
    const diferencia = dbC - dbA;
    let atenuacion;

    if (diferencia <= 2) {
        atenuacion = M - ((H - M) / 4) * (diferencia - 2);
    } else {
        atenuacion = M - ((M - L) / 8) * (diferencia - 2);
    }

    // 4. Cálculo del nivel en el oído (LeqA')
    let dbA_protegido = dbA - atenuacion;
    
    // Si está tildada la corrección de +4dB (Probable vs Supuesta)
    if (cbox && cbox.checked) {
        dbA_protegido += 4;
    }

    // 5. Mostrar resultados en la interfaz
    const resultadoInput = document.querySelector("#filaRuidoAtenuadoHML input");
    if (resultadoInput) {
        resultadoInput.value = dbA_protegido.toFixed(1);
    }

    // 6. Clasificación del Índice de Protección
    const elIndice = document.getElementById("indice-proteccionHML");
    if (elIndice) {
        elIndice.classList.remove("indice-sobreprotegido", "indice-buena", "indice-aceptable", "indice-insuficiente");

        let textoIndice = "";
        if (dbA_protegido < 70) {
            textoIndice = "SOBREPROTEGIDO";
            elIndice.classList.add("indice-sobreprotegido");
        } else if (dbA_protegido < 80) {
            textoIndice = "BUENA";
            elIndice.classList.add("indice-buena");
        } else if (dbA_protegido <= 85) {
            textoIndice = "ACEPTABLE";
            elIndice.classList.add("indice-aceptable");
        } else {
            textoIndice = "INSUFICIENTE";
            elIndice.classList.add("indice-insuficiente");
        }
        elIndice.textContent = textoIndice;
        
        // Guardar estado del índice
        sessionStorage.setItem("hml_indiceProteccion", textoIndice);
        sessionStorage.setItem("hml_indiceProteccionClase", elIndice.className);
    }

    // 7. Guardar datos para persistencia y para el mail
    sessionStorage.setItem("hml_dbA_protegido", dbA_protegido.toFixed(1));
    saveAllDataHML();

    // 8. Mostrar sección de envío (WhatsApp/Mail)
    const seccionEnviar = document.getElementById("seccion-enviar-atenua");
    if (seccionEnviar) seccionEnviar.style.display = "flex";
}

function borrarTodoHML() {
    // Limpiar todos los inputs de texto
    document.querySelectorAll("input[type='text']").forEach(i => i.value = "");
    
    // Resetear checkbox y resultados
    const cbox = document.getElementById("cbox3");
    if (cbox) cbox.checked = false;

    const elIndice = document.getElementById("indice-proteccionHML");
    if (elIndice) {
        elIndice.textContent = "";
        elIndice.className = "resultado-indice";
    }

    const resInput = document.querySelector("#filaRuidoAtenuadoHML input");
    if (resInput) resInput.value = "";

    // Ocultar botones de envío y limpiar storage
    const seccionEnviar = document.getElementById("seccion-enviar-atenua");
    if (seccionEnviar) seccionEnviar.style.display = "none";

    sessionStorage.clear();
}

function saveAllDataHML() {
    sessionStorage.setItem("hml_protectorAuditivo", document.getElementById("protector-auditivo")?.value || "");
    sessionStorage.setItem("hml_H", document.querySelector("#filaH input")?.value || "");
    sessionStorage.setItem("hml_M", document.querySelector("#filaM input")?.value || "");
    sessionStorage.setItem("hml_L", document.querySelector("#filaL input")?.value || "");
    sessionStorage.setItem("hml_lugarRuido", document.getElementById("ruido")?.value || "");
    sessionStorage.setItem("hml_dbC", document.getElementById("dbC")?.value || "");
    sessionStorage.setItem("hml_dbA", document.getElementById("dbA")?.value || "");
    sessionStorage.setItem("hml_cbox3", document.getElementById("cbox3")?.checked || false);
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Restaurar valores guardados
    if (document.getElementById("protector-auditivo")) {
        document.getElementById("protector-auditivo").value = sessionStorage.getItem("hml_protectorAuditivo") || "";
        document.querySelector("#filaH input").value = sessionStorage.getItem("hml_H") || "";
        document.querySelector("#filaM input").value = sessionStorage.getItem("hml_M") || "";
        document.querySelector("#filaL input").value = sessionStorage.getItem("hml_L") || "";
        document.getElementById("ruido").value = sessionStorage.getItem("hml_lugarRuido") || "";
        document.getElementById("dbA").value = sessionStorage.getItem("hml_dbA") || "";
        document.getElementById("dbC").value = sessionStorage.getItem("hml_dbC") || "";
        document.getElementById("cbox3").checked = sessionStorage.getItem("hml_cbox3") === "true";
        
        const resPrevio = sessionStorage.getItem("hml_dbA_protegido");
        if (resPrevio) {
            document.querySelector("#filaRuidoAtenuadoHML input").value = resPrevio;
            document.getElementById("seccion-enviar-atenua").style.display = "flex";
        }

        const elIndice = document.getElementById("indice-proteccionHML");
        const indicePrevio = sessionStorage.getItem("hml_indiceProteccion");
        const clasePrevia = sessionStorage.getItem("hml_indiceProteccionClase");
        if (elIndice && indicePrevio) {
            elIndice.textContent = indicePrevio;
            elIndice.className = clasePrevia;
        }
    }

    // Listeners para guardar datos mientras se escribe
    const inputs = ["protector-auditivo", "ruido", "dbA", "dbC"];
    inputs.forEach(id => {
        document.getElementById(id)?.addEventListener("input", saveAllDataHML);
    });
    
    document.querySelectorAll("#filaH input, #filaM input, #filaL input").forEach(el => {
        el.addEventListener("input", saveAllDataHML);
    });

    document.getElementById("cbox3")?.addEventListener("change", () => {
        saveAllDataHML();
        // Si ya había resultados, recalculamos automáticamente al tocar el check
        if (document.getElementById("dbA").value) calcularTodoHML();
    });
});