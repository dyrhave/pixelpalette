const container = document.getElementById('container');
const rows = 16
const columns = 16

for (let i = 0; i < rows * columns; i++) {
    const gridSquare = document.createElement('div');
    gridSquare.classList.add('grid-square');
    container.appendChild(gridSquare);
    gridSquare.addEventListener('mouseenter', hoverGrid)
}

function hoverGrid(e) {
    e.target.style.backgroundColor = 'black';
}

