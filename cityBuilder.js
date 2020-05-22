const ANIMATION_SPEED = 10;
let MOUSEDOWN = false;
let shapes = [];

let currentMouseCoordinates = {
  x: null,
  y: null,
}

let currentLineSegment = {
  start: {
    x: null,
    y: null,
  },
  end: {
    x: null,
    y: null,
  }
}

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
    drawCurrentPerspectiveLines();
    drawExistingLines();

    updateDebugFields();
}


/* EVENT LISTENERS */
registerEventListeners = () => {

  canvas.addEventListener('mousedown', (e) => {
    MOUSEDOWN = true;
    setMouseCoordinates(e);
    setLineSegmentStart(e);
    console.log("MOUSE DOWN");
  });

  canvas.addEventListener('mouseup', (e) => {
    MOUSEDOWN = false;
    setLineSegmentEnd(e);
    resetMouseCoordinates();
    resetLineSegment();
  });

  canvas.addEventListener('mousemove', (e) => {
    if(MOUSEDOWN){
      setMouseCoordinates(e);
    }
  });
}

/* UTILITY FUNCTIONS */

distanceBetween = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
}

getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}


randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

objectCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
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

/* mouse coordinates */

setLineSegmentStart = (event) => {
  currentLineSegment.start.x = event.offsetX;
  currentLineSegment.start.y = event.offsetY;
}

setLineSegmentEnd = (event) => {
  currentLineSegment.end.x = currentLineSegment.start.x;
  currentLineSegment.end.y = event.offsetY;
  shapes.push(objectCopy(currentLineSegment));
}

resetLineSegment = () => {
  currentLineSegment.start.x = null;
  currentLineSegment.start.y = null;
  currentLineSegment.end.x = null;
  currentLineSegment.end.y = null;
}

/* drawing */

drawCurrentPerspectiveLines = () => {
  if(MOUSEDOWN){
    mouse = currentMouseCoordinates;
    
    //starting point
    drawPerspectiveLines(currentLineSegment.start.x, currentLineSegment.start.y);
    //current point    
    drawPerspectiveLines(currentLineSegment.start.x, mouse.y);


    line(currentLineSegment.start.x, currentLineSegment.start.y, currentLineSegment.start.x, mouse.y);
  }
}

drawPerspectiveLines = (x, y) => {
  perspectiveLine(x, y, vp1.x, vp1.y);
  perspectiveLine(x, y, vp2.x, vp2.y);
}

drawExistingLines = () => {
  shapes.forEach((shape) => {
    line(shape.start.x, shape.start.y, shape.end.x, shape.end.y);
    drawPerspectiveLines(shape.start.x, shape.start.y);
    drawPerspectiveLines(shape.end.x, shape.end.y);
  })
}

/* DEBUGGER CODE*/

updateDebugFields = () => {
  document.getElementById("mouse-coords").innerText = `${currentMouseCoordinates.x}, ${currentMouseCoordinates.y}`;
}

init(); 