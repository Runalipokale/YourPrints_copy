const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: 500,
        height: 500,
        backgroundColor: '#fff',
        selection: false
    });
}

// const setBackground = (url, canvas) => {
//     fabric.Image.fromURL(url, (img) => {
//         canvas.backgroundImage = img
//         canvas.renderAll()
//     })
// }

const toggleMode = (mode) => {
    if (mode === modes.pan) {
        if (currentMode === modes.pan) {
            currentMode = ''
        } else {
            currentMode = modes.pan
            canvas.isDrawingMode = false
            canvas.renderAll()
        }
    } else if (mode === modes.drawing) {
        if (currentMode === modes.drawing) {
            currentMode = ''
            canvas.isDrawingMode = false
            canvas.renderAll()
        } else {
            currentMode = modes.drawing
            canvas.isDrawingMode = true
            canvas.freeDrawingBrush.color = document.getElementById('colorPicker').value
            canvas.renderAll()
        }      
    }
}

const setPanEvents = (canvas) => {
    canvas.on('mouse:move', (event) => {
        // console.log(event)
        if (mousePressed && currentMode === modes.pan) {
            canvas.setCursor('grab')
            canvas.renderAll()
            const mEvent = event.e
            const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
            canvas.relativePan(delta)
        }
    })
    // keep track of mouse down/up
    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        if (currentMode === modes.pan) {
            canvas.setCursor('grab')
            canvas.renderAll()
        }
    })
    canvas.on('mouse:up', (event) => {
        mousePressed = false
        canvas.setCursor('default')
        canvas.renderAll()
    })
}


const clearCanvas = (canvas, state) => {
    state.val = canvas.toSVG()
    canvas.getObjects().forEach((o) => {
        if(o !== canvas.backgroundImage) {
            canvas.remove(o)
        }
    })
}

const restoreCanvas = (canvas, state, bgUrl) => {
    if (state.val) {
        fabric.loadSVGFromString(state.val, objects => {
            console.log(objects)
            objects = objects.filter(o => o['xlink:href'] !== bgUrl)
            canvas.add(...objects)
            canvas.requestRenderAll()
        })
    }
}

//elements
function createCloud(canvas) {
    const canvCenter = canvas.getCenter()
    const cloud = new fabric.Path('M 20 20 L 20 0 L 50 20 Q 60 20 60 30 L 50 20 L 80 20 Q 90 20 90 30 L 90 60 Q 90 70 80 70 L 20 70 Q 10 70 10 60 L 10 30 Q 10 20 20 20');
    cloud.set({
        left: canvCenter.left,
        top: -50,
        fill: document.getElementById('colorPicker').value,
        stroke: 'black',
        strokeWidth: 2
    });
    canvas.add(cloud);
    cloud.animate('top', canvCenter.top, {
        onChange: canvas.renderAll.bind(canvas)
    });
    cloud.on('selected', () => {
        cloud.set('fill', 'lightgrey')
        console.log('selected')
        canvas.renderAll()
    })
    cloud.on('deselected', () => {
        cloud.set('fill', document.getElementById('colorPicker').value)
        canvas.renderAll()
    })
}
const createSqu = (canvas) => {
    console.log("rect")
    const canvCenter = canvas.getCenter()
    const rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: document.getElementById('colorPicker').value,
        left: canvCenter.left,
        top: -50,
        originX: 'center',
        originY: 'center',
        cornerColor: 'white'
    })
    canvas.add(rect)
    
    rect.animate('top', canvCenter.top, {
        onChange: canvas.renderAll.bind(canvas)
    });
    rect.on('selected', () => {
        rect.set('fill', 'lightgrey')
        canvas.renderAll()
    })
    rect.on('deselected', () => {
        rect.set('fill', document.getElementById('colorPicker').value)
        canvas.renderAll()
    })
}
const createRect = (canvas) => {
    console.log("rect")
    const canvCenter = canvas.getCenter()
    const rect = new fabric.Rect({
        width: 200,
        height: 100,
        fill: document.getElementById('colorPicker').value,
        left: canvCenter.left,
        top: -50,
        originX: 'center',
        originY: 'center',
        cornerColor: 'white'
    })
    canvas.add(rect)
    rect.animate('top', canvCenter.top, {
        onChange: canvas.renderAll.bind(canvas)
    });
    rect.on('selected', () => {
        rect.set('fill', 'lightgrey')
        canvas.renderAll()
    })
    rect.on('deselected', () => {
        rect.set('fill', document.getElementById('colorPicker').value)
        canvas.renderAll()
    })
}
const createTri = (canvas) => {
    const canvCenter = canvas.getCenter()
    const rect = new fabric.Triangle({
        width: 100,
        height: 100,
        fill: document.getElementById('colorPicker').value,
        left: canvCenter.left,
        top: -50,
        originX: 'center',
        originY: 'center',
        cornerColor: 'white'
    })
    canvas.add(rect)
    
    rect.animate('top', canvCenter.top, {
        onChange: canvas.renderAll.bind(canvas)
    });
    rect.on('selected', () => {
        rect.set('fill', 'lightgrey')
        canvas.renderAll()
    })
    rect.on('deselected', () => {
        rect.set('fill', document.getElementById('colorPicker').value)
        canvas.renderAll()
    })
}
const createCirc = (canvas) => {
    console.log("circ")
    const canvCenter = canvas.getCenter()
    const circle = new fabric.Circle({
        radius: 50,
        fill: document.getElementById('colorPicker').value,
        left: canvCenter.left,
        top: -50,
        originX: 'center',
        originY: 'center',
        cornerColor: 'white'
    })
    canvas.add(circle)
    canvas.renderAll()
    circle.animate('top', canvas.height - 50, {
        onChange: canvas.renderAll.bind(canvas),
        onComplete: () => {
            circle.animate('top', canvCenter.top, {
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease.easeOutBounce,
                duration: 200
            })
        }
      });
    circle.on('selected', () => {
        circle.set('fill', 'lightgrey')
        canvas.requestRenderAll()
    })
    circle.on('deselected', () => {
        circle.set('fill', document.getElementById('colorPicker').value)
        canvas.requestRenderAll()
    })
}

const groupObjects = (canvas, group, shouldGroup) => {
    if (shouldGroup) {
        const objects = canvas.getObjects()
        group.val = new fabric.Group(objects, {cornerColor: 'white'})
        clearCanvas(canvas, svgState)
        canvas.add(group.val)
        canvas.requestRenderAll()
    } else {
        group.val.destroy()
        let oldGroup = group.val.getObjects()
        clearCanvas(canvas, svgState)
        canvas.add(...oldGroup)
        group.val = null
        canvas.requestRenderAll()
    }
}

// Function to handle file select
function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgData = e.target.result;
        fabric.Image.fromURL(imgData, function(img) {
            canvas.add(img);
        });
    }
    reader.readAsDataURL(file);
}
// Function to trigger file input click
function uploadImage() {
    document.getElementById('uploadInput').click();
}

const imgAdded = (e) => {
    console.log(e)
    const inputElem = document.getElementById('myImg')
    const file = inputElem.files[0];
    reader.readAsDataURL(file)
}

const canvas = initCanvas('canvas')
const svgState = {}
let mousePressed = false
let color = '#000000'
const group = {}
const bgUrl = ''

let currentMode;

const modes = {
    pan: 'pan',
    drawing: 'drawing'
}
const reader = new FileReader()

// setBackground(bgUrl, canvas)
setPanEvents(canvas)

const inputFile = document.getElementById('myImg');
inputFile.addEventListener('change', imgAdded)

reader.addEventListener("load", () => {
    fabric.Image.fromURL(reader.result, img => {
        canvas.add(img)
        canvas.requestRenderAll()
    })
})


// t-shirt add 
function blackTshirt(){
    fabric.Image.fromURL('/tshirts/black-tshirt.png', function(img){
        canvas.add(img)
    })
}
function bottlegreenTshirt(){
    fabric.Image.fromURL('/tshirts/bottlegreen-tshirt.png', function(img){
        canvas.add(img)
    })
}
function darkblueTshirt(){
    fabric.Image.fromURL('/tshirts/darkblue-tshirt.png', function(img){
        canvas.add(img)
    })
}
function darkgreenTshirt(){
    fabric.Image.fromURL('/tshirts/darkgreen-tshirt.png', function(img){
        canvas.add(img)
    })
}
function darkorangeTshirt(){
    fabric.Image.fromURL('/tshirts/darkorange-tshirt.png', function(img){
        canvas.add(img)
    })
}
function darkyellowTshirt(){
    fabric.Image.fromURL('/tshirts/darkyellow-tshirt.png', function(img){
        canvas.add(img)
    })
}
function greyTshirt(){
    fabric.Image.fromURL('/tshirts/grey-tshirt.png', function(img){
        canvas.add(img)
    })
}
function leafgreenTshirt(){
    fabric.Image.fromURL('/tshirts/leafgreen-tshirt.png', function(img){
        canvas.add(img)
    })
}
function lightblueTshirt(){
    fabric.Image.fromURL('/tshirts/lightblue-tshirt.png', function(img){
        canvas.add(img)
    })
}
function orangeTshirt(){
    fabric.Image.fromURL('/tshirts/orange-tshirt.png', function(img){
        canvas.add(img)
    })
}
function pinkTshirt(){
    fabric.Image.fromURL('/tshirts/pink-tshirt.png', function(img){
        canvas.add(img)
    })
}
function redTshirt(){
    fabric.Image.fromURL('/tshirts/red-tshirt.png', function(img){
        canvas.add(img)
    })
}
function whiteTshirt(){
    fabric.Image.fromURL('/tshirts/white-tshirt.png', function(img){
        canvas.add(img)
    })
}
function yellowTshirt(){
    fabric.Image.fromURL('/tshirts/yellow-tshirt.png', function(img){
        canvas.add(img)
    })
}



// add text
// Function to add text to canvas
function addText() {
    const textValue = document.getElementById('myText').value;
    const font = document.getElementById('fontselect').value;
    const alignment = document.getElementById('textalignment').value;
    const color = document.getElementById('colorPicker').value;

    const text = new fabric.Text(textValue, {
        left: 100,
        top: 100,
        fontFamily: font,
        textAlign: alignment,
        fill: color,
        editable: true
    });
    canvas.add(text);
}
// Event listener for font selection
const fontSelect = document.getElementById('fontselect');
fontSelect.addEventListener('change', function() {
    const selectedFont = this.value;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set("fontFamily", selectedFont);
        canvas.renderAll();
    }
});
// Event listener for text color
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', function() {
    const selectedColor = this.value;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set("fill", selectedColor);
        canvas.renderAll();
    }
});


function removeObject() {
    const selectedObject = canvas.getActiveObject(); // Get the currently selected object
    if (selectedObject) {
        canvas.remove(selectedObject); // Remove the selected object from the canvas
        canvas.discardActiveObject(); // Deselect the removed object
        canvas.renderAll(); // Render the canvas to reflect changes
    } else {
        alert('Please select an object to remove.'); // Alert if no object is selected
    }
}

// Function to download canvas as PNG
function downloadCanvas() {
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL('image/png');
    saveAs(dataURL, 'canvas.png');
}
