
//Este código valida que solo se ingresen numeros
// js/validacionDecimal.js
function validarNumeroReal(input) {
  let valor = input.value;

  // Eliminar caracteres no válidos
  valor = valor.replace(/[^0-9.,-]/g, '');

  // Permitir solo un signo menos al principio
  if (valor.indexOf('-') > 0) {
    valor = valor.replace(/-/g, '');
  }
  if (valor.startsWith('-') && valor.indexOf('-') !== valor.length -1) {
    valor = valor.replace(/-/g, '');
    valor = "-" + valor;
  }
  // Permitir solo una coma o punto
  const comaIndex = valor.indexOf(',');
  const puntoIndex = valor.indexOf('.');

  if (comaIndex !== -1 && puntoIndex !== -1) {
    // Si hay ambos, eliminar el segundo
    valor = valor.slice(0, Math.max(comaIndex, puntoIndex)) + valor.slice(Math.max(comaIndex, puntoIndex) + 1);
  } else if (comaIndex !== -1) {
    // Si hay coma, reemplazarla por punto
    valor = valor.replace(',', '.');
  }

  // Limitar a dos decimales
  const puntoIndexFinal = valor.indexOf('.');
  if (puntoIndexFinal !== -1 && valor.length > puntoIndexFinal + 3) {
    valor = valor.slice(0, puntoIndexFinal + 3);
  }

  input.value = valor;
}


function toggleMenu() {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("activo");
}

/* para abrir y cerrar el modal Acerca de */
document.addEventListener("DOMContentLoaded", function () {
    const modalAcerca = document.getElementById("modalAcerca");
    const openModalAcerca = document.getElementById("openModal");
    const closeModalAcerca = modalAcerca.querySelector(".close");
    
    // Abrir el modal al hacer clic en el enlace
    openModalAcerca.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el enlace recargue la página
        modalAcerca.style.display = "block";
    });

    // Cerrar el modal al hacer clic en la "X"
    closeModalAcerca.addEventListener("click", function () {
      modalAcerca.style.display = "none";
      console.log("clic");
    }); 

    // Cerrar el modal si el usuario hace clic fuera del contenido
    window.addEventListener("click", function (event) {
        if (event.target === modalAcerca) {
            modalAcerca.style.display = "none";
        }
    });
});


