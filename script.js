// Get canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Get window size
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

//IIFE (Immediately Invoked Function Expression) to create the canvas grid
(() => DrawGrid())();

// Variables
let hasListener = true
const canvasArea = canvas.getBoundingClientRect();
const nodeArray = []
const firstNode = {
    x: 0,
    y: 0
}
Object.seal(firstNode)

// Add click event to canvas
canvas.addEventListener('click', ClickHandle);

/***********************FUNCTIONS***********************/

function DrawGrid() {
    const cellSize = 20
    const color = '#cccccc57'
    // Grid style
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= windowWidth; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, windowHeight);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= windowHeight; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(windowWidth, y);
        ctx.stroke();
    }

    ctx.closePath()
}

function ClickHandle(event) {
    // Remove first node from array
    if (nodeArray.length === 2) {
        nodeArray.shift()
    }

    // Get mouse coordinates
    const x_pos = event.clientX - canvasArea.left;
    const y_pos = event.clientY - canvasArea.top;

    // Draw node
    DrawNode(x_pos, y_pos);

    // Save first node
    if (nodeArray.length === 0) {
        firstNode.x = x_pos
        firstNode.y = y_pos
    }

    // Push the node position to the array
    nodeArray.push({ x: x_pos, y: y_pos })

    // If nodeArray has 2 nodes, draw a line and shift the older value
    if (nodeArray.length === 2) {
        DrawLine();
    }
}

function DrawNode(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function DrawLine() {
    ctx.beginPath();
    ctx.moveTo(nodeArray[0].x, nodeArray[0].y)
    ctx.lineTo(nodeArray[1].x, nodeArray[1].y)
    ctx.strokeStyle = 'black'
    ctx.stroke();
    ctx.closePath();
}

function ClosePolygon() {
    if (nodeArray.length === 2) {
        nodeArray.shift();
        nodeArray.push(firstNode);
        DrawLine();
        nodeArray.splice(0, nodeArray.length)
        canvas.removeEventListener('click', ClickHandle);
        hasListener = false
    } else {
        return
    }
}

function Reset() {
    if (!hasListener) {
        canvas.addEventListener('click', ClickHandle);
        hasListener = true
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawGrid();
}