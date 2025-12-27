const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

const SERIAL_PORT = '/dev/cu.usbmodem1101';
const BAUD_RATE = 115200;

// --- WebSocket ---
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
console.log('WebSocket running at ws://localhost:8080');

// --- Serial ---
const serial = new SerialPort({
  path: SERIAL_PORT,
  baudRate: BAUD_RATE
});

serial.on('open', () => {
  console.log('SERIAL PORT OPEN');
});

serial.on('error', (err) => {
  console.error('SERIAL ERROR:', err.message);
});

const parser = serial.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (line) => {
  console.log('SERIAL:', line);

  try {
    const data = JSON.parse(line);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } catch (e) {
    console.log('JSON PARSE ERROR');
  }
});
