import { Timer } from './timer.js';

const canvas = document.getElementsByClassName('nurture-draw');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas[0].getContext('2d');

const LINE_COLOR = '#fff';
const LINE_WIDTH = 0.4;
const MIN_LENGTH = 20;
const RAND_OFFSET = 300;

let randTimer = null;
let prevPos = { x: undefined, y: undefined };
let mousePos = { x: undefined, y: undefined };
let center = { x: undefined, y: undefined };

const calcDist = (x1, y1, x2, y2) => {
  let dx = x2 - x1,
    dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const draw = () => {
  if (mousePos.x && mousePos.y) {
    if (!prevPos.x) {
      prevPos = mousePos;
    }

    let dist = calcDist(prevPos.x, prevPos.y, mousePos.x, mousePos.y);

    if (dist > MIN_LENGTH) {
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();

      prevPos = mousePos;
    }
  }
};

const drawRand = () => {
  let rect = ctx.canvas.getBoundingClientRect();

  if (rect) {
    let randX = getRandomInt(
        center.x - RAND_OFFSET,
        center.x + RAND_OFFSET
      ),
      randY = getRandomInt(
        center.y - RAND_OFFSET,
        center.y + RAND_OFFSET
      );

    if (randX > rect.right) {
      randX = rect.right;
    } else if (randX < 0) {
      randX = 0;
    }

    if (randY > rect.bottom) {
      randY = rect.bottom;
    } else if (randY < 0) {
      randY = 0;
    }

    mousePos = { x: randX, y: randY };
    draw();

    randTimer.interval = getRandomInt(100, 1000);
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

  randTimer = new Timer(drawRand, 5000);
  randTimer.start();
};

window.addEventListener('mousemove', (e) => {
  randTimer.interval = 5000;
  randTimer.reset();

  let rect = ctx.canvas.getBoundingClientRect();
  mousePos = {
    x: e.clientX - ((rect && rect.left) || 0),
    y: e.clientY - ((rect && rect.top) || 0),
  };
  draw();
});

window.addEventListener('load', init);
