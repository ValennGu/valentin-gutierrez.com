const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  // __dirname is a shorthand for node to access the current directory.
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Server started on port 3000"));
