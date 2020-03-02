const pathname = window.location.pathname;
const paths = pathname.split("/");
const roomName = paths[paths.length - 1];

const socket = io(window.location.protocol + '//' + window.location.host);

socket.on("connect", () => {
  console.log("Connected to the socket");
  socket.emit("newUser", { roomName, userId: socket.id });
});
