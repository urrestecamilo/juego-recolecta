let port;
let reader;

async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    reader = port.readable.pipeThrough(decoder).getReader();

    readLoop();
  } catch (error) {
    console.error("Error conectando al puerto serial:", error);
  }
}

function movePlayer1(direction) {
  if (direction === "UP") player1.y -= 10;
  if (direction === "DOWN") player1.y += 10;
  if (direction === "LEFT") player1.x -= 10;
  if (direction === "RIGHT") player1.x += 10;
}

async function readLoop() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      movePlayer1(value.trim());
    }
  }
}
