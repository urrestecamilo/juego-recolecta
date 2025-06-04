const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const img1 = new Image();
img1.src = "player1.png";
const img2 = new Image();
img2.src = "player2.png";
const coinImg = new Image();
coinImg.src = "coin.png";
const collectSound = new Audio("collect.mp3");
const winSound = new Audio("win.mp3");

let player1 = { x: 50, y: 50, score: 0 };
let player2 = { x: 500, y: 300, score: 0 };
let item = { x: 300, y: 200, size: 16 };

let timeLeft = 40; // segundos
let gameOver = false;

document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  switch (e.key) {
    case "w": player2.y -= 10; break;
    case "s": player2.y += 10; break;
    case "a": player2.x -= 10; break;
    case "d": player2.x += 10; break;
  }
});

function drawPlayer(p, img) {
  ctx.drawImage(img, p.x, p.y, 30, 30);
}

function drawItem() {
  ctx.drawImage(coinImg, item.x, item.y, 20, 20);
}

function updateScores() {
  if (Math.abs(player1.x - item.x) < 20 && Math.abs(player1.y - item.y) < 20) {
    player1.score++;
    collectSound.play();
    randomizeItem();
  }
  if (Math.abs(player2.x - item.x) < 20 && Math.abs(player2.y - item.y) < 20) {
    player2.score++;
    collectSound.play();
    randomizeItem();
  }
}

function randomizeItem() {
  item.x = Math.random() * (canvas.width - 30);
  item.y = Math.random() * (canvas.height - 30);
}

function drawScores() {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Jugador 1: " + player1.score, 10, 20);
  ctx.fillText("Jugador 2: " + player2.score, 480, 20);
  ctx.fillText("Tiempo: " + timeLeft, 270, 20);
}

function checkEndGame() {
  if (player1.score >= 15 || player2.score >= 15 || timeLeft <= 0) {
    gameOver = true;
    winSound.play();
    setTimeout(() => {
      let winner = "Empate";
      if (player1.score > player2.score) winner = "¡Jugador 1 gana!";
      else if (player2.score > player1.score) winner = "¡Jugador 2 gana!";
      alert(winner + "\nP1: " + player1.score + " - P2: " + player2.score);
    }, 100);
  }
}

function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player1, img1);
    drawPlayer(player2, img2);
    drawItem();
    updateScores();
    drawScores();
    checkEndGame();
    requestAnimationFrame(gameLoop);
  }
}

function startTimer() {
  const timer = setInterval(() => {
    if (!gameOver) {
      timeLeft--;
      if (timeLeft <= 0 || player1.score >= 15 || player2.score >= 15) {
        clearInterval(timer);
      }
    }
  }, 1000);
}

startTimer();
gameLoop();
