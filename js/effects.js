import { updatePowerupsTimer } from "./powerup.js";
import { getPointOnCurve, objectLerp } from "./utils.js";

let canvas, ctx;
let p0, p1, p2;
let lastTime = performance.now();


const gainTexts = [];

export function intiEffectCanvas() {
  if (canvas) return canvas;

  canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 999;

  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  updateBezelCurve();
  render();
}

export function getCtx() {
  if (!ctx) return intiEffectCanvas();
}

export function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  updateBezelCurve();
}

function updateBezelCurve(){
  p0 = { x: canvas.width / 2, y: canvas.height / 2 - 30 };
  p1 = { x: canvas.width / 2, y: -100 };
  p2 = { x: 130, y: canvas.height - 40 };
}

export function createBezelCurve() {

  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);

  for (let t = 0; t < 1; t += 0.01) {
    const a = objectLerp(p0, p1, t);
    const b = objectLerp(p1, p2, t);
    const point = objectLerp(a, b, t);

    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();

  [p0, p1, p2].forEach((p) => {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function spawnGainText(text, size, color) {
  gainTexts.push({ text, size, color, t: 0, speed: 0.7 });
}

function render(now) {
  const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  updatePowerupsTimer(deltaTime);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // createBezelCurve();

  for (let i = gainTexts.length - 1; i >= 0; i--) {
    const gain = gainTexts[i];
    const point = getPointOnCurve(p0, p1, p2, gain.t);

    ctx.fillStyle = gain.color;
    ctx.font = `${gain.size}px Arial`;
    const textWidth = ctx.measureText(gain.text).width;
    const textHeight = 20;
    ctx.fillText(gain.text, point.x - textWidth / 2, point.y - textHeight / 2);

    gain.t += gain.speed * deltaTime;

    if (gain.t > 1) {
      gainTexts.splice(i, 1);
    }
  }
  requestAnimationFrame(render);
}