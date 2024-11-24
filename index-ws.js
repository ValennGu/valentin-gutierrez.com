const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  // __dirname is a shorthand for node to access the current directory.
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Server started on port 3000"));

/**
 * Begin Websockets.
 */
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  wss.broadcast(`Current visitors: ${wss.clients.size}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server!");
  }

  ws.on("close", () => {
    console.log("A client has disconnected");

    wss.broadcast(
      `A client has disconnected. \nCurrent visitors: ${wss.clients.size}`
    );
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
