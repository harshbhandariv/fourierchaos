const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ctx1 = canvas.getContext("2d");
const { height, width } = canvas;
console.log(height, width);
const duration = 10;
const radius = 100;
const line = {
  sx: width / 2,
  sy: height / 2,
  ex: width / 2 + radius,
  ey: height / 2,
};
const line2 = {
  sx: width / 2,
  sy: height / 2,
  ex: width / 2 + radius,
  ey: height / 2,
};
const line3 = {
  sx: width / 2,
  sy: height / 2,
  ex: width / 2 + radius,
  ey: height / 2,
};
const trail = [{ x: width / 2 + radius, y: height / 2 }];
ctx.beginPath();
ctx.arc(width / 2, height / 2, radius, Math.PI * 2, false);
ctx1.arc(width / 2, height / 2, radius, Math.PI * 1, false);
ctx.moveTo(line.sx, line.sy);
ctx.lineTo(line.ex, line.ey);
let start;
function update(timestamp) {
  if (start === undefined) start = timestamp;
  const elapsed = timestamp - start;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  updateRadiusPos(elapsed);
  redraw();
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
  ctx.moveTo(line.sx, line.sy);
  ctx.lineTo(line.ex, line.ey);
  ctx.moveTo(line.ex + radius, line.ey);
  ctx.arc(line.ex, line.ey, radius, Math.PI * 2, false);
  ctx.moveTo(line.ex, line.ey);
  ctx.lineTo(line2.ex, line2.ey);
  ctx.moveTo(line2.ex + radius / 2, line2.ey);
  ctx.arc(line2.ex, line2.ey, radius / 2, Math.PI * 2, false);
  ctx.moveTo(line2.ex, line2.ey);
  ctx.lineTo(line3.ex, line3.ey);
  ctx.moveTo(line3.ex + radius / 4, line3.ey);
  ctx.arc(line3.ex, line3.ey, radius / 4, Math.PI * 2, false);
  ctx.stroke();
  window.requestAnimationFrame(update);
}

function redraw() {
  ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  for (let i = 2; i < trail.length; i++) {
    if (i == 2) ctx.moveTo(trail[2].x, trail[2].y);
    ctx.lineTo(trail[i].x, trail[i].y);
  }
}

function updateRadiusPos(elapsed) {
  line.ex =
    line.sx +
    radius * Math.cos((1 * 2 * Math.PI * elapsed) / (duration * 1000));
  line.ey =
    line.sy +
    radius * Math.sin((1 * 2 * Math.PI * elapsed) / (duration * 1000));
  line2.sx = line.ex;
  line2.sy = line.ey;
  line2.ex =
    line2.sx +
    (radius / 2) * Math.cos((2 * 2 * Math.PI * elapsed) / (duration * 1000));
  line2.ey =
    line2.sy +
    (radius / 2) * Math.sin((2 * 2 * Math.PI * elapsed) / (duration * 1000));
  line3.sx = line2.ex;
  line3.sy = line2.ey;
  line3.ex =
    line3.sx +
    (radius / 4) * Math.cos((3 * 2 * Math.PI * elapsed) / (duration * 1000));
  line3.ey =
    line3.sy +
    (radius / 4) * Math.sin((3 * 2 * Math.PI * elapsed) / (duration * 1000));
  if (elapsed < 11000) trail.push({ x: line3.ex, y: line3.ey });
}
update();
