function calcularTodoSNR() {
    let dbC = parseFloat(document.querySelector("#dbC_snr").value) || null;
    let SNR =
        parseFloat(document.querySelector("#filaSNR input").value) || null;

    if ([dbC, SNR].includes(null)) {
        alert("Por favor, ingrese todos los valores antes de calcular.");
        return;
    }

    let dbA_protegido = dbC - SNR;
    if (document.querySelector("#cbox3").checked) {
        dbA_protegido += 4;
    }

    const dbA_protegido_fixed = dbA_protegido.toFixed(1);
    document.querySelector("#filaRuidoAtenuadoSNR input").value =
        dbA_protegido_fixed;

    const elIndice = document.getElementById("indice-proteccionSNR");
    elIndice.classList.remove(
        "indice-sobreprotegido",
        "indice-buena",
        "indice-aceptable",
        "indice-insuficiente",
    );

    let indiceProteccion;
    if (dbA_protegido < 70.0) {
        indiceProteccion = "SOBREPROTEGIDO";
        elIndice.classList.add("indice-sobreprotegido");
    } else if (dbA_protegido < 80.0) {
        indiceProteccion = "BUENA";
        elIndice.classList.add("indice-buena");
    } else if (dbA_protegido > 85.0) {
        indiceProteccion = "INSUFICIENTE";
        elIndice.classList.add("indice-insuficiente");
    } else {
        indiceProteccion = "ACEPTABLE";
        elIndice.classList.add("indice-aceptable");
    }

    elIndice.textContent = indiceProteccion;

    sessionStorage.setItem("snr_dbA_protegido", dbA_protegido_fixed);
    sessionStorage.setItem("snr_indiceProteccion", indiceProteccion);
    sessionStorage.setItem("snr_indiceProteccionClase", elIndice.className);
}

function borrarTodoSNR() {
    document.querySelectorAll("input").forEach((input) => {
        input.value = "";
    });
    document.querySelector("#cbox3").checked = false;

    const elIndice = document.getElementById("indice-proteccionSNR");
    elIndice.textContent = "";
    elIndice.classList.remove(
        "indice-sobreprotegido",
        "indice-buena",
        "indice-aceptable",
        "indice-insuficiente",
    );

    sessionStorage.removeItem("snr_protectorAuditivo");
    sessionStorage.removeItem("snr_SNR");
    sessionStorage.removeItem("snr_lugarRuido");
    sessionStorage.removeItem("snr_dbC");
    sessionStorage.removeItem("snr_cbox3");
    sessionStorage.removeItem("snr_dbA_protegido");
    sessionStorage.removeItem("snr_indiceProteccion");
    sessionStorage.removeItem("snr_indiceProteccionClase");
}

const checkbox = document.getElementById("cbox3");
checkbox.addEventListener("change", function () {
    calcularTodoSNR();
    saveAllDataSNR();
});

function saveAllDataSNR() {
    sessionStorage.setItem(
        "snr_protectorAuditivo",
        document.getElementById("protector-auditivo").value,
    );
    sessionStorage.setItem(
        "snr_SNR",
        document.querySelector("#filaSNR input").value,
    );
    sessionStorage.setItem(
        "snr_lugarRuido",
        document.getElementById("ruido").value,
    );
    sessionStorage.setItem("snr_dbC", document.querySelector("#dbC_snr").value);
    sessionStorage.setItem(
        "snr_cbox3",
        document.querySelector("#cbox3").checked,
    );
}

document
    .getElementById("protector-auditivo")
    .addEventListener("input", saveAllDataSNR);
document
    .querySelector("#filaSNR input")
    .addEventListener("input", saveAllDataSNR);
document.getElementById("ruido").addEventListener("input", saveAllDataSNR);
document.querySelector("#dbC_snr").addEventListener("input", saveAllDataSNR);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("protector-auditivo").value =
        sessionStorage.getItem("snr_protectorAuditivo") || "";
    document.querySelector("#filaSNR input").value =
        sessionStorage.getItem("snr_SNR") || "";
    document.getElementById("ruido").value =
        sessionStorage.getItem("snr_lugarRuido") || "";
    document.querySelector("#dbC_snr").value =
        sessionStorage.getItem("snr_dbC") || "";
    document.getElementById("cbox3").checked =
        sessionStorage.getItem("snr_cbox3") === "true";

    document.querySelector("#filaRuidoAtenuadoSNR input").value =
        sessionStorage.getItem("snr_dbA_protegido") || "";

    const elIndiceRestore = document.getElementById("indice-proteccionSNR");
    elIndiceRestore.textContent =
        sessionStorage.getItem("snr_indiceProteccion") || "";
    const storedClase = sessionStorage.getItem("snr_indiceProteccionClase");
    if (storedClase) {
        elIndiceRestore.className = storedClase;
    }
});
