function actualizarGrafico(general, localizada) {
    valorGeneral = general;
    valorLocalizada = localizada;

    miGrafico.data.datasets[1].data = [{ x: valorGeneral, y: 0 }, { x: valorGeneral, y: 10000 }];
    miGrafico.data.datasets[2].data = [{ x: datosGeneral[0], y: valorLocalizada }, { x: datosGeneral[datosGeneral.length - 1], y: valorLocalizada }];

    miGrafico.update();
}

const datosGeneral = [0, 125, 250, 300, 500, 600, 700];
const datosLocalizada = [0, 250, 500, 1000, 2500, 5000, 10000];
let valorGeneral = 700;
let valorLocalizada = 10000;

const ctx = document.getElementById('gral__vs__localizada').getContext('2d');

const miGrafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: datosGeneral,
        datasets: [{
            label: 'ILUMINACIÓN GENERAL VS LOCALIZADA',
            data: datosGeneral.map((x, i) => ({ x, y: datosLocalizada[i] })),
            borderColor: 'blue',
            borderWidth: 1
        }, { // Línea vertical
            label: 'GENERAL',
            data: [{ x: valorGeneral, y: Math.min(...datosLocalizada) }, { x: valorGeneral, y: Math.max(...datosLocalizada) }],
            borderColor: 'red',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5] // Línea punteada opcional
        }, { // Línea horizontal
            label: 'LOCALIZADA',
            data: [{ x: Math.min(...datosGeneral), y: valorLocalizada }, { x: Math.max(...datosGeneral), y: valorLocalizada }],
            borderColor: 'green',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5] // Línea punteada opcional
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear', // Cambio importante para permitir valores intermedios
                title: {
                    display: true,
                    text: 'GENERAL'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'LOCALIZADA'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

