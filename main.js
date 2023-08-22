const container = document.getElementById('container');
const rows = 16;
const columns = 16;
let isDrawing = false;

gridSizeSlider.addEventListener('input', updateGridSize)

function updateGridSize() {
    const newSize = gridSizeSlider.value;
    clearGrid();
    generateGrid(newSize)
    gridSizeText.textContent = `Grid Size: ${newSize}`;
}


function clearGrid() {
    container.innerHTML = '';
}

function generateGrid(size) {
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const gridSquare = document.createElement('div');
        gridSquare.classList.add('grid-square');
        container.appendChild(gridSquare);
    }

    container.addEventListener('mousedown', startDraw);
    container.addEventListener('mouseup', stopDraw);
    container.addEventListener('mousemove', (e) => draw(e, 'black'));
}

container.addEventListener('mouseup', stopDraw);
document.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        draw(e, 'black');
    }
});

function startDraw(e) {
    isDrawing = true;
    draw(e, 'black');
}

function draw(e, color) {
    if (!isDrawing) return;
    e.target.style.backgroundColor = color;
}

function stopDraw() {
    isDrawing = false;
}

document.addEventListener('DOMContentLoaded', () => {
    generateGrid(16);
})