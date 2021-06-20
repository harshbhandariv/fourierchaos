const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let duration;
let scale;
canvas.width = 600;
canvas.height = 500;
const { height, width } = canvas;
let lines = [];
let trail = [];
let start;
function update(timestamp) {
  if (start == undefined) start = timestamp;
  let elapsed = timestamp - start;
  ctx.clearRect(0, 0, width, height);
  updateLengthPos(elapsed);
  ctx.beginPath();
  redraw();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
  for (let i = 0; i < lines.length; i++) {
    ctx.moveTo(lines[i].sx, lines[i].sy);
    ctx.lineTo(lines[i].ex, lines[i].ey);
    ctx.moveTo(
      lines[i].ex +
        (lines[i].length > 0 ? lines[i].length : -lines[i].length) * scale,
      lines[i].ey
    );
    ctx.arc(
      lines[i].ex,
      lines[i].ey,
      Math.abs(lines[i].length * scale),
      Math.PI * 2,
      false
    );
    ctx.moveTo(lines[i].ex, lines[i].ey);
  }
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

function updateLengthPos(elapsed) {
  lines[0].ex =
    lines[0].sx +
    lines[0].length *
      scale *
      Math.cos(
        (0 * 2 * Math.PI * elapsed) / (duration * 1000) + lines[0].phase
      );
  lines[0].ey =
    lines[0].sy +
    lines[0].length *
      scale *
      Math.sin(
        (0 * 2 * Math.PI * elapsed) / (duration * 1000) + lines[0].phase
      );
  for (let i = 1; i < lines.length; i++) {
    lines[i].sx = lines[i - 1].ex;
    lines[i].sy = lines[i - 1].ey;
    lines[i].ex =
      lines[i].sx +
      Math.abs(lines[i].length) *
        scale *
        Math.cos(
          (i * 2 * Math.PI * elapsed) / (duration * 1000) + lines[i].phase
        );
    lines[i].ey =
      lines[i].sy +
      lines[i].length *
        scale *
        Math.sin(
          (i * 2 * Math.PI * elapsed) / (duration * 1000) + lines[i].phase
        );
  }
  if (elapsed < duration * 1000 * 1.01)
    trail.push({
      x: lines[lines.length - 1].ex,
      y: lines[lines.length - 1].ey,
    });
}
const lengths = document.getElementById("length");
const phase = document.getElementById("phase");
const scaleInput = document.getElementById("scale");
const durationInput = document.getElementById("duration");
function setup(e) {
  let lengthURI = (getQueryVariable("length") &&
    getQueryVariable("length")
      .split(",")
      .map((length) => parseFloat(length.trim()))) || [1, -1, 1];
  let phaseURI = (getQueryVariable("phase") &&
    getQueryVariable("phase")
      .split(",")
      .map((length) => parseFloat(length.trim()))) || [0, 0, 0];
  let scaleURI = getQueryVariable("scale");
  let durationURI = getQueryVariable("duration");
  for (let i = 0; i < lengthURI.length; i++) {
    lines.push({
      phase: phaseURI[i],
      length: lengthURI[i],
    });
    if (i == 0) {
      lines[0].sx = width / 2;
      lines[0].sy = height / 2;
    }
  }
  lengths.value = getQueryVariable("length") || "1,-1,1";
  phase.value = getQueryVariable("phase") || "0,0,0";
  scale = scaleInput.value = parseFloat(scaleURI) || 50;
  duration = durationInput.value = parseFloat(durationURI) || 10;
  trail = [];
  window.requestAnimationFrame(update);
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

setup();
