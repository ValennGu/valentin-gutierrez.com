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
 * Listens to
 */
process.on("SIGINT", () => {
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});

/**
 * Begin Websockets.
 */
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  wss.broadcast(`Current visitors: ${wss.clients.size}`);

  console.log(`A new client has connected.`);
  console.log(`Current number of visitors: ${wss.clients.size}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server!");
  }

  db.run(`
      INSERT INTO visitors (count, time)
      VALUES (${wss.clients.size}, datetime('now'))
    `);

  ws.on("close", () => {
    console.log(`A client has disconnected.`);
    console.log(`Current number of visitors: ${wss.clients.size}`);

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

/**
 * End WebSockets
 */

/**
 * Begin DataBases
 */
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory");

/**
 * .serializes ensures the database is set up and
 * ready to go before any query is run.
 */
db.serialize(() => {
  db.run(`
      CREATE TABLE if NOT EXISTS visitors (
        count INTEGER,
        time TEXT
      )
    `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("Sutting down DB");
  db.close();
}
