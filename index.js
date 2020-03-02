const fs = require('fs');
const https = require("https");
const express = require("express");
const socket = require("socket.io");
const users = require("./users");
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

const server = https.createServer({
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.cert')
},app);

// const server = http.createServer(app);

const io = socket(server);

io.on("connection", connection => {
  console.log("A new client connected");

  connection.on("update", data => {
    connection.id;
    const userIds = users
      .getByRoomName(data.roomName)
      .filter(usr => connection.id !== usr.userId)
      .map(usr => usr.userId);
    userIds.forEach(id => {
      io.to(id).emit("update", data);
    });
  });

  connection.on("newUser", data => {
    users.createUser(data);
  });

  connection.on("disconnect", function() {
    users.deleteById(connection.id);
  });
});

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
