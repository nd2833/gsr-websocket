const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

console.log("✅ GSR WebSocket server running on port", PORT);

wss.on("connection", (ws) => {
  console.log("🌐 Client connected");

  // Send handshake
  ws.send(JSON.stringify({ status: "connected" }));

  ws.on("message", (message) => {
    const payload = message.toString();
    console.log("📥 Incoming GSR:", payload);

    // 🔥 BROADCAST TO ALL CONNECTED CLIENTS
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
