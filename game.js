const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player1 = { x: 50, y: 50, color: "blue", score: 0 };
let player2 = { x: 500, y: 300, color: "green", score: 0 };
let item = { x: 300, y: 200, size: 10 };

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w": player2.y -= 10; break;
    case "s": player2.y += 10; break;
    case "a": player2.x -= 10; break;
    case "d": player2.x += 10; break;
  }
});

function drawPlayer(p) {
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x, p.y, 20, 20);
}

function drawItem() {
  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.arc(item.x, item.y, item.size, 0, 2 * Math.PI);
  ctx.fill();
}

function updateScores() {
  if (Math.abs(player1.x - item.x) < 15 && Math.abs(player1.y - item.y) < 15) {
    player1.score++;
    randomizeItem();
  }
  if (Math.abs(player2.x - item.x) < 15 && Math.abs(player2.y - item.y) < 15) {
    player2.score++;
    randomizeItem();
  }
}

function randomizeItem() {
  item.x = Math.random() * (canvas.width - 20) + 10;
  item.y = Math.random() * (canvas.height - 20) + 10;
}

function drawScores() {
  ctx.fillStyle = "black";
  ctx.fillText("Jugador 1: " + player1.score, 10, 10);
  ctx.fillText("Jugador 2: " + player2.score, 500, 10);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer(player1);
  drawPlayer(player2);
  drawItem();
  updateScores();
  drawScores();
  requestAnimationFrame(gameLoop);
}

gameLoop();
