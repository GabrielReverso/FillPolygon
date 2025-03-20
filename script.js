// Get canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Get window size
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

//IIFE (Immediately Invoked Function Expression) to create the canvas grid
(() => DrawGrid())();

// Variables
let fillColor = 'red'
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
	ctx.fillStyle = 'white'
	ctx.fillRect(0, 0, windowWidth, windowHeight - 60)

    const cellSize = 20
    const color = '#cccccc57'
    // Grid style
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= windowWidth; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, windowHeight - 60);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= windowHeight - 60; y += cellSize) {
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
        DrawLine('black', nodeArray[0].x, nodeArray[0].y, nodeArray[1].x, nodeArray[1].y);
    }
}

function DrawNode(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function DrawLine(color = 'black', x_start, y_start, x_end, y_end) {
    ctx.beginPath();
    ctx.moveTo(x_start, y_start)
    ctx.lineTo(x_end, y_end)
    ctx.strokeStyle = color
	ctx.lineWidth = 2
    ctx.stroke();
    ctx.closePath();
}

function ClosePolygon() {
    if (nodeArray.length === 2) {
        nodeArray.shift();
        nodeArray.push(firstNode);
        DrawLine('black', nodeArray[0].x, nodeArray[0].y, nodeArray[1].x, nodeArray[1].y);
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

async function StartScanLine() {
    const boundaryArray = []
    for(let y = 0; y <= windowHeight - 60; y++) {
        for(let x = 0; x <= windowWidth; x++) {
			/* if(!isBoundaryPixel(x, y)){
				ctx.fillStyle = fillColor;
				ctx.fillRect(x, y, 1, 1);
			} */
			if (isBoundaryPixel(x, y)){
				console.log({x: x, y: y})
				boundaryArray.push({x: x, y: y})
			}
        }
		if (boundaryArray.length >= 2) {
			/* for (let i = 0; i <= boundaryArray.length - 1; i += 2) {
				DrawLine(fillColor, boundaryArray[i].x, boundaryArray[i].j, boundaryArray[i+1].x, boundaryArray[i+1].y)
			} */
		}
		boundaryArray.splice(0, boundaryArray.length)
        await applyDelay(() => console.log("Delay complete"), 50);
    }
}


/************************AUX****************************/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function applyDelay(callback, delayMs) {
    await delay(delayMs);
    callback();
}

function isBoundaryPixel(x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;
    
    return (
    	data[0] < 80 &&
        data[1] < 80 &&
        data[2] < 80
    );
}

function setFillColor(color) {
	fillColor = color
}