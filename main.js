document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container')
    const colorPicker = document.getElementById('colorPicker');
    const colorLabel = document.getElementById('colorLabel');
    const currentColorText = document.getElementById('currentColor');
    const clearButton = document.getElementById('clearButton');
    const gridSizeSlider = document.getElementById('gridSizeSlider')
    let isDrawing = false;
    let drawingMode = 'normal';
    let shadingLevel = 0;


    function setDrawingMode(mode) {
        if (drawingMode === mode) {
            drawingMode = 'normal'
        } else {
             drawingMode = mode;
        }
        ['toggleRandomColor', 'toggleDarken', 'toggleLighten'].forEach(id => {
            const element = document.getElementById(id);
            if (drawingMode === 'normal') {
                element.classList.remove('active')
            } else if(element.id === `toggle${mode.charAt(0).toUpperCase() + mode.slice(1)}`) {
                element.classList.add('active');            
            } else {
            element.classList.remove('active');
            }
        });
    }
    /** Check if given color is considered "light" based on its luminance */
    function isLight(color) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    }
    /** Apply the selected drawing method to the target element */
    function applyColor(target, baseColor) {
        switch(drawingMode) {
            case 'randomColor':
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
                shadingLevel = 0;
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
    /** Update the displayed current color in the sidebar */
    function updateCurrentColor() {
        const selectedColor = colorPicker.value;
        colorLabel.querySelector('span').textContent = selectedColor;
    }
    /** Update det canvas grid size based on user input from size slider */
    function updateGridSize() {
        const newSize = gridSizeSlider.value;
        clearGrid();
        generateGrid(newSize)
        gridSizeText.textContent = `Canvas Size: ${newSize}`;
    }
    /** Clears all squares from grid */
    function clearGrid() {
        container.innerHTML = '';
    }
    /** Generates grid canvas with specified size */
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
    /** Initiate drawing state when mouse is pressed on a grid square */
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
    /** Perform drawing action during mouse movement */
    function draw(e) {
        if (!isDrawing) return;
        shadingLevel = 0;
        const selectedColor = e.target.style.backgroundColor || colorPicker.value;
        applyColor(e.target, selectedColor);
    }
    /** Adds necessary event listeners to grid for drawing function */
    function addSquareListeners(square) {
        square.addEventListener('mouseenter', draw);
        square.addEventListener('mousedown', startDraw);
        square.addEventListener('mouseup', stopDraw);
    }

    function stopDraw() {
        isDrawing = false;
    }

    function resetCanvas() {
        const currentSize = gridSizeSlider.value;
        clearGrid();
        generateGrid(currentSize);
    }
    /** Update the color picker display when its value changes */
    colorPicker.addEventListener('input', function() {
        colorLabel.style.backgroundColor = `${colorPicker.value}`;
        if (isLight(colorPicker.value)) {
            colorLabel.querySelector('span').style.color = '#333';
        } else {
            colorLabel.querySelector('span').style.color = '#fff';
        }
        updateCurrentColor();
    });

    gridSizeSlider.addEventListener('input', updateGridSize);

    clearButton.addEventListener('click', resetCanvas);

    document.getElementById('toggleRandomColor').addEventListener('click', () => setDrawingMode('randomColor'));
    document.getElementById('toggleDarken').addEventListener('click', () => setDrawingMode('darken'));
    document.getElementById('toggleLighten').addEventListener('click', () => setDrawingMode('lighten'));
    /** Initialize canvas grid on page load */
    const currentSize = gridSizeSlider.value;
    generateGrid(currentSize);
    gridSizeText.textContent = `Size: ${currentSize}x${currentSize}`;
    /** Prevent default browser drag behavior */
    document.addEventListener("dragstart", function(e) {
        e.preventDefault();
    });
});