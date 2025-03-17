// Rutinas para almacenar temporalmente los datos de mediciones.html
document.addEventListener("DOMContentLoaded", function () {
    let tabla = document.getElementById("tabla");
    let nivelIluminacionInput = document.querySelector("#nivel-iluminacion-requerido");

    // Modificación aquí: Crear la tabla con 8 columnas (4 numéricas, 4 editables)
    let tbody = tabla.querySelector("tbody");
    let contador = 1;

    for (let i = 0; i < 10; i++) {
        let fila = document.createElement("tr");

        // Columna 1: Número (No editable)
        let celdaNum1 = document.createElement("td");
        celdaNum1.textContent = contador;
        fila.appendChild(celdaNum1);

        // Columna 2: Editable
        let celdaEditable1 = document.createElement("td");
        celdaEditable1.setAttribute("contenteditable", "true");
        celdaEditable1.setAttribute("id", `m${contador}`); // Asigna un ID único
        fila.appendChild(celdaEditable1);

        // Columna 3: Número (No editable)
        let celdaNum2 = document.createElement("td");
        celdaNum2.textContent = contador + 10;
        fila.appendChild(celdaNum2);

        // Columna 4: Editable
        let celdaEditable2 = document.createElement("td");
        celdaEditable2.setAttribute("contenteditable", "true");
        celdaEditable2.setAttribute("id", `m${contador + 10}`); // Asigna un ID único
        fila.appendChild(celdaEditable2);

        // Columna 5: Número (No editable)
        let celdaNum3 = document.createElement("td");
        celdaNum3.textContent = contador + 20;
        fila.appendChild(celdaNum3);

        // Columna 6: Editable
        let celdaEditable3 = document.createElement("td");
        celdaEditable3.setAttribute("contenteditable", "true");
        celdaEditable3.setAttribute("id", `m${contador + 20}`); // Asigna un ID único
        fila.appendChild(celdaEditable3);

        // Columna 7: Número (No editable)
        let celdaNum4 = document.createElement("td");
        celdaNum4.textContent = contador + 30;
        fila.appendChild(celdaNum4);

        // Columna 8: Editable
        let celdaEditable4 = document.createElement("td");
        celdaEditable4.setAttribute("contenteditable", "true");
        celdaEditable4.setAttribute("id", `m${contador + 30}`); // Asigna un ID único
        fila.appendChild(celdaEditable4);

        tbody.appendChild(fila);
        contador++; // Incrementa el contador para la siguiente fila
    }


    let datosGuardadosTabla = sessionStorage.getItem("tablaMediciones");
    if (datosGuardadosTabla) {
        let datosTabla = JSON.parse(datosGuardadosTabla);
        [...tabla.rows].forEach((fila, index) => {
            // Recupera solo los valores de las celdas editables
            const celdasEditables = fila.querySelectorAll("td:nth-child(even)");
            if (datosTabla[index]) {
                celdasEditables.forEach((celda, i) => {
                    if (datosTabla[index][i]) {
                        celda.textContent = datosTabla[index][i];
                    }
                });
            }
        });
    }

    let nivelIluminacionGuardado = sessionStorage.getItem("nivelIluminacionRequerido");
    if (nivelIluminacionGuardado !== null) {
        nivelIluminacionInput.value = nivelIluminacionGuardado;
    }

    let nroMedicionesGuardado = sessionStorage.getItem("nroMedicionesValue");
    let emedioGuardado = sessionStorage.getItem("emedioValue");
    let minimoGuardado = sessionStorage.getItem("minimoValue");
    let ilumGeneralTextGuardado = sessionStorage.getItem("ilumGeneralText");
    let uniformidadTextGuardado = sessionStorage.getItem("uniformidadText");
    let ilumGeneralColorGuardado = sessionStorage.getItem("ilumGeneralColor");
    let uniformidadColorGuardado = sessionStorage.getItem("uniformidadColor");

    if (nroMedicionesGuardado !== null) {
        document.getElementById("nroMediciones").textContent = nroMedicionesGuardado;
    }
    if (emedioGuardado !== null) {
        document.getElementById("emedio").textContent = emedioGuardado;
    }
    if (minimoGuardado !== null) {
        document.getElementById("minimo").textContent = minimoGuardado;
    }
    if (ilumGeneralTextGuardado !== null) {
        document.getElementById("ilum-general").textContent = ilumGeneralTextGuardado;
    }
    if (uniformidadTextGuardado !== null) {
        document.getElementById("uniformidad").textContent = uniformidadTextGuardado;
    }
    if (ilumGeneralColorGuardado !== null) {
        document.getElementById("ilum-general").style.color = ilumGeneralColorGuardado;
    }
    if (uniformidadColorGuardado !== null) {
        document.getElementById("uniformidad").style.color = uniformidadColorGuardado;
    }

    tabla.addEventListener("input", function () {
        let datosAGuardar = {};
        [...tabla.rows].forEach((fila, index) => {
            // Guarda solo los valores de las celdas editables
            const celdasEditables = fila.querySelectorAll("td:nth-child(even)");
            let valoresFila = Array.from(celdasEditables).map((celda) => celda.textContent.trim());
            if (valoresFila.some(valor => valor !== "")) {
                datosAGuardar[index] = valoresFila;
            }
        });
        sessionStorage.setItem("tablaMediciones", JSON.stringify(datosAGuardar));
    });

    nivelIluminacionInput.addEventListener("input", function () {
        sessionStorage.setItem("nivelIluminacionRequerido", nivelIluminacionInput.value);
    });
});

// Esta función borra los valores de la tabla y el input en mediciones.html
function borrarTabla() {
    console.log("Ejecutando borrarTabla...");

    // Borrar datos de sessionStorage completamente (existente - sin cambios)
    sessionStorage.removeItem("tablaMediciones");
    sessionStorage.removeItem("nivelIluminacionRequerido");

    // NUEVO - Borrar de sessionStorage para los resultados calculados
    sessionStorage.removeItem("nroMedicionesValue");
    sessionStorage.removeItem("emedioValue");
    sessionStorage.removeItem("minimoValue");
    sessionStorage.removeItem("ilumGeneralText");
    sessionStorage.removeItem("uniformidadText");
    sessionStorage.removeItem("ilumGeneralColor");
    sessionStorage.removeItem("uniformidadColor");

    // Borrar los valores de la tabla (existente - SIN CAMBIOS, borra todas las celdas)
    document.querySelectorAll("#tabla tbody td:nth-child(even)").forEach(celda => {
        celda.textContent = "";
    });

    // Borrar el input del nivel de iluminación requerido (existente - sin cambios)
    let nivelIluminacionInput = document.querySelector("#nivel-iluminacion-requerido");
    if (nivelIluminacionInput) {
        nivelIluminacionInput.value = "";
    }

    // Borrar los resultados mostrados en la página (existente - sin cambios)
    document.getElementById("nroMediciones").textContent = "-";
    document.getElementById("emedio").textContent = "-";
    document.getElementById("minimo").textContent = "-";
    document.getElementById("ilum-general").textContent = "";
    document.getElementById("uniformidad").textContent = "";

    // Confirmar que los datos fueron eliminados de sessionStorage (existente - sin cambios)
    setTimeout(() => {
        console.log("Verificación final en sessionStorage (debe ser null):", sessionStorage.getItem("tablaMediciones"));
    }, 100);
}

// Fin rutinas para almacenar temporalmente las tablas

//rutina para almacenar index.html

document.addEventListener("DOMContentLoaded", function () {
    const inputs = ["largo", "ancho", "luminaria"];

    // Cargar datos desde sessionStorage al cargar la página
    inputs.forEach(id => {
        const inputElement = document.getElementById(id);
        const storedValue = sessionStorage.getItem(id);
        if (storedValue) {
            inputElement.value = storedValue;
        }

        // Guardar cambios en sessionStorage cada vez que el usuario escribe
        inputElement.addEventListener("input", function () {
            sessionStorage.setItem(id, this.value);
        });
    });

window.borrarTodo = function () {
    // Borrar todos los inputs
    const inputs = ["largo", "ancho", "luminaria"];
    inputs.forEach(id => {
        sessionStorage.removeItem(id);
        document.getElementById(id).value = "";
    });

    // Borrar las frases almacenadas en sessionStorage
    sessionStorage.removeItem("fraseIndice");
    sessionStorage.removeItem("fraseResultado");

    // Limpiar los resultados en la página
    document.getElementById('indice').innerHTML = "";
    document.getElementById('resultado').innerHTML = "";
};

});


// fin rutina index.html


//Esta función borra las caja y resultados de index.htlm
function borrarTodo() {
  document.querySelector('#largo').value = ''
  document.querySelector('#ancho').value = ''
  document.querySelector('#luminaria').value = ''
  limpiarCajasResultados();
}

//Esta función determina el numero de puntos mínimo a medir en la página index.html
function calcular() {
    largo = parseFloat(document.getElementById('largo').value);
    if (isNaN(largo) || (largo <= 0)) {
        limpiarCajasResultados();
        alert('La expresión ingresada en Largo no es válida o es menor o igual a 0. Vuelva a ingresar el valor');
        return;
    }
    ancho = parseFloat(document.getElementById('ancho').value);
    if (isNaN(ancho) || (ancho <= 0)) {
        limpiarCajasResultados();
        alert('La expresión ingresada en ancho no es válida o es menor o igual a 0. Vuelva a ingresar el valor');
        return;
    }
    altura = parseFloat(document.getElementById('luminaria').value);
    if (isNaN(altura) || (altura <= 0)) {
        limpiarCajasResultados();
        alert('La expresión ingresada en Altura de las luminarias no es válida o es menor o igual a 0. Vuelva a ingresar el valor');
        return;
    }
    // Calcula el valor índice local
    indiceLocal = ancho * largo / (altura * (ancho + largo));
    console.log(indiceLocal);
    if (indiceLocal <= 3) {
        indiceLocalAdoptado = Math.trunc(indiceLocal) + 1;
    } else {
        indiceLocalAdoptado = 4;
    }
    // Número de puntos mínimos de medición
    numeroPuntos = (indiceLocalAdoptado + 2) * (indiceLocalAdoptado + 2);
    
    // Frases para mostrar
    let fraseIndice = `El índice del local es: ${indiceLocalAdoptado}`;
    let fraseResultado = `Puntos mínimos de medición: ${numeroPuntos}`;

    // Mostrar en el HTML
    let parrafoIndice = document.getElementById('indice');
    let parrafoResultado = document.getElementById('resultado');
    parrafoIndice.innerHTML = fraseIndice;
    parrafoResultado.innerHTML = fraseResultado;

    // Guardar las frases completas en sessionStorage
    sessionStorage.setItem("fraseIndice", fraseIndice);
    sessionStorage.setItem("fraseResultado", fraseResultado);

     // Guardar indiceLocalAdoptado en sessionStorage
    sessionStorage.setItem("indiceLocalAdoptado", indiceLocalAdoptado);
}

//rutina para recuperar las frases de index.html
document.addEventListener("DOMContentLoaded", function () {
    // Recuperamos las frases de sessionStorage si existen
    const fraseIndiceGuardada = sessionStorage.getItem("fraseIndice");
    const fraseResultadoGuardada = sessionStorage.getItem("fraseResultado");

    // Si existen, las mostramos en los elementos correspondientes
    if (fraseIndiceGuardada && fraseResultadoGuardada) {
        document.getElementById('indice').innerHTML = fraseIndiceGuardada;
        document.getElementById('resultado').innerHTML = fraseResultadoGuardada;
    }

    // Cargar datos desde sessionStorage al cargar la página para los inputs
    const inputs = ["largo", "ancho", "luminaria"];
    inputs.forEach(id => {
        const inputElement = document.getElementById(id);
        const storedValue = sessionStorage.getItem(id);
        if (storedValue) {
            inputElement.value = storedValue;
        }

        // Guardar cambios en sessionStorage cada vez que el usuario escribe
        inputElement.addEventListener("input", function () {
            sessionStorage.setItem(id, this.value);
        });
    });
});





function limpiarCajasResultados(){
  let parrafoIndice = document.getElementById('indice');
  let parrafoResultado = document.getElementById('resultado');
  parrafoIndice.innerHTML=`El índice del local es: `;
  parrafoResultado.innerHTML = `Puntos mínimos de medición: `;
  return;
}

//Esta función lee los valores de la tabla en la página mediciones y realiza los cálculos de promedio y mínimo
function leerTabla() {
    let mediciones = [];
    // Selecciona solo las celdas editables
    let celdas = document.querySelectorAll("#tabla tbody td:nth-child(even)");

    for (let celda of celdas) {
        let valor = celda.textContent.trim();

        // Si la celda está vacía, simplemente la ignoramos
        if (valor === "") {
            continue;
        }

        // Validación: verificar que el contenido sea un número real mayor a 0
        if (isNaN(valor) || parseFloat(valor) <= 0) {
            alert("Error: Todas las celdas con valores deben contener un número real mayor a 0.");
            celda.textContent = ""; // Borra el contenido de la celda con error
            // Posicionar el cursor en la celda con error
            celda.focus();
            //Borra los resltados en la página mediciones.html
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

    //Escribe los resultados en la página mediciones.html
    document.getElementById("nroMediciones").textContent = nroMediciones;
    document.getElementById("emedio").textContent = emedio;
    document.getElementById("minimo").textContent = minimo;

    // NUEVO - Guardar en sessionStorage para nroMediciones, emedio y minimo
    sessionStorage.setItem("nroMedicionesValue", nroMediciones);
    sessionStorage.setItem("emedioValue", emedio);
    sessionStorage.setItem("minimoValue", minimo);

    // Si el númro de mediciones es menor a 1 interrumpe el cálculo y da error
    if (nroMediciones<=0){
        alert("Ingrese en la tabla los valores medidos");
        return;
    }

    // Si la celda de iluminación requerido está vacía o se ingresó valores no numéricos, señala error
    nivelIluminacionRequerido = parseFloat(document.getElementById('nivel-iluminacion-requerido').value);
    console.log(nivelIluminacionRequerido);
    if (isNaN(nivelIluminacionRequerido) || (nivelIluminacionRequerido<=0)) {
        alert("Debe ingresar un valor de iluminación requerido para chequear el cumplimiento de la legislación");
        return;
    }
    parrafo = document.getElementById("ilum-general");
    if (emedio < nivelIluminacionRequerido) {
        parrafo.style.color = "red"; // Se vuelve rojo si la iluminación promedio es menor al requerido
        document.getElementById("ilum-general").textContent = "El nivel de iluminación general NO CUMPLE con la legislación vigente";
    } else {
        parrafo.style.color = "green"; // Se vuelve rojo si la iluminación promedio es menor al requerido
        document.getElementById("ilum-general").textContent = "El nivel de iluminación general CUMPLE con la legislación vigente";
    }
    // NUEVO - Guardar en sessionStorage para ilum-general
    sessionStorage.setItem("ilumGeneralText", document.getElementById("ilum-general").textContent);
    sessionStorage.setItem("ilumGeneralColor", parrafo.style.color); // Guarda el color

    parrafo = document.getElementById("uniformidad");
    if (minimo < emedio/2) {
        parrafo.style.color = "red"; // Se vuelve rojo si no cumple con la uniformidad
        document.getElementById("uniformidad").textContent = "El nivel de uniformidad NO CUMPLE con la legislación vigente";
    } else {
        parrafo.style.color = "green"; // Se vuelve verde si cumple con la uniformidad
        document.getElementById("uniformidad").textContent = "El nivel de uniformidad CUMPLE con la legislación vigente";
    }
    // NUEVO - Guardar en sessionStorage para uniformidad
    sessionStorage.setItem("uniformidadText", document.getElementById("uniformidad").textContent);
    sessionStorage.setItem("uniformidadColor", parrafo.style.color); // Guarda el color
}

//A usar en localizada.html
function evaluar() {  // Ubica las rectas horizontales y verticales de acuerdo de acuerdo con los datos
  
    actualizarGrafico(parseFloat(document.getElementById('nivel-iluminacion-general').value), parseFloat(document.getElementById('nivel-iluminacion-localizada').value));
  return;
}

function resetear() {  //resetea el gráfico a los valores inciales de localizada y general = 0
 
    document.getElementById('nivel-iluminacion-general').value='';
    document.getElementById('nivel-iluminacion-localizada').value='';

    actualizarGrafico(0, 0);
  return;

}



// Declara las variables
let largo = 0;
let ancho = 0;
let altura = 0;
let numeroPuntos = 0;  // Esta variable almacena el valor de puntos minimos de medición
let indiceLocal = 0;
let indiceLocalAdoptado = 0;
let nivelIluminacionRequerido = 0;
let parrafo ="";

