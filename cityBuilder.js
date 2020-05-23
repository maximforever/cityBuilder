const ANIMATION_SPEED = 10;
let MOUSEDOWN = false;
let shapes = [];

let currentMouseCoordinates = {
  x: null,
  y: null,
}

const defaultShape = {
  one:{
    x: null,
    y: null,
  },
  two:{
    x: null,
    y: null,
  },
  three:{
    x: null,
    y: null,
  },
  four:{
    x: null,
    y: null,
  }
}

let currentShape = objectCopy(defaultShape);

// vanishingPoints
let vp1 = {
  x: 5,
  y: HEIGHT/2,
}

let vp2 = {
  x: WIDTH - 5,
  y: HEIGHT/2,
}

init = () => {
    registerEventListeners();
    draw();
    setInterval(draw, ANIMATION_SPEED);
}

draw = () => {
    clear();
    drawBackground();
    drawVanishingPoints();
    drawInProgressShape();
    drawExistingLines();

    updateDebugFields();
}


/* EVENT LISTENERS */
registerEventListeners = () => {

  canvas.addEventListener('mousedown', (e) => {
    MOUSEDOWN = true;
    setMouseCoordinates(e);
    setShapeStart(e);
  });

  canvas.addEventListener('mouseup', (e) => {
    MOUSEDOWN = false;
    resetMouseCoordinates();
    setShapeEnd();
  });

  canvas.addEventListener('mousemove', (e) => {
    if(MOUSEDOWN){
      setMouseCoordinates(e);
    }
  });
}

/* UTILITY FUNCTIONS */

function distanceBetween(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
}

function getRandomElement(array){
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}


function randomBetween(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function objectCopy(obj){
  return JSON.parse(JSON.stringify(obj))
}


function calculateY(point, vp, correspondingX){
  const slope = calculateSlope(point, vp);
  const deltaX = Math.abs(correspondingX - point.x);
  return point.y - deltaX * slope;
}

function calculateSlope(pt1, pt2){
  const slope = (pt1.y - pt2.y)/(pt1.x - pt2.x)
  return slope;
}

/* DRAWING  */ 


/* mouse coordinates */
setMouseCoordinates = (event) => {
  currentMouseCoordinates.x = event.offsetX;
  currentMouseCoordinates.y = event.offsetY;
}

resetMouseCoordinates = () => {
  currentMouseCoordinates.x = null;
  currentMouseCoordinates.y = null;
}

/* shape */

setShapeStart = (event) => {
  currentShape.one.x = event.offsetX;
  currentShape.one.y = event.offsetY;
}

setShapeEnd = (event) => {
  shapes.push(objectCopy(currentShape));
  resetShape();
}

resetShape = () => {
  currentShape = objectCopy(defaultShape);
}

/* drawing */

drawInProgressShape = () => {
  if(MOUSEDOWN){
    const mouse = currentMouseCoordinates;
    const currentLineEnd = {
      x: currentShape.one.x, 
      y: mouse.y,
    }

    const vp = mouse.x < currentShape.one.x ? vp1 : vp2

    //starting point
    drawPerspectiveLines(currentShape.one.x, currentShape.one.y);
    //current point    
    drawPerspectiveLines(currentShape.one.x, mouse.y);

    currentShape.two = {
      x: currentShape.one.x,
      y: mouse.y,
    }

    currentShape.three = {
      x: mouse.x,
      y: calculateY(currentLineEnd, vp, mouse.x),
    }

    currentShape.four = {
      x: mouse.x,
      y: calculateY(currentShape.one, vp, mouse.x),
    }

    drawShape(currentShape);
  }
}

drawPerspectiveLines = (x, y) => {
  perspectiveLine(x, y, vp1.x, vp1.y);
  perspectiveLine(x, y, vp2.x, vp2.y);
}

drawVanishingPoints = () => {
  circle(vp1.x, vp1.y, 3, "orange");
  circle(vp2.x, vp2.y, 3, "orange");
}

drawExistingLines = () => {
  shapes.forEach((shape) => {
    drawShape(shape);
    //drawPerspectiveLines(shape.one.x, shape.one.y);
    //drawPerspectiveLines(shape.two.x, shape.two.y);
  })
}

drawShape = (shape) => {
  line(shape.one.x, shape.one.y, shape.two.x, shape.two.y);
  line(shape.two.x, shape.two.y, shape.three.x, shape.three.y);
  line(shape.three.x, shape.three.y, shape.four.x, shape.four.y);
  line(shape.four.x, shape.four.y, shape.one.x, shape.one.y);
}

/* DEBUGGER CODE*/

updateDebugFields = () => {
  document.getElementById("mouse-coords").innerText = `${currentMouseCoordinates.x}, ${currentMouseCoordinates.y}`;
  document.getElementById("current-shape").innerText = JSON.stringify(currentShape);
}

init(); 