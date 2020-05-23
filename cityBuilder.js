const ANIMATION_SPEED = 10;
let MOUSEDOWN = false;
let CMDDOWN = false;
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
    drawFinishedShapes();

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
    if(CMDDOWN){
      resetShape();
    } else {
      saveShape();
    }    
  });

  canvas.addEventListener('mousemove', (e) => {
    if(MOUSEDOWN){
      setMouseCoordinates(e);
    }
  });

  window.addEventListener('keydown', (e) => {
    console.log(e.which);
    if(e.which === 91){
      CMDDOWN = true
    }
  });

  window.addEventListener('keyup', (e) => {
    if(e.which === 91 && CMDDOWN){
      CMDDOWN = false;
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
  const differenceInX = correspondingX - point.x;
  return point.y - differenceInX * slope;
}

function calculateSlope(pt1, pt2){
  const slope = (pt2.y - pt1.y)/Math.abs(pt2.x - pt1.x);
  console.log(slope);
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

saveShape = (event) => {
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
    const startingPoint = currentShape.one;
//    const vp = mouse.x < startingPoint.x ? vp1 : vp2

    currentShape.two = {
      x: startingPoint.x,
      y: calculateY(mouse, vp1, startingPoint.x),
    }

    currentShape.three = {
      x: mouse.x,
      y: mouse.y,
    }

    currentShape.four = {
      x: mouse.x,
      y: calculateY(startingPoint, vp1, mouse.x),
    }

    //starting point
    drawPerspectiveLines(startingPoint.x, startingPoint.y);
    //current point    
    drawPerspectiveLines(startingPoint.x, currentShape.two.y);

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

drawFinishedShapes = () => {
  shapes.forEach((shape) => {
    drawShape(shape);
  })
}

drawShape = (shape) => {
  line(shape.one.x, shape.one.y, shape.two.x, shape.two.y);
  line(shape.two.x, shape.two.y, shape.three.x, shape.three.y);
  line(shape.three.x, shape.three.y, shape.four.x, shape.four.y);
  line(shape.four.x, shape.four.y, shape.one.x, shape.one.y);

  circle(shape.one.x, shape.one.y, 2, "#59ffec");
  circle(shape.two.x, shape.two.y, 2, "#59ffec");
  circle(shape.three.x, shape.three.y, 2, "#59ffec");
  circle(shape.four.x, shape.four.y, 2, "#59ffec");

  text("1", shape.one.x - 10, shape.one.y, 14, "#59ffec", true);
  text("2", shape.two.x - 10, shape.two.y, 14, "#59ffec", true);
  text("3", shape.three.x - 10, shape.three.y, 14, "#59ffec", true);
  text("4", shape.four.x - 10, shape.four.y, 14, "#59ffec", true);
}

/* DEBUGGER CODE*/

updateDebugFields = () => {
  document.getElementById("mouse-coords").innerText = `${currentMouseCoordinates.x}, ${currentMouseCoordinates.y}`;
  document.getElementById("current-shape").innerText = JSON.stringify(currentShape, undefined, 2);
}

init(); 