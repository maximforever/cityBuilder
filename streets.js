const PROBABILITY_OF_KEEPING_DIRECTION = 0.6;
const SEGMENT_LENGTH = 50;
const ANIMATION_SPEED = 30;

const MAX_STEPS = 10;
let currentStep = 0;

const opposite = {
  "left": "right",
  "right": "left",
  "up": "down",
  "down": "up",
}

let points = {
  "400,400": ["400,450"],
  "400,450": ["400,400"]
}

function generateStreets(){
  getNextPoint("400,450", "400,400")
}

function getNextPoint(currentPoint, prevPoint){  


  const currentDirection = determineCurrentDirection(prevPoint, currentPoint);
  let nextDirection = currentDirection;

  if(Math.random() > PROBABILITY_OF_KEEPING_DIRECTION){
    nextDirection = pickNewDirection(currentDirection);
    console.log(`${nextDirection} SWITCH `);
  } else {
    console.log(`${nextDirection}`);
  }

  nextPoint = calculateNextPointCoordinate(nextDirection, currentPoint);
  recordPoints(currentPoint, nextPoint);
  currentStep++;

  if(currentStep < MAX_STEPS){
    getNextPoint(nextPoint, currentPoint);
  }
}

function pickNewDirection(currentDirection){
  const seedValue = Math.random();
  
  if(currentDirection == "up" || currentDirection == "down"){
    return seedValue <= 0.5 ? "right" : "left";
  } else {
    return seedValue <= 0.5 ? "up" : "down";
  }
}

function determineCurrentDirection(pointOne, pointTwo){
    let [x1, y1] = pointStringToArray(pointOne);
    let [x2, y2] = pointStringToArray(pointTwo); 

    if(x1 == x2){
      return (y2 - y1) > 0 ? "down" : "up";
    } else {
      return (x2 - x1) > 0 ? "right" : "left";
    }
}

function calculateNextPointCoordinate(direction, currentPoint){
  let [x1, y1] = pointStringToArray(currentPoint);

  if(direction == "up"){
    return `${x1},${y1 - SEGMENT_LENGTH}`;
  } else if (direction == "down"){
    return `${x1},${y1 + SEGMENT_LENGTH}`;
  } else if (direction == "left"){
    return `${x1 - SEGMENT_LENGTH},${y1}`;
  } else {
    return `${x1 + SEGMENT_LENGTH},${y1}`;
  }
}

function recordPoints(currentPoint, nextPoint){
  console.log(points[currentPoint], points[currentPoint].includes(nextPoint));
  if(points[currentPoint] && !points[currentPoint].includes(nextPoint)){
    points[currentPoint].push(nextPoint)
  } else {
    points[currentPoint] = [nextPoint];
  }

  if(points[nextPoint] && !points[nextPoint].includes(currentPoint)){
    points[nextPoint].push(currentPoint)
  } else {
    points[nextPoint] = [currentPoint];
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pointStringToArray(str){
  const coords = str.split(',');
  return [Number(coords[0]), Number(coords[1])];
}

//

function init(){
    generateStreets();
    setInterval(draw, ANIMATION_SPEED);
}

function draw(){
    clear();
    drawBackground();
    drawStreets();
}

function drawStreets(){
  for(point in points){
    circle(400, 400, 5, "blue")
    points[point].forEach((endPoint) => {
      drawOneStreet(point, endPoint)
    })
    
  }
}

function drawOneStreet(startPoint, endPoint){
  const [x1, y1] = pointStringToArray(startPoint)
  const [x2, y2] = pointStringToArray(endPoint)

  line(x1, y1, x2, y2);
  circle(x2, y2, 3, "orange")
  text(`${x2}, ${y2}`, x2-20, y2-10, 10, "orange")
}

//

init();








