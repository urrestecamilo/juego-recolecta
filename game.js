
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let players = [
  { x: 50, y: 50, color: "blue", score: 0 },
  { x: 500, y: 300, color: "red", score: 0 },
];

let objects = [];
let objectSize = 20;
let gameDuration = 40; // segundos
let maxScore = 15;
let startTime = null;
let gameOver = false;
let arduinoDirection = null;

function drawPlayer(player) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, 20, 20);
}

function drawObject(obj) {
  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, objectSize / 2, 0, 2 * Math.PI);
  ctx.fill();
}

function spawnObject() {
  const x = Math.random() * (canvas.width - objectSize);
  const y = Math.random() * (canvas.height - objectSize);
  objects.push({ x, y });
}

function movePlayer(player, direction) {
  const step = 10;
  if (direction === "LEFT") player.x -= step;
  if (direction === "RIGHT") player.x += step;
  if (direction === "UP") player.y -= step;
  if (direction === "DOWN") player.y += step;

  // límites
  player.x = Math.max(0, Math.min(canvas.width - 20, player.x));
  player.y = Math.max(0, Math.min(canvas.height - 20, player.y));
}

function detectCollision(player, object) {
  return (
    player.x < object.x + objectSize &&
    player.x + 20 > object.x &&
    player.y < object.y + objectSize &&
    player.y + 20 > object.y
  );
}

function checkGameOver() {
  const elapsed = (Date.now() - startTime) / 1000;
  if (elapsed >= gameDuration || players.some(p => p.score >= maxScore)) {
    gameOver = true;
    let winner = "Empate";
    if (players[0].score > players[1].score) winner = "Jugador 1 gana";
    else if (players[1].score > players[0].score) winner = "Jugador 2 gana";
    alert(`Fin del juego. ${winner}`);
  }
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  players.forEach(drawPlayer);
  objects.forEach(drawObject);

  // Movimiento del jugador 1 por Arduino
  if (arduinoDirection) {
    movePlayer(players[0], arduinoDirection);
    arduinoDirection = null;
  }

  // Revisar colisiones
  for (let i = objects.length - 1; i >= 0; i--) {
    for (let p = 0; p < players.length; p++) {
      if (detectCollision(players[p], objects[i])) {
        players[p].score++;
        objects.splice(i, 1);
        spawnObject();
        break;
      }
    }
  }

  checkGameOver();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  const keyMap = {
    w: "UP",
    a: "LEFT",
    s: "DOWN",
    d: "RIGHT",
  };
  const dir = keyMap[e.key.toLowerCase()];
  if (dir) movePlayer(players[1], dir);
});

document.getElementById("connectButton").addEventListener("click", async () => {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    const reader = port.readable.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = new TextDecoder().decode(value).trim();
      arduinoDirection = text;
    }
  } catch (err) {
    console.error("Error al conectar con Arduino:", err);
  }
});

spawnObject();
spawnObject();
startTime = Date.now();
update();
