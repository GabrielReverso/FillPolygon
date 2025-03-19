const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/* ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(300, 150);

// Draw the Path
ctx.stroke(); */

const dotArray  = []

// Função para capturar cliques no canvas
canvas.addEventListener('click', function(event) {
    // Obtém as coordenadas do clique em relação ao canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Desenha um círculo no local do clique
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2); // Círculo com raio 10
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    console.log(`Clique em (${x}, ${y})`);

    dotArray.push({x: x, y: y})

    if (dotArray.length === 2) {
        ctx.moveTo(dotArray[0].x, dotArray[0].y)
        ctx.lineTo(dotArray[1].x, dotArray[1].y)
        ctx.strokeStyle = 'black'
        ctx.stroke();
        dotArray.shift()
    }
});

function drawGrid(ctx, canvas, cellSize = 20, color = '#cccccc57') {
    // Configurações do grid
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Desenha linhas verticais
    for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Desenha linhas horizontais
    for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

drawGrid(ctx, canvas)