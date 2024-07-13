const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);
const PORT = 3000;

let i = 0;

io.on("connection", (socket) => {
  i++;
  console.log(`${i} user connected`);

  socket.on("chat message", (data) => {
    console.log(data);
    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    i--;
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
