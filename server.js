const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const users = new Map();

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

io.on("connection", (socket) => {
  socket.on("join", ({ username, color }) => {
    users.set(socket.id, { username, color });
    io.emit("users", [...users.values()]);
    io.emit("systemMessage", `${username} entrou na sala.`);
  });

  socket.on("message", (data) => {
    const user = users.get(socket.id);
    if (!user) return;
    const timestamp = formatTime();
    const msgData = {
      id: generateId(),
      username: user.username,
      color: user.color,
      text: data.text,
      time: timestamp,
      reactions: {},
    };
    io.emit("message", msgData);
  });

  socket.on("fileMessage", (data) => {
    const user = users.get(socket.id);
    if (!user) return;
    const timestamp = formatTime();
    const msgData = {
      id: generateId(),
      username: user.username,
      color: user.color,
      file: data.file,
      text: data.text || "",
      time: timestamp,
      reactions: {},
    };
    io.emit("message", msgData);
  });

  socket.on("react", ({ messageId, emoji }) => {
    io.emit("reactionUpdate", { messageId, emoji, username: users.get(socket.id)?.username });
  });

  socket.on("deleteMessage", (messageId) => {
    io.emit("messageDelete", messageId);
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      io.emit("systemMessage", `${user.username} saiu da sala.`);
      users.delete(socket.id);
      io.emit("users", [...users.values()]);
    }
  });
});

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
