const ANIMATION_SPEED = 10;
let MOUSEDOWN = false;
let CMDDOWN = false;
let SHAPE_IN_PROGRESS = false;
let shapes = [];
let inProgressRectangle = {}

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
  },
  five:{
    x: null,
    y: null,
  },
  six:{
    x: null,
    y: null,
  },
  seven:{
    x: null,
    y: null,
  },
  eight:{
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

    if(!SHAPE_IN_PROGRESS){
      setShapeStart(e);
    }
    
    setMouseCoordinates(e);
  });

  canvas.addEventListener('mouseup', (e) => {
    MOUSEDOWN = false;

    if(CMDDOWN){
      resetShape();
    } else if(!SHAPE_IN_PROGRESS) {
      SHAPE_IN_PROGRESS = true;
      saveInProgressRectangle();
    } else {
      saveShape();
    }   
  });

  canvas.addEventListener('mousemove', (e) => {
    setMouseCoordinates(e);
  });

  window.addEventListener('keydown', (e) => {
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
  const modifier = vp.x < point.x ? 1 : -1


  return point.y - differenceInX * (modifier * slope);
}

function calculateSlope(pt1, pt2){
  const slope = (pt2.y - pt1.y)/Math.abs(pt2.x - pt1.x);
  return slope;
}

function intersectionOfTwoLines(point1, point2, point3, point4){
  const slope1 = calculateSlope()
}

/* DRAWING  */ 


/* mouse coordinates */
setMouseCoordinates = (event) => {
  currentMouseCoordinates.x = event.offsetX;
  currentMouseCoordinates.y = event.offsetY;
}

/* shape */

setShapeStart = (event) => {
  currentShape.one.x = event.offsetX;
  currentShape.one.y = event.offsetY;
}

saveShape = () => {
  console.log("SAVING!");
  shapes.push(objectCopy(currentShape));
  SHAPE_IN_PROGRESS = false;
  resetShape();
}

saveInProgressRectangle = () => {
  inProgressRectangle = {
    one: currentShape.one,
    two: currentShape.two,
    three: currentShape.three,
    four: currentShape.four,
  }
}

resetShape = () => {
  inProgressRectangle = {};
  currentShape = objectCopy(defaultShape);
}

/* drawing */

drawInProgressShape = () => {
  if(MOUSEDOWN){
    const mouse = currentMouseCoordinates;
    const vp = mouse.x < currentShape.one.x ? vp1 : vp2

    currentShape.two = {
      x: currentShape.one.x,
      y: calculateY(mouse, vp1, currentShape.one.x),
    }

    currentShape.three = {
      x: mouse.x,
      y: mouse.y,
    }

    currentShape.four = {
      x: mouse.x,
      y: calculateY(currentShape.one, vp1, mouse.x),
    }
  }

  if(SHAPE_IN_PROGRESS){
    const mouse = currentMouseCoordinates;

    currentShape.one = inProgressRectangle.one;
    currentShape.two = inProgressRectangle.two;
    currentShape.three = inProgressRectangle.three;
    currentShape.four = inProgressRectangle.four;

    currentShape.five = {
      x: mouse.x,
      y: calculateY(currentShape.three, vp2, mouse.x),
    }

    currentShape.six = {
      x: mouse.x,
      y: calculateY(currentShape.four, vp2, mouse.x),
    }

    // currentShape.seven = {
    //   x: calculateY(currentShape.six, vp1, mouse.x),,
    //   y: ,
    // }

    // currentShape.eight = {
    //   x: ,
    //   y: ,
    // }
  
    drawPerspectiveLines(currentShape.five.x, currentShape.five.y);
    drawPerspectiveLines(currentShape.six.x, currentShape.six.y);
  }

  if(MOUSEDOWN || SHAPE_IN_PROGRESS){
    //starting point
    drawPerspectiveLines(currentShape.one.x, currentShape.one.y);   
    drawPerspectiveLines(currentShape.one.x, currentShape.two.y);
    drawPerspectiveLines(currentShape.three.x, currentShape.three.y);
    drawPerspectiveLines(currentShape.four.x, currentShape.four.y);
  }

  drawShape(currentShape);
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

  circle(shape.one.x, shape.one.y, 4, "#59ffec");
  circle(shape.two.x, shape.two.y, 4, "#59ffec");
  circle(shape.three.x, shape.three.y, 4, "#59ffec");
  circle(shape.four.x, shape.four.y, 4, "#59ffec");

  text("1", shape.one.x - 10, shape.one.y, 14, "#59ffec", true);
  text("2", shape.two.x - 10, shape.two.y, 14, "#59ffec", true);
  text("3", shape.three.x - 10, shape.three.y, 14, "#59ffec", true);
  text("4", shape.four.x - 10, shape.four.y, 14, "#59ffec", true);

  if(shape.five.x){
    line(shape.five.x, shape.five.y, shape.six.x, shape.six.y);
    // line(shape.six.x, shape.six.y, shape.seven.x, shape.seven.y);
    // line(shape.seven.x, shape.seven.y, shape.eight.x, shape.eight.y);
    // line(shape.eight.x, shape.eight.y, shape.five.x, shape.five.y);

    circle(shape.five.x, shape.five.y, 4, "#59ffec");
    circle(shape.six.x, shape.six.y, 4, "#59ffec");
    //circle(shape.seven.x, shape.seven.y, 4, "#59ffec");
    // circle(shape.eight.x, shape.eight.y, 4, "#59ffec");

    text("5", shape.five.x - 10, shape.five.y, 14, "#59ffec", true);
    text("6", shape.six.x - 10, shape.six.y, 14, "#59ffec", true);
    //text("7", shape.seven.x - 10, shape.seven.y, 14, "#59ffec", true);
    // text("8", shape.eight.x - 10, shape.eight.y, 14, "#59ffec", true);
  }

}

/* DEBUGGER CODE*/

updateDebugFields = () => {
  document.getElementById("mouse-coords").innerText = `${currentMouseCoordinates.x}, ${currentMouseCoordinates.y}`;
  document.getElementById("in-progress").innerText = SHAPE_IN_PROGRESS;
  document.getElementById("current-shape").innerText = JSON.stringify(currentShape, undefined, 2);
}

init(); 