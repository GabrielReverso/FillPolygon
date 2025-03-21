// Get canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Get window size
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

// IIFE (Immediately Invoked Function Expression) to create the canvas grid
(() => DrawGrid())();

// Variables
let fillColor = [255, 0, 0, 255];
let hasListener = true;
const canvasArea = canvas.getBoundingClientRect();
const nodeArray = [];
let polygonEdges = [];

// Add click event to canvas
canvas.addEventListener('click', ClickHandle);

/*********************** FUNCTIONS ***********************/

function DrawGrid() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, windowWidth, windowHeight - 60);

    const cellSize = 20;
    const color = 'rgba(236, 236, 236, 1)';
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

    ctx.closePath();
}

function ClickHandle(event) {
    const x_pos = event.clientX - canvasArea.left;
    const y_pos = event.clientY - canvasArea.top;

    DrawNode(x_pos, y_pos);

    if (nodeArray.length >= 1) {
        const lastNode = nodeArray[nodeArray.length - 1];
        DrawLine('black', lastNode.x, lastNode.y, x_pos, y_pos);
    }

    nodeArray.push({ x: x_pos, y: y_pos });
}

function DrawNode(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function DrawLine(color = 'black', x_start, y_start, x_end, y_end, width = 2) {
    ctx.beginPath();
    ctx.moveTo(x_start, y_start);
    ctx.lineTo(x_end, y_end);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();
}

function ClosePolygon() {
    if (nodeArray.length >= 3) {
        const first = nodeArray[0];
        const last = nodeArray[nodeArray.length - 1];
        DrawLine('black', last.x, last.y, first.x, first.y);

        polygonEdges = [];
        for (let i = 0; i < nodeArray.length; i++) {
            const nextIndex = (i + 1) % nodeArray.length;
            polygonEdges.push({
                x1: nodeArray[i].x,
                y1: nodeArray[i].y,
                x2: nodeArray[nextIndex].x,
                y2: nodeArray[nextIndex].y
            });
        }

        nodeArray.length = 0;
        canvas.removeEventListener('click', ClickHandle);
        hasListener = false;
    }
}

function Reset() {
    if (!hasListener) {
        canvas.addEventListener('click', ClickHandle);
        hasListener = true;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawGrid();
    polygonEdges = [];
}

async function StartScanLine() {
    // Get fill color components [R, G, B, A]
    const color = fillColor;

    // Iterate through every vertical line (Y-axis)
    for (let y = 0; y <= windowHeight - 60; y++) {
        const intersections = []; // Stores X-coordinates of edge intersections

        // Process each polygon edge
        for (const edge of polygonEdges) {
            const x1 = edge.x1, y1 = edge.y1;
            const x2 = edge.x2, y2 = edge.y2;

            // Skip horizontal edges
            if (y1 === y2) continue;

            // Determine vertical bounds of the edge
            const yMin = Math.min(y1, y2);
            const yMax = Math.max(y1, y2);

            // Check if current scanline is within edge's vertical range
            if (y >= yMin && y < yMax) {
                // Calculate intersection point using linear interpolation
                const t = (y - y1) / (y2 - y1); // Normalized position along edge
                const x = x1 + t * (x2 - x1); // X-coordinate of intersection
                intersections.push(x);
            }
        }

        // Sort intersections left-to-right for proper pairing
        intersections.sort((a, b) => a - b);

        // Get pixel data for current scanline
        const imageData = ctx.getImageData(0, y, windowWidth, 1);
        const data = imageData.data;

        // Fill between pairs of intersections (even-odd rule)
        for (let i = 0; i < intersections.length; i += 2) {
            if (i + 1 >= intersections.length) break; // Handle odd number of intersections

            // Convert floating-point intersections to integer pixel coordinates
            const xStart = Math.ceil(intersections[i]); // Round up left boundary
            const xEnd = Math.floor(intersections[i + 1]); // Round down right boundary

            // Fill pixels between boundaries
            for (let x = xStart; x <= xEnd; x++) {
                if (x < 0 || x >= windowWidth) continue; // Skip out-of-bounds pixels

                // Calculate pixel index in RGBA array (4 bytes per pixel)
                const idx = x * 4;

                // Set pixel color components
                data[idx] = color[0];     // Red
                data[idx + 1] = color[1]; // Green
                data[idx + 2] = color[2]; // Blue
                data[idx + 3] = color[3]; // Alpha
            }
        }

        // Update scanline in canvas
        ctx.putImageData(imageData, 0, y);

        // Add delay for visualization effect (optional)
        await applyDelay(() => { }, 50);
    }
}

/*********************** AUX ****************************/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function applyDelay(callback, delayMs) {
    await delay(delayMs);
    callback();
}

function setFillColor(color) {
    fillColor = color;
}