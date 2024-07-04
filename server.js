const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const msg = JSON.parse(message);
    console.log('Received message:', msg);

    if (msg.type === 'register') {
      clients[msg.email] = ws;
      console.log(`User registered: ${msg.email}`);
      return;
    }

    if (msg.type === 'message') {
      const receiver = clients[msg.receiverEmail];
      if (receiver) {
        receiver.send(JSON.stringify({ type: 'message', text: msg.text, senderEmail: msg.senderEmail }));
        console.log(`Message sent from ${msg.senderEmail} to ${msg.receiverEmail}: ${msg.text}`);
      } else {
        console.log(`User ${msg.receiverEmail} not connected`);
      }
    }
  });

  ws.on('close', () => {
    for (let email in clients) {
      if (clients[email] === ws) {
        console.log(`User disconnected: ${email}`);
        delete clients[email];
        break;
      }
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
