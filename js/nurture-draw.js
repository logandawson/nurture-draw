import { Timer } from './timer.js';

const canvas = document.getElementsByClassName('nurture-draw');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas[0].getContext('2d');

/** Settings */
const LINE_COLOR = '#eee';
const LINE_WIDTH = 0.8;
const MIN_LENGTH = 45;
const RAND_MAX_LENGTH = 100;
const RAND_BOX_PERCENT = 0.5;
const RAND_INTERVAL_RANGE = { min: 200, max: 1000 };
const RAND_DELAY_TIME = 3000;

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

const resetCanvas = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (randTimer) {
    randTimer.interval = RAND_DELAY_TIME;
    randTimer.reset();
  }
};

const fitCanvas = (ctx) => {
  let canvas = ctx.canvas;
  const cw = window.innerWidth;
  const ch = window.innerHeight;

  const needResize = canvas.width !== cw || canvas.height !== ch;

  if (needResize) {
    canvas.width = cw;
    canvas.height = ch;
  }

  ctx.clearRect(0, 0, cw, ch);

  center = {
    x: Math.floor(cw / 2),
    y: Math.floor(ch / 2),
  };

  let rect = ctx.canvas.getBoundingClientRect();
  offset = {
    x: (rect.right * RAND_BOX_PERCENT) / 2,
    y: (rect.bottom * RAND_BOX_PERCENT) / 2,
  };
};

const setCanvasStyle = (ctx) => {
  ctx.fillStyle = LINE_COLOR;
  ctx.strokeStyle = LINE_COLOR;

  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = 'butt';
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
  // todo: limit the line length based on RAND_MAX_LENGTH constant
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
  fitCanvas(ctx);
  setCanvasStyle(ctx);

  ctx.save();

  randTimer = new Timer(drawRand, RAND_DELAY_TIME);
  randTimer.start();

  window.addEventListener('resize', () => {
    fitCanvas(ctx);
    setCanvasStyle(ctx);
  });
};

document
  .getElementById('clear')
  .addEventListener('click', resetCanvas);

window.addEventListener('keydown', (e) => {
  if (e.key == ' ' || e.key == 'Spacebar' || e.key == 'Escape') {
    resetCanvas();
  }
});

window.addEventListener('pointermove', (e) => {
  if (e.isPrimary) {
    randTimer.interval = RAND_DELAY_TIME;
    randTimer.reset();

    let rect = ctx.canvas.getBoundingClientRect();

    curPos = {
      x: e.clientX - ((rect && rect.left) || 0),
      y: e.clientY - ((rect && rect.top) || 0),
    };

    draw();
  }
});

// window.addEventListener('touchstart', () => {
//   let el = document.documentElement,
//     rfs = el.requestFullscreen;
//   rfs.call(el);
// });

window.addEventListener('load', init);
