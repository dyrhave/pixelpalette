const container = document.getElementById('container');
const colorPicker = document.getElementById('colorPicker')
const currentColorText = document.getElementById('currentColor')
const clearButton = document.getElementById('clearButton');
let isDrawing = false;
let drawingMode = 'normal';
let shadingLevel = 0;

function setDrawingMode(mode) {
    drawingMode = mode;
    ['toggleRandomColor', 'toggleDarken', 'toggleLighten'].forEach(id => {
        const element = document.getElementById(id);
        if(element.id === `toggle${mode.charAt(0).toUpperCase() + mode.slice(1)}`) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

document.getElementById('toggleRandomColor').addEventListener('click', () => setDrawingMode('random'));
document.getElementById('toggleDarken').addEventListener('click', () => setDrawingMode('darken'));
document.getElementById('toggleLighten').addEventListener('click', () => setDrawingMode('lighten'));

function applyColor(target, baseColor) {
    switch(drawingMode) {
        case 'random':
            target.style.backgroundColor = getRandomRGB();
            break;
        case 'darken':
            shadingLevel = Math.min(shadingLevel + 0.1, 1);
            target.style.backgroundColor = darkenColor(baseColor, shadingLevel);
            break;
        case 'lighten':
            shadingLevel = Math.min(shadingLevel + 0.1, 1);
            target.style.backgroundColor = lightenColor(baseColor, shadingLevel);
            break;
        default:
            target.style.backgroundColor = baseColor;
    }
}

function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}


function darkenColor(colorStr, percent) {
    let color = colorStr.slice(4, -1).split(',').map(Number);
    const adjustment = (amount, color) => Math.max(Math.floor(color * (1 - amount)), 0)

    return `rgb(${adjustment(percent, color[0])}, ${adjustment(percent, color[1])}, ${adjustment(percent, color[2])})`;
}

function lightenColor(colorStr, percent) {
    let color = colorStr.slice(4, -1).split(',').map(Number);
    const adjustment = (amount, color) => Math.min(Math.floor(color + (255 - color) * amount), 255);

    return `rgb(${adjustment(percent, color[0])}, ${adjustment(percent, color[1])}, ${adjustment(percent, color[2])})`;
}

colorPicker.addEventListener('input', updateCurrentColor);

function updateCurrentColor() {
    const selectedColor = colorPicker.value;
    currentColorText.textContent = `Color: ${selectedColor}`;
}

gridSizeSlider.addEventListener('input', updateGridSize)


function updateGridSize() {
    const newSize = gridSizeSlider.value;
    clearGrid();
    generateGrid(newSize)
    gridSizeText.textContent = `Canvas Size: ${newSize}`;
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
        addSquareListeners(gridSquare);
        container.appendChild(gridSquare);
    }   
}

function startDraw(e) {
    isDrawing = true;
    shadingLevel = 0;
    draw(e);
}



function clearHover(target) {
    if (!isDrawing) {
        target.style.backgroundColor = '';
    }
}

function draw(e) {
    if (!isDrawing) return;
    shadingLevel = 0;
    const selectedColor = e.target.style.backgroundColor || colorPicker.value;
    applyColor(e.target, selectedColor);
}

function addSquareListeners(square) {
    square.addEventListener('mouseenter', draw);
    square.addEventListener('mousedown', startDraw);
    square.addEventListener('mouseup', stopDraw);
}


function stopDraw() {
    isDrawing = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const currentSize = gridSizeSlider.value;
    generateGrid(currentSize);
    gridSizeText.textContent = `Canvas Size: ${currentSize}`;
})

clearButton.addEventListener('click', resetCanvas);

function resetCanvas() {
    const currentSize = gridSizeSlider.value;
    clearGrid();
    generateGrid(currentSize);
}

