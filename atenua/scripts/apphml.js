function calcularTodoHML() {
    let dbA = parseFloat(document.querySelector("#dbA input").value) || null;
    let dbC = parseFloat(document.querySelector("#dbC input").value) || null;
    let H = parseFloat(document.querySelector("#filaH input").value) || null;
    let M = parseFloat(document.querySelector("#filaM input").value) || null;
    let L = parseFloat(document.querySelector("#filaL input").value) || null;

    if ([dbA, dbC, H, M, L].includes(null)) {
        alert("Por favor, ingrese todos los valores antes de calcular.");
        return;
    }

    let diferencia = dbC - dbA;
    let atenuacion;
    if (diferencia <= 2) {
        atenuacion = M - ((H - M) / 4) * (diferencia - 2);
    } else {
        atenuacion = M - ((M - L) / 8) * (diferencia - 2);
    }

    let dbA_protegido = dbA - atenuacion;
    if (document.querySelector("#cbox3").checked) {
        dbA_protegido += 4;
    }

    const dbA_protegido_fixed = dbA_protegido.toFixed(1);
    document.querySelector("#filaRuidoAtenuadoHML input").value =
        dbA_protegido_fixed;

    const elIndice = document.getElementById("indice-proteccionHML");
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

    sessionStorage.setItem("hml_dbA_protegido", dbA_protegido_fixed);
    sessionStorage.setItem("hml_indiceProteccion", indiceProteccion);
    sessionStorage.setItem("hml_indiceProteccionClase", elIndice.className);
}

function borrarTodoHML() {
    document.querySelectorAll("input").forEach((input) => {
        input.value = "";
    });
    document.querySelector("#cbox3").checked = false;

    const elIndice = document.getElementById("indice-proteccionHML");
    elIndice.textContent = "";
    elIndice.classList.remove(
        "indice-sobreprotegido",
        "indice-buena",
        "indice-aceptable",
        "indice-insuficiente",
    );

    sessionStorage.removeItem("hml_protectorAuditivo");
    sessionStorage.removeItem("hml_H");
    sessionStorage.removeItem("hml_M");
    sessionStorage.removeItem("hml_L");
    sessionStorage.removeItem("hml_lugarRuido");
    sessionStorage.removeItem("hml_dbA");
    sessionStorage.removeItem("hml_dbC");
    sessionStorage.removeItem("hml_cbox3");
    sessionStorage.removeItem("hml_dbA_protegido");
    sessionStorage.removeItem("hml_indiceProteccion");
    sessionStorage.removeItem("hml_indiceProteccionClase");
}

const checkbox = document.getElementById("cbox3");
checkbox.addEventListener("change", function () {
    calcularTodoHML();
    saveAllDataHML();
});

function saveAllDataHML() {
    sessionStorage.setItem(
        "hml_protectorAuditivo",
        document.getElementById("protector-auditivo").value,
    );
    sessionStorage.setItem(
        "hml_H",
        document.querySelector("#filaH input").value,
    );
    sessionStorage.setItem(
        "hml_M",
        document.querySelector("#filaM input").value,
    );
    sessionStorage.setItem(
        "hml_L",
        document.querySelector("#filaL input").value,
    );
    sessionStorage.setItem(
        "hml_lugarRuido",
        document.getElementById("ruido").value,
    );
    sessionStorage.setItem(
        "hml_dbC",
        document.querySelector("#dbC input").value,
    );
    sessionStorage.setItem(
        "hml_dbA",
        document.querySelector("#dbA input").value,
    );
    sessionStorage.setItem(
        "hml_cbox3",
        document.querySelector("#cbox3").checked,
    );
}

document
    .getElementById("protector-auditivo")
    .addEventListener("input", saveAllDataHML);
document
    .querySelector("#filaH input")
    .addEventListener("input", saveAllDataHML);
document
    .querySelector("#filaM input")
    .addEventListener("input", saveAllDataHML);
document
    .querySelector("#filaL input")
    .addEventListener("input", saveAllDataHML);
document.getElementById("ruido").addEventListener("input", saveAllDataHML);
document.querySelector("#dbA input").addEventListener("input", saveAllDataHML);
document.querySelector("#dbC input").addEventListener("input", saveAllDataHML);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("protector-auditivo").value =
        sessionStorage.getItem("hml_protectorAuditivo") || "";
    document.querySelector("#filaH input").value =
        sessionStorage.getItem("hml_H") || "";
    document.querySelector("#filaM input").value =
        sessionStorage.getItem("hml_M") || "";
    document.querySelector("#filaL input").value =
        sessionStorage.getItem("hml_L") || "";
    document.getElementById("ruido").value =
        sessionStorage.getItem("hml_lugarRuido") || "";
    document.querySelector("#dbA input").value =
        sessionStorage.getItem("hml_dbA") || "";
    document.querySelector("#dbC input").value =
        sessionStorage.getItem("hml_dbC") || "";
    document.getElementById("cbox3").checked =
        sessionStorage.getItem("hml_cbox3") === "true";

    document.querySelector("#filaRuidoAtenuadoHML input").value =
        sessionStorage.getItem("hml_dbA_protegido") || "";

    const elIndiceRestore = document.getElementById("indice-proteccionHML");
    elIndiceRestore.textContent =
        sessionStorage.getItem("hml_indiceProteccion") || "";
    const storedClase = sessionStorage.getItem("hml_indiceProteccionClase");
    if (storedClase) {
        elIndiceRestore.className = storedClase;
    }
});
