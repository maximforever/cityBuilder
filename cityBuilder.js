const ANIMATION_SPEED = 10;
const SHOW_LABELS = true;
const LABEL_AS_NUMBER = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
}

const SNAP_MOUSE_DISTANCE = 12;

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
  one: {
    x: null,
    y: null,
  },
  two: {
    x: null,
    y: null,
  },
  three: {
    x: null,
    y: null,
  },
  four: {
    x: null,
    y: null,
  },
  five: {
    x: null,
    y: null,
  },
  six: {
    x: null,
    y: null,
  },
  seven: {
    x: null,
    y: null,
  },
  eight: {
    x: null,
    y: null,
  }
}

let currentShape = objectCopy(defaultShape);

// vanishingPoints
let vp1 = {
  x: 0,
  y: HEIGHT / 2,
}

let vp2 = {
  x: WIDTH,
  y: HEIGHT / 2,
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

    if (!SHAPE_IN_PROGRESS) {
      setShapeStart(e);
    }

    setMouseCoordinates(e);
  });

  canvas.addEventListener('mouseup', (e) => {
    MOUSEDOWN = false;

    if (CMDDOWN) {
      resetShape();
    } else if (!SHAPE_IN_PROGRESS) {
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
    if (e.which === 91) {
      CMDDOWN = true
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.which === 91 && CMDDOWN) {
      CMDDOWN = false;
    }
  });


}

/* UTILITY FUNCTIONS */

function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}


function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function objectCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}


function calculateY(point, vp, correspondingX) {
  const slope = calculateSlope(point, vp);
  const differenceInX = correspondingX - point.x;
  const modifier = vp.x < point.x ? 1 : -1


  return point.y - differenceInX * (modifier * slope);
}

function calculateSlope(pt1, pt2) {
  const slope = (pt2.y - pt1.y) / Math.abs(pt2.x - pt1.x);
  return slope;
}

function objectsAreIdentical(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/*TODO: understand what the fuuuuck this is doing*/
function intersectionOfTwoLines(point1, point2, point3, point4) {
  var s, s1_x, s1_y, s2_x, s2_y, t;
  s1_x = point2.x - point1.x;
  s1_y = point2.y - point1.y;
  s2_x = point4.x - point3.x;
  s2_y = point4.y - point3.y;

  s = (-s1_y * (point1.x - point3.x) + s1_x * (point1.y - point3.y)) / (-s2_x * s1_y + s1_x * s2_y);
  t = (s2_x * (point1.y - point3.y) - s2_y * (point1.x - point3.x)) / (-s2_x * s1_y + s1_x * s2_y);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {

    const intersectionPoint = {
      x: point1.x + (t * s1_x),
      y: point1.y + (t * s1_y)
    };
    return intersectionPoint;
  }
  return null;
}

/* DRAWING  */


/* mouse coordinates */
setMouseCoordinates = (event) => {
  currentMouseCoordinates.x = event.offsetX;
  currentMouseCoordinates.y = event.offsetY;

  snapMouseToExistingPoints(event.offsetX, event.offsetY);
}

// TODO: this is not performant and not pretty
snapMouseToExistingPoints = (mouseX, mouseY) => {
  if (!currentlyDrawing()) {
    shapes.forEach((shape) => {
      for (point in shape) {
        if (typeof(shape[point].x) !== "undefined") {
          if (distanceBetween(mouseX, mouseY, shape[point].x, shape[point].y) < SNAP_MOUSE_DISTANCE) {
            currentMouseCoordinates.x = shape[point].x;
            currentMouseCoordinates.y = shape[point].y;
            return;
          }
        }
      }
    });
  }
}


/* shape */

setShapeStart = (event) => {
  currentShape.color = "white";
  currentShape.one.x = currentMouseCoordinates.x;
  currentShape.one.y = currentMouseCoordinates.y;
}

saveShape = () => {
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
  if (MOUSEDOWN) {
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

  if (SHAPE_IN_PROGRESS && !CMDDOWN) {
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

    currentShape.seven = {
      x: intersectionOfTwoLines(vp1, { x: WIDTH, y: calculateY(vp1, currentShape.six, WIDTH) }, vp2, { x: 0, y: calculateY(vp2, currentShape.one, 0) }).x,
      y: intersectionOfTwoLines(vp1, { x: WIDTH, y: calculateY(vp1, currentShape.six, WIDTH) }, vp2, { x: 0, y: calculateY(vp2, currentShape.one, 0) }).y,
    }

    currentShape.eight = {
      x: currentShape.seven.x,
      y: calculateY(currentShape.five, vp1, currentShape.seven.x),
    }

    drawPerspectiveLines(currentShape.five.x, currentShape.five.y);
    drawPerspectiveLines(currentShape.six.x, currentShape.six.y);
  }

  if (currentlyDrawing()) {
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
  line(shape.one.x, shape.one.y, shape.two.x, shape.two.y, shape.color);
  line(shape.two.x, shape.two.y, shape.three.x, shape.three.y, shape.color);
  line(shape.three.x, shape.three.y, shape.four.x, shape.four.y, shape.color);
  line(shape.four.x, shape.four.y, shape.one.x, shape.one.y, shape.color);


  if (shape.five.x) {
    line(shape.five.x, shape.five.y, shape.six.x, shape.six.y, shape.color);
    line(shape.six.x, shape.six.y, shape.seven.x, shape.seven.y, shape.color);
    line(shape.seven.x, shape.seven.y, shape.eight.x, shape.eight.y, shape.color);
    line(shape.eight.x, shape.eight.y, shape.five.x, shape.five.y, shape.color);

    line(shape.five.x, shape.five.y, shape.three.x, shape.three.y, shape.color);
    line(shape.six.x, shape.six.y, shape.four.x, shape.four.y, shape.color);
    line(shape.seven.x, shape.seven.y, shape.one.x, shape.one.y, shape.color);
    line(shape.eight.x, shape.eight.y, shape.two.x, shape.two.y, shape.color);
  }

  if (SHOW_LABELS) {
    displayShapeLabels(shape);
  }
}

displayShapeLabels = (shape) => {
  for (point in shape) {
    if (typeof(shape[point].x) !== "undefined" && shape[point].x) {
      const hoveringOverPoint = (objectsAreIdentical(currentMouseCoordinates, shape[point]) && !currentlyDrawing());
      const color = hoveringOverPoint ? "#f58c31" : "#59ffec";

      if(hoveringOverPoint){
        emptyCircle(shape[point].x, shape[point].y, SNAP_MOUSE_DISTANCE, color)
      }

      circle(shape[point].x, shape[point].y, 4, color);
      text(LABEL_AS_NUMBER[point], shape[point].x - 10, shape[point].y, 14, "#59ffec", true);
    }
  }
}

function currentlyDrawing() {
  return MOUSEDOWN || SHAPE_IN_PROGRESS
}

/* DEBUGGER CODE*/

updateDebugFields = () => {
  document.getElementById("mouse-coords").innerText = `${currentMouseCoordinates.x}, ${currentMouseCoordinates.y}`;
  document.getElementById("in-progress").innerText = SHAPE_IN_PROGRESS;
  document.getElementById("current-shape").innerText = JSON.stringify(currentShape, undefined, 2);
}

init();