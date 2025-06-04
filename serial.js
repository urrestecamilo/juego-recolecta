let port;
let reader;

async function connectArduino() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    reader = port.readable.getReader();
    readLoop();
  } catch (err) {
    alert("Error al conectar con Arduino: " + err);
  }
}

async function readLoop() {
  const decoder = new TextDecoderStream();
  port.readable.pipeTo(decoder.writable);
  const inputStream = decoder.readable;
  const reader = inputStream.getReader();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) handleArduinoInput(value.trim());
  }
}

function handleArduinoInput(command) {
  switch (command) {
    case "UP": player1.y -= 10; break;
    case "DOWN": player1.y += 10; break;
    case "LEFT": player1.x -= 10; break;
    case "RIGHT": player1.x += 10; break;
  }
}
