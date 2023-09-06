import { Timer } from './timer.js';

const canvas = document.getElementsByClassName('nurture-draw');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas[0].getContext('2d');

/** Settings */
const LINE_COLOR = '#fff';
const LINE_WIDTH = 0.6;
const MIN_LENGTH = 20;
const RAND_BOX_PERCENT = 0.45;
const RAND_INTERVAL_RANGE = { min: 100, max: 1500 };
const RAND_DELAY_TIME = 2000;

let randTimer = null;
let prevPos = { x: undefined, y: undefined };
let curPos = { x: undefined, y: undefined };
let center = { x: undefined, y: undefined };
let offset = { x: undefined, y: undefined };

const calcDist = (x1, y1, x2, y2) => {
  let dx = x2 - x1,
    dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const checkBounds = (value, max) => {
  if (value > max) {
    return max;
  } else if (value < 0) {
    return 0;
  }
  return value;
};

const draw = () => {
  if (curPos.x && curPos.y) {
    if (!prevPos.x) {
      prevPos = curPos;
    }

    let dist = calcDist(prevPos.x, prevPos.y, curPos.x, curPos.y);

    if (dist > MIN_LENGTH) {
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(curPos.x, curPos.y);
      ctx.stroke();

      prevPos = curPos;

      return true;
    } else {
      return false;
    }
  }
};

const drawRand = () => {
  let randX = getRandomInt(center.x - offset.x, center.x + offset.x),
    randY = getRandomInt(center.y - offset.y, center.y + offset.y);

  let rect = ctx.canvas.getBoundingClientRect();
  randX = checkBounds(randX, rect.right);
  randY = checkBounds(randY, rect.bottom);

  curPos = { x: randX, y: randY };

  if (draw()) {
    randTimer.interval = getRandomInt(
      RAND_INTERVAL_RANGE.min,
      RAND_INTERVAL_RANGE.max
    );
  } else {
    randTimer.interval = 0;
  }
};

const init = () => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  center = {
    x: Math.floor(ctx.canvas.width / 2),
    y: Math.floor(ctx.canvas.height / 2),
  };

  ctx.fillStyle = LINE_COLOR;
  ctx.strokeStyle = LINE_COLOR;

  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = 'round';

  ctx.save();

  let rect = ctx.canvas.getBoundingClientRect();
  offset = {
    x: (rect.right * RAND_BOX_PERCENT) / 2,
    y: (rect.bottom * RAND_BOX_PERCENT) / 2,
  };

  randTimer = new Timer(drawRand, RAND_DELAY_TIME);
  randTimer.start();
};

window.addEventListener('mousemove', (e) => {
  randTimer.interval = RAND_DELAY_TIME;
  randTimer.reset();

  let rect = ctx.canvas.getBoundingClientRect();

  curPos = {
    x: e.clientX - ((rect && rect.left) || 0),
    y: e.clientY - ((rect && rect.top) || 0),
  };

  draw();
});

window.addEventListener('load', init);
