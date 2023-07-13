const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var shipData = {};

app.get("/images/:slug", (req, res) => {
  res.sendFile(__dirname + "/images/" + req.params.slug);
});

app.use((req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.emit("shipData", shipData);
  socket.on("updateS", (id, color) => {
    shipData[id] = color;
    socket.broadcast.emit("updateC", id, color);
  });

  socket.on("updateTextS", (id, text) => {
    shipData[id] = text;
    socket.broadcast.emit("textData", id, text);
  });
});

server.listen(process.env.PORT || 80, () => {
  console.log("Server started on port " + (process.env.PORT || 80));
});
