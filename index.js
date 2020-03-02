const http = require("http");
const express = require("express");
const socket = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/room/:roomName", (req, res) => {
  console.log(req.params.roomName);
  res.sendFile(__dirname + "/public/room.html");
});

const server = http.createServer(app);

const io = socket(server);
io.on("connection", connection => {
  console.log("A new client connected");
  connection.on("update", data => {
    connection.broadcast.emit("update", data);
  });
});

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
