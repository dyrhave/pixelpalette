const container = document.getElementById('container');
const rows = 16;
const columns = 16;
let isDrawing = false;

for (let i = 0; i < rows * columns; i++) {
    const gridSquare = document.createElement('div');
    gridSquare.classList.add('grid-square');
    container.appendChild(gridSquare);
    
    gridSquare.addEventListener('mousedown', startDraw);
}

container.addEventListener('mouseup', stopDraw);
container.addEventListener('mousemove', draw);

function startDraw(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    e.target.style.backgroundColor = 'black';
}

function stopDraw() {
    isDrawing = false;
}

container.addEventListener('mousedown', (e) => e.preventDefault());