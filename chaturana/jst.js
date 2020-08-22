const express = require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;
io.on("connection", () => {
  console.log("Server started");
});

server.listen(port);
