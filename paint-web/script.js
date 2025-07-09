const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let startX, startY;
let tool = "brush";
let color = "#000";
let lineWidth = 2;
let snapshot;

function takeSnapshot() {
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
  ctx.putImageData(snapshot, 0, 0);
}

document.querySelectorAll(".tool").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tool").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tool = btn.dataset.tool;
    canvas.style.cursor = tool === "eraser" ? "not-allowed" : "crosshair";
  });
});

document.querySelectorAll(".color").forEach(btn => {
  btn.addEventListener("click", () => {
    color = btn.dataset.color;
    lineWidth = tool === "eraser" ? 10 : 2;
  });
});

canvas.addEventListener("mousedown", e => {
  startX = e.offsetX;
  startY = e.offsetY;
  drawing = true;
  takeSnapshot();
  if (tool === "brush" || tool === "eraser") {
    draw(e);
  }
});

canvas.addEventListener("mouseup", e => {
  if (!drawing) return;
  drawing = false;
  draw(e);
});

canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  ctx.strokeStyle = tool === "eraser" ? "#fff" : color;
  ctx.lineWidth = tool === "eraser" ? 10 : lineWidth;
  ctx.lineCap = "round";

  if (tool === "brush" || tool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
    startX = x;
    startY = y;
  } else {
    restoreSnapshot();
    ctx.beginPath();
    if (tool === "line") {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    } else if (tool === "rectangle") {
      ctx.rect(startX, startY, x - startX, y - startY);
    } else if (tool === "circle") {
      const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    }
    ctx.stroke();
  }
}

document.getElementById("clear").onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

document.getElementById("save").onclick = () => {
  const link = document.createElement("a");
  link.download = "dibujo.png";
  link.href = canvas.toDataURL();
  link.click();
};
