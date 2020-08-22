const io = require("socket.io")(3000);

const users = {};

io.on("connection", (socket) => {
  socket.emit("chat-message", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      name: users[socket.id],
      message: message,
    });
  });
  socket.emit("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
