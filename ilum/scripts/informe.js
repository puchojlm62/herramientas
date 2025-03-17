// scripts/informe.js (Código separado para generar el informe)
function informeResultado() {
    const modalPlantilla = document.getElementById('modalPlantilla');
    const botonGenerarInformeModal = document.getElementById('boton-generarInformeModal');
    const botonCancelarInformeModal = document.getElementById('boton-cancelarInformeModal');

    // Función para abrir el modal (ahora solo llama a mostrar el modal)
    window.abrirModalPlantilla = function() {
        modalPlantilla.style.display = "block";
    }

    // Función para cerrar el modal
    function cerrarModal() {
        modalPlantilla.style.display = "none";
    }

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModal.onclick = function() {
        cerrarModal();
    }

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModal.onclick = function() {
        cerrarModal(); // Cerrar el modal después de iniciar la generación del informe
        generarInformeDesdeModal(); // Llamar a la función para generar el informe
    };
}

function generarInformeDesdeModal() {
    const plantillaSeleccionada = document.querySelector('input[name="plantillaModalSeleccion"]:checked').value;
    let plantillaPromise; // Variable para almacenar la promesa de la plantilla

    if (plantillaSeleccionada === 'default') {
        // Usar plantilla predeterminada del servidor
        plantillaPromise = fetch("./plantillas/Informe_TomaMedicionesIluminacion.docx") // Ajusta la ruta al archivo
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar la plantilla predeterminada: ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            });
    } else if (plantillaSeleccionada === 'subir') {
        // Usar plantilla subida por el usuario
        const plantillaUploadInput = document.getElementById('plantillaModalUpload');
        const archivoPlantilla = plantillaUploadInput.files[0];

        if (!archivoPlantilla) {
            alert("Por favor, selecciona un archivo de plantilla.");
            return Promise.reject("No se seleccionó ningún archivo de plantilla."); // Rechazar promesa para detener el proceso
        }

        plantillaPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result); // Resolver promesa con el ArrayBuffer del archivo
            };
            reader.onerror = function(error) {
                reject(`Error al leer el archivo de plantilla: ${error}`); // Rechazar promesa en caso de error de lectura
            };
            reader.readAsArrayBuffer(archivoPlantilla); // Leer el archivo como ArrayBuffer
        });
    } else {
        alert("Opción de plantilla no válida.");
        return;
    }

    plantillaPromise.then(data => { // Usar .then() para procesar la promesa resuelta (ya sea fetch o FileReader)
        let zip;
        try {
            zip = new JSZip(data);
        } catch (error) {
            console.error("Error al cargar el ZIP con JSZip:", error);
            alert("Error al procesar la plantilla Word (JSZip).");
            return;
        }

        let doc = new window.docxtemplater().loadZip(zip);

        // Recopilar datos para el informe (ajusta esto según tus necesidades)
        let valores = {
            nivelIluminacionRequerido: document.getElementById("nivel-iluminacion-requerido").value || "",
            nroMediciones: document.getElementById("nroMediciones").textContent || "",
            emedio: document.getElementById("emedio").textContent || "",
            minimo: document.getElementById("minimo").textContent || "",
            ilumGeneral: document.getElementById("ilum-general").textContent || "",
            uniformidad: document.getElementById("uniformidad").textContent || "",
            // Obtener valores de sessionStorage, usar "" como valor predeterminado si no existen
            altura: sessionStorage.getItem('luminaria') || "", // Usar 'luminaria' porque ahí guardas la altura
            largo: sessionStorage.getItem('largo') || "",
            ancho: sessionStorage.getItem('ancho') || "",
            numeroPuntos: sessionStorage.getItem('fraseResultado') ? sessionStorage.getItem('fraseResultado').split(':')[1].trim() : "",  // Extraer el número de puntos de la frase guardada
            indiceLocalAdoptado: sessionStorage.getItem('indiceLocalAdoptado') || "" // Obtener el valor de indiceLocalAdoptado

        };

        // Recopilar valores de la tabla (asumiendo 10 filas con 4 celdas editables por fila)
        for (let i = 1; i <= 40; i++) {
            // Usar document.getElementById para acceder a las celdas por su ID
            let celda = document.getElementById(`m${i}`);

            // Verificar si la celda existe antes de acceder a su contenido
            if (celda) {
                valores[`m${i}`] = celda.textContent.trim(); // Guarda el valor en el objeto
            } else {
                valores[`m${i}`] = "";  // Si la celda no existe, asignar un valor vacío
            }
        }

        // **Importante:  Adaptar las claves del objeto `valores` para que coincidan con los placeholders de la plantilla ({} en lugar de {{}})**
        const dataParaPlantilla = {};
        for (const key in valores) {
            dataParaPlantilla[key] = valores[key];
        }

        // Añadir explícitamente el valor de nivelIluminacionRequerido al objeto dataParaPlantilla con la clave 'requerido'
        dataParaPlantilla['requerido'] = valores.nivelIluminacionRequerido;


        doc.setData(dataParaPlantilla);


        try {
            doc.render();
            let out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "Informe_Iluminacion.docx"); // Puedes cambiar el nombre del archivo de salida si quieres
        } catch (error) {
            console.error("Error generando el documento:", error);
            alert("Hubo un error al generar el informe.");
        }
    })
    .catch(error => {
        console.error("Error cargando la plantilla:", error);
        alert("No se pudo cargar la plantilla del informe.");
    });
}

// Event listeners para el Modal (mover desde el script inline del HTML)
document.addEventListener('DOMContentLoaded', () => {
    const modalPlantilla = document.getElementById('modalPlantilla');
    const botonInformeBo = document.getElementById('boton-informeBo');
    const spanCerrarModalPlantilla = document.getElementById('cerrarModalPlantilla');
    const botonGenerarInformeModal = document.getElementById('boton-generarInformeModal');
    const botonCancelarInformeModal = document.getElementById('boton-cancelarInformeModal');
    const radioSubirPlantillaModal = document.querySelector('input[name="plantillaModalSeleccion"][value="subir"]');
    const plantillaModalUploadInput = document.getElementById('plantillaModalUpload'); // Referencia al input de archivo

    // Evento para abrir el modal al hacer clic en el botón "Generar Informe" (fuera del modal)
    botonInformeBo.onclick = abrirModalPlantilla; // Llama a la función global para abrir el modal

    // Cerrar el modal al hacer clic en la "x"
    spanCerrarModalPlantilla.onclick = function() {
      modalPlantilla.style.display = "none";
    };

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModal.onclick = function() {
      modalPlantilla.style.display = "none";
    };

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModal.onclick = generarInformeDesdeModal;

    // Cerrar el modal al hacer clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modalPlantilla) {
          modalPlantilla.style.display = "none";
        }
    }

    // Mostrar/ocultar input de archivo en el modal
    radioSubirPlantillaModal.addEventListener('change', function() {
        if (this.checked) {
            plantillaModalUploadInput.style.display = 'block';
        } else {
            plantillaModalUploadInput.style.display = 'none';
        }
    });

    
});

// Llama a la función para inicializar el modal
informeResultado();